# AgentPort AI — Portable Agent Identity & Verification

> **“Define once. Export anywhere. Verify what survives.”**

[![OpenGAP Specification](https://img.shields.io/badge/OpenGAP-0.1.0-blue.svg)](https://github.com/agentport/agent-port)
[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](LICENSE)
[![Verification Engine](https://img.shields.io/badge/Verification-Deterministic_PASS-emerald.svg)](verification)
[![Max Score](https://img.shields.io/badge/Composite_Score-575%2F575-cyan.svg)](verification)

---

## 1. Executive Overview

**AgentPort AI** is a framework-independent AI Agent Passport and formal verification system built upon the **OpenGAP (Open Git Agent Protocol)** specification.

In the rapidly evolving AI landscape, autonomous agents are tightly coupled to fragmented proprietary runtimes (OpenAI Agents SDK, CrewAI, Claude Code, Lyzr, LangGraph, AutoGen). Migrating an agent between frameworks frequently leads to **persona drift**, **silent permission escalation**, **eroded safety boundaries**, and **lost behavioral contracts**.

AgentPort solves this by enforcing an architectural separation:
> **Portable Agent Identity, Tools, and Behavior Contracts** are defined canonically once in OpenGAP format.
> **Framework-Specific Runtime Behavior and Orchestration Loops** are generated through deterministic adapters whose behavioral survival is rigorously verified and accredited with **Framework Visas**.

---

## 2. Canonical OpenGAP Repository Structure

The canonical agent definition lives directly within this repository as an OpenGAP compliant source of truth:

```text
agentport-ai/
├── agent.yaml           # Manifest (spec_version: 0.1.0, agent identity, tools/skills registry)
├── SOUL.md              # Identity, Personality, Communication Style, Values, Behavioral Principles
├── AGENTS.md            # Framework-agnostic operational rules, safety boundaries, escalation policies
├── DUTIES.md            # Strict Separation of Duties (Maker, Checker, Executor, Auditor)
├── EXPLAINABILITY.md    # Transparent reasoning contract (# Decision, # Inputs, # Limits)
├── README.md            # Comprehensive architecture documentation
│
├── tools/               # Formally specified JSON schema tool definitions
│   ├── risk_check.json
│   ├── approval_request.json
│   ├── audit_log.json
│   └── agent_status.json
│
├── skills/              # Specialized domain procedures
│   ├── security-review/SKILL.md
│   ├── risk-analysis/SKILL.md
│   └── audit-report/SKILL.md
│
├── adapters/            # 4 Independent Framework Transformation Adapters
│   ├── openai_adapter.py      # OpenAI Agents SDK (Strict tools, dual-agent handoffs)
│   ├── crewai_adapter.py      # CrewAI (Sequential process, Backstory/Goal, Task graphs)
│   ├── claude_code_adapter.py # Claude Code (CLAUDE.md guidelines, slash commands, tools)
│   └── lyzr_adapter.py        # Lyzr Automata (Agent API schemas, persona prompt, tasks)
│
├── verification/        # Deterministic 3-Checkpoint Verification Engine & CLI
│   ├── checkpoint1.py   # Manifest integrity, SOUL sections, role segregation, tool/skill check
│   ├── checkpoint2.py   # Explainability structure and semantic sentence validation
│   ├── checkpoint3.py   # Framework export and serialization validation
│   ├── scoring.py       # Dynamic point allocation engine (up to 575 pts)
│   ├── engine.py        # Verification coordinator and evidence hash generator
│   └── validate.py      # CLI runner: python -m verification.validate
│
├── backend/             # REST APIs, SQLite models, and Policy Simulator
│   ├── main.py          # FastAPI application
│   ├── models.py        # SQLite schema for agents, runs, and audit logs
│   ├── schemas.py       # Request/Response contracts
│   └── security_simulator.py # Deterministic ALLOW / REQUIRE APPROVAL / BLOCK engine
│
└── src/                 # Premium React + TypeScript + Tailwind developer dashboard
```

---

## 3. The 3 Deterministic Checkpoints

Unlike systems that output superficial status indicators, AgentPort uses strict deterministic checks:

| Checkpoint | Focus | Validation Rules |
| :--- | :--- | :--- |
| **Checkpoint 1: Passport Integrity** | Core Contract | • Validates `agent.yaml` (`spec_version: "0.1.0"`, lowercase hyphenated name).<br>• Verifies `SOUL.md` contains populated sections for Identity, Personality, Communication Style, Values, Principles.<br>• Checks that all declared `tools/*.json` and `skills/*/SKILL.md` exist with valid schemas.<br>• Scans `DUTIES.md` ensuring **Maker** and **Checker** are never conflated or placed on the same line.<br>• *Gating rule*: Checkpoint 1 must pass before remaining checkpoints run. |
| **Checkpoint 2: Explainability** | Decision Lineage | • Verifies exact markdown headings: `# Decision`, `# Inputs`, `# Limits`.<br>• Confirms each section has **at least 2 complete sentences**.<br>• Verifies semantic presence of decision reasoning, input sources, and operational bounds. |
| **Checkpoint 3: Framework Export** | Multi-Runtime Export | • Runs all 4 independent adapters (OpenAI, CrewAI, Claude Code, Lyzr).<br>• Validates JSON serialization, required fields, and non-empty artifacts.<br>• Awards 1 Framework Visa per passed adapter. |

---

## 4. Framework Visas & Scoring Model

AgentPort utilizes a transparent 575-point challenge scoring model:

| Milestone | Points | Requirement |
| :--- | :---: | :--- |
| **First Passport Created** | `+25` | Canonical OpenGAP repository loaded |
| **Checkpoint 1 (Passport Integrity)** | `+50` | Manifest, SOUL, Tools, Skills, Separation of Duties |
| **Checkpoint 2 (Explainability)** | `+50` | Exact headings + 2 sentences each + semantic check |
| **Checkpoint 3 (Framework Export)** | `+50` | Successful generation of export artifacts |
| **OpenAI Visa** | `+100` | Passed OpenAI Agents SDK adapter validation |
| **CrewAI Visa** | `+100` | Passed CrewAI multi-agent adapter validation |
| **Claude Code Visa** | `+100` | Passed Claude Code memory & guidelines adapter validation |
| **Lyzr Visa** | `+100` | Passed Lyzr Automata adapter validation |
| **MAX TOTAL** | **575** | **Fully Verified Autonomous Agent Passport** |

---

## 5. Portability Analysis: What Survives vs. What Adapts

| Feature | OpenGAP Canonical | OpenAI Agents SDK | CrewAI | Claude Code | Lyzr Automata |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Identity & Core Values** | `SOUL.md` | System Instructions | Agent Backstory | `CLAUDE.md` Guidelines | Persona Prompt |
| **Operational Rules** | `AGENTS.md` | Developer Directives | Agent Goal | System Directive | Task Instructions |
| **Separation of Duties** | `DUTIES.md` | Handoff Agents | Sequential Process | Subagent Permissions | Dual Task Sequence |
| **Tools** | JSON Schemas | Strict Function Tools | BaseTool Classes | Anthropic Tools Schema | Automata Tool Signatures |
| **Explainability** | `EXPLAINABILITY.md` | Structured Output | Output Pydantic Model | Markdown Output Section | Output Schema Dict |
| **Execution Loop** | Abstract | Runner Loop | Crew Execution Loop | User / CLI Turn Loop | Task Graph Execution |

---

## 6. Deterministic Security Simulator

AgentPort integrates an interactive zero-trust security engine enforcing three verdict tiers:
- **ALLOW** (Risk: 10–25): Read-only queries on public docs, manifests, and telemetry.
- **REQUIRE APPROVAL** (Risk: 50–75): Mutating filesystem actions, exporting `customer.csv`, or external network dispatches. Requires cryptographic clearance from an independent Checker.
- **BLOCK** (Risk: 90–100): Categorically halts attempts to delete production databases, drop tables, disable explainability, or conflate Maker/Checker privileges.

---

## 7. Quickstart & CLI Verification

### Run CLI Verification
Execute the deterministic verification suite directly in bash:
```bash
python3 -m verification.validate
```

Expected Output:
```text
AgentPort Verification

[1/3] Passport Integrity
PASS

[2/3] Explainability
PASS

[3/3] Framework Export
OpenAI       PASS
CrewAI       PASS
Claude Code  PASS
Lyzr         PASS

VISAS
OpenAI       VERIFIED
CrewAI       VERIFIED
Claude Code  VERIFIED
Lyzr         VERIFIED

SCORE: 575 / 575
```

### Launch Web Dashboard
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect the Agent Passport, run live verification sweeps, export framework artifacts, simulate security policies, and download tamper-evident evidence reports.

---

## 8. License & Attribution

Designed and engineered for the AI Agent Hackathon under the **Apache-2.0 License**. Compatible with the OpenGAP specification.
