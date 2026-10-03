---
name: risk-analysis
description: Deterministic risk scoring and impact modeling for autonomous agent tool invocations
version: 1.0.0
category: compliance
---

# Risk Analysis Skill

## Overview
This skill calculates dynamic threat and impact vectors for proposed agent actions before runtime execution is dispatched to external frameworks.

## Evaluation Criteria
- **Data Sensitivity**: Inspect whether target resources contain customer personally identifiable information (PII), secret keys, or internal specifications.
- **State Mutability**: Differentiate between read-only diagnostic actions (Tier 1: Low Risk) and irreversible state-mutating actions such as record deletion or external network dispatch (Tier 3: High Risk).
- **Dual Control Enforcement**: Trigger mandatory dual-authorization escalation whenever calculated risk score exceeds 40 out of 100.
