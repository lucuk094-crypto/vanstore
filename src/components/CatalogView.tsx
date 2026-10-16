import React, { useState, useEffect } from 'react';
import type { Product } from '../types.ts';
import { formatRupiah, filterProducts, createWhatsAppUrl } from '../utils/store.ts';

interface CatalogViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenDemo: (product: Product) => void;
  onClaimCoupon: () => void;
  onOpenFilterModal: () => void;
  isForcedMobile?: boolean;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  onSelectProduct,
  onOpenDemo,
  onClaimCoupon,
  onOpenFilterModal,
  isForcedMobile = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('Terbaru');

  // Flash sale timer countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { label: 'Semua (128)', value: 'Semua' },
    { label: 'Next.js 14', value: 'Next.js 14' },
    { label: 'Laravel 11', value: 'Laravel 11' },
    { label: 'React SaaS', value: 'React SaaS' },
    { label: 'Flutter Mobile', value: 'Flutter Mobile' },
    { label: 'Vue 3', value: 'Vue 3' },
    { label: 'Node.js API', value: 'Node.js API' },
  ];

  const filteredProducts = filterProducts(products, searchQuery, selectedCategory, sortBy);

  const format2Digits = (n: number) => n.toString().padStart(2, '0');

  const containerClasses = isForcedMobile
    ? 'max-w-lg mx-auto'
    : 'max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto';

  return (
    <div className={`pt-16 pb-[104px] px-4 lg:px-6 flex flex-col gap-5 ${containerClasses}`}>
      {/* 1. Top Featured Hero Banner Image at the very top of the first page */}
      <div className="relative overflow-hidden rounded-2xl bg-[#121212] border border-[#262626] shadow-xl shadow-red-950/25 group hover:border-[#ef4444]/60 transition-all">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#262626] bg-[#16161a] gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#52525b] shrink-0" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27272a] shrink-0" />
            <span className="font-mono text-[10px] text-[#a3a3a3] ml-1 truncate">
              vanstore://promotions/banner.png
            </span>
          </div>
          <span className="shrink-0 px-2 py-0.5 rounded bg-red-950/80 border border-red-700/60 text-[#ef4444] font-mono text-[9px] font-bold tracking-wider uppercase whitespace-nowrap">
            OFFICIAL BANNER
          </span>
        </div>

        {/* Banner Visual - Preserves full graphic cleanly across mobile and laptop */}
        <div className="relative w-full overflow-hidden bg-[#0c0c0e]">
          <img
            src="https://clooud.my.id/uploder/uploads/OHRwpw.png"
            alt="VanStore Promo Banner"
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[340px] object-cover sm:object-cover group-hover:scale-[1.01] transition-transform duration-300 block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 2. Search & Terminal Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <span className="font-mono text-xs font-semibold text-[#ef4444]">$</span>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Cari source code"
          className="w-full pl-8 pr-10 py-2.5 sm:py-3 bg-[#121212]/90 border border-[#27272a] rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/40 transition-all duration-150 backdrop-blur-md"
          placeholder="Cari source code, Next.js, Laravel, React..."
          type="text"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#71717a] hover:text-white cursor-pointer"
              aria-label="Bersihkan pencarian"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            <span className="material-symbols-outlined text-[#71717a] text-[18px]">search</span>
          )}
        </div>
      </div>

      {/* 3. Promo Banner: Flash Sale (Optimized responsive on Mobile & Laptop) */}
      <div className="relative overflow-hidden rounded-2xl p-4 md:p-6 bg-[#121212]/90 border border-[#27272a] shadow-xl shadow-red-950/20 backdrop-blur-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#27272a] border border-[#ef4444]/50 text-white font-mono text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
                FLASH SALE WEEKEND
              </div>
              <span className="text-[#ef4444] font-mono text-[11px] font-bold tracking-wider">
                DISKON 50% OFF
              </span>
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-headline font-bold text-white leading-tight tracking-tight">
              Source Code Arsitektur Siap Deploy
            </h2>
            <p className="text-[#a1a1aa] text-[11px] sm:text-xs md:text-sm leading-relaxed">
              Lisensi unminified commercial + file dokumentasi setup Docker lengkap. Akses instan ke
              seluruh template production-ready.
            </p>
          </div>

          {/* Timer Matrix & Claim CTA (Full width on Mobile, Inline on Laptop) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#27272a]">
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-[#0a0a0a]/80 px-3 py-2 rounded-xl border border-[#27272a]">
              <span className="font-mono text-[#71717a] text-[10px] uppercase tracking-wider">
                Berakhir dalam:
              </span>
              <div className="flex items-center gap-1 font-mono text-white font-semibold">
                <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#27272a] text-[12px]">
                  {format2Digits(timeLeft.hours)}
                </span>
                <span className="text-xs text-[#ef4444] font-bold">:</span>
                <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#27272a] text-[12px]">
                  {format2Digits(timeLeft.minutes)}
                </span>
                <span className="text-xs text-[#ef4444] font-bold">:</span>
                <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#27272a] text-[12px]">
                  {format2Digits(timeLeft.seconds)}
                </span>
              </div>
            </div>

            <button
              onClick={onClaimCoupon}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-[#ef4444] hover:to-[#dc2626] border border-[#ef4444] text-white font-mono text-xs font-bold tracking-tight shadow-md shadow-red-900/40 active:scale-98 transition-all cursor-pointer text-center justify-center flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">confirmation_number</span>
              <span>Klaim Kupon FLASH50</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Category Pills Horizontal Scroll */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[#71717a] uppercase tracking-wider text-[10px]">
            Kategori Ekosistem
          </span>
          <button
            onClick={() => setSelectedCategory('Semua')}
            className="font-mono text-[#ef4444] text-[11px] font-semibold hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#ef4444] text-white border border-[#ef4444] font-bold shadow-md shadow-red-900/40'
                    : 'bg-[#121212] border border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#ef4444]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#52525b]'}`}
                />
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Filter & Sorting Toolbar (No text cut off on mobile) */}
      <div className="flex items-center justify-between py-2 border-y border-[#27272a] text-xs gap-2 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenFilterModal}
            className="px-2.5 py-1.5 rounded-lg bg-[#121212] border border-[#27272a] text-[#f4f4f5] hover:text-white hover:border-[#ef4444] font-mono text-[10px] flex items-center gap-1 transition-colors active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>Filter</span>
          </button>
          <span className="text-[#27272a]">|</span>
          <div className="flex items-center gap-1 text-[#a1a1aa] text-[11px] whitespace-nowrap">
            <span className="text-[#71717a] hidden xs:inline">Urut:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-0 py-0 pl-1 pr-5 text-white font-mono text-[11px] focus:ring-0 cursor-pointer"
            >
              <option className="bg-[#121212] text-white" value="Terbaru">
                Terbaru
              </option>
              <option className="bg-[#121212] text-white" value="Terpopuler">
                Terpopuler
              </option>
              <option className="bg-[#121212] text-white" value="Harga Terendah">
                Harga Min
              </option>
              <option className="bg-[#121212] text-white" value="Rating Tertinggi">
                Rating Max
              </option>
            </select>
          </div>
        </div>

        <div className="font-mono text-[#71717a] text-[10px] sm:text-[11px] whitespace-nowrap shrink-0 text-right">
          <span className="text-white font-semibold">{filteredProducts.length}</span> Produk
        </div>
      </div>

      {/* Responsive Catalog Grid (1 column on mobile, 2 columns on tablet, 3 columns on laptop) */}
      <div
        className={
          isForcedMobile
            ? 'flex flex-col gap-4'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5'
        }
      >
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12 px-4 rounded-2xl bg-[#121212] border border-[#27272a]">
            <span className="material-symbols-outlined text-4xl text-[#71717a] mb-2">
              search_off
            </span>
            <p className="text-white font-semibold text-sm">Tidak ada source code ditemukan</p>
            <p className="text-[#71717a] text-xs mt-1">Coba kata kunci atau kategori lain</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#18181b] border border-[#3f3f46] text-white text-xs font-mono hover:border-[#ef4444] cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const waUrl = createWhatsAppUrl(
              product.whatsappNumber,
              product.title,
              product.priceDiscount
            );

            return (
              <article
                key={product.id}
                className="rounded-2xl bg-[#121212]/95 border border-[#27272a] p-4 flex flex-col justify-between gap-3 relative group hover:border-[#ef4444]/60 transition-all shadow-lg shadow-black/40 backdrop-blur-md"
              >
                <div>
                  {/* Terminal Header Bar */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#27272a] gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#52525b] shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27272a] shrink-0" />
                      <span className="font-mono text-[10px] text-[#71717a] ml-1 truncate">
                        {product.repoPath}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#27272a] border border-[#ef4444]/40 text-[#ef4444] font-mono text-[9px] tracking-wide font-semibold shrink-0 ml-1">
                      {product.badge}
                    </span>
                  </div>

                  {/* Title & Spec */}
                  <div className="mt-2.5">
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-headline text-white font-semibold text-base leading-tight group-hover:text-[#ef4444] transition-colors cursor-pointer"
                    >
                      {product.title}
                    </h3>
                    <p className="text-[#a1a1aa] text-[12px] mt-1.5 line-clamp-2 leading-relaxed">
                      {product.shortDesc}
                    </p>
                  </div>

                  {/* Tech Stack Badge Cluster */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {product.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-[#0a0a0a] border border-[#262626] text-[#d4d4d8] font-mono text-[10px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Section: Telemetry, Pricing & Action Buttons */}
                <div className="pt-2">
                  <div className="flex items-end justify-between pt-1 mb-2.5">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#a1a1aa]">
                        <span
                          className="material-symbols-outlined text-[#ef4444] text-[14px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
                        <span className="text-[#71717a]">({product.salesCount} terjual)</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="font-mono text-white font-bold text-base">
                          {formatRupiah(product.priceDiscount)}
                        </span>
                        {product.priceNormal > product.priceDiscount && (
                          <span className="font-mono text-[#71717a] line-through text-[11px]">
                            {formatRupiah(product.priceNormal)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Live Demo Chip */}
                    <button
                      onClick={() => onOpenDemo(product)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#18181b] border border-[#3f3f46] text-white font-mono text-[11px] hover:border-[#ef4444] hover:text-[#ef4444] transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Live Demo</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </button>
                  </div>

                  {/* Action Matrix */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#27272a]">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="w-full py-2.5 px-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] border border-[#3f3f46] text-white font-mono text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer whitespace-nowrap min-w-0"
                    >
                      <span className="material-symbols-outlined text-[15px] shrink-0">description</span>
                      <span className="truncate">Lihat Detail</span>
                    </button>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-2 rounded-xl bg-[#dc2626] hover:bg-[#ef4444] border border-[#ef4444] text-white font-mono text-[11px] font-bold shadow-md shadow-red-950/40 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer whitespace-nowrap min-w-0"
                    >
                      <span className="material-symbols-outlined text-[15px] shrink-0">chat</span>
                      <span className="truncate">Order WA</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Code Repository Trust Banner */}
      <div className="p-4 rounded-xl bg-[#121212]/90 border border-[#27272a] flex items-center gap-3 shadow-md backdrop-blur-md">
        <div className="w-10 h-10 rounded-lg bg-[#18181b] flex items-center justify-center text-[#ef4444] shrink-0 border border-[#ef4444]/40">
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
        </div>
        <div>
          <h4 className="font-headline text-xs md:text-sm font-semibold text-white">
            Jaminan Garansi 100% Run
          </h4>
          <p className="text-[11px] md:text-xs text-[#a1a1aa] mt-0.5">
            Panduan instalasi via remote AnyDesk/TeamViewer bila gagal build. Siap live di server dalam 15 menit.
          </p>
        </div>
      </div>
    </div>
  );
};
