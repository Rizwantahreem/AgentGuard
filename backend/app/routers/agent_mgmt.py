"""Agent management router for Aegis."""

import uuid
import secrets

from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import RegisteredAgent, User
from ..schemas import AgentRegister, RegisteredAgentOut
from .auth import get_current_user

router = APIRouter(prefix="/api/agents", tags=["agent_management"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def generate_api_key() -> str:
    return "aegis_sk_" + secrets.token_hex(16)


@router.post("/register", response_model=RegisteredAgentOut)
def register_agent(
    data: AgentRegister,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    api_key = generate_api_key()
    base_url = str(request.base_url).rstrip("/")
    proxy_url = f"{base_url}/v1/proxy/{api_key}/chat/completions"

    agent = RegisteredAgent(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        name=data.name,
        description=data.description,
        api_key=api_key,
        proxy_url=proxy_url,
        policy_level=data.policy_level,
        system_prompt=data.system_prompt,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


@router.get("/registered", response_model=list[RegisteredAgentOut])
def list_agents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(RegisteredAgent).filter(RegisteredAgent.user_id == current_user.id).all()


@router.delete("/registered/{agent_id}")
def delete_agent(
    agent_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    agent = db.query(RegisteredAgent).filter(
        RegisteredAgent.id == agent_id, RegisteredAgent.user_id == current_user.id
    ).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()
    return {"detail": "Agent deleted"}


@router.patch("/registered/{agent_id}/status")
def update_agent_status(
    agent_id: str,
    status: str = "active",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    agent = db.query(RegisteredAgent).filter(
        RegisteredAgent.id == agent_id, RegisteredAgent.user_id == current_user.id
    ).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if status not in ("active", "paused", "disabled"):
        raise HTTPException(status_code=400, detail="Invalid status")
    agent.status = status
    db.commit()
    db.refresh(agent)
    return {"detail": f"Agent status updated to {status}"}
