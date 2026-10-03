import React, { useState } from 'react';
import { Lock, Shield, CheckCircle2, AlertTriangle, XCircle, Play, History, FileText } from 'lucide-react';
import { evaluateSecurity } from '../engine/securityEngine';
import { SecurityEvent } from '../types/agent';

export const SecuritySimulator: React.FC = () => {
  const [actionType, setActionType] = useState('read');
  const [targetResource, setTargetResource] = useState('public documentation');
  const [requestingRole, setRequestingRole] = useState('maker');
  
  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: 'sec-8f12',
      timestamp: '2026-10-03T09:42:26Z',
      action_type: 'DELETE_PRODUCTION_DB',
      target_resource: 'prod_db.users; delete production database',
      requesting_role: 'executor',
      verdict: 'BLOCK',
      risk_level: 'CRITICAL',
      risk_score: 98,
      rule_id: 'SEC-001',
      reason: 'Destructive mutations against production data are categorically prohibited by OpenGAP zero-trust policy.'
    },
    {
      id: 'sec-8f11',
      timestamp: '2026-10-03T09:42:21Z',
      action_type: 'SEND_CUSTOMER.CSV',
      target_resource: 'customer.csv outbound webhook dispatch',
      requesting_role: 'maker',
      verdict: 'REQUIRE APPROVAL',
      risk_level: 'HIGH',
      risk_score: 75,
      rule_id: 'SEC-004',
      reason: 'Target resource contains sensitive customer records. Dual-control approval from Checker is mandatory.'
    },
    {
      id: 'sec-8f10',
      timestamp: '2026-10-03T09:42:18Z',
      action_type: 'READ_PUBLIC_DOCS',
      target_resource: 'agent.yaml & public documentation',
      requesting_role: 'auditor',
      verdict: 'ALLOW',
      risk_level: 'LOW',
      risk_score: 15,
      rule_id: 'SEC-007',
      reason: 'Read-only inspection of non-sensitive public documentation operates within normal bounds.'
    }
  ]);

  const [activeEvent, setActiveEvent] = useState<SecurityEvent>(events[0]);

  const handleSimulate = (act?: string, res?: string, role?: string) => {
    const a = act || actionType;
    const r = res || targetResource;
    const ro = role || requestingRole;
    const result = evaluateSecurity(a, r, ro);
    setEvents((prev) => [result, ...prev]);
    setActiveEvent(result);
  };

  return (
    <div className="space-y-6">
      {/* Header (Section 12) */}
      <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
            SECURITY OPERATIONS CONSOLE
          </span>
          <h1 className="text-3xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
            Policy Engine
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Deterministic zero-trust evaluation of tool calls and parameter payloads against OpenGAP rules.
          </p>
        </div>

        {/* 3 Decision States Banner */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
            ALLOW
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-950/40 text-amber-400 border border-amber-500/30">
            REQUIRE APPROVAL
          </span>
          <span className="px-2.5 py-1 rounded bg-rose-950/40 text-rose-400 border border-rose-500/30">
            BLOCK
          </span>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Event Stream (Section 12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              Real-Time Security Event Stream
            </span>
            <span className="text-slate-500">{events.length} records</span>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] divide-y divide-white/[0.04] font-mono text-xs overflow-hidden">
            {events.map((ev) => {
              const isSelected = activeEvent.id === ev.id;
              const time = ev.timestamp.includes('T')
                ? ev.timestamp.split('T')[1].substring(0, 8)
                : '09:42:18';

              return (
                <div
                  key={ev.id}
                  onClick={() => setActiveEvent(ev)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-slate-500 text-[11px] shrink-0">{time}</span>
                    <div className="truncate">
                      <div className="text-white font-medium truncate">{ev.action_type.toUpperCase()}</div>
                      <div className="text-[11px] text-slate-500 truncate">{ev.target_resource}</div>
                    </div>
                  </div>

                  <span
                    className={`ml-4 shrink-0 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase border ${
                      ev.verdict === 'ALLOW'
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                        : ev.verdict === 'BLOCK'
                        ? 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                        : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {ev.verdict}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Event Inspection + Simulation Trigger */}
        <div className="lg:col-span-5 space-y-5">
          {/* Event Inspector Card */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-5 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                Event Detail &amp; Policy Trace
              </span>
              <span className="text-indigo-400 text-[10px]">ID: {activeEvent.id}</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">TIMESTAMP:</span>
                <span className="text-slate-300">{activeEvent.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ACTION:</span>
                <span className="text-white font-bold">{activeEvent.action_type.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ACTOR ROLE:</span>
                <span className="text-slate-300">{activeEvent.requesting_role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">POLICY RULE:</span>
                <span className="text-indigo-300 font-bold">{activeEvent.rule_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DECISION:</span>
                <span className={`font-bold ${activeEvent.verdict === 'ALLOW' ? 'text-emerald-400' : activeEvent.verdict === 'BLOCK' ? 'text-rose-400' : 'text-amber-400'}`}>
                  {activeEvent.verdict} (Risk {activeEvent.risk_score}/100)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.05] space-y-1">
              <span className="text-slate-500 text-[10px] uppercase block">EVIDENCE &amp; RATIONALE:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed bg-[#080a0f] p-3 rounded border border-white/[0.03]">
                {activeEvent.reason}
              </p>
            </div>
          </div>

          {/* Action Simulation Trigger Box */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0c0e15] p-5 font-mono text-xs space-y-3">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
              Simulate Action Execution
            </span>

            <div className="space-y-2">
              <input
                type="text"
                value={targetResource}
                onChange={(e) => setTargetResource(e.target.value)}
                placeholder="Target resource..."
                className="w-full bg-[#080a0f] border border-white/[0.08] rounded p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="flex-1 bg-[#080a0f] border border-white/[0.08] rounded p-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="read">read</option>
                  <option value="write">write</option>
                  <option value="export">export</option>
                  <option value="execute">execute</option>
                </select>
                <select
                  value={requestingRole}
                  onChange={(e) => setRequestingRole(e.target.value)}
                  className="flex-1 bg-[#080a0f] border border-white/[0.08] rounded p-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="maker">maker</option>
                  <option value="checker">checker</option>
                  <option value="executor">executor</option>
                  <option value="auditor">auditor</option>
                </select>
              </div>

              <button
                onClick={() => handleSimulate()}
                className="w-full mt-2 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                Evaluate Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
