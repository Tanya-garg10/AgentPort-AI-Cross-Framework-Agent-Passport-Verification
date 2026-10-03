#!/usr/bin/env python3
"""
CLI entry point for AgentPort verification.
Usage:
    python -m verification.validate
"""
import sys
import os

# Add root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from verification.engine import run_full_verification

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    result = run_full_verification(root_dir)

    print("AgentPort Verification\n")

    # Checkpoint 1
    cp1 = result["checkpoint1"]
    print("[1/3] Passport Integrity")
    print(cp1["status"])
    if cp1["errors"]:
        for err in cp1["errors"]:
            print(f"  ✗ {err}")
    print()

    # Checkpoint 2
    cp2 = result["checkpoint2"]
    print("[2/3] Explainability")
    print(cp2["status"])
    if cp2["errors"]:
        for err in cp2["errors"]:
            print(f"  ✗ {err}")
    print()

    # Checkpoint 3
    cp3 = result["checkpoint3"]
    print("[3/3] Framework Export")
    adapter_results = cp3.get("adapter_results", {})
    frameworks = ["OpenAI", "CrewAI", "Claude Code", "Lyzr"]
    for fw in frameworks:
        ar = adapter_results.get(fw, {})
        status = ar.get("status", "FAIL")
        print(f"{fw:<12} {status}")
    print()

    # Visas
    print("VISAS")
    visas = result.get("visas", {})
    for fw in frameworks:
        v = visas.get(fw, "DENIED")
        print(f"{fw:<12} {v}")
    print()

    # Score
    score = result.get("score", {})
    total = score.get("total_score", 0)
    max_score = score.get("max_score", 575)
    print(f"SCORE: {total} / {max_score}")

    if result["overall_status"] != "PASS":
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
