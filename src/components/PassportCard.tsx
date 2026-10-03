import React, { useState } from 'react';
import { Shield, CheckCircle2, Copy, Check, FileText, Cpu, Key, Wrench, Sparkles, User, BookOpen } from 'lucide-react';
import { CanonicalAgent, VerificationReport } from '../types/agent';
import { PassportHeroVisual } from './PassportHeroVisual';

interface PassportCardProps {
  agent: CanonicalAgent;
  report: VerificationReport;
}

export const PassportCard: React.FC<PassportCardProps> = ({ agent, report }) => {
  const [activeTab, setActiveTab] = useState<'soul' | 'duties' | 'tools' | 'skills' | 'manifest'>('soul');
  const [copied, setCopied] = useState(false);

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(agent.manifestRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVerified = report.score.total === 575;

  return (
    <div className="space-y-8">
      {/* Top Split Section: Large Passport Artifact (Left) & Identity Metadata with Technical Seal (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Large Passport Artifact */}
        <div className="lg:col-span-5 flex justify-center">
          <PassportHeroVisual report={report} />
        </div>

        {/* Right Side: Identity Metadata & Circular Technical Seal */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metadata Block (Section 8) */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-6 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  AGENT ID
                </span>
                <span className="text-sm font-bold text-white tracking-wider">
                  AP-7F92-41C8
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  NAME
                </span>
                <span className="text-sm font-bold text-white tracking-wider">
                  {agent.manifest.name}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  VERSION
                </span>
                <span className="text-sm font-bold text-white tracking-wider">
                  {agent.manifest.version}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  SPECIFICATION
                </span>
                <span className="text-sm font-bold text-indigo-400 tracking-wider">
                  OpenGAP {agent.manifest.spec_version}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  STATUS
                </span>
                <span className="text-sm font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> VERIFIED
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
                  SCORE
                </span>
                <span className="text-sm font-bold text-white tracking-wider">
                  {report.score.total} / {report.score.max} PTS
                </span>
              </div>
            </div>

            {/* Circular Technical Seal (Section 8) */}
            <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Technical Stamp */}
              <div className="relative w-28 h-28 rounded-full border-2 border-emerald-500/40 bg-[#090b10] flex items-center justify-center p-2 text-center shrink-0 shadow-inner select-none">
                {/* Outer dashed ring */}
                <div className="absolute inset-1 rounded-full border border-dashed border-emerald-500/30" />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-[8px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                    AGENTPORT
                  </span>
                  <span className="text-[7px] font-mono tracking-tight text-slate-300 font-semibold uppercase leading-tight my-0.5">
                    VERIFIED IDENTITY
                  </span>
                  <span className="text-[6px] font-mono tracking-wider text-slate-500 uppercase">
                    OPEN-GAP
                  </span>
                  <span className="text-[7px] font-mono tracking-tighter text-emerald-400 font-bold uppercase mt-0.5">
                    BEHAVIOR CHECKED
                  </span>
                </div>
              </div>

              {/* Seal Telemetry Text */}
              <div className="space-y-1 text-center sm:text-left font-mono text-xs">
                <div className="text-white font-bold tracking-wider">
                  OFFICIAL VERIFICATION ATTESTATION
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed font-light">
                  This identity is sealed under canonical OpenGAP standards. Cryptographic behavioral lineage, role separation, and tool schemas have been deterministically audited.
                </p>
                <div className="pt-1 text-[10px] text-slate-500 space-x-3">
                  <span>TIMESTAMP: {report.timestamp.substring(0, 19).replace('T', ' ')} UTC</span>
                  <span>ID: {report.runId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Tabs for Inspecting Passport Source of Truth */}
      <div className="space-y-4">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-1 border-b border-white/[0.08] pb-1">
          {[
            { id: 'soul', label: 'SOUL.md (Identity)', icon: User },
            { id: 'duties', label: 'DUTIES.md (Roles)', icon: Key },
            { id: 'tools', label: `tools/ (${agent.tools.length})`, icon: Wrench },
            { id: 'skills', label: `skills/ (${agent.skills.length})`, icon: Sparkles },
            { id: 'manifest', label: 'agent.yaml (Manifest)', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-mono transition-all cursor-pointer border-b-2 -mb-[1px] ${
                  isActive
                    ? 'border-indigo-400 text-white font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="rounded-xl border border-white/[0.07] bg-[#090b10] p-6 font-mono text-xs">
          {/* SOUL.MD */}
          {activeTab === 'soul' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1">
                  # IDENTITY
                </span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs bg-white/[0.02] p-4 rounded border border-white/[0.04]">
                  {agent.soul.identity}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.02] p-4 rounded border border-white/[0.04]">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1">
                    # PERSONALITY
                  </span>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">{agent.soul.personality}</p>
                </div>

                <div className="bg-white/[0.02] p-4 rounded border border-white/[0.04]">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1">
                    # COMMUNICATION STYLE
                  </span>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">{agent.soul.communication_style}</p>
                </div>

                <div className="bg-white/[0.02] p-4 rounded border border-white/[0.04]">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1">
                    # VALUES
                  </span>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">{agent.soul.values}</p>
                </div>

                <div className="bg-white/[0.02] p-4 rounded border border-white/[0.04]">
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1">
                    # BEHAVIORAL PRINCIPLES
                  </span>
                  <p className="text-slate-400 font-sans text-xs leading-relaxed">{agent.soul.behavioral_principles}</p>
                </div>
              </div>
            </div>
          )}

          {/* DUTIES.MD */}
          {activeTab === 'duties' && (
            <div className="space-y-4">
              <div className="text-slate-400 text-xs font-sans pb-2 border-b border-white/[0.05]">
                OpenGAP Separation of Duties enforces that the Maker and Checker roles are strictly segregated on separate lines and identities.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Maker</span>
                    <span className="text-[10px] text-indigo-300">Proposer</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Responsible for proposing actions, synthesizing policy adjustments, drafting tool calls.</p>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.04]">Cannot self-certify</div>
                </div>

                <div className="p-3.5 rounded bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Checker</span>
                    <span className="text-[10px] text-emerald-300">Reviewer</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Responsible for reviewing proposed actions against security policies and role bounds.</p>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.04]">Issues clearance token</div>
                </div>

                <div className="p-3.5 rounded bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Executor</span>
                    <span className="text-[10px] text-amber-300">Runtime</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Executes approved actions within target runtime environments with verification.</p>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.04]">Requires clearance token</div>
                </div>

                <div className="p-3.5 rounded bg-white/[0.02] border border-white/[0.05] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Auditor</span>
                    <span className="text-[10px] text-purple-300">Telemetry</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">Records and reviews execution evidence, calculates scores, and grants framework visas.</p>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.04]">Non-repudiable audit</div>
                </div>
              </div>
            </div>
          )}

          {/* TOOLS */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agent.tools.map((t) => (
                <div key={t.name} className="p-3.5 rounded bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white tracking-wider">{t.name}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Role: {t.permission_level}</span>
                  </div>
                  <p className="text-slate-400 text-xs font-sans">{t.description}</p>
                  <div className="text-[10px] text-slate-500 pt-1 font-mono">
                    Inputs: {Object.keys(t.input_schema.properties || {}).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {agent.skills.map((s) => (
                <div key={s.id} className="p-3.5 rounded bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{s.name}</span>
                    <span className="text-[10px] text-slate-500">v{s.version}</span>
                  </div>
                  <p className="text-slate-400 text-xs font-sans">{s.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* MANIFEST */}
          {activeTab === 'manifest' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                <span className="text-slate-400 text-[11px]">agent.yaml (OpenGAP Manifest)</span>
                <button
                  onClick={handleCopyManifest}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-slate-300 text-xs leading-relaxed overflow-x-auto max-h-96">
                {agent.manifestRaw}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
