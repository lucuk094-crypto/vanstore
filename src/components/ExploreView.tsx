import React, { useState } from 'react';
import type { Product } from '../types.ts';
import { formatRupiah } from '../utils/store.ts';

interface ExploreViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenDemo: (product: Product) => void;
  isForcedMobile?: boolean;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  products,
  onSelectProduct,
  onOpenDemo,
  isForcedMobile = false,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(600000);

  const allTags = [
    'All',
    'Next.js 14',
    'Tailwind',
    'Stripe',
    'Supabase',
    'Laravel 11',
    'React 19',
    'Flutter',
    'Go Fiber',
    'Prisma ORM',
    'MySQL',
  ];

  const filtered = products.filter((p) => {
    const matchTag = selectedTag === 'All' || p.techStack.includes(selectedTag);
    const matchPrice = p.priceDiscount <= maxPrice;
    return matchTag && matchPrice;
  });

  const containerClasses = isForcedMobile
    ? 'max-w-lg mx-auto'
    : 'max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto';

  return (
    <div className={`pt-16 pb-[104px] px-4 lg:px-6 flex flex-col gap-5 ${containerClasses}`}>
      {/* Title */}
      <div>
        <h1 className="font-headline text-lg md:text-2xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ef4444]">explore</span>
          Eksplorasi Arsitektur &amp; Framework
        </h1>
        <p className="text-xs md:text-sm text-[#a3a3a3] mt-0.5">
          Filter kode sumber berdasarkan stack teknologi, arsitektur, dan anggaran Anda
        </p>
      </div>

      {/* Filter Row: Tag Cloud & Price Slider side by side on Laptop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tag Cloud */}
        <div className="p-4 rounded-xl bg-[#121212]/95 border border-[#262626] space-y-2 backdrop-blur-md shadow-lg">
          <span className="font-mono text-[10px] uppercase text-[#a3a3a3] tracking-wider block">
            Pilih Stack Utama:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#dc2626] text-white border border-[#ef4444] font-bold shadow-sm shadow-red-900/50'
                    : 'bg-[#1a1a1a] text-[#a3a3a3] border border-[#262626] hover:text-white hover:border-[#ef4444]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div className="p-4 rounded-xl bg-[#121212]/95 border border-[#262626] space-y-2 backdrop-blur-md shadow-lg flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#a3a3a3]">Batas Harga Maksimal:</span>
            <span className="text-white font-bold text-sm">{formatRupiah(maxPrice)}</span>
          </div>
          <input
            type="range"
            min="150000"
            max="600000"
            step="25000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#ef4444] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#666666]">
            <span>Rp 150K</span>
            <span>Rp 600K</span>
          </div>
        </div>
      </div>

      {/* Results Grid (1 col on mobile, 2 col on tablet, 3 col on laptop) */}
      <div className="space-y-3">
        <span className="font-mono text-xs text-[#a3a3a3] block">
          Menampilkan {filtered.length} Arsitektur:
        </span>

        <div
          className={
            isForcedMobile
              ? 'flex flex-col gap-3'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#121212]/95 border border-[#262626] hover:border-[#ef4444]/60 transition-all flex flex-col justify-between gap-3 shadow-lg backdrop-blur-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-[#ef4444] font-semibold block mb-0.5">
                      {item.categoryLabel}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(item)}
                      className="font-headline text-white font-bold text-sm hover:text-[#ef4444] cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-mono text-white font-bold text-sm shrink-0">
                    {formatRupiah(item.priceDiscount)}
                  </span>
                </div>

                <p className="text-xs text-[#a3a3a3] line-clamp-2 leading-relaxed mt-2">
                  {item.shortDesc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.techStack.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded bg-[#0a0a0a] border border-[#262626] text-[10px] font-mono text-[#d4d4d8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => onOpenDemo(item)}
                    className="px-2 py-1 rounded bg-[#18181b] border border-[#3f3f46] text-white text-xs font-mono hover:text-[#ef4444] cursor-pointer"
                  >
                    Demo
                  </button>
                  <button
                    onClick={() => onSelectProduct(item)}
                    className="px-2.5 py-1 rounded bg-[#dc2626] text-white text-xs font-mono font-bold hover:bg-[#ef4444] cursor-pointer"
                  >
                    Buka
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
