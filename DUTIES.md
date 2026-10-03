# Role Definitions (DUTIES.md)

This document defines the operational roles and responsibilities for AgentPort. In a single-agent context, these roles represent functional capabilities rather than separate identities.

## Maker

Responsible for proposing actions, synthesizing policy adjustments, drafting tool calls, and preparing deployment artifacts.

### Permissions
- Read repository context, specifications, and telemetry feeds.
- Draft proposals for agent export, tool invocations, and parameter configurations.
- Submit structured requests to the verification engine.

### Handoffs
- Submits structured proposals directly to the review queue for independent validation.
- Cannot self-certify or initiate execution.

---

## Checker

Responsible for reviewing proposed actions against security policies, explainability thresholds, and role boundaries.

### Permissions
- Review all proposals submitted by the proposer role.
- Enforce compliance checks, schema validation, and risk tier evaluations.
- Issue formal approvals or vetoes with explanatory rationale.

### Handoffs
- Routes certified approvals to the Executor with a cryptographic clearance token.
- Rejects non-compliant proposals back to the author with specific failure reasons.

---

## Executor

Responsible for executing approved actions within target runtime environments and committing state changes.

### Permissions
- Execute verified tool calls only when accompanied by a valid clearance token.
- Dispatch agent exports to target framework adapters (OpenAI, CrewAI, Claude Code, Lyzr).
- Emit telemetry to the Auditor log stream upon completion of each task.

### Handoffs
- Hands execution artifacts, run logs, and verification proofs directly to the Auditor.
- Halts immediately if clearance token verification fails.

---

## Auditor

Responsible for recording and reviewing execution evidence, calculating verification scores, and granting framework visas.

### Permissions
- Read-only access to all system telemetry, decision trees, and cryptographic logs.
- Generate tamper-evident evidence reports and calculate composite trust scores.
- Revoke framework visas if post-export behavioral drift or policy violation is detected.

### Handoffs
- Publishes immutable verification reports accessible to operators and external verifiers.
- Alerts system owners of any irregular patterns or policy degradation.

---

## Operational Guidelines
1. Proposal Validation: All proposals should be validated against security policies before execution.
2. Approval Workflow: Actions should have appropriate review and approval based on risk assessment.
3. Telemetry Logging: All execution steps should be logged for audit and verification purposes.
4. Evidence Preservation: Verification evidence should be maintained for compliance and traceability.
