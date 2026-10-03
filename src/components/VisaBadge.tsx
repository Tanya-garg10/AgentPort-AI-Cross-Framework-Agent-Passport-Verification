import React from 'react';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

interface VisaBadgeProps {
  framework: string;
  visaNumber: string;
  status: 'VERIFIED' | 'DENIED';
  adapterVersion?: string;
  lastVerification?: string;
  portabilityScore?: string;
  evidenceCount?: number;
  compact?: boolean;
}

export const VisaBadge: React.FC<VisaBadgeProps> = ({
  framework,
  visaNumber,
  status,
  adapterVersion = '1.0.0',
  lastVerification = '2026-10-03',
  portabilityScore = '98%',
  evidenceCount = 14,
  compact = false
}) => {
  const isVerified = status === 'VERIFIED';

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0b0d13] border border-white/[0.08] text-xs font-mono">
        <span className="text-white font-semibold">{framework}</span>
        <span className="text-[10px] text-slate-500">VISA {visaNumber}</span>
        <span className={isVerified ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
          {isVerified ? '✓' : '✗'}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-5 font-mono space-y-4 relative overflow-hidden transition-all duration-200 hover:border-white/[0.15]">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest block">
            VISA {visaNumber}
          </span>
          <h3 className="text-sm font-bold text-white tracking-wider mt-0.5">
            {framework}
          </h3>
        </div>

        {/* Status Stamp */}
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
            isVerified
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
          }`}
        >
          {isVerified ? '✓ VERIFIED' : '✗ DENIED'}
        </span>
      </div>

      {/* Passport Stamp Metadata Matrix (Section 9) */}
      <div className="grid grid-cols-2 gap-3 text-[11px] pt-3 border-t border-white/[0.05]">
        <div>
          <span className="text-slate-500 text-[10px] block">ADAPTER</span>
          <span className="text-slate-300 font-medium">v{adapterVersion}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">PORTABILITY</span>
          <span className="text-emerald-400 font-medium">{portabilityScore}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">VERIFIED AT</span>
          <span className="text-slate-300">{lastVerification}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">EVIDENCE</span>
          <span className="text-slate-300">{evidenceCount} checks</span>
        </div>
      </div>
    </div>
  );
};
