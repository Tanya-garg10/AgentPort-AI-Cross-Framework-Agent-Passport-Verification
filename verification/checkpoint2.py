"""
Checkpoint 2: Explainability Validator
Validates EXPLAINABILITY.md:
- Exact headings: # Decision, # Inputs, # Limits
- At least two complete sentences per section
- Semantic coverage of decision reasoning, input sources, and operational limitations
"""
import os
import re
from typing import Dict, Any, List

def count_sentences(text: str) -> int:
    """Counts complete sentences based on punctuation boundaries."""
    cleaned = text.strip()
    if not cleaned:
        return 0
    # Split on terminal punctuation followed by space or end of string
    sentences = re.split(r'[.!?]+(?:\s+|$)', cleaned)
    return len([s for s in sentences if s.strip()])

def run_checkpoint2(root_dir: str = ".") -> Dict[str, Any]:
    errors = []
    checks = []

    file_path = os.path.join(root_dir, "EXPLAINABILITY.md")
    if not os.path.exists(file_path):
        return {
            "checkpoint": "Checkpoint 2 — Explainability",
            "passed": False,
            "status": "FAIL",
            "errors": ["EXPLAINABILITY.md file does not exist at root."],
            "checks": []
        }

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Required headings check
    required_sections = ["Decision", "Inputs", "Limits"]
    section_bodies = {}

    for heading in required_sections:
        # Match markdown level 1 heading: # Decision
        pattern = rf"^#\s+{heading}\s*$(.*?)(?=^#|\Z)"
        match = re.search(pattern, content, flags=re.MULTILINE | re.DOTALL)
        if not match:
            errors.append(f"Missing required exact heading: '# {heading}'")
            checks.append({"name": f"{heading} heading", "passed": False})
        else:
            body = match.group(1).strip()
            section_bodies[heading] = body
            checks.append({"name": f"{heading} heading", "passed": True})

            sentence_count = count_sentences(body)
            if sentence_count < 2:
                errors.append(f"Section '# {heading}' must contain at least TWO complete sentences. Found {sentence_count}.")
                checks.append({"name": f"{heading} minimum 2 sentences", "passed": False, "sentences": sentence_count})
            else:
                checks.append({"name": f"{heading} minimum 2 sentences", "passed": True, "sentences": sentence_count})

    # Semantic keyword checks
    decision_text = section_bodies.get("Decision", "").lower()
    if decision_text:
        has_decision_terms = any(t in decision_text for t in ["decision", "decide", "reason", "evaluate", "why", "how"])
        if not has_decision_terms:
            errors.append("Section '# Decision' does not sufficiently explain how or why the agent decides.")
            checks.append({"name": "Decision reasoning", "passed": False})
        else:
            checks.append({"name": "Decision reasoning", "passed": True})

    inputs_text = section_bodies.get("Inputs", "").lower()
    if inputs_text:
        has_input_terms = any(t in inputs_text for t in ["data", "input", "source", "tool", "context", "telemetry"])
        if not has_input_terms:
            errors.append("Section '# Inputs' does not describe data sources, inputs, or tools.")
            checks.append({"name": "Input sources", "passed": False})
        else:
            checks.append({"name": "Input sources", "passed": True})

    limits_text = section_bodies.get("Limits", "").lower()
    if limits_text:
        has_limit_terms = any(t in limits_text for t in ["limit", "constraint", "bound", "issue", "assumption", "cannot"])
        if not has_limit_terms:
            errors.append("Section '# Limits' does not describe limitations, constraints, or known issues.")
            checks.append({"name": "Limitations", "passed": False})
        else:
            checks.append({"name": "Limitations", "passed": True})

    passed = len(errors) == 0

    return {
        "checkpoint": "Checkpoint 2 — Explainability",
        "passed": passed,
        "status": "PASS" if passed else "FAIL",
        "errors": errors,
        "checks": checks,
        "details": {
            "sentence_counts": {k: count_sentences(v) for k, v in section_bodies.items()}
        }
    }
