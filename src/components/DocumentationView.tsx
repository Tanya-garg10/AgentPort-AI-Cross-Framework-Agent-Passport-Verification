import React from 'react';
import { BookOpen, Shield, Award, Layers, Key, CheckCircle2, FileCode, Lock, Terminal } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl font-mono text-xs">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
          CANONICAL STANDARD
        </span>
        <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
          OpenGAP Specification &amp; Architecture
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          GitAgentProtocol (OpenGAP) defines portable AI agent identities, behavioral contracts, and verifiable runtime adaptations.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-6 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider">
            <span>01</span>
            <span>CANONICAL REPOSITORY STRUCTURE</span>
          </div>
          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            Every OpenGAP agent is structured as a declarative Git repository. The root directory contains canonical files that define identity, instructions, duties, and tools:
          </p>
          <div className="bg-[#07090e] p-4 rounded border border-white/[0.05] text-[11px] text-slate-300 space-y-1">
            <div><strong className="text-white">agent.yaml</strong> — Manifest with spec_version: "0.1.0", name, version, tools, and skills.</div>
            <div><strong className="text-white">SOUL.md</strong> — # Identity, # Personality, # Communication Style, # Values, # Behavioral Principles.</div>
            <div><strong className="text-white">AGENTS.md</strong> — Operational rules, safety boundaries, escalation triggers, and tool usage laws.</div>
            <div><strong className="text-white">DUTIES.md</strong> — Strict Separation of Duties (Maker, Checker, Executor, Auditor).</div>
            <div><strong className="text-white">EXPLAINABILITY.md</strong> — Mandatory reasoning contract (# Decision, # Inputs, # Limits).</div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-6 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider">
            <span>02</span>
            <span>DETERMINISTIC VERIFICATION &amp; VISA SYSTEM</span>
          </div>
          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            AgentPort does not use stochastic prompts to judge agents. Verification is deterministic and gated across three checkpoints:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded bg-[#07090e] border border-white/[0.04]">
              <span className="text-slate-500 text-[10px] block">CHECKPOINT 1 (+50 PTS)</span>
              <span className="text-white font-bold text-xs">Passport Integrity</span>
              <p className="text-slate-400 font-sans text-[11px] mt-1">Manifest validation, SOUL sections, tool resolution, line-by-line role separation.</p>
            </div>
            <div className="p-3 rounded bg-[#07090e] border border-white/[0.04]">
              <span className="text-slate-500 text-[10px] block">CHECKPOINT 2 (+50 PTS)</span>
              <span className="text-white font-bold text-xs">Explainability Contract</span>
              <p className="text-slate-400 font-sans text-[11px] mt-1">Exact headings and ≥ 2 complete sentences per section.</p>
            </div>
            <div className="p-3 rounded bg-[#07090e] border border-white/[0.04]">
              <span className="text-slate-500 text-[10px] block">CHECKPOINT 3 (+50 PTS)</span>
              <span className="text-white font-bold text-xs">Framework Export</span>
              <p className="text-slate-400 font-sans text-[11px] mt-1">Execution of all 4 adapters and serialization verification.</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-6 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wider">
            <span>03</span>
            <span>CHALLENGE SCORING MODEL (MAX 575 PTS)</span>
          </div>
          <div className="bg-[#07090e] p-4 rounded border border-white/[0.05] text-[11px] space-y-1.5">
            <div className="flex justify-between text-slate-300"><span>First Passport Initialized:</span><span className="text-emerald-400 font-bold">+25 pts</span></div>
            <div className="flex justify-between text-slate-300"><span>Checkpoint 1 (Passport Integrity):</span><span className="text-emerald-400 font-bold">+50 pts</span></div>
            <div className="flex justify-between text-slate-300"><span>Checkpoint 2 (Explainability Contract):</span><span className="text-emerald-400 font-bold">+50 pts</span></div>
            <div className="flex justify-between text-slate-300"><span>Checkpoint 3 (Framework Export):</span><span className="text-emerald-400 font-bold">+50 pts</span></div>
            <div className="flex justify-between text-slate-300"><span>OpenAI Framework Visa:</span><span className="text-emerald-400 font-bold">+100 pts</span></div>
            <div className="flex justify-between text-slate-300"><span>CrewAI Framework Visa:</span><span className="text-emerald-400 font-bold">+100 pts</span></div>
            <div className="flex justify-between text-slate-300"><span>Claude Code Framework Visa:</span><span className="text-emerald-400 font-bold">+100 pts</span></div>
            <div className="flex justify-between text-slate-300"><span>Lyzr Framework Visa:</span><span className="text-emerald-400 font-bold">+100 pts</span></div>
            <div className="flex justify-between pt-2 border-t border-white/[0.08] text-white font-bold"><span>TOTAL COMPOSITE SCORE:</span><span className="text-indigo-300">575 / 575 PTS</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
