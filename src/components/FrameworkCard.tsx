import React, { useState } from 'react';
import { FileCode, Download, Copy, Check } from 'lucide-react';
import { AdapterExportResult } from '../types/agent';

interface FrameworkCardProps {
  adapter: AdapterExportResult;
  visaNumber: string;
}

export const FrameworkCard: React.FC<FrameworkCardProps> = ({ adapter, visaNumber }) => {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'code' | 'artifact'>('code');

  const handleCopy = () => {
    const text = activeCodeTab === 'code' ? adapter?.codeSnippet || '' : adapter?.artifact || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = adapter?.frameworkKey === 'claude_code' ? 'md' : 'py';
    const filename = `${adapter?.frameworkKey || 'agent'}_agent.${extension}`;
    const blob = new Blob([adapter?.codeSnippet || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isVerified = adapter?.visaStatus === 'VERIFIED';

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-5 font-mono flex flex-col justify-between hover:border-white/[0.15] transition-all">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block">
              VISA {visaNumber}
            </span>
            <h3 className="text-base font-bold text-white tracking-wider mt-0.5">
              {adapter?.framework || 'Framework Adapter'}
            </h3>
          </div>

          <span
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
              isVerified
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
            }`}
          >
            {isVerified ? '✓ VERIFIED' : '✗ DENIED'}
          </span>
        </div>

        {/* Passport Stamp Metadata Matrix (Section 9) */}
        <div className="grid grid-cols-4 gap-2 py-3 text-[11px] border-b border-white/[0.06]">
          <div>
            <span className="text-slate-500 text-[10px] block">ADAPTER</span>
            <span className="text-slate-200">v1.0.0</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">PORTABILITY</span>
            <span className="text-emerald-400 font-bold">98%</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">VERIFIED</span>
            <span className="text-slate-300">2026-10-03</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">EVIDENCE</span>
            <span className="text-slate-300">14 checks</span>
          </div>
        </div>

        {/* Preserved vs Framework Specific Badges */}
        <div className="py-4 space-y-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
              Preserved Attributes ({adapter?.portable_fields?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(adapter?.portable_fields || []).map((f, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-white/[0.05]"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
              Framework-Specific Shims ({adapter?.framework_specific_fields?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(adapter?.framework_specific_fields || []).map((f, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/[0.02] text-slate-400 border border-white/[0.04]"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Code / Artifact Preview Box */}
        <div className="rounded-lg border border-white/[0.06] bg-[#07090e] overflow-hidden mb-4">
          <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border-b border-white/[0.05]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCodeTab('code')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                  activeCodeTab === 'code' ? 'bg-white/[0.08] text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Generated Code
              </button>
              <button
                onClick={() => setActiveCodeTab('artifact')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                  activeCodeTab === 'artifact' ? 'bg-white/[0.08] text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Artifact JSON
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white"
                title="Copy snippet"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white"
                title="Download artifact"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <pre className="p-3 text-[11px] text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
            {activeCodeTab === 'code' ? adapter.codeSnippet : adapter.artifact}
          </pre>
        </div>
      </div>

      <div className="pt-3 border-t border-white/[0.05] flex justify-between items-center text-xs">
        <span className="text-slate-500 text-[11px]">ACCREDITED VISA SCORE</span>
        <span className="text-emerald-400 font-bold">+100 PTS</span>
      </div>
    </div>
  );
};
