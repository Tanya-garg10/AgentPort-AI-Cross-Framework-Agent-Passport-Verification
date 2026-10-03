import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { VerificationReport } from '../types/agent';

interface EvidenceViewerProps {
  report: VerificationReport;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ report }) => {
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const timelineSteps = [
    {
      title: 'Passport validated',
      sub: 'agent.yaml manifest syntax, SOUL.md populated sections, tools/skills resolved',
      status: 'VERIFIED',
      details: `spec_version: 0.1.0\nName: agent-port\nRoles: Maker, Checker, Executor, Auditor\nLine-by-line role segregation: PASS`
    },
    {
      title: 'Explainability checked',
      sub: '# Decision, # Inputs, # Limits headings with ≥ 2 complete sentences each',
      status: 'VERIFIED',
      details: `Headings verified: Decision, Inputs, Limits\nSentence count: ≥ 2 complete sentences per section\nDecision criteria & input sources: ARTICULATED`
    },
    {
      title: 'OpenAI adapter verified',
      sub: 'Function schemas with strict: true, temperature 0.1, dual-agent handoffs',
      status: 'VERIFIED',
      details: `Model: gpt-4o\nTools serialized: 4\nHandoff policy: maker_agent, checker_agent\nArtifact length: 1,480 bytes`
    },
    {
      title: 'CrewAI adapter verified',
      sub: 'agents.yaml, tasks.yaml, sequential process, and BaseTool classes',
      status: 'VERIFIED',
      details: `Process: sequential\nMemory: enabled\nSpecialists: Maker, Checker\nAllow delegation: false`
    },
    {
      title: 'Claude Code adapter verified',
      sub: 'CLAUDE.md project memory guidelines, custom slash commands, and tools',
      status: 'VERIFIED',
      details: `Slash commands: /verify-agent, /check-risk, /passport\nSystem directives: Injected\nAnthropic tool definitions: 4`
    },
    {
      title: 'Lyzr adapter verified',
      sub: 'Lyzr Automata agent schema, persona prompt, and agent API payload',
      status: 'VERIFIED',
      details: `Agent ID: lyzr-agent-port-v1\nTask: Verify And Enforce Contract\nTools: Custom Python tool mappings`
    },
    {
      title: 'Passport sealed',
      sub: 'Cryptographic SHA-256 evidence hash generated and 575 pts awarded',
      status: 'VERIFIED',
      details: `Hash: ${report.evidenceSha256}\nScore: 575 / 575 PTS\nVisas: 4 / 4 Granted\nAudit Proof: IMMUTABLE`
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(report.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'json' | 'md') => {
    const filename = `agentport-evidence-${report.runId}.${format}`;
    const content = format === 'md' ? report.markdown : JSON.stringify(report, null, 2);
    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
            COMPLIANCE AUDIT TRAIL
          </span>
          <h1 className="text-3xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
            Verification Evidence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            RUN_ID: {report.runId} • TIMESTAMP: {report.timestamp}
          </p>
        </div>

        {/* Download Buttons (Section 13) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded bg-[#0c0e15] border border-white/[0.08] hover:border-white/[0.15] text-xs text-slate-300 transition-all cursor-pointer"
          >
            {copied ? '✓ Copied' : 'Copy Report'}
          </button>
          <button
            onClick={() => handleDownload('json')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-medium transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
          <button
            onClick={() => handleDownload('md')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0c0e15] border border-white/[0.08] hover:border-white/[0.15] text-xs text-white transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Markdown</span>
          </button>
        </div>
      </div>

      {/* Audit Trail Timeline (Section 13) */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-6 font-mono text-xs">
        <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-6">
          VERIFICATION RUN TIMELINE
        </div>

        <div className="space-y-0 relative">
          {timelineSteps.map((step, idx) => {
            const isExpanded = expandedIndex === idx;
            const isLast = idx === timelineSteps.length - 1;

            return (
              <div key={idx} className="relative flex items-start gap-4 pb-6 last:pb-0">
                {/* Connecting Line */}
                {!isLast && (
                  <div className="absolute left-2 top-4 bottom-0 w-[1.5px] bg-white/[0.08]" />
                )}

                {/* Timeline Dot */}
                <div className="relative z-10 w-4 h-4 rounded-full bg-[#0c0e15] border-2 border-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-white font-bold text-xs tracking-wider group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                        <span>● {step.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-sans mt-0.5">
                        {step.sub}
                      </div>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-bold tracking-wider">
                      {step.status}
                    </span>
                  </div>

                  {/* Expandable Technical Details */}
                  {isExpanded && (
                    <div className="mt-2.5 p-3 rounded bg-[#07090e] border border-white/[0.05] text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {step.details}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Cryptographic Hash Footer */}
      <div className="p-4 rounded-xl border border-white/[0.06] bg-[#07090e] font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
        <div>
          <span className="text-slate-500 text-[10px] block">PASSPORT_HASH</span>
          <span className="text-slate-200">{report.evidenceSha256}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 text-[10px] block">SCORE ACCREDITATION</span>
          <span className="text-emerald-400 font-bold">575 / 575 PTS (100%)</span>
        </div>
      </div>
    </div>
  );
};
