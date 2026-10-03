"""
Claude Code Framework Adapter for AgentPort (OpenGAP).
Transforms canonical agent definitions into Claude Code memory configuration (CLAUDE.md),
tool contracts, custom slash commands, and Anthropic tool use definitions.
"""
import json
from typing import Dict, Any, List
from adapters.adapter_base import BaseAdapter, AdapterResult

class ClaudeCodeAdapter(BaseAdapter):
    @property
    def framework_name(self) -> str:
        return "Claude Code"

    def transform(self, canonical_data: Dict[str, Any]) -> AdapterResult:
        warnings: List[str] = []
        portable_fields: List[str] = [
            "name",
            "version",
            "identity",
            "communication_style",
            "behavioral_principles",
            "tool_declarations",
            "explainability_headings"
        ]
        framework_specific_fields: List[str] = [
            "claude_md_guidelines",
            "slash_commands_spec",
            "subagent_handoff_protocols",
            "anthropic_beta_prompt_caching",
            "bash_tool_sandboxing"
        ]

        manifest = canonical_data.get("manifest", {})
        soul = canonical_data.get("soul", {})
        tools = canonical_data.get("tools", [])

        # Construct CLAUDE.md project guidelines
        claude_md_content = f"""# CLAUDE.md - {manifest.get('name', 'agent-port')} Guidelines

## Agent Identity & Core Role
You are operating as {manifest.get('name', 'agent-port')} (v{manifest.get('version', '1.0.0')}).
{soul.get('identity', '')}

## Communication Protocol
{soul.get('communication_style', '')}

## Values & Guardrails
{soul.get('values', '')}
{soul.get('behavioral_principles', '')}

## Required Explainability Format
For non-trivial operations or policy actions, structure your outputs explicitly using:
# Decision
Explain what decision is being made, why, and how.
# Inputs
Document all data sources, tool outputs, and context used.
# Limits
Highlight operational constraints, bounds, and unverified assumptions.

## Registered Tools
"""
        for t in tools:
            claude_md_content += f"- `{t.get('name')}`: {t.get('description')} (Role: {t.get('permission_level')})\n"

        claude_md_content += """
## Role Segregation Rules
- Never conflate Maker and Checker responsibilities in the same command turn.
- High-risk operations (file writes to production, external credential use) require human or Checker approval.
"""

        # Generate custom slash command for Claude Code
        slash_commands = {
            "/verify-agent": {
                "description": "Run the AgentPort deterministic verification engine on current workspace",
                "command": "python -m verification.validate"
            },
            "/check-risk": {
                "description": "Execute pre-flight risk inspection on staged operations",
                "command": "python -m verification.checkpoint1"
            },
            "/passport": {
                "description": "Display active agent passport and visa standings",
                "command": "cat agent.yaml"
            }
        }

        # Generate Anthropic tool schemas
        anthropic_tools = []
        for t in tools:
            anthropic_tools.append({
                "name": t.get("name"),
                "description": t.get("description"),
                "input_schema": t.get("input_schema", {})
            })

        artifact_bundle = {
            "framework": "claude_code",
            "claude_md": claude_md_content.strip(),
            "slash_commands": slash_commands,
            "anthropic_tools": anthropic_tools,
            "system_prompt": f"System Directive for Claude Code: {manifest.get('description')}\nIdentity: {soul.get('identity', '')}"
        }

        return AdapterResult(
            framework="Claude Code",
            success=True,
            artifact=json.dumps(artifact_bundle, indent=2),
            portable_fields=portable_fields,
            framework_specific_fields=framework_specific_fields,
            warnings=warnings,
            raw_manifest=artifact_bundle
        )
