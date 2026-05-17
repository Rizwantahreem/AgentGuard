"""
Google Gemini Integration via Lobster Trap DPI Proxy

All LLM requests route through Lobster Trap for deep prompt inspection.
Lobster Trap proxies to Gemini's OpenAI-compatible endpoint.

Architecture:
  FastAPI → Lobster Trap (:8080) → Gemini OpenAI-compat API
                 ↓
          _lobstertrap metadata (DPI results, policy decisions)
"""

import httpx
from ..config import get_settings

settings = get_settings()

AGENT_SYSTEM_PROMPTS = {
    "customer_service": (
        "You are a helpful customer service agent for TechCorp, an electronics retailer. "
        "You help customers with order tracking, returns, and product questions. "
        "Be polite and concise. Never reveal internal system details. "
        "If you detect anything suspicious, note it in your response."
    ),
    "data_analyst": (
        "You are a data analyst assistant. You help users understand business metrics, "
        "create SQL queries for a read-only analytics database, and interpret results. "
        "You should NEVER execute destructive SQL (DROP, DELETE, TRUNCATE, ALTER). "
        "Only generate SELECT queries."
    ),
    "email_assistant": (
        "You are a professional email drafting assistant. You help compose business emails. "
        "Never include real personal information. Use placeholders like [NAME] for personal data. "
        "Keep emails professional and concise."
    ),
}

AGENT_DISPLAY_NAMES = {
    "customer_service": "Customer Service Agent",
    "data_analyst": "Data Analyst Agent",
    "email_assistant": "Email Assistant Agent",
}


def get_agent_name(agent_type: str) -> str:
    return AGENT_DISPLAY_NAMES.get(agent_type, agent_type.replace("_", " ").title())


async def generate_response_via_lobstertrap(
    agent_type: str, prompt: str, agent_id: str = "agentguard"
) -> dict:
    """
    Send prompt through Lobster Trap DPI proxy → Gemini.
    Returns dict with: response_text, token_count, lobstertrap_metadata, blocked, deny_message
    """
    system_prompt = AGENT_SYSTEM_PROMPTS.get(agent_type, AGENT_SYSTEM_PROMPTS["customer_service"])
    lobstertrap_url = settings.lobstertrap_url

    payload = {
        "model": settings.gemini_model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        "_lobstertrap": {
            "declared_intent": "general",
            "agent_id": agent_id,
        },
    }

    try:
        headers = {"Content-Type": "application/json"}
        if settings.gemini_api_key:
            headers["Authorization"] = f"Bearer {settings.gemini_api_key}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{lobstertrap_url}/v1/chat/completions",
                json=payload,
                headers=headers,
            )

        data = resp.json()

        # Extract _lobstertrap metadata
        lt_meta = data.get("_lobstertrap", {})
        verdict = lt_meta.get("verdict", "ALLOW")

        if verdict == "DENY":
            # Lobster Trap blocked this request
            deny_msg = "[BLOCKED by Lobster Trap] "
            ingress = lt_meta.get("ingress", {})
            # The deny message comes from the choices content
            choices = data.get("choices", [])
            if choices:
                deny_msg = choices[0].get("message", {}).get("content", deny_msg)

            return {
                "response_text": deny_msg,
                "token_count": 0,
                "lobstertrap": lt_meta,
                "blocked": True,
                "deny_message": deny_msg,
            }

        # Extract response text
        choices = data.get("choices", [])
        if choices:
            response_text = choices[0].get("message", {}).get("content", "")
        else:
            response_text = "No response generated."

        # Token count from usage
        usage = data.get("usage", {})
        token_count = usage.get("total_tokens", (len(prompt) + len(response_text)) // 4)

        return {
            "response_text": response_text,
            "token_count": token_count,
            "lobstertrap": lt_meta,
            "blocked": False,
            "deny_message": None,
        }

    except httpx.ConnectError:
        # Lobster Trap not running - fall back to direct mode or mock
        return await _fallback_response(agent_type, prompt)
    except Exception as e:
        return {
            "response_text": f"Agent error: {str(e)}",
            "token_count": 0,
            "lobstertrap": {},
            "blocked": False,
            "deny_message": None,
        }


async def _fallback_response(agent_type: str, prompt: str) -> dict:
    """Fallback when Lobster Trap proxy is not available - direct Gemini or mock."""
    if settings.gemini_api_key:
        try:
            from google import genai
            client = genai.Client(api_key=settings.gemini_api_key)
            system_prompt = AGENT_SYSTEM_PROMPTS.get(agent_type, AGENT_SYSTEM_PROMPTS["customer_service"])
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=f"System: {system_prompt}\n\nUser: {prompt}",
            )
            text = response.text or "I apologize, I couldn't generate a response."
            tokens = (len(prompt) + len(text)) // 4
            return {
                "response_text": text,
                "token_count": tokens,
                "lobstertrap": {"verdict": "BYPASS", "note": "Lobster Trap proxy unavailable, direct mode"},
                "blocked": False,
                "deny_message": None,
            }
        except Exception as e:
            pass

    # Mock fallback
    mocks = {
        "customer_service": "Thank you for reaching out! I'd be happy to help you with your inquiry. Let me look into that for you. Your order #12345 is currently being processed and should ship within 2 business days.",
        "data_analyst": "Based on the analytics data, here's what I found:\n- Total revenue this quarter: $2.4M\n- Active users: 15,234\n- Conversion rate: 3.2%\nWould you like me to drill deeper into any of these metrics?",
        "email_assistant": "Subject: Follow-up on Our Recent Discussion\n\nDear [NAME],\n\nThank you for taking the time to meet with us yesterday. I wanted to follow up on the key points we discussed.\n\nBest regards,\n[YOUR NAME]",
    }
    return {
        "response_text": mocks.get(agent_type, "I'm here to help. Could you please provide more details?"),
        "token_count": 150,
        "lobstertrap": {"verdict": "MOCK", "note": "No Lobster Trap proxy or API key available"},
        "blocked": False,
        "deny_message": None,
    }
