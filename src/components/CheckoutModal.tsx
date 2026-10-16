import React, { useState } from 'react';
import type { Product, Order } from '../types.ts';
import { formatRupiah, generateOrderId } from '../utils/store.ts';

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (newOrder: Order) => void;
  onShowToast: (msg: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderSuccess,
  onShowToast,
}) => {
  const [license, setLicense] = useState<'regular' | 'extended'>('regular');
  const [name, setName] = useState('Dian Kusuma');
  const [email, setEmail] = useState('dian.kusuma@gmail.com');
  const [whatsapp, setWhatsapp] = useState('+6281234567890');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'midtrans'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen || !product) return null;

  const basePrice = product.priceDiscount;
  const finalPrice = license === 'extended' ? basePrice + 250000 : basePrice;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = generateOrderId();
      const newOrder: Order = {
        id: orderId,
        productId: product.id,
        productTitle: product.title,
        customerName: `${name} (${email})`,
        customerWhatsapp: whatsapp,
        license,
        amount: finalPrice,
        status: 'confirmed',
        timestamp: 'Baru saja',
        downloadToken: `tok_sec_${orderId.replace('#VN-', '')}_aes256_verified`,
        licenseKey: `VN-${product.slug.slice(0, 4).toUpperCase()}-${Math.floor(
          1000 + Math.random() * 9000
        )}-${license === 'extended' ? 'EXT' : 'REG'}`,
      };

      setIsProcessing(false);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
      onShowToast(`Pembayaran sukses! Order ${orderId} siap diunduh.`);
    }, 1200);
  };

  const handleCloseModal = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-[#121212] border border-[#27272a] rounded-2xl p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-xl">shopping_cart_checkout</span>
            <h2 className="font-headline text-base font-bold text-white">
              {completedOrder ? 'Pesanan Terkonfirmasi' : 'Instant Checkout Source Code'}
            </h2>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-1 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {completedOrder ? (
          /* Success Screen */
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/80 flex items-center justify-center mx-auto text-emerald-400">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <div>
              <h3 className="font-headline text-lg font-bold text-white">Pembayaran Sukses!</h3>
              <p className="text-xs text-[#a3a3a3] mt-0.5">
                Order <span className="font-mono text-white font-bold">{completedOrder.id}</span> telah diverifikasi
                oleh sistem VanStore.
              </p>
            </div>

            {/* License Box */}
            <div className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#262626] text-left space-y-2">
              <span className="font-mono text-[10px] uppercase text-[#a3a3a3] tracking-wider block">
                Lisensi Resmi Anda:
              </span>
              <div className="flex items-center justify-between bg-[#151518] px-3 py-2 rounded border border-[#27272a]">
                <span className="font-mono text-xs text-white select-all font-semibold">
                  {completedOrder.licenseKey}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(completedOrder.licenseKey);
                    onShowToast('Kunci lisensi disalin!');
                  }}
                  className="text-xs font-mono text-[#ef4444] hover:underline"
                >
                  Salin
                </button>
              </div>

              <span className="font-mono text-[10px] uppercase text-[#a3a3a3] tracking-wider block mt-2">
                Akses Download ZIP:
              </span>
              <div className="flex items-center justify-between bg-[#151518] px-3 py-2 rounded border border-[#27272a]">
                <span className="font-mono text-[11px] text-[#a3a3a3] truncate">
                  {completedOrder.downloadToken}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                  AES-256 Valid
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onShowToast(`Mengunduh berkas ${completedOrder.productTitle} (.zip 84MB)...`);
                }}
                className="w-full py-3 px-4 rounded-xl font-headline text-sm font-bold text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-t border-red-400 shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 active:scale-98"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Unduh ZIP Source Code Sekarang</span>
              </button>

              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 px-4 rounded-xl font-mono text-xs text-white bg-[#1a1a1a] hover:bg-[#222222] border border-[#262626]"
              >
                Selesai &amp; Lihat Riwayat di Tab Orders
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePay} className="space-y-4">
            {/* Product Summary */}
            <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#262626] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#ef4444] uppercase font-bold block">
                  {product.categoryLabel}
                </span>
                <h3 className="font-headline text-xs font-bold text-white line-clamp-1">{product.title}</h3>
                <span className="text-[11px] text-[#a3a3a3] font-mono">{product.repoPath}</span>
              </div>
              <span className="font-mono text-sm font-bold text-white">{formatRupiah(basePrice)}</span>
            </div>

            {/* License Option */}
            <div>
              <label className="block font-mono text-xs text-white mb-1.5 font-medium">Pilih Tipe Lisensi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLicense('regular')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    license === 'regular'
                      ? 'bg-[#1a1a1a] border-[#ef4444] shadow-sm'
                      : 'bg-[#0a0a0a] border-[#262626] hover:border-neutral-600'
                  }`}
                >
                  <span className="font-headline text-xs font-semibold text-white block">Regular License</span>
                  <span className="text-[10px] text-[#a3a3a3] block mt-0.5">1 Domain Client</span>
                  <span className="font-mono text-[11px] text-[#ef4444] font-bold mt-1 block">
                    {formatRupiah(basePrice)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLicense('extended')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    license === 'extended'
                      ? 'bg-[#1a1a1a] border-[#ef4444] shadow-sm'
                      : 'bg-[#0a0a0a] border-[#262626] hover:border-neutral-600'
                  }`}
                >
                  <span className="font-headline text-xs font-semibold text-white block">Extended Dev</span>
                  <span className="text-[10px] text-[#a3a3a3] block mt-0.5">Unlimited Project</span>
                  <span className="font-mono text-[11px] text-[#ef4444] font-bold mt-1 block">
                    {formatRupiah(basePrice + 250000)}
                  </span>
                </button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-2">
              <div>
                <label className="block font-mono text-xs text-white mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white text-xs focus:border-[#ef4444] focus:outline-none"
                  placeholder="Nama Lengkap"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-white mb-1">Email Penerima (Link ZIP &amp; Repo)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white text-xs focus:border-[#ef4444] focus:outline-none"
                  placeholder="nama@gmail.com"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-white mb-1">WhatsApp Notifikasi</label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white text-xs focus:border-[#ef4444] focus:outline-none"
                  placeholder="+6281234567890"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block font-mono text-xs text-white mb-1.5 font-medium">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    paymentMethod === 'qris'
                      ? 'bg-[#1a1a1a] border-[#ef4444] text-white'
                      : 'bg-[#0a0a0a] border-[#262626] text-[#a3a3a3]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#ef4444]">qr_code_2</span>
                  <span>QRIS Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bca')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    paymentMethod === 'bca'
                      ? 'bg-[#1a1a1a] border-[#ef4444] text-white'
                      : 'bg-[#0a0a0a] border-[#262626] text-[#a3a3a3]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#ef4444]">account_balance</span>
                  <span>BCA Virtual Acc</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mandiri')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    paymentMethod === 'mandiri'
                      ? 'bg-[#1a1a1a] border-[#ef4444] text-white'
                      : 'bg-[#0a0a0a] border-[#262626] text-[#a3a3a3]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#ef4444]">credit_card</span>
                  <span>Mandiri VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('midtrans')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    paymentMethod === 'midtrans'
                      ? 'bg-[#1a1a1a] border-[#ef4444] text-white'
                      : 'bg-[#0a0a0a] border-[#262626] text-[#a3a3a3]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#ef4444]">shield</span>
                  <span>Midtrans Snap</span>
                </button>
              </div>
            </div>

            {/* Total & Submit */}
            <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#a3a3a3] uppercase font-mono block">Total Pembayaran:</span>
                <span className="font-mono text-lg font-bold text-white">{formatRupiah(finalPrice)}</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="py-3 px-5 rounded-xl font-headline text-xs font-bold text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-t border-red-400 shadow-md shadow-red-950/50 flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifikasi...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">lock</span>
                    <span>Bayar &amp; Dapatkan Akses</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
