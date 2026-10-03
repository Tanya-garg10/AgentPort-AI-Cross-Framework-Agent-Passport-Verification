import React from 'react';
import { Shield, Award, CheckCircle2, Lock, Cpu, Sparkles } from 'lucide-react';
import { VerificationReport } from '../types/agent';

interface PassportHeroVisualProps {
  report: VerificationReport;
  compact?: boolean;
}

export const PassportHeroVisual: React.FC<PassportHeroVisualProps> = ({ report, compact = false }) => {
  const isVerified = report.score.total === 575;

  return (
    <div className="relative flex items-center justify-center p-4 sm:p-8 select-none">
      {/* Background Rotating Verification Ring (Signature Visual) */}
      <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] pointer-events-none flex items-center justify-center">
        {/* Subtle Outer Faint Tech Circle */}
        <div className="absolute inset-0 rounded-full border border-white/[0.04]" />
        <div className="absolute inset-4 rounded-full border border-dashed border-white/[0.06] animate-spin-slow" />
        
        {/* SVG Ring with Circular Orbiting Labels */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin-slow opacity-60"
          viewBox="0 0 460 460"
        >
          <defs>
            <path
              id="verificationCirclePath"
              d="M 230, 230 m -195, 0 a 195,195 0 1,1 390,0 a 195,195 0 1,1 -390,0"
              fill="none"
            />
          </defs>
          <text className="text-[10px] font-mono tracking-[0.28em] fill-slate-400 uppercase font-semibold">
            <textPath href="#verificationCirclePath" startOffset="0%">
              • IDENTITY • BEHAVIOR • TOOLS • SECURITY • PORTABILITY • OPEN-GAP VERIFIED
            </textPath>
          </text>
        </svg>

        {/* Faint Radial Core Glow */}
        <div className="w-64 h-64 rounded-full bg-indigo-500/[0.04] blur-3xl pointer-events-none" />
      </div>

      {/* Main Digital Passport Card Artifact */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[370px] rounded-xl border border-white/10 bg-[#0d0f15] shadow-2xl p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 group">
        
        {/* Top Passport Ribbon & Micro-Chip */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            {/* Digital Passport Micro-Chip icon */}
            <div className="w-8 h-8 rounded border border-amber-500/30 bg-amber-500/[0.06] flex items-center justify-center text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                AGENT PASSPORT
              </div>
              <div className="text-xs font-mono font-bold text-white tracking-wider">
                AGENTPORT-AI
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono block text-slate-500">SERIAL NUMBER</span>
            <span className="text-[11px] font-mono text-indigo-300 font-semibold tracking-wider">
              AP-7F92-41C8
            </span>
          </div>
        </div>

        {/* Spec & Security Bar */}
        <div className="py-3 flex items-center justify-between text-[11px] font-mono border-b border-white/[0.05]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-500">SPEC:</span>
            <span className="text-slate-200 font-semibold">OPEN-GAP v0.1.0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold text-[10px] tracking-wider uppercase">
              ACTIVE PASSPORT
            </span>
          </div>
        </div>

        {/* Core Verification Contract Checklist */}
        <div className="py-4 space-y-2.5 font-mono text-xs border-b border-white/[0.07]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 tracking-wider text-[11px]">IDENTITY</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 tracking-wider text-[11px]">BEHAVIOR</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 tracking-wider text-[11px]">TOOLS</span>
            <span className="text-slate-200 font-bold bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.05] text-[11px]">
              04
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 tracking-wider text-[11px]">SKILLS</span>
            <span className="text-slate-200 font-bold bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.05] text-[11px]">
              03
            </span>
          </div>
        </div>

        {/* Framework Visas Stamp Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              FRAMEWORK VISAS
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              4 / 4 GRANTED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {[
              { name: 'OPENAI', id: '#001', verified: report.visas.OpenAI === 'VERIFIED' },
              { name: 'CREWAI', id: '#002', verified: report.visas.CrewAI === 'VERIFIED' },
              { name: 'CLAUDE CODE', id: '#003', verified: report.visas['Claude Code'] === 'VERIFIED' },
              { name: 'LYZR', id: '#004', verified: report.visas.Lyzr === 'VERIFIED' }
            ].map((visa) => (
              <div
                key={visa.name}
                className="flex items-center justify-between p-2 rounded bg-[#090b10] border border-white/[0.05] group-hover:border-white/[0.09] transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-slate-300 tracking-wider">
                    {visa.name}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    VISA {visa.id}
                  </span>
                </div>
                <span className="text-emerald-400 font-bold text-xs">
                  {visa.verified ? '✓' : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Cryptographic Stamp */}
        <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>HASH: sha256:7f92...c81a</span>
          <span className="text-slate-400">SCORE: {report.score.total}/575</span>
        </div>
      </div>
    </div>
  );
};
