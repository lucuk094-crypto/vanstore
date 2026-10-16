import React from 'react';
import type { TabType } from '../types.ts';

interface NavbarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
  deviceMode: 'auto' | 'mobile' | 'laptop';
  onToggleDeviceMode: (mode: 'auto' | 'mobile' | 'laptop') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  cartCount,
  onOpenCart,
  onOpenNotifications,
  notificationCount,
  deviceMode,
  onToggleDeviceMode,
}) => {
  const isAdmin = activeTab === 'admin';

  const navLinks: { key: TabType; label: string; icon: string }[] = [
    { key: 'catalog', label: 'Katalog', icon: 'code' },
    { key: 'explore', label: 'Eksplorasi Stack', icon: 'explore' },
    { key: 'orders', label: 'Pesanan & Lisensi', icon: 'receipt_long' },
    { key: 'admin', label: 'Admin Panel', icon: 'dashboard' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-8 h-14 w-full bg-[#0a0a0a]/90 border-b border-[#262626] backdrop-blur-md">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChangeTab('catalog')}
          className="flex items-center gap-2 group text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#3f3f46] flex items-center justify-center text-[#ef4444] shadow-sm shadow-red-950/40 group-hover:border-[#ef4444] transition-colors">
            <span className="material-symbols-outlined text-[19px]">terminal</span>
          </div>
          <span className="text-[17px] font-bold text-white tracking-tight font-headline">
            VanStore
          </span>
        </button>

        {isAdmin ? (
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#7f1d1d]/40 border border-[#ef4444]/40 text-[#ef4444] font-semibold">
            v2.4-adm
          </span>
        ) : (
          <span className="bg-[#27272a] border border-[#ef4444]/40 text-[#ef4444] text-[10px] font-mono px-1.5 py-0.5 rounded tracking-wider font-semibold">
            DEV_v2.4
          </span>
        )}
      </div>

      {/* Desktop Navigation Links (Laptop Mode) */}
      <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-[#121212]/80 p-1 rounded-xl border border-[#27272a]">
        {navLinks.map((link) => {
          const isActive = activeTab === link.key;
          return (
            <button
              key={link.key}
              onClick={() => onChangeTab(link.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                isActive
                  ? 'bg-[#dc2626] text-white font-bold shadow-sm shadow-red-900/50'
                  : 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {link.icon}
              </span>
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Device Mode Switcher, Notifications, Cart */}
      <div className="flex items-center gap-2">
        {/* Device Mode Switcher for Testing / Previewing */}
        <div className="hidden sm:flex items-center bg-[#121212] p-1 rounded-xl border border-[#27272a] font-mono text-xs">
          <button
            onClick={() => onToggleDeviceMode('auto')}
            title="Mode Otomatis Responsif"
            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              deviceMode === 'auto'
                ? 'bg-[#27272a] text-white font-bold'
                : 'text-[#71717a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">devices</span>
            <span className="text-[11px]">Auto</span>
          </button>
          <button
            onClick={() => onToggleDeviceMode('laptop')}
            title="Mode Tampilan Laptop / Desktop Penuh"
            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              deviceMode === 'laptop'
                ? 'bg-[#dc2626] text-white font-bold'
                : 'text-[#71717a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">laptop_mac</span>
            <span className="text-[11px]">Laptop</span>
          </button>
          <button
            onClick={() => onToggleDeviceMode('mobile')}
            title="Mode Bingkai Mobile Smartphone"
            className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              deviceMode === 'mobile'
                ? 'bg-[#dc2626] text-white font-bold'
                : 'text-[#71717a] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            <span className="text-[11px]">Mobile</span>
          </button>
        </div>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifikasi Sistem"
          className="relative p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#18181b] transition-colors duration-150 active:scale-95"
          title="Notifikasi"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444] ring-2 ring-[#0a0a0a]" />
          )}
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          aria-label="Keranjang Belanja"
          className="relative p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#18181b] transition-colors duration-150 active:scale-95"
          title="Keranjang"
        >
          <span className="material-symbols-outlined text-xl">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#dc2626] text-white font-mono text-[10px] flex items-center justify-center font-bold shadow-md shadow-red-900/50">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
