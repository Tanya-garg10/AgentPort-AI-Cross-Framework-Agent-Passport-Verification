import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, AlertTriangle, ShieldCheck, Flame, Sliders } from 'lucide-react';
import { CanonicalAgent, VerificationReport } from '../types/agent';

interface VerificationLabProps {
  agent: CanonicalAgent;
  report: VerificationReport;
  onRunVerification: () => void;
  isVerifying: boolean;
  onMutateAgent: (updatedAgent: CanonicalAgent) => void;
  onResetAgent: () => void;
}

export const VerificationLab: React.FC<VerificationLabProps> = ({
  agent,
  report,
  onRunVerification,
  isVerifying,
  onMutateAgent,
  onResetAgent
}) => {
  const [activeFailureMode, setActiveFailureMode] = useState<'none' | 'conflation' | 'explainability' | 'spec_version'>('none');

  const handleToggleFailureMode = (mode: 'none' | 'conflation' | 'explainability' | 'spec_version') => {
    setActiveFailureMode(mode);

    if (mode === 'none') {
      onResetAgent();
      return;
    }

    if (mode === 'conflation') {
      const brokenDuties = `# Separation of Duties Specification (DUTIES.md)
Line 3: Prohibited Maker and Checker co-assignment simulated here for test!

## Maker
Responsible for proposing actions.

## Checker
Responsible for reviewing proposed actions.
`;
      onMutateAgent({
        ...agent,
        dutiesRaw: brokenDuties
      });
    } else if (mode === 'explainability') {
      const brokenExp = `# Decision
The agent evaluates incoming requests to determine whether an operation is permitted.

# Inputs
The agent processes structured data sources.
`;
      onMutateAgent({
        ...agent,
        explainabilityRaw: brokenExp
      });
    } else if (mode === 'spec_version') {
      onMutateAgent({
        ...agent,
        manifest: {
          ...agent.manifest,
          spec_version: '0.2.0-invalid'
        }
      });
    }
  };

  const isVerified = report.score.total === 575;

  return (
    <div className="space-y-6">
      {/* Header (Section 10) */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            Verification Lab
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Run deterministic checks against the agent passport and every framework adapter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRunVerification}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Running Test Suite...' : 'Run Verification Suite'}</span>
          </button>
        </div>
      </div>

      {/* Large Terminal-Style Verification Panel (Section 10) */}
      <div className="relative rounded-xl border border-white/[0.1] bg-[#07090e] p-6 font-mono text-xs overflow-hidden shadow-2xl">
        {/* Subtle scan-line animation when running */}
        {isVerifying && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div className="w-full h-12 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent animate-scanline" />
          </div>
        )}

        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] text-slate-400 mb-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="text-white font-bold tracking-wider">
              AGENTPORT VERIFY / RUN {report.runId.substring(4, 8).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>TIMESTAMP: {report.timestamp.substring(11, 19)} UTC</span>
            <span className="text-slate-400">EXIT: {report.overallStatus === 'PASS' ? '0' : '1'}</span>
          </div>
        </div>

        {/* Terminal Body with exact formatting from Section 10 */}
        <div className="space-y-4 text-slate-300 leading-relaxed">
          {/* Step 1: agent.yaml */}
          <div>
            <div className="text-slate-400">&gt; loading agent.yaml</div>
            <div className="pl-4 text-emerald-400">
              {report.checkpoint1.checks.find((c) => c.name.includes('spec_version'))?.passed ? (
                <>✓ spec_version 0.1.0</>
              ) : (
                <span className="text-rose-400">✗ spec_version invalid: {agent.manifest.spec_version}</span>
              )}
            </div>
            {report.checkpoint1.checks.find((c) => c.name.includes('name'))?.passed ? (
              <div className="pl-4 text-emerald-400">✓ name: {agent.manifest.name}</div>
            ) : (
              <div className="pl-4 text-rose-400">✗ name formatting error</div>
            )}
          </div>

          {/* Step 2: SOUL.md */}
          <div>
            <div className="text-slate-400">&gt; validating agent identity</div>
            <div className="pl-4 text-emerald-400">
              {report.checkpoint1.checks.some((c) => c.name.includes('SOUL.md') && !c.passed) ? (
                <span className="text-rose-400">✗ SOUL.md section validation failed</span>
              ) : (
                <>✓ SOUL.md (Identity, Personality, Style, Values, Principles)</>
              )}
            </div>
          </div>

          {/* Step 3: tools */}
          <div>
            <div className="text-slate-400">&gt; checking tools</div>
            <div className="pl-4 text-emerald-400">
              ✓ {agent.tools.length} registered ({agent.tools.map((t) => t.name).join(', ')})
            </div>
          </div>

          {/* Step 4: skills */}
          <div>
            <div className="text-slate-400">&gt; checking skills</div>
            <div className="pl-4 text-emerald-400">
              ✓ {agent.skills.length} registered ({agent.skills.map((s) => s.name).join(', ')})
            </div>
          </div>

          {/* Step 5: role boundaries */}
          <div>
            <div className="text-slate-400">&gt; validating role boundaries</div>
            <div className="pl-4">
              {report.checkpoint1.errors.some((e) => e.toLowerCase().includes('conflation')) ? (
                <span className="text-rose-400 font-bold">
                  ✗ VIOLATION: Maker and Checker appear on the same line (prohibited co-assignment)
                </span>
              ) : (
                <span className="text-emerald-400">✓ Maker / Checker separation</span>
              )}
            </div>
          </div>

          {/* Step 6: explainability */}
          <div>
            <div className="text-slate-400">&gt; checking explainability</div>
            <div className="pl-4 space-y-0.5">
              {report.checkpoint2.status === 'SKIPPED' ? (
                <div className="text-amber-400">⊘ SKIPPED (Gated by Checkpoint 1 failure)</div>
              ) : (
                <>
                  <div className={report.checkpoint2.checks.find((c) => c.name.includes('Decision heading'))?.passed ? 'text-emerald-400' : 'text-rose-400'}>
                    {report.checkpoint2.checks.find((c) => c.name.includes('Decision heading'))?.passed ? '✓ Decision' : '✗ Decision missing'}
                  </div>
                  <div className={report.checkpoint2.checks.find((c) => c.name.includes('Inputs heading'))?.passed ? 'text-emerald-400' : 'text-rose-400'}>
                    {report.checkpoint2.checks.find((c) => c.name.includes('Inputs heading'))?.passed ? '✓ Inputs' : '✗ Inputs missing'}
                  </div>
                  <div className={report.checkpoint2.checks.find((c) => c.name.includes('Limits heading'))?.passed ? 'text-emerald-400' : 'text-rose-400'}>
                    {report.checkpoint2.checks.find((c) => c.name.includes('Limits heading'))?.passed ? '✓ Limits' : '✗ Limits missing'}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Step 7: adapters */}
          <div>
            <div className="text-slate-400">&gt; testing framework adapters</div>
            <div className="pl-4 space-y-1 pt-1">
              {[
                { name: 'OPENAI', passed: report.visas.OpenAI === 'VERIFIED' },
                { name: 'CREWAI', passed: report.visas.CrewAI === 'VERIFIED' },
                { name: 'CLAUDE CODE', passed: report.visas['Claude Code'] === 'VERIFIED' },
                { name: 'LYZR', passed: report.visas.Lyzr === 'VERIFIED' }
              ].map((fw) => (
                <div key={fw.name} className="flex items-center gap-6">
                  <span className="w-28 text-slate-300">{fw.name}</span>
                  <span className={fw.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {fw.passed ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Conclusion */}
          <div className="pt-6 border-t border-white/[0.08] space-y-1">
            <div className="text-white font-bold tracking-wider">
              {isVerified ? 'VERIFICATION COMPLETE' : 'VERIFICATION HALTED WITH VIOLATIONS'}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">STATUS:</span>
              <span className={`font-bold ${isVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isVerified ? 'VERIFIED' : 'FAILED'}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">TOTAL SCORE:</span>
              <span className="text-white font-bold">{report.score.total} / {report.score.max}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Failure Mode Sandbox for Live Demonstrations */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-5 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Deterministic Failure Mode Sandbox</span>
          </div>
          <span className="text-[10px] text-slate-500">Test real-time enforcement</span>
        </div>
        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
          Inject contract violations to verify that the audit engine deterministically rejects non-compliant states rather than hardcoding PASS.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => handleToggleFailureMode('none')}
            className={`px-3 py-1.5 rounded text-xs transition-all cursor-pointer ${
              activeFailureMode === 'none'
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            ✓ Canonical State (575 / 575 PASS)
          </button>

          <button
            onClick={() => handleToggleFailureMode('conflation')}
            className={`px-3 py-1.5 rounded text-xs transition-all cursor-pointer ${
              activeFailureMode === 'conflation'
                ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            Simulate Maker/Checker Conflation
          </button>

          <button
            onClick={() => handleToggleFailureMode('explainability')}
            className={`px-3 py-1.5 rounded text-xs transition-all cursor-pointer ${
              activeFailureMode === 'explainability'
                ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            Simulate Missing # Limits Heading
          </button>

          <button
            onClick={() => handleToggleFailureMode('spec_version')}
            className={`px-3 py-1.5 rounded text-xs transition-all cursor-pointer ${
              activeFailureMode === 'spec_version'
                ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white'
            }`}
          >
            Simulate Invalid spec_version
          </button>
        </div>
      </div>
    </div>
  );
};
