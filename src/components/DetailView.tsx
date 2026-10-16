import React, { useState, useEffect } from 'react';
import type { Product } from '../types.ts';
import { formatRupiah, calculateDiscount, createWhatsAppUrl } from '../utils/store.ts';

interface DetailViewProps {
  product: Product;
  onBack: () => void;
  onOpenDemo: (product: Product) => void;
  onCheckout: (product: Product) => void;
  onShowToast: (msg: string) => void;
  isForcedMobile?: boolean;
}

export const DetailView: React.FC<DetailViewProps> = ({
  product,
  onBack,
  onOpenDemo,
  onCheckout,
  onShowToast,
  isForcedMobile = false,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const discountPercent = calculateDiscount(product.priceNormal, product.priceDiscount);
  const waChatUrl = createWhatsAppUrl(
    product.whatsappNumber,
    product.title,
    product.priceDiscount,
    'Regular'
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.title,
          text: `Cek source code ${product.title} di VanStore!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Link source code berhasil disalin ke clipboard!');
    }
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onShowToast(!isBookmarked ? 'Ditambahkan ke simpanan bookmark' : 'Dihapus dari bookmark');
  };

  const containerClasses = isForcedMobile
    ? 'max-w-lg mx-auto'
    : 'max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto';

  return (
    <div className="min-h-screen pb-32">
      {/* Header Navigasi Sub Halaman */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-8 h-14 w-full bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#262626]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Kembali"
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#121212] border border-[#262626] text-white hover:bg-[#1a1a1a] hover:border-[#ef4444]/50 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="font-headline text-[15px] font-bold text-white leading-tight">
              Detail Source Code
            </span>
            <span className="font-mono text-[11px] text-[#a3a3a3] flex items-center gap-1.5 leading-none mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] inline-block shadow-[0_0_6px_#ef4444]" />
              {product.repoPath}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleBookmark}
            aria-label="Bookmark"
            className={`w-9 h-9 rounded-lg flex items-center justify-center bg-[#121212] border border-[#262626] transition-colors active:scale-95 cursor-pointer ${
              isBookmarked
                ? 'text-[#ef4444] border-[#ef4444]/60'
                : 'text-[#a3a3a3] hover:text-white hover:border-neutral-600'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
          </button>

          <button
            onClick={handleShare}
            aria-label="Share"
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#121212] border border-[#262626] text-[#a3a3a3] hover:text-white hover:border-neutral-600 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </header>

      {/* Konten Utama (Responsive 2-column on Laptop) */}
      <main className={`pt-16 px-4 lg:px-6 ${containerClasses} mt-2`}>
        <div
          className={
            isForcedMobile ? 'flex flex-col gap-4' : 'flex flex-col lg:grid lg:grid-cols-12 gap-6'
          }
        >
          {/* Left Column on Laptop (Mockup, Demo CTA, Deploy Guide) */}
          <div className={isForcedMobile ? 'space-y-4' : 'lg:col-span-7 space-y-4'}>
            {/* Card Frame Cover Preview */}
            <div className="rounded-xl overflow-hidden bg-[#121212]/95 border border-[#262626] p-3 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262626] px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block shadow-[0_0_4px_#ef4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#333333] inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#222222] inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-[#a3a3a3]">
                    preview.vanstore.dev/app/dashboard
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-red-950/80 text-white border border-red-800">
                  Versi 2.4 (2025)
                </span>
              </div>

              {/* Mockup Visual */}
              <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden border border-[#262626] bg-[#1a1a1a]">
                <img
                  alt={`${product.title} Dashboard Mockup`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  src={product.thumbnailUrl}
                />
                <div className="absolute inset-0 bg-[#0a0a0a]/25 pointer-events-none" />
                <div className="absolute top-2.5 left-2.5">
                  <span className="flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded bg-[#0a0a0a]/95 text-white border border-red-900/60 font-medium shadow-md">
                    <span className="material-symbols-outlined text-[13px] text-[#ef4444]">
                      verified
                    </span>
                    Tested Architecture
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 bg-[#0a0a0a]/95 px-2.5 py-1 rounded border border-[#262626]">
                  <span className="material-symbols-outlined text-[13px] text-[#a3a3a3]">
                    desktop_windows
                  </span>
                  <span className="text-[#737373] text-[8px]">•</span>
                  <span className="material-symbols-outlined text-[13px] text-[#a3a3a3]">
                    tablet_mac
                  </span>
                  <span className="text-[#737373] text-[8px]">•</span>
                  <span className="material-symbols-outlined text-[13px] text-[#a3a3a3]">
                    smartphone
                  </span>
                  <span className="font-mono text-[10px] text-[#a3a3a3] ml-1">100% Responsif</span>
                </div>
              </div>

              {/* Tombol Aksi Langsung Solid (Hitam, Merah, Tactile 3D) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-2.5 mt-0.5">
                <button
                  onClick={() => onOpenDemo(product)}
                  className="w-full flex items-center justify-between px-3 sm:px-3.5 py-2.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] border border-red-500 text-white font-semibold text-xs sm:text-[13px] active:scale-[0.98] transition-all shadow-[0_4px_0_0_#991b1b,0_6px_14px_rgba(220,38,38,0.3),inset_0_1px_0_0_rgba(255,255,255,0.25)] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[17px] sm:text-[18px] shrink-0">open_in_new</span>
                    <span className="truncate">Buka Live Demo / Preview</span>
                  </div>
                  <span className="font-mono text-[10px] sm:text-[11px] text-white/90 bg-black/40 px-2 py-0.5 rounded border border-white/20 shrink-0 ml-1">
                    demo.vanstore.dev
                  </span>
                </button>

                <a
                  href={waChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#262626] text-white font-semibold text-xs sm:text-[13px] active:scale-[0.98] transition-all shadow-[0_3px_0_0_#050505,inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:border-neutral-600 cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[17px] sm:text-[18px] text-[#ef4444] shrink-0">chat</span>
                  <span>Chat Penjual via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* BAGIAN UTAMA: PANDUAN DEPLOY KE HOSTING GRATIS */}
            <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-[#121212]/95 border border-[#262626] backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 pb-2 border-b border-[#262626]">
                <div className="w-7 h-7 rounded-md bg-red-950/80 border border-red-700/80 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] text-[#ef4444]">
                    cloud_upload
                  </span>
                </div>
                <div>
                  <h2 className="font-headline text-[14px] md:text-base font-bold text-white">
                    Panduan Deploy Hosting Gratis
                  </h2>
                  <p className="text-[11px] text-[#a3a3a3]">
                    Langkah rilis website ke Vercel &amp; Netlify tanpa biaya bulanan
                  </p>
                </div>
              </div>

              {/* Step by Step List */}
              <div className="flex flex-col gap-2.5 pt-1">
                {product.deploySteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] flex gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#dc2626] text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-red-400 shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                      {step.step}
                    </div>
                    <div className="flex flex-col gap-1 w-full overflow-hidden">
                      <span className="font-headline text-[13px] md:text-sm font-semibold text-white">
                        {step.title}
                      </span>
                      <p className="text-[11px] md:text-xs text-neutral-300 leading-relaxed">
                        {step.desc}
                      </p>
                      {step.codeSnippet && (
                        <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#262626] font-mono text-[10px] md:text-[11px] text-neutral-200 mt-1 whitespace-pre-wrap overflow-x-auto">
                          {step.codeSnippet}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column on Laptop (Title, Price, Tech Stack, Deliverables, Sticky Checkout Box) */}
          <div className={isForcedMobile ? 'space-y-4' : 'lg:col-span-5 space-y-4'}>
            {/* Judul & Harga Produk */}
            <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-[#121212]/95 border border-[#262626] shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-red-950/80 text-white border border-red-700/80 font-semibold tracking-wide uppercase">
                  {product.categoryLabel || 'FULLSTACK NEXT.JS'}
                </span>
                <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-2.5 py-1 rounded border border-[#262626]">
                  <span
                    className="material-symbols-outlined text-[14px] text-[#ef4444]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-mono text-[12px] font-bold text-white">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-[#a3a3a3] text-[11px]">({product.reviewsCount} review)</span>
                </div>
              </div>

              <h1 className="font-headline text-[20px] md:text-2xl font-bold text-white leading-snug">
                {product.fullDesc ? product.title : 'SaaS AI Content Generator & Multi-tenant Workspace'}
              </h1>
              <p className="text-[13px] text-neutral-300 leading-relaxed">
                {product.fullDesc ||
                  'Source code siap pakai arsitektur production-grade. Menggunakan fondasi Next.js App Router, modular micro-frontend, dan integrasi pembayaran instan.'}
              </p>

              <div className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#262626] flex items-center justify-between mt-1 shadow-sm">
                <div>
                  <span className="block text-[11px] text-[#a3a3a3]">Harga Spesial</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[22px] md:text-2xl font-bold text-white">
                      {formatRupiah(product.priceDiscount)}
                    </span>
                    {product.priceNormal > product.priceDiscount && (
                      <span className="font-mono text-[12px] text-[#737373] line-through">
                        {formatRupiah(product.priceNormal)}
                      </span>
                    )}
                  </div>
                </div>
                {discountPercent > 0 && (
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#dc2626] text-white font-bold border border-red-400 shadow-[0_2px_8px_rgba(220,38,38,0.4)]">
                    Hemat {discountPercent}%
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Direct Checkout Card (Visible on Laptop) */}
            <div className="hidden lg:flex flex-col gap-3 p-4 rounded-xl bg-[#141418] border border-red-500/40 shadow-xl shadow-red-950/20">
              <span className="font-mono text-xs text-[#a3a3a3] uppercase font-bold tracking-wider">
                Pembelian Instan &amp; Unduh Langsung
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#a3a3a3] block font-mono">Total Investasi:</span>
                  <span className="font-mono text-2xl font-bold text-white">
                    {formatRupiah(product.priceDiscount)}
                  </span>
                </div>
                <button
                  onClick={() => onCheckout(product)}
                  className="px-5 py-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] border border-red-500 text-white font-headline text-sm font-bold flex items-center gap-2 active:scale-95 shadow-[0_4px_0_0_#991b1b,0_6px_14px_rgba(220,38,38,0.4)] cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  <span>Beli Sekarang</span>
                </button>
              </div>
              <a
                href={waChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#262626] text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-[#ef4444]">chat</span>
                <span>Tanya via WhatsApp Langsung</span>
              </a>
            </div>

            {/* Tech Stack Dependencies */}
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#121212]/95 border border-[#262626] shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-headline text-[13px] font-bold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#ef4444]">code</span>
                  Tech Stack &amp; Dependensi
                </span>
                <span className="font-mono text-[10px] text-[#a3a3a3]">
                  {product.dependencies.length} Core Libs
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {product.dependencies.map((dep) => (
                  <div
                    key={dep.name}
                    className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between hover:border-neutral-700 transition-colors"
                  >
                    <span className="text-[12px] text-white font-medium">{dep.name}</span>
                    <span className="font-mono text-[10px] text-[#a3a3a3]">{dep.version}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apa yang Anda Dapatkan (Deliverables) */}
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#121212]/95 border border-[#262626] shadow-md">
              <span className="font-headline text-[13px] font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ef4444]">
                  inventory_2
                </span>
                Apa yang Anda Dapatkan (Deliverables)
              </span>
              <div className="flex flex-col gap-1.5 pt-1">
                {product.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[12px] text-neutral-200">
                    <span className="material-symbols-outlined text-[15px] text-[#ef4444]">
                      check_circle
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Garansi & Pengiriman Instan */}
            <div className="p-3.5 rounded-xl bg-[#121212]/95 border border-[#262626] flex items-center gap-3 shadow-md">
              <div className="w-9 h-9 rounded-lg bg-red-950/80 border border-red-700/80 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] text-[#ef4444]">
                  verified_user
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-[12px] font-bold text-white">
                  Pengiriman Instan &amp; Garansi 100% Run
                </span>
                <span className="text-[11px] text-[#a3a3a3] leading-tight">
                  Link download ZIP dan akses repo dikirim otomatis via WhatsApp &amp; Email setelah
                  checkout.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Checkout Bar on Mobile View */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#262626] px-3 sm:px-4 py-2.5 sm:py-3"
        style={{
          boxShadow:
            'rgba(0, 0, 0, 0.9) 0px -8px 24px -4px, rgba(239, 68, 68, 0.1) 0px 1px 0px 0px inset',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-[10px] text-[#a3a3a3] uppercase font-mono tracking-wider truncate">
              Total Investasi
            </span>
            <span className="font-mono text-[16px] sm:text-[18px] font-bold text-white leading-tight truncate">
              {formatRupiah(product.priceDiscount)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={waChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg bg-[#121212] hover:bg-[#1a1a1a] border border-neutral-700 hover:border-neutral-500 text-white text-[11px] sm:text-[12px] font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-[0_3px_0_0_#050505,inset_0_1px_0_0_rgba(255,255,255,0.15)] cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#ef4444]">chat</span>
              <span>Tanya WA</span>
            </a>

            <button
              onClick={() => onCheckout(product)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] border border-red-500 text-white text-[11px] sm:text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-[0_4px_0_0_#991b1b,0_6px_14px_rgba(220,38,38,0.4),inset_0_1px_0_0_rgba(255,255,255,0.3)] cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">shopping_bag</span>
              <span>Beli Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
