export interface ToolDefinition {
  name: string;
  description: string;
  permission_level: 'maker' | 'checker' | 'executor' | 'auditor';
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  content: string;
}

export interface CanonicalAgent {
  manifestRaw: string;
  manifest: {
    spec_version: string;
    name: string;
    version: string;
    description: string;
    author?: string;
    license?: string;
    repository?: string;
    tools: string[];
    skills: string[];
    roles: Record<string, string>;
    compliance?: Record<string, any>;
  };
  soulRaw: string;
  soul: {
    identity: string;
    personality: string;
    communication_style: string;
    values: string;
    behavioral_principles: string;
  };
  agentsRaw: string;
  dutiesRaw: string;
  explainabilityRaw: string;
  tools: ToolDefinition[];
  skills: SkillDefinition[];
}

export interface CheckpointResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIPPED';
  passed: boolean;
  score: number;
  maxScore: number;
  errors: string[];
  checks: Array<{
    name: string;
    passed: boolean;
    details?: string;
  }>;
}

export interface AdapterExportResult {
  framework: string;
  frameworkKey: 'openai' | 'crewai' | 'claude_code' | 'lyzr';
  success: boolean;
  visaStatus: 'VERIFIED' | 'DENIED';
  artifact: string;
  codeSnippet: string;
  configSnippet?: string;
  portable_fields: string[];
  framework_specific_fields: string[];
  warnings: string[];
}

export interface VerificationReport {
  runId: string;
  timestamp: string;
  overallStatus: 'PASS' | 'FAIL' | 'PARTIAL';
  evidenceSha256: string;
  checkpoint1: CheckpointResult;
  checkpoint2: CheckpointResult;
  checkpoint3: CheckpointResult;
  visas: Record<string, 'VERIFIED' | 'DENIED'>;
  adapterResults: Record<string, AdapterExportResult>;
  score: {
    total: number;
    max: number;
    percentage: number;
    breakdown: Array<{
      item: string;
      points: number;
      maxPoints: number;
      awarded: boolean;
    }>;
  };
  markdown: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  action_type: string;
  target_resource: string;
  requesting_role: string;
  verdict: 'ALLOW' | 'REQUIRE APPROVAL' | 'BLOCK';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  rule_id: string;
  reason: string;
}
