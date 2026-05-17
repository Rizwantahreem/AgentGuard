"""Agent execution and session management endpoints."""

import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models import AgentSession, ConversationLog, SecurityEvent
from ..schemas import AgentExecuteRequest, AgentExecuteResponse, SessionOut, ConversationLogOut
from ..services.gemini import generate_response_via_lobstertrap, get_agent_name
from ..services.lobster_trap import inspect_prompt, should_block
from ..services.cost import calculate_cost
from .sse import broadcast_event

router = APIRouter(prefix="/api/agents", tags=["agents"])


def _extract_violations_from_lobstertrap(lt_meta: dict) -> list[dict]:
    """Extract structured violation info from _lobstertrap response metadata."""
    violations = []

    for direction in ["ingress", "egress"]:
        section = lt_meta.get(direction, {})
        action = section.get("action", "ALLOW")
        detected = section.get("detected", {})
        rule_name = section.get("rule_name", "unknown")

        if action in ("DENY", "HUMAN_REVIEW", "QUARANTINE", "LOG"):
            violation = {
                "policy_name": rule_name,
                "action": action.lower(),
                "category": detected.get("intent_category", "unknown"),
                "description": f"Lobster Trap {direction} policy: {rule_name} ({action})",
                "matched_text": "",
                "direction": direction,
                "risk_score": detected.get("risk_score", 0),
                "dpi_metadata": {
                    k: v for k, v in detected.items()
                    if isinstance(v, bool) and v  # only True flags
                },
            }
            violations.append(violation)

    return violations


def _extract_security_events_from_lobstertrap(lt_meta: dict, session_id: str) -> list[SecurityEvent]:
    """Create SecurityEvent records from _lobstertrap metadata."""
    events = []
    for direction in ["ingress", "egress"]:
        section = lt_meta.get(direction, {})
        action = section.get("action", "ALLOW")
        detected = section.get("detected", {})
        matched_rule = section.get("matched_rule", {})

        if action in ("DENY", "HUMAN_REVIEW", "QUARANTINE"):
            severity = "critical" if action == "DENY" else "warning"

            # Determine event type from DPI flags
            event_type = "policy_violation"
            if detected.get("contains_injection_patterns"):
                event_type = "injection"
            elif detected.get("contains_pii") or detected.get("contains_pii_request"):
                event_type = "pii"
            elif detected.get("contains_system_commands"):
                event_type = "command"
            elif detected.get("contains_exfiltration"):
                event_type = "exfiltration"
            elif detected.get("contains_credentials"):
                event_type = "credential_leak"
            elif detected.get("contains_malware_request"):
                event_type = "malware"
            elif detected.get("contains_harm_patterns"):
                event_type = "harmful_content"

            event = SecurityEvent(
                id=str(uuid.uuid4()),
                session_id=session_id,
                event_type=event_type,
                severity=severity,
                title=f"[Lobster Trap] {matched_rule.get('description', f'{action}: {direction} policy violation')}",
                details={
                    "direction": direction,
                    "action": action,
                    "rule_name": matched_rule.get("name", "unknown"),
                    "risk_score": detected.get("risk_score", 0),
                    "intent_category": detected.get("intent_category", "unknown"),
                    "dpi_flags": {k: v for k, v in detected.items() if isinstance(v, bool) and v},
                    "verdict": lt_meta.get("verdict", "unknown"),
                },
            )
            events.append(event)

        elif action == "LOG":
            event = SecurityEvent(
                id=str(uuid.uuid4()),
                session_id=session_id,
                event_type="logged_activity",
                severity="info",
                title=f"[Lobster Trap] Logged: {matched_rule.get('description', 'Activity logged')}",
                details={
                    "direction": direction,
                    "action": action,
                    "rule_name": matched_rule.get("name", "unknown"),
                    "risk_score": detected.get("risk_score", 0),
                },
            )
            events.append(event)

    return events


@router.post("/execute", response_model=AgentExecuteResponse)
async def execute_agent(req: AgentExecuteRequest, db: Session = Depends(get_db)):
    """Execute an agent prompt with Lobster Trap DPI + Gemini."""

    # Get or create session
    if req.session_id:
        session = db.query(AgentSession).filter(AgentSession.id == req.session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = AgentSession(
            id=str(uuid.uuid4()),
            agent_name=get_agent_name(req.agent_type),
            agent_type=req.agent_type,
            status="active",
        )
        db.add(session)
        db.flush()

    # Send through Lobster Trap → Gemini
    result = await generate_response_via_lobstertrap(
        agent_type=req.agent_type,
        prompt=req.prompt,
        agent_id=f"agentguard-{req.agent_type}",
    )

    response_text = result["response_text"]
    tokens_used = result["token_count"]
    lt_meta = result["lobstertrap"]
    blocked = result["blocked"]
    cost = calculate_cost(tokens_used)

    # Extract violations from Lobster Trap metadata
    violation_dicts = _extract_violations_from_lobstertrap(lt_meta)

    # If Lobster Trap wasn't available (MOCK/BYPASS mode), use Python policy engine as fallback
    if lt_meta.get("verdict") in ("MOCK", "BYPASS"):
        violations = inspect_prompt(req.prompt, db)
        if should_block(violations):
            blocked = True
            response_text = "[BLOCKED] - Your request was blocked by AgentGuard policy enforcement."
        violation_dicts = [v.to_dict() for v in violations]

        # Create security events from Python engine
        for v in violations:
            severity = "critical" if v.action == "block" else "warning"
            event = SecurityEvent(
                id=str(uuid.uuid4()),
                session_id=session.id,
                event_type=v.category,
                severity=severity,
                title=f"{'Blocked' if v.action == 'block' else 'Warning'}: {v.description}",
                details=v.to_dict(),
            )
            db.add(event)
            await broadcast_event({
                "type": "security_event",
                "data": {
                    "id": event.id,
                    "session_id": session.id,
                    "event_type": v.category,
                    "severity": severity,
                    "title": event.title,
                    "agent_name": session.agent_name,
                    "detected_at": datetime.utcnow().isoformat(),
                },
            })
    else:
        # Create security events from Lobster Trap metadata
        security_events = _extract_security_events_from_lobstertrap(lt_meta, session.id)
        for event in security_events:
            db.add(event)
            await broadcast_event({
                "type": "security_event",
                "data": {
                    "id": event.id,
                    "session_id": session.id,
                    "event_type": event.event_type,
                    "severity": event.severity,
                    "title": event.title,
                    "agent_name": session.agent_name,
                    "detected_at": datetime.utcnow().isoformat(),
                    "lobstertrap_verdict": lt_meta.get("verdict"),
                },
            })

    # Log the conversation
    log = ConversationLog(
        id=str(uuid.uuid4()),
        session_id=session.id,
        user_prompt=req.prompt,
        agent_response=response_text,
        tokens_used=tokens_used,
        cost_usd=cost,
        policy_violations=violation_dicts,
        blocked=blocked,
    )
    db.add(log)

    # Update session totals
    session.total_tokens += tokens_used
    session.total_cost += cost
    session.violations_count += len(violation_dicts)

    db.commit()

    # Broadcast activity
    await broadcast_event({
        "type": "agent_activity",
        "data": {
            "session_id": session.id,
            "agent_name": session.agent_name,
            "agent_type": req.agent_type,
            "prompt_preview": req.prompt[:80],
            "blocked": blocked,
            "violations": len(violation_dicts),
            "tokens": tokens_used,
            "cost": cost,
            "timestamp": datetime.utcnow().isoformat(),
            "lobstertrap_verdict": lt_meta.get("verdict", "N/A"),
        },
    })

    return AgentExecuteResponse(
        session_id=session.id,
        response=response_text,
        blocked=blocked,
        violations=violation_dicts,
        tokens_used=tokens_used,
        cost_usd=cost,
    )


@router.get("/sessions", response_model=list[SessionOut])
def list_sessions(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(AgentSession).order_by(desc(AgentSession.started_at)).limit(limit).all()


@router.get("/sessions/{session_id}", response_model=SessionOut)
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(AgentSession).filter(AgentSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/sessions/{session_id}/logs", response_model=list[ConversationLogOut])
def get_session_logs(session_id: str, db: Session = Depends(get_db)):
    return db.query(ConversationLog).filter(
        ConversationLog.session_id == session_id
    ).order_by(ConversationLog.timestamp).all()
