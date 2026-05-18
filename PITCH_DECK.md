# Aegis - The AI Firewall | Pitch Deck
## TechEx Intelligent Enterprise Solutions Hackathon

---

## SLIDE 1: Title

**Aegis - The AI Firewall**
*Enterprise security & observability for AI agents*

- Team: Rtahreem
- Track: Agent Security & AI Governance (Veea)
- Built with: Google Gemini 2.0 Flash + Veea Lobster Trap

---

## SLIDE 2: The Problem

**Enterprises are deploying AI agents with ZERO visibility**

- 78% of enterprises have AI agents in production (Gartner 2025)
- No one inspects what goes IN or comes OUT of these agents
- One prompt injection = data breach, compliance violation, or financial loss

**Without Aegis:**
```
Your AI Agent --> LLM API (completely blind)
```

---

## SLIDE 3: The Solution + How It Works

**Aegis = One-line integration. Total protection.**

```
Your AI Agent --> Aegis Proxy --> LLM API
                    |
            Deep Prompt Inspection (sub-ms)
            Real-time blocking
            Full audit trail
```

**3 Steps:**
1. **Register** your agent (30 seconds)
2. **Swap** your LLM base URL to the Aegis proxy URL
3. **Monitor** - real-time security events, blocking, audit

No SDK. No code changes. No agent modifications.

---

## SLIDE 4: Architecture & Tech Stack

```
                    Aegis Platform
                    ┌─────────────────────────┐
AI Agent ──POST──> │ Lobster Trap DPI (:8080) │
                    │   13 ingress rules       │
                    │   2 egress rules         │
                    │   ALLOW? ──> Gemini API  │
                    │   DENY?  ──> Block + Log │
                    │   FastAPI + SQLite + SSE │
                    └─────────────────────────┘
                              |
                    Next.js Dashboard (Real-time)
```

| Layer | Technology |
|-------|-----------|
| AI Engine | Google Gemini 2.0 Flash |
| DPI Proxy | Veea Lobster Trap (Go binary) |
| Backend | Python FastAPI + SQLite |
| Frontend | Next.js 16 + Tailwind CSS |

---

## SLIDE 5: Lobster Trap Integration (Veea)

**Not just using it - it IS the core engine**

- ALL LLM traffic routes through Lobster Trap binary
- Custom policy YAML with 13 ingress rules:
  - Prompt injection, PII leaks, SQL injection
  - Shell commands, data exfiltration, role impersonation
  - Malware requests, obfuscation/encoding detection
- 2 egress rules for response inspection
- Sub-millisecond (compiled regex, zero LLM overhead)
- Full audit log with bidirectional metadata headers

---

## SLIDE 6: Key Features

- **Real-time Dashboard** - SSE-powered, live security events
- **Agent Registry** - Register agents, get proxy URLs, set policy levels
- **Security Tester** - Built-in adversarial prompt suite (27 test cases)
- **Audit Trail** - Every request logged with full metadata (SOC2-ready)
- **Multi-tenant** - User accounts, per-user agent isolation
- **Zero-latency inspection** - Regex DPI, no LLM calls for security checks

---

## SLIDE 7: Business Model & Market

| Plan | Price | For |
|------|-------|-----|
| Starter | $99/mo | 5 agents, 10K requests |
| Pro | $299/mo | 25 agents, 100K requests, Slack alerts |
| Enterprise | Custom | Unlimited, on-prem, SOC2, SSO |

**TAM**: $4.2B (AI security market, projected 2027)
**Target**: CTOs, Heads of AI, Security Engineers

| Aegis | Competitors |
|-------|-------------|
| Real DPI proxy (Lobster Trap) | Webhooks/logs only |
| Sub-ms latency (compiled regex) | LLM-based checks |
| One-line integration (URL swap) | SDK required |
| Bidirectional inspection | Ingress only |

---

## SLIDE 8: Live Demo

**Live App:** https://aegis-vert.vercel.app/
**Backend API:** https://rtahreem-aegis-apis.hf.space
**Demo Login:** demo@aegis.ai / demo1234

1. Login -> View real-time dashboard
2. Register a new agent -> get proxy URL
3. Send adversarial prompts -> watch blocks in real-time
4. View security events + audit trail

---

## SLIDE 9: Thank You

**Aegis - The AI Firewall**

*One line of code. Total AI agent security.*

- GitHub: github.com/Rizwantahreem/Aegis
- Live: https://aegis-vert.vercel.app/
- Built with Google Gemini + Veea Lobster Trap

**Future:** Slack/PagerDuty alerts, visual policy editor, SOC2 reports, multi-LLM support, on-prem deployment

---
