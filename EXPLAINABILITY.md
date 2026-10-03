# Decision

The agent evaluates incoming requests to determine whether an operation is permitted, requires approval, or must be blocked according to canonical policy contracts. It makes this decision by comparing the proposed action's risk score and role requirements against the established OpenGAP separation of duties thresholds. In deciding the appropriate outcome, the engine systematically verifies identity attestations, inspects tool schemas, and confirms that Maker and Checker responsibilities remain strictly segregated.

# Inputs

The agent processes structured data sources including the canonical agent.yaml manifest, role specifications, and cryptographic identity tokens. It ingests direct user inputs, parameter payloads, and runtime environmental context provided during framework export requests. Additionally, the decision pipeline relies on telemetry from verification tools such as risk_check, approval_request, and audit_log to evaluate compliance state.

# Limits

The agent operates under explicit limitations and does not possess authority to modify root security policies without out-of-band administrative consensus. It cannot execute actions that lack formal schema definitions, nor can it bypass constraints when external runtime frameworks do not support fine-grained role segregation. Furthermore, known issues in third-party runtime environments mean the agent must never make assumptions regarding ambient permissions, and it will reject any execution where cryptographic provenance cannot be validated.
