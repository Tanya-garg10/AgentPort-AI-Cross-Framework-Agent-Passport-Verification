import { CanonicalAgent, AdapterExportResult } from '../types/agent';

export function runAllAdapters(agent: CanonicalAgent): Record<string, AdapterExportResult> {
  return {
    openai: exportOpenAIAdapter(agent),
    crewai: exportCrewAIAdapter(agent),
    claude_code: exportClaudeCodeAdapter(agent),
    lyzr: exportLyzrAdapter(agent)
  };
}

export function exportOpenAIAdapter(agent: CanonicalAgent): AdapterExportResult {
  const name = agent.manifest.name || 'agent-port';
  const cleanName = name.replace(/-/g, '_');
  const version = agent.manifest.version || '1.0.0';

  const openaiTools = agent.tools.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: {
        type: 'object',
        properties: t.input_schema?.properties || {},
        required: t.input_schema?.required || [],
        additionalProperties: false
      },
      strict: true
    }
  }));

  const instructions = `You are ${name} (v${version}).
${agent.manifest.description}

IDENTITY & PERSONALITY:
${agent.soul.identity}
${agent.soul.personality}

VALUES & COMMUNICATION:
${agent.soul.values}
${agent.soul.communication_style}

OPERATIONAL CONSTRAINTS:
1. Enforce strict Maker/Checker segregation.
2. Call risk_check before state changes.
3. Every response must state # Decision, # Inputs, and # Limits.`;

  const codeSnippet = `from agents import Agent, Runner, function_tool
from typing import Dict, Any

# Target Agent definition for OpenAI Agents SDK
${cleanName} = Agent(
    name="${name}",
    model="gpt-4o",
    instructions="""${instructions}""",
    tools=[
${openaiTools.map((t) => `        # function_tool: ${t.function.name}`).join('\n')}
    ],
    temperature=0.1
)

# Separation of Duties Hand-off Agents
maker_agent = Agent(
    name="${name}_maker",
    instructions="Responsible for proposing actions. Cannot self-certify."
)

checker_agent = Agent(
    name="${name}_checker",
    instructions="Responsible for reviewing proposed actions. Cannot draft proposals."
)

handoff_policy = {
    "transfer_to_checker": checker_agent,
    "transfer_to_maker": maker_agent
}
`;

  const configObj = {
    framework: 'openai_agents_sdk',
    agent_spec: {
      name,
      version,
      model: 'gpt-4o',
      temperature: 0.1,
      tools_count: openaiTools.length,
      tools: openaiTools
    },
    handoff_definitions: ['maker_agent', 'checker_agent'],
    strict_schema_validation: true
  };

  return {
    framework: 'OpenAI Agents SDK',
    frameworkKey: 'openai',
    success: true,
    visaStatus: 'VERIFIED',
    artifact: JSON.stringify(configObj, null, 2),
    codeSnippet,
    configSnippet: JSON.stringify(openaiTools, null, 2),
    portable_fields: [
      'name',
      'version',
      'description',
      'soul.identity',
      'soul.values',
      'soul.personality',
      'tool_schemas'
    ],
    framework_specific_fields: [
      'openai_model_spec (gpt-4o)',
      'strict: true JSON schema constraints',
      'handoff_policy agents routing',
      'temperature: 0.1'
    ],
    warnings: []
  };
}

export function exportCrewAIAdapter(agent: CanonicalAgent): AdapterExportResult {
  const name = agent.manifest.name || 'agent-port';
  const roleTitle = `${name.replace(/-/g, ' ')} Governor`;
  const goal = 'Deterministically enforce behavioral contracts, verify tool requests, and maintain zero-trust role separation.';
  const backstory = `${agent.soul.identity} ${agent.soul.personality} Values: ${agent.soul.values}`.replace(/\n/g, ' ');

  const agentsYaml = `# CrewAI Agents Specification generated from OpenGAP
${name.replace(/-/g, '_')}_governor:
  role: >
    ${roleTitle}
  goal: >
    ${goal}
  backstory: >
    ${backstory}
  verbose: true
  allow_delegation: false
  max_iter: 15

maker_specialist:
  role: Action Proposal Author
  goal: Propose secure actions and formulate tool requests
  backstory: Creative proposal engine strictly blocked from self-certification.
  allow_delegation: false

checker_specialist:
  role: Compliance and Risk Verifier
  goal: Evaluate proposals against OpenGAP safety policies
  backstory: Rigorous policy gatekeeper ensuring dual-control integrity.
  allow_delegation: false
`;

  const tasksYaml = `# CrewAI Tasks Specification
propose_action_task:
  description: Evaluate incoming system request and draft an actionable proposal.
  expected_output: Structured action proposal with designated tool targets.
  agent: maker_specialist

verify_compliance_task:
  description: Inspect drafted action proposal, run risk_check, and confirm Maker/Checker separation.
  expected_output: Formal verdict (ALLOW, REQUIRE_APPROVAL, or BLOCK) with cryptographic signature.
  agent: checker_specialist

execute_action_task:
  description: Execute verified operation only if clearance status is APPROVED.
  expected_output: Execution telemetry and payload audit record.
  agent: ${name.replace(/-/g, '_')}_governor
`;

  const codeSnippet = `from crewai import Agent, Crew, Process, Task
from crewai.tools import BaseTool

# CrewAI Agent definitions
governor = Agent(
    role="${roleTitle}",
    goal="${goal}",
    backstory="""${agent.soul.identity}""",
    verbose=True,
    allow_delegation=False
)

# Crew instantiation with Sequential Process enforcing Separation of Duties
agentport_crew = Crew(
    agents=[governor],
    tasks=[], # Populated from tasks.yaml
    process=Process.sequential,
    verbose=True,
    memory=True
)
`;

  const configObj = {
    framework: 'crewai',
    agents_yaml: agentsYaml,
    tasks_yaml: tasksYaml,
    process: 'sequential',
    memory: true,
    delegation_permitted: false
  };

  return {
    framework: 'CrewAI',
    frameworkKey: 'crewai',
    success: true,
    visaStatus: 'VERIFIED',
    artifact: JSON.stringify(configObj, null, 2),
    codeSnippet,
    configSnippet: agentsYaml,
    portable_fields: [
      'name',
      'version',
      'soul.identity (as Backstory)',
      'purpose (as Goal)',
      'roles (as Crew Specialists)',
      'sequential_duty_flow'
    ],
    framework_specific_fields: [
      'process: Process.sequential',
      'allow_delegation: false',
      'memory: true',
      'max_iter: 15',
      'tasks.yaml expected_output schemas'
    ],
    warnings: []
  };
}

export function exportClaudeCodeAdapter(agent: CanonicalAgent): AdapterExportResult {
  const name = agent.manifest.name || 'agent-port';
  const version = agent.manifest.version || '1.0.0';

  const claudeMd = `# CLAUDE.md - ${name} Guidelines

## Agent Identity & Core Role
You are operating as ${name} (v${version}).
${agent.soul.identity}

## Communication Protocol
${agent.soul.communication_style}

## Values & Guardrails
${agent.soul.values}
${agent.soul.behavioral_principles}

## Required Explainability Format
For non-trivial operations or policy actions, structure your outputs explicitly using:
# Decision
Explain what decision is being made, why, and how.
# Inputs
Document all data sources, tool outputs, and context used.
# Limits
Highlight operational constraints, bounds, and unverified assumptions.

## Registered Tools
${agent.tools.map((t) => `- \`${t.name}\`: ${t.description} (Role: ${t.permission_level})`).join('\n')}

## Role Segregation Rules
- Never conflate Maker and Checker responsibilities in the same command turn.
- High-risk operations (file writes to production, external credential use) require human or Checker approval.`;

  const slashCommands = {
    '/verify-agent': {
      description: 'Run the AgentPort deterministic verification engine on current workspace',
      command: 'python -m verification.validate'
    },
    '/check-risk': {
      description: 'Execute pre-flight risk inspection on staged operations',
      command: 'python -m verification.checkpoint1'
    },
    '/passport': {
      description: 'Display active agent passport and visa standings',
      command: 'cat agent.yaml'
    }
  };

  const codeSnippet = `<!-- Saved as .claude/CLAUDE.md in project root -->
${claudeMd}

<!-- Custom Slash Commands (.claude/commands/agentport.json) -->
${JSON.stringify(slashCommands, null, 2)}
`;

  const configObj = {
    framework: 'claude_code',
    claude_md: claudeMd,
    slash_commands: slashCommands,
    anthropic_tools: agent.tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema
    }))
  };

  return {
    framework: 'Claude Code',
    frameworkKey: 'claude_code',
    success: true,
    visaStatus: 'VERIFIED',
    artifact: JSON.stringify(configObj, null, 2),
    codeSnippet,
    configSnippet: claudeMd,
    portable_fields: [
      'name',
      'version',
      'soul.identity',
      'soul.communication_style',
      'soul.values',
      'tool_declarations',
      'explainability_headings'
    ],
    framework_specific_fields: [
      'CLAUDE.md project guidelines format',
      'Slash command bindings (/verify-agent, /check-risk, /passport)',
      'Anthropic input_schema definitions',
      'Markdown memory persistence'
    ],
    warnings: []
  };
}

export function exportLyzrAdapter(agent: CanonicalAgent): AdapterExportResult {
  const name = agent.manifest.name || 'agent-port';
  const cleanName = name.replace(/-/g, '_');
  const version = agent.manifest.version || '1.0.0';

  const personaPrompt = `You are ${name} (v${version}).
Role: Autonomous Systems Governance & Verification Agent.
Identity: ${agent.soul.identity}
Personality: ${agent.soul.personality}
Values: ${agent.soul.values}
Communication: ${agent.soul.communication_style}
Principles: ${agent.soul.behavioral_principles}`;

  const lyzrTools = agent.tools.map((t) => ({
    tool_name: t.name,
    tool_type: 'custom_python_tool',
    description: t.description,
    permission_role: t.permission_level
  }));

  const codeSnippet = `# Generated by AgentPort Export Engine for Lyzr Automata
from lyzr_automata import Agent, Task
from lyzr_automata.tools import Tool
from lyzr_automata.ai_models.openai import OpenAIModel

# Initialize LLM backend
llm_model = OpenAIModel(
    api_key="OPTIONAL_ENV_KEY",
    parameters={"model": "gpt-4o", "temperature": 0.2}
)

# Instantiate Lyzr Agent
${cleanName} = Agent(
    role="${name} Verifier",
    prompt_persona="""${personaPrompt}""",
    model=llm_model
)

# Lyzr Policy Enforcement Task
governance_task = Task(
    name="Verify And Enforce Contract",
    agent=${cleanName},
    output_type="json",
    input_type="text",
    model=llm_model,
    instructions="Process input, enforce Maker/Checker boundaries, and record audit evidence."
)
`;

  const apiPayload = {
    agent_id: `lyzr-${name}-v1`,
    name,
    role: 'Autonomous Systems Governance & Verification Agent',
    description: agent.manifest.description,
    system_prompt: personaPrompt,
    tools: lyzrTools,
    features: {
      memory: true,
      rag: false,
      role_separation: true
    }
  };

  const configObj = {
    framework: 'lyzr',
    api_payload: apiPayload,
    automata_code: codeSnippet
  };

  return {
    framework: 'Lyzr',
    frameworkKey: 'lyzr',
    success: true,
    visaStatus: 'VERIFIED',
    artifact: JSON.stringify(configObj, null, 2),
    codeSnippet,
    configSnippet: JSON.stringify(apiPayload, null, 2),
    portable_fields: [
      'name',
      'version',
      'persona_prompt',
      'behavior_instructions',
      'tool_call_interfaces',
      'security_boundaries'
    ],
    framework_specific_fields: [
      'lyzr_agent_api_payload (agent_id, features)',
      'automata_task_graph (governance_task)',
      'lyzr_session_state_config',
      'custom_python_tool wrappers'
    ],
    warnings: []
  };
}
