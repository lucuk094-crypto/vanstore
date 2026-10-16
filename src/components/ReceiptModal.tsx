import React from 'react';
import type { Order } from '../types.ts';
import { formatRupiah } from '../utils/store.ts';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm bg-[#121212] border border-[#27272a] rounded-2xl p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-xl">receipt</span>
            <span className="font-headline font-bold text-white text-sm">Bukti Transaksi VanStore</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#a3a3a3] hover:text-white">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3 font-mono text-xs">
          <div className="flex justify-between text-[#a3a3a3]">
            <span>Nomor Invoice:</span>
            <span className="text-white font-bold">{order.id}</span>
          </div>

          <div className="flex justify-between text-[#a3a3a3]">
            <span>Waktu:</span>
            <span className="text-white">{order.timestamp}</span>
          </div>

          <div className="flex justify-between text-[#a3a3a3]">
            <span>Pelanggan:</span>
            <span className="text-white truncate max-w-[180px]">{order.customerName}</span>
          </div>

          <div className="flex justify-between text-[#a3a3a3]">
            <span>Status Lisensi:</span>
            <span className="text-[#ef4444] font-bold uppercase">{order.license} License</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0a0a0a] border border-[#262626] space-y-1">
            <span className="text-[10px] text-[#71717a] block">Produk:</span>
            <p className="text-white font-headline text-xs font-semibold">{order.productTitle}</p>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#262626]">
            <span className="text-[#a3a3a3]">Total Pembayaran:</span>
            <span className="text-white font-bold text-base">{formatRupiah(order.amount)}</span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#262626]">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`Invoice ${order.id} - ${order.productTitle} (${formatRupiah(order.amount)})`);
              onShowToast('Detail invoice berhasil disalin!');
            }}
            className="w-full py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] border border-[#262626] text-white font-mono text-xs flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            Salin Invoice
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#dc2626] text-white font-mono text-xs font-bold hover:bg-[#ef4444]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
