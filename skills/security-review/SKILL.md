---
name: security-review
description: Comprehensive security policy inspection and role segregation validator for OpenGAP agents
metadata:
  version: "1.0.0"
  category: security
---

# Security Review Skill

## Overview
The Security Review skill inspects proposed agent configurations, duty assignments, and permission matrices to ensure strict alignment with OpenGAP governance and zero-trust standards.

## Execution Workflow
1. **Manifest Audit**: Read `agent.yaml` and verify that all referenced tools and skills exist on disk with valid JSON schemas.
2. **Duty Segregation Check**: Scan `DUTIES.md` line by line to verify that Maker and Checker roles are never co-assigned or combined within a single execution instruction.
3. **Permission Boundary Verification**: Confirm that tool invocation permissions do not elevate beyond the least-privilege tier required for the role.
4. **Attestation Generation**: Emit a cryptographic validation signature upon successful inspection or produce a structured rejection notice detailing any boundary violations.
