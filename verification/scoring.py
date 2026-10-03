"""
Scoring Engine for AgentPort Passport Verification.
Calculates dynamic score based on checkpoints and framework visas:
- First Passport: +25
- Checkpoint 1 (Passport Integrity): +50
- Checkpoint 2 (Explainability): +50
- Checkpoint 3 (Framework Export): +50
- OpenAI Visa: +100
- CrewAI Visa: +100
- Claude Code Visa: +100
- Lyzr Visa: +100
Maximum possible: 575 points.
"""
from typing import Dict, Any, List

def calculate_score(
    has_passport: bool,
    cp1_passed: bool,
    cp2_passed: bool,
    cp3_passed: bool,
    visas: Dict[str, str]
) -> Dict[str, Any]:
    breakdown = []
    total = 0

    # First Passport created
    if has_passport:
        total += 25
        breakdown.append({"item": "First Passport Created", "points": 25, "awarded": True})
    else:
        breakdown.append({"item": "First Passport Created", "points": 0, "max_points": 25, "awarded": False})

    # Checkpoint 1: Passport Integrity
    if cp1_passed:
        total += 50
        breakdown.append({"item": "Checkpoint 1 — Passport Integrity", "points": 50, "awarded": True})
    else:
        breakdown.append({"item": "Checkpoint 1 — Passport Integrity", "points": 0, "max_points": 50, "awarded": False})

    # Checkpoint 2: Explainability
    if cp2_passed:
        total += 50
        breakdown.append({"item": "Checkpoint 2 — Explainability", "points": 50, "awarded": True})
    else:
        breakdown.append({"item": "Checkpoint 2 — Explainability", "points": 0, "max_points": 50, "awarded": False})

    # Checkpoint 3: Framework Export
    if cp3_passed:
        total += 50
        breakdown.append({"item": "Checkpoint 3 — Framework Export", "points": 50, "awarded": True})
    else:
        breakdown.append({"item": "Checkpoint 3 — Framework Export", "points": 0, "max_points": 50, "awarded": False})

    # Visas
    framework_list = ["OpenAI", "CrewAI", "Claude Code", "Lyzr"]
    for fw in framework_list:
        status = visas.get(fw, "DENIED")
        if status == "VERIFIED":
            total += 100
            breakdown.append({"item": f"{fw} Visa", "points": 100, "awarded": True})
        else:
            breakdown.append({"item": f"{fw} Visa", "points": 0, "max_points": 100, "awarded": False})

    return {
        "total_score": total,
        "max_score": 575,
        "percentage": round((total / 575) * 100, 1),
        "breakdown": breakdown
    }
