"""
Data schemas and interfaces for AgentPort API.
Supports typed payloads for verification, exports, security simulations, and passport views.
"""
from typing import Dict, Any, List, Optional

class AgentCreateRequest:
    def __init__(self, name: str, version: str, description: str, directory: Optional[str] = None):
        self.name = name
        self.version = version
        self.description = description
        self.directory = directory or "."

class SecuritySimulationRequest:
    def __init__(self, action_type: str, target_resource: str, requesting_role: str, payload: Optional[Dict[str, Any]] = None):
        self.action_type = action_type
        self.target_resource = target_resource
        self.requesting_role = requesting_role
        self.payload = payload or {}

class ExportRequest:
    def __init__(self, framework: str):
        self.framework = framework
