import React from 'react';
import type { ActivityLog } from '../types.ts';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-sm bg-[#121212] border border-[#27272a] rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-xl">notifications</span>
            <h3 className="font-headline font-bold text-sm text-white">Notifikasi Sistem &amp; Order</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#a3a3a3] hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="py-3 space-y-2.5">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-lg bg-[#0a0a0a] border border-[#262626] font-mono text-[11px] flex gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-1 shrink-0" />
              <div>
                <p className="text-white">
                  <span className="text-[#ef4444] font-semibold">[{log.time}]</span> {log.title}{' '}
                  <span className="text-white font-bold">{log.target}</span> {log.detail}
                </p>
                <span className="text-[9px] text-[#71717a] mt-0.5 block">Node Server SG-01 Verified</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] border border-[#262626] text-white font-mono text-xs"
        >
          Tandai Semua Sudah Dibaca
        </button>
      </div>
    </div>
  );
};
