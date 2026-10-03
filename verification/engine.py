"""
AgentPort Core Verification Engine.
Coordinates sequential execution of Checkpoints 1, 2, and 3,
enforces checkpoint gating, calculates score, and generates evidence dossiers.
"""
import os
import uuid
import hashlib
from datetime import datetime, timezone
from typing import Dict, Any

from verification.checkpoint1 import run_checkpoint1
from verification.checkpoint2 import run_checkpoint2
from verification.checkpoint3 import run_checkpoint3
from verification.scoring import calculate_score

def run_full_verification(root_dir: str = ".") -> Dict[str, Any]:
    run_id = f"apr-{uuid.uuid4().hex[:12]}"
    timestamp = datetime.now(timezone.utc).isoformat()

    # Step 1: Checkpoint 1 - Passport Integrity
    cp1_result = run_checkpoint1(root_dir)

    # Checkpoint 1 must pass before remaining checkpoints are considered valid
    if not cp1_result["passed"]:
        visas = {"OpenAI": "DENIED", "CrewAI": "DENIED", "Claude Code": "DENIED", "Lyzr": "DENIED"}
        score_data = calculate_score(
            has_passport=True,
            cp1_passed=False,
            cp2_passed=False,
            cp3_passed=False,
            visas=visas
        )
        return {
            "run_id": run_id,
            "timestamp": timestamp,
            "overall_status": "FAIL",
            "checkpoint1": cp1_result,
            "checkpoint2": {
                "checkpoint": "Checkpoint 2 — Explainability",
                "passed": False,
                "status": "SKIPPED",
                "errors": ["Gated: Checkpoint 1 must pass before Checkpoint 2 can run."]
            },
            "checkpoint3": {
                "checkpoint": "Checkpoint 3 — Framework Export",
                "passed": False,
                "status": "SKIPPED",
                "errors": ["Gated: Checkpoint 1 must pass before Checkpoint 3 can run."]
            },
            "visas": visas,
            "score": score_data,
            "evidence": generate_evidence_markdown(run_id, timestamp, "1.0.0", cp1_result, None, None, visas, score_data)
        }

    # Step 2: Checkpoint 2 - Explainability
    cp2_result = run_checkpoint2(root_dir)

    # Step 3: Checkpoint 3 - Framework Export
    canonical_data = {
        "manifest": cp1_result["details"]["manifest"],
        "soul": cp1_result["details"]["soul"],
        "tools": cp1_result["details"]["tools"],
        "skills": cp1_result["details"]["skills"]
    }
    cp3_result = run_checkpoint3(canonical_data)

    visas = cp3_result.get("visas", {})
    score_data = calculate_score(
        has_passport=True,
        cp1_passed=cp1_result["passed"],
        cp2_passed=cp2_result["passed"],
        cp3_passed=cp3_result["passed"],
        visas=visas
    )

    overall_status = "PASS" if (cp1_result["passed"] and cp2_result["passed"] and cp3_result["passed"]) else "PARTIAL"

    agent_version = cp1_result["details"]["manifest"].get("version", "1.0.0")
    evidence_md = generate_evidence_markdown(
        run_id=run_id,
        timestamp=timestamp,
        agent_version=agent_version,
        cp1=cp1_result,
        cp2=cp2_result,
        cp3=cp3_result,
        visas=visas,
        score=score_data
    )

    evidence_hash = hashlib.sha256(evidence_md.encode('utf-8')).hexdigest()

    return {
        "run_id": run_id,
        "timestamp": timestamp,
        "evidence_sha256": evidence_hash,
        "overall_status": overall_status,
        "checkpoint1": cp1_result,
        "checkpoint2": cp2_result,
        "checkpoint3": cp3_result,
        "visas": visas,
        "score": score_data,
        "evidence_markdown": evidence_md
    }

def generate_evidence_markdown(
    run_id: str,
    timestamp: str,
    agent_version: str,
    cp1: Dict[str, Any],
    cp2: Any,
    cp3: Any,
    visas: Dict[str, str],
    score: Dict[str, Any]
) -> str:
    md = f"""# AgentPort Verification Evidence Report

- **Run ID**: `{run_id}`
- **Timestamp**: {timestamp}
- **Agent Version**: {agent_version}
- **Overall Score**: {score['total_score']} / {score['max_score']} ({score['percentage']}%)

## Checkpoint Status

### [1/3] Passport Integrity
- Status: **{cp1['status']}**
- Manifest Valid: {cp1.get('details', {}).get('manifest_valid')}
- SOUL.md Populated: {cp1.get('details', {}).get('soul_valid')}
- Role Separation Enforced: {cp1.get('details', {}).get('duties_valid')}
- Tools Registered: {cp1.get('details', {}).get('tools_count')}
- Skills Registered: {cp1.get('details', {}).get('skills_count')}
"""
    if cp1.get('errors'):
        md += f"- Violations: {', '.join(cp1['errors'])}\n"

    if cp2:
        md += f"""
### [2/3] Explainability
- Status: **{cp2['status']}**
- Required Headings Verified: Decision, Inputs, Limits
"""
        if cp2.get('errors'):
            md += f"- Violations: {', '.join(cp2['errors'])}\n"
    else:
        md += "\n### [2/3] Explainability\n- Status: SKIPPED (Gated by Checkpoint 1)\n"

    if cp3:
        md += f"""
### [3/3] Framework Export & Visas
- Status: **{cp3['status']}**
- Visas Earned: {cp3.get('visas_earned', 0)} / 4
"""
        for fw, v in visas.items():
            md += f"- **{fw}**: `{v}`\n"
    else:
        md += "\n### [3/3] Framework Export & Visas\n- Status: SKIPPED (Gated by Checkpoint 1)\n"

    md += f"""
## Score Breakdown
"""
    for item in score.get('breakdown', []):
        pts = f"+{item['points']}" if item.get('awarded') else "0"
        md += f"- {item['item']}: **{pts}** pts\n"

    md += f"\n**TOTAL COMPOSITE SCORE**: {score['total_score']} / {score['max_score']}\n"
    return md
