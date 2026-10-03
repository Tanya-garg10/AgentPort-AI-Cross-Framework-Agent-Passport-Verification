"""
Database models and entities for AgentPort AI backend.
Provides SQLite persistence for Agents, Verification Runs, and Audit Events.
"""
from typing import Dict, Any, List, Optional
import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "agentport.db")

def init_db(db_path: str = DB_PATH):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        description TEXT,
        canonical_dir TEXT,
        created_at TEXT,
        updated_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verification_runs (
        run_id TEXT PRIMARY KEY,
        agent_id TEXT,
        timestamp TEXT,
        overall_status TEXT,
        score INTEGER,
        max_score INTEGER,
        evidence_sha256 TEXT,
        results_json TEXT,
        FOREIGN KEY(agent_id) REFERENCES agents(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS security_events (
        event_id TEXT PRIMARY KEY,
        agent_id TEXT,
        timestamp TEXT,
        action_type TEXT,
        target_resource TEXT,
        risk_score INTEGER,
        verdict TEXT,
        requesting_role TEXT,
        details TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()
