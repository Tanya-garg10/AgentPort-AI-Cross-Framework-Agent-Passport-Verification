import { SecurityEvent } from '../types/agent';

export interface SecurityRule {
  id: string;
  description: string;
  verdict: 'ALLOW' | 'REQUIRE APPROVAL' | 'BLOCK';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  reason: string;
  matcher: (action: string, resource: string, role: string) => boolean;
}

export const SECURITY_RULES: SecurityRule[] = [
  // BLOCK
  {
    id: 'SEC-001',
    description: 'Block destructive mutations against production database or infrastructure',
    verdict: 'BLOCK',
    risk_level: 'CRITICAL',
    risk_score: 98,
    reason: 'Destructive mutations against production storage or databases are categorically prohibited by OpenGAP zero-trust policy.',
    matcher: (act, res) => {
      const lower = res.toLowerCase();
      return ['production', 'prod_db', 'database', 'drop table', 'rm -rf', 'delete_all'].some((k) => lower.includes(k));
    }
  },
  {
    id: 'SEC-002',
    description: 'Block conflation of Maker and Checker duties',
    verdict: 'BLOCK',
    risk_level: 'CRITICAL',
    risk_score: 100,
    reason: 'Prohibited Maker/Checker conflation detected. The authoring role cannot self-authorize state transitions or bypass review.',
    matcher: (act, res, role) => {
      const r = role.toLowerCase();
      const a = act.toLowerCase();
      return (r === 'maker' && ['self_certify', 'approve', 'bypass_review', 'execute'].includes(a)) ||
             res.toLowerCase().includes('conflate');
    }
  },
  {
    id: 'SEC-003',
    description: 'Block disabling explainability or audit trails',
    verdict: 'BLOCK',
    risk_level: 'CRITICAL',
    risk_score: 95,
    reason: 'System explainability and tamper-evident audit logging are immutable invariants that cannot be disabled or deleted.',
    matcher: (act, res) => {
      const lower = res.toLowerCase();
      return ['disable_explainability', 'bypass_audit', 'delete_audit_log', 'root_policy'].some((k) => lower.includes(k));
    }
  },

  // REQUIRE APPROVAL
  {
    id: 'SEC-004',
    description: 'Require approval for exporting sensitive customer, financial, or secret data',
    verdict: 'REQUIRE APPROVAL',
    risk_level: 'HIGH',
    risk_score: 75,
    reason: 'Target resource contains sensitive PII, customer records, or credentials. Dual-control approval from independent Checker is mandatory.',
    matcher: (act, res) => {
      const lower = res.toLowerCase();
      return ['customer.csv', 'user_records', 'pii', 'billing', 'credentials', 'secrets', 'api_key'].some((k) => lower.includes(k));
    }
  },
  {
    id: 'SEC-005',
    description: 'Require approval for outbound external network dispatch or third-party webhooks',
    verdict: 'REQUIRE APPROVAL',
    risk_level: 'MEDIUM',
    risk_score: 60,
    reason: 'Outbound network communications to unverified external endpoints require formal clearance token before execution.',
    matcher: (act, res) => {
      const a = act.toLowerCase();
      const r = res.toLowerCase();
      return ['export', 'dispatch', 'webhook', 'send_external'].includes(a) || r.includes('external');
    }
  },
  {
    id: 'SEC-006',
    description: 'Require approval for state-mutating filesystem writes or framework exports',
    verdict: 'REQUIRE APPROVAL',
    risk_level: 'MEDIUM',
    risk_score: 50,
    reason: 'State-mutating write or deployment operation requires dual-custody authorization.',
    matcher: (act) => ['write', 'modify', 'deploy'].includes(act.toLowerCase())
  },

  // ALLOW
  {
    id: 'SEC-007',
    description: 'Allow read-only queries on public documentation, manifests, and telemetry',
    verdict: 'ALLOW',
    risk_level: 'LOW',
    risk_score: 15,
    reason: 'Read-only inspection of non-sensitive public documentation and agent telemetry operates within normal bounds.',
    matcher: (act, res) => {
      const a = act.toLowerCase();
      const r = res.toLowerCase();
      return ['read', 'inspect', 'query', 'status'].includes(a) ||
             ['documentation', 'docs', 'agent.yaml', 'status', 'public', 'telemetry'].some((k) => r.includes(k));
    }
  }
];

export function evaluateSecurity(
  actionType: string,
  targetResource: string,
  requestingRole: string
): SecurityEvent {
  const now = new Date().toISOString();
  const id = `sec-${Math.random().toString(36).substring(2, 9)}`;

  for (const rule of SECURITY_RULES) {
    if (rule.matcher(actionType, targetResource, requestingRole)) {
      return {
        id,
        timestamp: now,
        action_type: actionType,
        target_resource: targetResource,
        requesting_role: requestingRole,
        verdict: rule.verdict,
        risk_level: rule.risk_level,
        risk_score: rule.risk_score,
        rule_id: rule.id,
        reason: rule.reason
      };
    }
  }

  return {
    id,
    timestamp: now,
    action_type: actionType,
    target_resource: targetResource,
    requesting_role: requestingRole,
    verdict: 'REQUIRE APPROVAL',
    risk_level: 'MEDIUM',
    risk_score: 45,
    rule_id: 'SEC-DEFAULT',
    reason: 'Unclassified resource access defaults to safe containment requiring Checker authorization.'
  };
}
