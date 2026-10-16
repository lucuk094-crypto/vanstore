import React, { useState } from 'react';
import type { Product } from '../types.ts';

interface LiveDemoModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({ product, isOpen, onClose }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeScreen, setActiveScreen] = useState<'overview' | 'analytics' | 'settings'>('overview');
  const [tokenCounter, setTokenCounter] = useState(14850);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl h-[92vh] bg-[#0c0c0e] border border-[#27272a] rounded-2xl flex flex-col overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-3 py-2.5 bg-[#141416] border-b border-[#262626]">
          {/* Browser Traffic Lights */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#ef4444] hover:opacity-80 transition-opacity"
                title="Tutup"
              />
              <span className="w-3 h-3 rounded-full bg-[#eab308]" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            </div>
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded bg-[#0a0a0a] border border-[#262626] text-[11px] font-mono text-[#a3a3a3]">
              <span className="text-emerald-400">https://</span>
              <span className="text-white">demo.vanstore.dev/app/dashboard</span>
              <span className="text-[#666666] ml-1">({product.slug})</span>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center gap-1 bg-[#0a0a0a] p-1 rounded-lg border border-[#262626]">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded text-xs transition-colors ${
                device === 'desktop' ? 'bg-[#27272a] text-white' : 'text-[#71717a] hover:text-white'
              }`}
              title="Desktop View"
            >
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded text-xs transition-colors ${
                device === 'tablet' ? 'bg-[#27272a] text-white' : 'text-[#71717a] hover:text-white'
              }`}
              title="Tablet View"
            >
              <span className="material-symbols-outlined text-[16px]">tablet_mac</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded text-xs transition-colors ${
                device === 'mobile' ? 'bg-[#27272a] text-white' : 'text-[#71717a] hover:text-white'
              }`}
              title="Mobile View"
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#27272a] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Viewport Content Area */}
        <div className="flex-1 overflow-auto bg-[#080808] p-3 flex justify-center items-start">
          <div
            className={`transition-all duration-300 w-full rounded-xl overflow-hidden border border-[#262626] bg-[#0f0f12] shadow-2xl flex flex-col ${
              device === 'desktop'
                ? 'max-w-full'
                : device === 'tablet'
                ? 'max-w-[720px]'
                : 'max-w-[390px]'
            }`}
          >
            {/* Mock App Shell Header */}
            <div className="px-4 py-3 bg-[#131317] border-b border-[#232328] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/50 flex items-center justify-center text-[#ef4444]">
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                </div>
                <span className="text-white font-bold text-sm tracking-tight font-headline">
                  {product.title}
                </span>
                <span className="font-mono text-[9px] bg-red-950/60 text-red-400 px-1.5 py-0.5 rounded border border-red-800">
                  LIVE DEMO
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-400 hidden sm:inline">
                  WebSocket: Connected (18ms)
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Mock Navigation Tabs */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#232328] bg-[#0e0e11] text-xs font-mono">
              <button
                onClick={() => setActiveScreen('overview')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeScreen === 'overview'
                    ? 'bg-[#ef4444] text-white font-bold'
                    : 'text-[#a3a3a3] hover:text-white'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveScreen('analytics')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeScreen === 'analytics'
                    ? 'bg-[#ef4444] text-white font-bold'
                    : 'text-[#a3a3a3] hover:text-white'
                }`}
              >
                AI Generation Feed
              </button>
              <button
                onClick={() => setActiveScreen('settings')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeScreen === 'settings'
                    ? 'bg-[#ef4444] text-white font-bold'
                    : 'text-[#a3a3a3] hover:text-white'
                }`}
              >
                Environment Config
              </button>
            </div>

            {/* Mock Screen Content */}
            <div className="p-4 space-y-4 text-white">
              {activeScreen === 'overview' && (
                <>
                  {/* Top Stats Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-lg bg-[#15151a] border border-[#262626]">
                      <span className="text-[10px] text-[#a3a3a3] uppercase font-mono block">
                        Monthly Active Users
                      </span>
                      <span className="text-xl font-bold font-headline mt-1 block">4,289</span>
                      <span className="text-[10px] text-emerald-400 font-mono">+12.4% vs last week</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#15151a] border border-[#262626]">
                      <span className="text-[10px] text-[#a3a3a3] uppercase font-mono block">
                        Tokens Consumed
                      </span>
                      <span className="text-xl font-bold font-headline mt-1 block font-mono">
                        {tokenCounter.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setTokenCounter((prev) => prev + 120)}
                        className="text-[10px] text-[#ef4444] hover:underline font-mono"
                      >
                        + Generate Test Request
                      </button>
                    </div>

                    <div className="p-3 rounded-lg bg-[#15151a] border border-[#262626]">
                      <span className="text-[10px] text-[#a3a3a3] uppercase font-mono block">
                        Database Latency
                      </span>
                      <span className="text-xl font-bold font-headline mt-1 block font-mono">
                        14ms
                      </span>
                      <span className="text-[10px] text-[#a3a3a3] font-mono">Serverless Postgres</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#15151a] border border-[#262626]">
                      <span className="text-[10px] text-[#a3a3a3] uppercase font-mono block">
                        Tenancy Isolation
                      </span>
                      <span className="text-xl font-bold font-headline mt-1 block text-emerald-400">
                        Enforced
                      </span>
                      <span className="text-[10px] text-[#a3a3a3] font-mono">Row Level Security</span>
                    </div>
                  </div>

                  {/* Main Visual Dashboard Canvas */}
                  <div className="p-4 rounded-xl bg-[#15151a] border border-[#262626] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-headline font-semibold text-sm">
                        AI Content Generator Workspace
                      </span>
                      <span className="font-mono text-xs text-[#a3a3a3]">Model: gpt-4o-mini</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#262626] space-y-2">
                      <span className="text-xs text-[#a3a3a3] font-mono block">
                        Prompt Editor (Micro-service Test):
                      </span>
                      <textarea
                        readOnly
                        value={`"Generate high-converting landing page copy with architectural breakdown for multi-tenant SaaS application..."`}
                        className="w-full bg-transparent border-none p-0 text-xs font-mono text-white resize-none focus:outline-none"
                        rows={2}
                      />
                      <div className="flex justify-between items-center pt-2 border-t border-[#1f1f24]">
                        <span className="text-[10px] font-mono text-[#71717a]">
                          Execution: 340ms • Status: 200 OK
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-mono text-[10px] border border-emerald-800">
                          Ready to Deploy
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeScreen === 'analytics' && (
                <div className="p-4 rounded-xl bg-[#15151a] border border-[#262626] space-y-3">
                  <h4 className="font-headline font-bold text-sm">Streaming Stream Log</h4>
                  <div className="space-y-2 font-mono text-xs text-[#a3a3a3]">
                    <p>
                      <span className="text-[#ef4444]">[14:40:02]</span> Inbound webhook from Stripe:
                      invoice.payment_succeeded (cust_9210)
                    </p>
                    <p>
                      <span className="text-[#ef4444]">[14:39:15]</span> JWT token refreshed via NextAuth
                      v5 session store
                    </p>
                    <p>
                      <span className="text-[#ef4444]">[14:35:22]</span> Subdomain tenant{' '}
                      <span className="text-white">workspace-alpha.app.domain</span> routed
                      successfully
                    </p>
                  </div>
                </div>
              )}

              {activeScreen === 'settings' && (
                <div className="p-4 rounded-xl bg-[#15151a] border border-[#262626] space-y-3 font-mono text-xs">
                  <h4 className="font-headline font-bold text-sm">Environment Variables Included:</h4>
                  <pre className="p-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-neutral-300 overflow-x-auto">
                    {`DATABASE_URL="postgres://..."\nNEXTAUTH_SECRET="secure_random_hash_key"\nSTRIPE_SECRET_KEY="sk_live_..."\nOPENAI_API_KEY="sk-..."\nNEXT_PUBLIC_APP_URL="https://yourdomain.com"`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
