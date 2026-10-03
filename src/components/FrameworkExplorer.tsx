import React from 'react';
import { Layers } from 'lucide-react';
import { AdapterExportResult } from '../types/agent';
import { FrameworkCard } from './FrameworkCard';

interface FrameworkExplorerProps {
  adapters?: Record<string, AdapterExportResult>;
}

export const FrameworkExplorer: React.FC<FrameworkExplorerProps> = ({ adapters = {} }) => {
  const visaNumbers: Record<string, string> = {
    openai: '#001',
    crewai: '#002',
    claude_code: '#003',
    lyzr: '#004'
  };

  const adapterEntries = Object.entries(adapters || {});

  return (
    <div className="space-y-6">
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
            FRAMEWORK ADAPTER REGISTRY
          </span>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
            Framework Visas &amp; Compiled Exports
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            4 independent compilers transform the canonical OpenGAP agent into target runtime representations.
          </p>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1.5 rounded">
          4 / 4 VISAS ACCREDITED (+400 PTS)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {adapterEntries.map(([key, adapter]) => (
          <FrameworkCard
            key={adapter?.frameworkKey || key}
            adapter={adapter}
            visaNumber={visaNumbers[adapter?.frameworkKey || key] || '#001'}
          />
        ))}
      </div>
    </div>
  );
};
