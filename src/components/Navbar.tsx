import React from 'react';
import { Shield, Play } from 'lucide-react';
import { VerificationReport } from '../types/agent';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  report: VerificationReport;
  onRunVerification: () => void;
  isVerifying: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  report,
  onRunVerification,
  isVerifying
}) => {
  const isFullPass = report.score.total === 575;

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'passport', label: 'Passport' },
    { id: 'frameworks', label: 'Frameworks' },
    { id: 'verification', label: 'Verification' },
    { id: 'security', label: 'Security' },
    { id: 'evidence', label: 'Evidence' },
    { id: 'docs', label: 'Docs' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#07080b]/90 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Left */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setActiveTab('overview')}
            >
              <div className="w-7 h-7 rounded border border-white/20 bg-white/[0.05] flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white font-['Plus_Jakarta_Sans']">
                AgentPort
              </span>
              <span className="text-[10px] font-mono text-slate-500 border-l border-white/10 pl-2 hidden sm:inline">
                OpenGAP
              </span>
            </div>

            {/* Structured Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id || (item.id === 'overview' && activeTab === 'landing');
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/[0.08] text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0d0f15] border border-white/[0.08] text-[11px] font-mono">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isFullPass ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span className={isFullPass ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                {isFullPass ? 'ALL SYSTEMS VERIFIED' : 'POLICY VIOLATION DETECTED'}
              </span>
            </div>

            {/* Run Verification Button */}
            <button
              onClick={onRunVerification}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] text-xs font-mono text-white transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3 h-3 fill-current ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying...' : 'Run Verification'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-white/[0.05] scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id || (item.id === 'overview' && activeTab === 'landing');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap ${
                  isActive
                    ? 'bg-white/[0.1] text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
