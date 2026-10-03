"""
Deterministic Security and Policy Simulator for AgentPort.
Evaluates proposed agent actions against OpenGAP governance policies and assigns:
- ALLOW
- REQUIRE APPROVAL
- BLOCK
Based on deterministic rules without stochastic or mock fallbacks.
"""
import re
from typing import Dict, Any, List

RULES = [
    # Tier 1 - BLOCK: Irreversible destruction, root tampering, or Maker/Checker conflation
    {
        "id": "SEC-001",
        "description": "Block destructive commands against production environments or databases",
        "match": lambda action, res, role: any(k in res.lower() for k in ["production", "prod_db", "database", "drop table", "rm -rf", "delete_all"]),
        "verdict": "BLOCK",
        "risk_level": "CRITICAL",
        "risk_score": 98,
        "reason": "Destructive mutations against production data or storage are categorically prohibited by OpenGAP zero-trust policy."
    },
    {
        "id": "SEC-002",
        "description": "Block conflation of Maker and Checker duties",
        "match": lambda action, res, role: (role.lower() == "maker" and action.lower() in ["self_certify", "approve", "bypass_review"]) or ("conflate" in res.lower()),
        "verdict": "BLOCK",
        "risk_level": "CRITICAL",
        "risk_score": 100,
        "reason": "Prohibited Maker/Checker conflation detected. The authoring role cannot self-authorize state transitions."
    },
    {
        "id": "SEC-003",
        "description": "Block root security policy or explainability bypass",
        "match": lambda action, res, role: any(k in res.lower() for k in ["disable_explainability", "bypass_audit", "delete_audit_log", "root_policy"]),
        "verdict": "BLOCK",
        "risk_level": "CRITICAL",
        "risk_score": 95,
        "reason": "System explainability and tamper-evident audit logging are immutable and cannot be disabled or deleted."
    },

    # Tier 2 - REQUIRE APPROVAL: Sensitive data exfiltration, external webhooks, state mutations
    {
        "id": "SEC-004",
        "description": "Require approval for exporting sensitive customer or financial data",
        "match": lambda action, res, role: any(k in res.lower() for k in ["customer.csv", "user_records", "pii", "billing", "credentials", "secrets", "api_key"]),
        "verdict": "REQUIRE APPROVAL",
        "risk_level": "HIGH",
        "risk_score": 75,
        "reason": "Target resource contains sensitive PII or credentials. Dual-control approval from independent Checker is mandatory."
    },
    {
        "id": "SEC-005",
        "description": "Require approval for external dispatch or third-party webhooks",
        "match": lambda action, res, role: action.lower() in ["export", "dispatch", "webhook", "send_external"] or "external" in res.lower(),
        "verdict": "REQUIRE APPROVAL",
        "risk_level": "MEDIUM",
        "risk_score": 60,
        "reason": "Outbound network communications to unverified external endpoints require clearance token before execution."
    },
    {
        "id": "SEC-006",
        "description": "Require approval for filesystem write or framework export commits",
        "match": lambda action, res, role: action.lower() in ["write", "modify", "deploy"],
        "verdict": "REQUIRE APPROVAL",
        "risk_level": "MEDIUM",
        "risk_score": 50,
        "reason": "State-mutating write operation requires dual-custody authorization."
    },

    # Tier 3 - ALLOW: Read-only documentation, local schema queries, status telemetry
    {
        "id": "SEC-007",
        "description": "Allow read-only queries on public documentation, manifests, and telemetry",
        "match": lambda action, res, role: action.lower() in ["read", "inspect", "query", "status"] or any(k in res.lower() for k in ["documentation", "docs", "agent.yaml", "status", "public", "telemetry"]),
        "verdict": "ALLOW",
        "risk_level": "LOW",
        "risk_score": 15,
        "reason": "Read-only inspection of non-sensitive public documentation and agent telemetry operates within normal bounds."
    }
]

def evaluate_security_action(action_type: str, target_resource: str, requesting_role: str, payload: Dict[str, Any] = None) -> Dict[str, Any]:
    """Deterministically evaluates an action against the OpenGAP policy matrix."""
    for rule in RULES:
        if rule["match"](action_type, target_resource, requesting_role):
            return {
                "rule_id": rule["id"],
                "verdict": rule["verdict"],
                "risk_level": rule["risk_level"],
                "risk_score": rule["risk_score"],
                "reason": rule["reason"],
                "action_type": action_type,
                "target_resource": target_resource,
                "requesting_role": requesting_role,
                "requires_checker": rule["verdict"] == "REQUIRE APPROVAL",
                "blocked": rule["verdict"] == "BLOCK"
            }

    # Default fallback: safe containment (Require approval for unrecognized resources)
    return {
        "rule_id": "SEC-DEFAULT",
        "verdict": "REQUIRE APPROVAL",
        "risk_level": "MEDIUM",
        "risk_score": 45,
        "reason": "Unclassified resource access defaults to safe containment requiring Checker authorization.",
        "action_type": action_type,
        "target_resource": target_resource,
        "requesting_role": requesting_role,
        "requires_checker": True,
        "blocked": False
    }
