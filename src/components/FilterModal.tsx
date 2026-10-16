import React from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#121212] border border-[#27272a] rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-xl">tune</span>
            <h3 className="font-headline font-bold text-base text-white">Filter Katalog</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#a3a3a3] hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Filter items */}
        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-[#a3a3a3] mb-1.5 uppercase text-[10px]">Tipe Lisensi</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white">
                <input type="checkbox" defaultChecked className="accent-[#ef4444]" />
                <span>Regular License</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white">
                <input type="checkbox" defaultChecked className="accent-[#ef4444]" />
                <span>Extended Dev</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#a3a3a3] mb-1.5 uppercase text-[10px]">Status Kesiapan</label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" defaultChecked className="accent-[#ef4444]" />
                <span>Verified Architecture (Siap Deploy)</span>
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" defaultChecked className="accent-[#ef4444]" />
                <span>Termasuk Panduan Video 15 Menit</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#a3a3a3] mb-1.5 uppercase text-[10px]">Rating Minimum</label>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded bg-[#dc2626] text-white font-bold border border-[#ef4444]">
                ★ 4.5+
              </button>
              <button className="px-3 py-1 rounded bg-[#1a1a1a] text-[#a3a3a3] border border-[#262626]">
                ★ 4.8+
              </button>
              <button className="px-3 py-1 rounded bg-[#1a1a1a] text-[#a3a3a3] border border-[#262626]">
                ★ 5.0
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-[#262626]">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-[#1a1a1a] border border-[#262626] text-white font-mono text-xs"
          >
            Reset
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-[#dc2626] text-white font-mono text-xs font-bold hover:bg-[#ef4444]"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
};
