"""
Checkpoint 3: Framework Export Validator
Executes independent adapters for OpenAI Agents SDK, CrewAI, Claude Code, and Lyzr.
Validates serialization, required fields, and artifact integrity.
Each passed adapter awards a framework Visa.
"""
from typing import Dict, Any, List
from adapters.openai_adapter import OpenAIAdapter
from adapters.crewai_adapter import CrewAIAdapter
from adapters.claude_code_adapter import ClaudeCodeAdapter
from adapters.lyzr_adapter import LyzrAdapter

def run_checkpoint3(canonical_data: Dict[str, Any]) -> Dict[str, Any]:
    adapters = {
        "OpenAI": OpenAIAdapter(),
        "CrewAI": CrewAIAdapter(),
        "Claude Code": ClaudeCodeAdapter(),
        "Lyzr": LyzrAdapter()
    }

    adapter_results = {}
    visas = {}
    errors = []

    for name, adapter in adapters.items():
        try:
            res = adapter.transform(canonical_data)
            # Validate generated artifact
            is_valid = res.success and len(res.artifact) > 50 and len(res.portable_fields) > 0
            adapter_results[name] = {
                "success": is_valid,
                "status": "PASS" if is_valid else "FAIL",
                "framework": res.framework,
                "artifact_length": len(res.artifact),
                "artifact": res.artifact,
                "portable_fields": res.portable_fields,
                "framework_specific_fields": res.framework_specific_fields,
                "warnings": res.warnings
            }
            if is_valid:
                visas[name] = "VERIFIED"
            else:
                visas[name] = "DENIED"
                errors.append(f"Adapter for {name} failed artifact validation.")
        except Exception as e:
            adapter_results[name] = {
                "success": False,
                "status": "FAIL",
                "framework": name,
                "error": str(e),
                "portable_fields": [],
                "framework_specific_fields": [],
                "warnings": [str(e)]
            }
            visas[name] = "DENIED"
            errors.append(f"Adapter {name} raised exception: {str(e)}")

    # Checkpoint 3 passes if at least one adapter succeeds
    successful_count = sum(1 for v in visas.values() if v == "VERIFIED")
    passed = successful_count > 0

    return {
        "checkpoint": "Checkpoint 3 — Framework Export",
        "passed": passed,
        "status": "PASS" if passed else "FAIL",
        "errors": errors,
        "adapter_results": adapter_results,
        "visas": visas,
        "visas_earned": successful_count
    }
