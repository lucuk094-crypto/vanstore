import React, { useState } from 'react';
import type { Product } from '../types.ts';
import { formatRupiah } from '../utils/store.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveItem: (productId: string) => void;
  onCheckoutProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onCheckoutProduct,
  onShowToast,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.priceDiscount, 0);
  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'FLASH50' || couponCode.toUpperCase() === 'VANSTORE') {
      setDiscountApplied(true);
      onShowToast('Kupon diskon 10% berhasil dipasang!');
    } else {
      onShowToast('Kupon tidak valid. Coba: FLASH50 atau VANSTORE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-sm h-full bg-[#101013] border-l border-[#262626] flex flex-col p-4 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ef4444] text-xl">shopping_bag</span>
            <h2 className="font-headline font-bold text-base text-white">Keranjang Belanja</h2>
            <span className="font-mono text-xs text-[#a3a3a3]">({cartItems.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <span className="material-symbols-outlined text-4xl text-[#71717a] mb-2">
                remove_shopping_cart
              </span>
              <p className="text-white text-sm font-semibold">Keranjang masih kosong</p>
              <p className="text-xs text-[#71717a] mt-1">Pilih source code dari katalog untuk memulai.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#141418] border border-[#262626] flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-[#ef4444] uppercase">{item.categoryLabel}</span>
                    <h4 className="font-headline font-bold text-xs text-white line-clamp-1">{item.title}</h4>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[#71717a] hover:text-[#ef4444] p-1"
                    title="Hapus"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-[#1f1f23]">
                  <span className="font-mono text-xs font-bold text-white">
                    {formatRupiah(item.priceDiscount)}
                  </span>
                  <button
                    onClick={() => {
                      onCheckoutProduct(item);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded bg-[#dc2626] text-white font-mono text-[10px] font-bold hover:bg-[#ef4444]"
                  >
                    Checkout Item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coupon code input */}
        {cartItems.length > 0 && (
          <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-[#262626] mb-3">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Kode Kupon: FLASH50"
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white font-mono text-xs uppercase placeholder:text-[#666666] focus:border-[#ef4444] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-white font-mono text-xs hover:border-[#ef4444]"
              >
                Pakai
              </button>
            </div>
            {discountApplied && (
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                ✓ Diskon kupon aktif (-10%)
              </span>
            )}
          </form>
        )}

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-[#262626]">
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between text-[#a3a3a3]">
                <span>Subtotal:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>Diskon Kupon:</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-[#1f1f23]">
                <span>Total:</span>
                <span>{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onCheckoutProduct(cartItems[0]);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-[#dc2626] hover:bg-[#ef4444] text-white font-headline font-bold text-xs shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">shopping_cart_checkout</span>
              <span>Checkout Semua ({cartItems.length} Produk)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
