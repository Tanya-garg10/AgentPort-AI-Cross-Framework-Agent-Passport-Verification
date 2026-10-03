"""
AgentPort AI Backend Application.
Provides REST API endpoints for agent passport management, deterministic verification,
framework exports, security simulation, and evidence reports.
Compatible with FastAPI or standard Python HTTP servers.
"""
import os
import sys
import json
import sqlite3
from typing import Dict, Any, List

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from verification.engine import run_full_verification
from verification.scoring import calculate_score
from adapters import ALL_ADAPTERS
from backend.security_simulator import evaluate_security_action
from backend.models import DB_PATH, init_db

# Ensure database is initialized
init_db()

def get_db_connection():
    return sqlite3.connect(DB_PATH)

def get_active_agent_passport(agent_id: str = "agent-port") -> Dict[str, Any]:
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    verification_res = run_full_verification(root_dir)

    cp1 = verification_res.get("checkpoint1", {})
    details = cp1.get("details", {})
    manifest = details.get("manifest", {})
    soul = details.get("soul", {})
    tools = details.get("tools", [])
    skills = details.get("skills", [])

    return {
        "id": agent_id,
        "name": manifest.get("name", "agent-port"),
        "version": manifest.get("version", "1.0.0"),
        "description": manifest.get("description", ""),
        "author": manifest.get("author", "AgentPort Working Group"),
        "license": manifest.get("license", "Apache-2.0"),
        "repository": manifest.get("repository", ""),
        "passport_status": "VALID" if verification_res.get("overall_status") == "PASS" else "INVALID",
        "composite_score": verification_res.get("score", {}).get("total_score", 0),
        "max_score": 575,
        "visas": verification_res.get("visas", {}),
        "roles": {
            "maker": "Responsible for proposing actions, drafting tool calls, and preparing deployment artifacts.",
            "checker": "Responsible for reviewing proposed actions against security policies and role boundaries.",
            "executor": "Responsible for executing approved actions within target runtime environments.",
            "auditor": "Responsible for recording and reviewing execution evidence and granting framework visas."
        },
        "soul": soul,
        "tools": tools,
        "skills": skills,
        "last_verification": verification_res
    }

def export_agent_framework(framework_name: str) -> Dict[str, Any]:
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    verification_res = run_full_verification(root_dir)
    details = verification_res.get("checkpoint1", {}).get("details", {})

    canonical_data = {
        "manifest": details.get("manifest", {}),
        "soul": details.get("soul", {}),
        "tools": details.get("tools", []),
        "skills": details.get("skills", [])
    }

    adapter = ALL_ADAPTERS.get(framework_name.lower())
    if not adapter:
        # Try finding by loose match
        for k, v in ALL_ADAPTERS.items():
            if k in framework_name.lower() or framework_name.lower() in k:
                adapter = v
                break

    if not adapter:
        return {
            "framework": framework_name,
            "success": False,
            "error": f"Unknown framework adapter '{framework_name}'",
            "artifact": "",
            "portable_fields": [],
            "framework_specific_fields": [],
            "warnings": [f"Adapter '{framework_name}' not registered in registry."]
        }

    res = adapter.transform(canonical_data)
    return res.to_dict()

# Provide FastAPI app if available
try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel

    app = FastAPI(
        title="AgentPort AI — Portable Agent Identity & Verification API",
        version="1.0.0",
        description="OpenGAP canonical agent passport verification, export, and security simulation APIs."
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    def root():
        return {
            "system": "AgentPort AI",
            "version": "1.0.0",
            "tagline": "Define once. Export anywhere. Verify what survives.",
            "status": "operational"
        }

    @app.get("/agents")
    def list_agents():
        return [get_active_agent_passport()]

    @app.get("/agents/{agent_id}")
    def get_agent(agent_id: str):
        return get_active_agent_passport(agent_id)

    @app.get("/agents/{agent_id}/passport")
    def get_passport(agent_id: str):
        return get_active_agent_passport(agent_id)

    @app.post("/agents/{agent_id}/verify")
    def verify_agent(agent_id: str):
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        return run_full_verification(root_dir)

    @app.post("/agents/{agent_id}/export/{framework}")
    def export_agent(agent_id: str, framework: str):
        return export_agent_framework(framework)

    @app.get("/agents/{agent_id}/evidence")
    def get_evidence(agent_id: str):
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        v = run_full_verification(root_dir)
        return {
            "run_id": v["run_id"],
            "timestamp": v["timestamp"],
            "sha256": v["evidence_sha256"],
            "markdown": v["evidence_markdown"],
            "score": v["score"],
            "visas": v["visas"],
            "checkpoints": {
                "cp1": v["checkpoint1"]["status"],
                "cp2": v["checkpoint2"]["status"],
                "cp3": v["checkpoint3"]["status"]
            }
        }

    @app.get("/agents/{agent_id}/score")
    def get_score(agent_id: str):
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        v = run_full_verification(root_dir)
        return v["score"]

    @app.post("/security/simulate")
    def simulate_security(action_type: str, target_resource: str, requesting_role: str):
        return evaluate_security_action(action_type, target_resource, requesting_role)

except ImportError:
    app = None
