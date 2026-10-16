import React, { useState } from 'react';
import type { Order } from '../types.ts';
import { formatRupiah } from '../utils/store.ts';

interface OrdersViewProps {
  orders: Order[];
  onShowToast: (msg: string) => void;
  onOpenReceipt: (order: Order) => void;
  isForcedMobile?: boolean;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onShowToast,
  onOpenReceipt,
  isForcedMobile = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'delivered'>('all');

  const filteredOrders = orders.filter((o) => (filter === 'all' ? true : o.status === filter));

  const handleCopyLicense = (licenseKey: string) => {
    navigator.clipboard.writeText(licenseKey);
    onShowToast(`License Key "${licenseKey}" disalin!`);
  };

  const handleSimulateDownload = (order: Order) => {
    onShowToast(`Mengunduh arsip ZIP "${order.productTitle}" via token ${order.downloadToken}...`);
  };

  const containerClasses = isForcedMobile
    ? 'max-w-lg mx-auto'
    : 'max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto';

  return (
    <div className={`pt-16 pb-[104px] px-4 lg:px-6 flex flex-col gap-5 ${containerClasses}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#262626]">
        <div>
          <h1 className="font-headline text-lg md:text-2xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444]">receipt_long</span>
            Manajemen Order &amp; Lisensi
          </h1>
          <p className="text-xs md:text-sm text-[#a3a3a3] mt-0.5">
            Daftar pembelian source code &amp; kunci lisensi otomatis
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#121212]/95 rounded-xl border border-[#262626] backdrop-blur-md">
          <button
            onClick={() => setFilter('all')}
            className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#dc2626] text-white font-bold shadow-md shadow-red-950/40'
                : 'text-[#a3a3a3] hover:text-white'
            }`}
          >
            Semua ({orders.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filter === 'confirmed'
                ? 'bg-[#dc2626] text-white font-bold shadow-md shadow-red-950/40'
                : 'text-[#a3a3a3] hover:text-white'
            }`}
          >
            Terkonfirmasi
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`py-1.5 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filter === 'delivered'
                ? 'bg-[#dc2626] text-white font-bold shadow-md shadow-red-950/40'
                : 'text-[#a3a3a3] hover:text-white'
            }`}
          >
            Terkirim
          </button>
        </div>
      </div>

      {/* Orders Grid (1 col on mobile, 2 col on tablet/laptop) */}
      <div
        className={
          isForcedMobile
            ? 'flex flex-col gap-4'
            : 'grid grid-cols-1 md:grid-cols-2 gap-4'
        }
      >
        {filteredOrders.length === 0 ? (
          <div className="col-span-full p-10 text-center rounded-2xl bg-[#121212] border border-[#262626]">
            <span className="material-symbols-outlined text-4xl text-[#71717a] mb-2">
              inbox
            </span>
            <p className="text-white text-sm font-semibold">Belum ada pesanan di kategori ini</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isConfirmed = order.status === 'confirmed';
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-[#121212]/95 border border-[#262626] p-4 md:p-5 flex flex-col justify-between gap-3.5 shadow-xl relative backdrop-blur-md"
              >
                <div>
                  {/* Header status */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#262626]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm md:text-base font-bold text-white">
                        {order.id}
                      </span>
                      <span className="font-mono text-[10px] md:text-xs text-[#a3a3a3]">
                        ({order.timestamp})
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-semibold ${
                        isConfirmed
                          ? 'bg-red-950/50 border-red-500/50 text-[#ef4444]'
                          : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="mt-2.5">
                    <h3 className="font-headline text-white font-bold text-sm md:text-base leading-tight">
                      {order.productTitle}
                    </h3>
                    <p className="text-xs text-[#a3a3a3] mt-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-[#ef4444]">
                        person
                      </span>
                      {order.customerName}
                    </p>
                    <p className="text-xs text-[#a3a3a3] mt-0.5 flex items-center gap-1.5 font-mono">
                      <span className="material-symbols-outlined text-xs text-emerald-400">
                        chat
                      </span>
                      {order.customerWhatsapp}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Amount & License */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0a0a] border border-[#262626]">
                    <div>
                      <span className="text-[10px] text-[#a3a3a3] uppercase font-mono block">
                        Total Dibayar ({order.license} License)
                      </span>
                      <span className="font-mono text-white font-bold text-sm">
                        {formatRupiah(order.amount)}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenReceipt(order)}
                      className="px-2.5 py-1 rounded bg-[#1a1a1a] text-white hover:text-[#ef4444] border border-[#262626] font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">receipt</span>
                      Struk Order
                    </button>
                  </div>

                  {/* License Key Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#a3a3a3] uppercase">
                        Kunci Lisensi Terdaftar:
                      </span>
                      <button
                        onClick={() => handleCopyLicense(order.licenseKey)}
                        className="font-mono text-[10px] text-[#ef4444] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                        Salin
                      </button>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0a0a0a] border border-[#262626] font-mono text-xs text-white flex items-center justify-between">
                      <span className="truncate">{order.licenseKey}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#262626]">
                    <button
                      onClick={() => handleSimulateDownload(order)}
                      className="w-full py-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#3f3f46] text-white font-mono text-[11px] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm text-[#ef4444]">
                        download
                      </span>
                      Unduh ZIP
                    </button>

                    <a
                      href={`https://wa.me/${order.customerWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Halo ${order.customerName}, berikut verifikasi pesanan ${order.id} untuk ${order.productTitle}. Terima kasih telah berbelanja di VanStore!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-[#dc2626] hover:bg-[#ef4444] text-white font-mono text-[11px] font-bold shadow-md shadow-red-950/40 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Hubungi Buyer
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
