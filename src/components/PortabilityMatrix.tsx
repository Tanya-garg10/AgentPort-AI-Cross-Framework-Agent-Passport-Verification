import React from 'react';
import { Check, RefreshCw, Minus } from 'lucide-react';

interface MatrixRow {
  aspect: string;
  category: 'PORTABLE' | 'FRAMEWORK_SPECIFIC';
  description: string;
  openai: 'preserved' | 'adapted' | 'specific';
  crewai: 'preserved' | 'adapted' | 'specific';
  claude: 'preserved' | 'adapted' | 'specific';
  lyzr: 'preserved' | 'adapted' | 'specific';
}

const ROWS: MatrixRow[] = [
  {
    aspect: 'Identity',
    category: 'PORTABLE',
    description: 'Persona, personality, and behavioral principles',
    openai: 'preserved',
    crewai: 'adapted',
    claude: 'preserved',
    lyzr: 'adapted'
  },
  {
    aspect: 'Instructions',
    category: 'PORTABLE',
    description: 'Operating guidelines and behavioral constraints',
    openai: 'preserved',
    crewai: 'adapted',
    claude: 'preserved',
    lyzr: 'adapted'
  },
  {
    aspect: 'Tools',
    category: 'PORTABLE',
    description: 'JSON schemas and execution parameters',
    openai: 'adapted',
    crewai: 'adapted',
    claude: 'preserved',
    lyzr: 'adapted'
  },
  {
    aspect: 'Roles',
    category: 'PORTABLE',
    description: 'Maker, Checker, Executor, Auditor boundary segregation',
    openai: 'adapted',
    crewai: 'adapted',
    claude: 'preserved',
    lyzr: 'adapted'
  },
  {
    aspect: 'Security',
    category: 'PORTABLE',
    description: 'Zero-trust policies, allow/approval/block matrices',
    openai: 'preserved',
    crewai: 'preserved',
    claude: 'preserved',
    lyzr: 'preserved'
  },
  {
    aspect: 'Runtime',
    category: 'FRAMEWORK_SPECIFIC',
    description: 'Execution loops, turn dispatch, and worker scheduling',
    openai: 'specific',
    crewai: 'specific',
    claude: 'specific',
    lyzr: 'specific'
  },
  {
    aspect: 'Memory',
    category: 'FRAMEWORK_SPECIFIC',
    description: 'Vector embeddings, short-term RAG, and session state',
    openai: 'specific',
    crewai: 'specific',
    claude: 'specific',
    lyzr: 'specific'
  }
];

export const PortabilityMatrix: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header (Section 11) */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
            BEHAVIORAL SURVIVAL MATRIX
          </span>
          <h1 className="text-3xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
            What survives the move?
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Deterministic audit of which agent contracts remain invariant versus which adapt to target runtimes.
          </p>
        </div>

        {/* Legend (Section 11) */}
        <div className="flex items-center gap-4 text-xs font-mono bg-[#0c0e15] border border-white/[0.07] px-3.5 py-2 rounded-lg">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="text-emerald-400 font-bold">✓</span> Preserved
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <RefreshCw className="w-3 h-3 text-indigo-400" /> Adapted
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-600 font-bold">—</span> Framework-specific
          </span>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] bg-[#080a0f] text-[11px] text-slate-400">
                <th className="py-3.5 px-6 font-semibold w-1/3">CONTRACT ATTRIBUTE</th>
                <th className="py-3.5 px-4 font-semibold text-center">OPENAI</th>
                <th className="py-3.5 px-4 font-semibold text-center">CREWAI</th>
                <th className="py-3.5 px-4 font-semibold text-center">CLAUDE</th>
                <th className="py-3.5 px-4 font-semibold text-center">LYZR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {ROWS.map((row) => (
                <tr key={row.aspect} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="text-white font-bold">{row.aspect}</div>
                    <div className="text-[11px] text-slate-500 font-sans">{row.description}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <CellIcon status={row.openai} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <CellIcon status={row.crewai} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <CellIcon status={row.claude} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <CellIcon status={row.lyzr} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CellIcon: React.FC<{ status: 'preserved' | 'adapted' | 'specific' }> = ({ status }) => {
  if (status === 'preserved') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-emerald-950/40 text-emerald-400 font-bold text-sm">
        ✓
      </span>
    );
  }
  if (status === 'adapted') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-indigo-950/40 text-indigo-400">
        <RefreshCw className="w-3.5 h-3.5" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 text-slate-600 font-bold text-sm">
      —
    </span>
  );
};
