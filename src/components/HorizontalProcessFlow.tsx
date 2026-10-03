import React from 'react';
import { FileCode, ShieldCheck, ArrowRight, Award, Layers, Terminal } from 'lucide-react';

export const HorizontalProcessFlow: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'DEFINE',
      sub: 'agent.yaml',
      desc: 'Declare identity, soul, duties, tools, and skills in standard OpenGAP specification.',
      icon: FileCode,
      tag: 'CANONICAL REPO'
    },
    {
      step: '02',
      title: 'VERIFY',
      sub: 'validation',
      desc: 'Deterministic checkpoint audit verifies syntax, role separation, and explainability.',
      icon: ShieldCheck,
      tag: 'GATE CHECK'
    },
    {
      step: '03',
      title: 'EXPORT',
      sub: 'adapter registry',
      desc: 'Independent compilers transform contracts into OpenAI, CrewAI, Claude Code, and Lyzr.',
      icon: Layers,
      tag: 'MULTI-RUNTIME'
    },
    {
      step: '04',
      title: 'EARN VISA',
      sub: 'verification stamp',
      desc: 'Adapters passing strict serialization earn accredited framework visa certifications.',
      icon: Award,
      tag: '+100 PTS EACH'
    },
    {
      step: '05',
      title: 'PROVE PORTABILITY',
      sub: 'digital passport',
      desc: 'Generate cryptographic evidence report and immutable verification hash.',
      icon: Terminal,
      tag: 'AUDIT EVIDENCE'
    }
  ];

  return (
    <div className="py-12 border-t border-white/[0.06]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
            DEVELOPER LIFECYCLE
          </span>
          <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] mt-0.5">
            The AgentPort Verification &amp; Export Pipeline
          </h3>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>agent.yaml</span>
          <span>→</span>
          <span>validation</span>
          <span>→</span>
          <span>adapters</span>
          <span>→</span>
          <span>visas</span>
          <span>→</span>
          <span className="text-emerald-400">passport</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="group relative rounded-xl border border-white/[0.07] bg-[#0c0e15] p-5 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold text-indigo-400">
                    {item.step}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                    {item.tag}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-300 group-hover:text-indigo-300 group-hover:border-indigo-500/30 transition-colors mb-3">
                  <Icon className="w-4 h-4" />
                </div>

                <h4 className="text-xs font-mono font-bold text-white tracking-wider mb-1">
                  {item.title}
                </h4>
                <div className="text-[11px] font-mono text-indigo-400/80 mb-2">
                  {item.sub}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-slate-700 pointer-events-none">
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
