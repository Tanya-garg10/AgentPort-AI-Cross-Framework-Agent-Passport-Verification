---
name: audit-report
description: Automated synthesis of tamper-evident verification evidence reports and framework visa certificates
metadata:
  version: "1.0.0"
  category: governance
---

# Audit Report Skill

## Overview
Compiles formal verification run logs, checkpoint attestations, and adapter serialization results into machine-readable JSON and human-readable Markdown evidence dossiers.

## Deliverables
- **Run Evidence Dossier**: Generates unique run IDs, timestamps, SHA-256 integrity checksums, and granular passed/failed check assertions.
- **Portability Breakdown**: Outlines preserved portable attributes versus framework-specific runtime shims across all evaluated adapters.
- **Visa Issuance**: Formalizes the grant of OpenAI, CrewAI, Claude Code, and Lyzr Visas based strictly on deterministic validation proofs.
