/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { PassportHeroVisual } from './components/PassportHeroVisual';
import { HorizontalProcessFlow } from './components/HorizontalProcessFlow';
import { PassportCard } from './components/PassportCard';
import { FrameworkExplorer } from './components/FrameworkExplorer';
import { PortabilityMatrix } from './components/PortabilityMatrix';
import { VerificationLab } from './components/VerificationLab';
import { SecuritySimulator } from './components/SecuritySimulator';
import { EvidenceViewer } from './components/EvidenceViewer';
import { DocumentationView } from './components/DocumentationView';

import { DEFAULT_CANONICAL_AGENT } from './data/canonicalAgent';
import { runDeterministicVerification } from './engine/verificationEngine';
import { CanonicalAgent, SecurityEvent } from './types/agent';
import { Shield, ArrowRight, Play, Terminal, Lock, Award, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [agent, setAgent] = useState<CanonicalAgent>(DEFAULT_CANONICAL_AGENT);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Compute live deterministic verification report
  const report = useMemo(() => {
    return runDeterministicVerification(agent);
  }, [agent]);

  const [securityEvents] = useState<SecurityEvent[]>([
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
      reason: 'Destructive mutations against production data are prohibited by OpenGAP zero-trust policy.'
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
      reason: 'Target resource contains customer records. Dual-control approval from Checker is required.'
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

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setAgent((prev) => ({ ...prev }));
      setIsVerifying(false);
    }, 600);
  };

  const handleMutateAgent = (updated: CanonicalAgent) => {
    setAgent(updated);
  };

  const handleResetAgent = () => {
    setAgent(DEFAULT_CANONICAL_AGENT);
  };

  const isVerified = report.score.total === 575;

  return (
    <div className="min-h-screen bg-[#07080b] text-[#e2e8f0] flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        report={report}
        onRunVerification={handleRunVerification}
        isVerifying={isVerifying}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* OVERVIEW TAB: Clean, Unified Command Center & Passport Showcase */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Top Stat Banner */}
            <div className="border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
                  DEVELOPER COMMAND CENTER
                </span>
                <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
                  {agent.manifest.name}
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Portable AI Agent Identity • ID: AP-7F92-41C8 • OpenGAP v0.1.0
                </p>
              </div>

              {/* Status & Key Metrics */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">STATUS</span>
                  <span className={`text-lg font-bold ${isVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>
                <div className="border-l border-white/[0.08] pl-6">
                  <span className="text-[10px] text-slate-500 uppercase block">SCORE</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white">{report.score.total}</span>
                    <span className="text-xs text-slate-500">/ 575</span>
                  </div>
                </div>
                <div className="border-l border-white/[0.08] pl-6">
                  <span className="text-[10px] text-slate-500 uppercase block">VISAS</span>
                  <span className="text-xl font-bold text-white">4 / 4</span>
                </div>
                <div className="border-l border-white/[0.08] pl-6">
                  <span className="text-[10px] text-slate-500 uppercase block">CHECKPOINTS</span>
                  <span className="text-xl font-bold text-white">3 / 3</span>
                </div>
              </div>
            </div>

            {/* Hero Split: Value Proposition & Passport Artifact */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span className="tracking-wider uppercase">
                    OPEN-GAP COMPATIBLE INFRASTRUCTURE
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans'] leading-[1.15]">
                  Build Once. Move Anywhere.{' '}
                  <span className="text-slate-400">Verify Everything.</span>
                </h2>

                <p className="text-sm text-slate-400 font-light leading-relaxed max-w-xl">
                  AgentPort provides AI agents with a portable identity, framework adapters, and verifiable behavior contracts — ensuring agents keep their core identity across OpenAI, CrewAI, Claude Code, and Lyzr.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('passport')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold transition-all cursor-pointer active:scale-95"
                  >
                    <Shield className="w-4 h-4" />
                    <span>View Agent Passport</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </button>

                  <button
                    onClick={() => setActiveTab('verification')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0e111a] hover:bg-[#151926] border border-white/[0.1] text-slate-200 font-mono text-xs font-semibold transition-all cursor-pointer active:scale-95"
                  >
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span>Open Verification Lab</span>
                  </button>
                </div>
              </div>

              {/* Signature Visual: Digital Passport with Rotating Ring */}
              <div className="lg:col-span-5 flex justify-center">
                <PassportHeroVisual report={report} />
              </div>
            </div>

            {/* Horizontal Pipeline */}
            <HorizontalProcessFlow />

            {/* Quick Framework Visas Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Accredited Framework Visas
                </span>
                <button
                  onClick={() => setActiveTab('frameworks')}
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Explore Adapters &amp; Portability Matrix →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                {[
                  { name: 'OPENAI', no: '#001', score: '+100 pts', verified: report.visas.OpenAI === 'VERIFIED' },
                  { name: 'CREWAI', no: '#002', score: '+100 pts', verified: report.visas.CrewAI === 'VERIFIED' },
                  { name: 'CLAUDE CODE', no: '#003', score: '+100 pts', verified: report.visas['Claude Code'] === 'VERIFIED' },
                  { name: 'LYZR', no: '#004', score: '+100 pts', verified: report.visas.Lyzr === 'VERIFIED' }
                ].map((v) => (
                  <div
                    key={v.name}
                    onClick={() => setActiveTab('frameworks')}
                    className="p-3.5 rounded-lg bg-[#0c0e15] border border-white/[0.07] hover:border-white/[0.15] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white tracking-wider">{v.name}</div>
                      <div className="text-[10px] text-slate-500">VISA {v.no} • {v.score}</div>
                    </div>
                    <span className="text-emerald-400 font-semibold text-xs">✓ VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Telemetry Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Live Security Policy Telemetry
                </span>
                <button
                  onClick={() => setActiveTab('security')}
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Policy Engine Console →
                </button>
              </div>

              <div className="rounded-lg border border-white/[0.07] bg-[#0c0e15] p-3 space-y-2 font-mono text-xs">
                {securityEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded bg-[#07090e] border border-white/[0.03] flex items-center justify-between"
                  >
                    <div className="truncate mr-3">
                      <span className="text-slate-500 text-[10px] block">
                        {ev.timestamp.split('T')[1]?.substring(0, 8) || '09:42:18'}
                      </span>
                      <span className="text-slate-200 truncate font-medium">
                        {ev.action_type.toUpperCase()}: {ev.target_resource}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase shrink-0 border ${
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
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PASSPORT TAB */}
        {activeTab === 'passport' && (
          <div className="space-y-6">
            <div className="border-b border-white/[0.08] pb-6">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">
                DIGITAL CREDENTIAL
              </span>
              <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
                Agent Passport Artifact
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Cryptographically sealed behavioral contract and runtime permissions under OpenGAP v0.1.0.
              </p>
            </div>
            <PassportCard agent={agent} report={report} />
          </div>
        )}

        {/* FRAMEWORKS TAB */}
        {activeTab === 'frameworks' && (
          <div className="space-y-12">
            <FrameworkExplorer adapters={report.adapterResults} />
            <PortabilityMatrix />
          </div>
        )}

        {/* VERIFICATION LAB TAB */}
        {activeTab === 'verification' && (
          <VerificationLab
            agent={agent}
            report={report}
            onRunVerification={handleRunVerification}
            isVerifying={isVerifying}
            onMutateAgent={handleMutateAgent}
            onResetAgent={handleResetAgent}
          />
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <SecuritySimulator />
        )}

        {/* EVIDENCE TAB */}
        {activeTab === 'evidence' && (
          <EvidenceViewer report={report} />
        )}

        {/* DOCS TAB */}
        {activeTab === 'docs' && (
          <DocumentationView />
        )}
      </main>

      {/* Developer Minimal Footer */}
      <footer className="border-t border-white/[0.06] bg-[#050608] py-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded border border-white/20 bg-white/[0.05] flex items-center justify-center text-white">
              <Shield className="w-3 h-3" />
            </div>
            <span className="text-slate-300 font-semibold font-['Plus_Jakarta_Sans']">AgentPort AI</span>
            <span>—</span>
            <span className="text-slate-400">Define once. Export anywhere. Verify what survives.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">
              CLI: <code className="text-slate-200">python -m verification.validate</code>
            </span>
            <span>•</span>
            <span className="text-slate-400">OpenGAP v0.1.0</span>
            <span>•</span>
            <span className="text-slate-400">Apache-2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
