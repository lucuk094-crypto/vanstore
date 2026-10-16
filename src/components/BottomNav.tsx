import React from 'react';
import type { TabType } from '../types.ts';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  ordersBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  ordersBadgeCount = 1,
}) => {
  const tabs: { key: TabType; label: string; icon: string; badge?: boolean }[] = [
    { key: 'catalog', label: 'Catalog', icon: 'code' },
    { key: 'explore', label: 'Explore', icon: 'explore' },
    { key: 'orders', label: 'Orders', icon: 'receipt_long', badge: ordersBadgeCount > 0 },
    { key: 'admin', label: 'Admin', icon: 'dashboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-center px-3 pointer-events-none pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div
        className="pointer-events-auto rounded-full w-full max-w-[400px] flex items-center justify-between p-1.5 backdrop-blur-xl transition-all"
        style={{
          background: 'linear-gradient(180deg, rgba(22, 22, 22, 0.96) 0%, rgba(10, 10, 10, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow:
            'rgba(0, 0, 0, 0.95) 0px 16px 36px -6px, rgba(220, 38, 38, 0.2) 0px 0px 24px, rgba(255, 255, 255, 0.12) 0px 1px 1px inset',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          if (isActive) {
            return (
              <button
                key={tab.key}
                onClick={() => onChangeTab(tab.key)}
                className="flex-1 min-w-0 flex flex-col items-center justify-center text-white font-bold py-1.5 px-1 rounded-full transition-all duration-150 active:scale-95 shadow-[0_2px_10px_rgba(220,38,38,0.5)] cursor-pointer"
                style={{
                  background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow:
                    'rgba(255, 255, 255, 0.3) 0px 1px 1px inset, rgba(220, 38, 38, 0.5) 0px 3px 10px',
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px] text-white leading-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {tab.icon}
                </span>
                <span className="font-mono text-[10px] mt-0.5 text-white font-bold leading-tight truncate max-w-full">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className="relative flex-1 min-w-0 flex flex-col items-center justify-center text-[#a1a1aa] py-1.5 px-1 hover:text-white transition-all duration-150 active:scale-95 cursor-pointer rounded-full"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">{tab.icon}</span>
              <span className="font-mono text-[10px] mt-0.5 leading-tight truncate max-w-full">{tab.label}</span>
              {tab.badge && (
                <span className="absolute top-1.5 right-[28%] w-1.5 h-1.5 rounded-full bg-[#ef4444] ring-2 ring-[#121212]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
