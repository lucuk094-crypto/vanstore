import React, { useState } from 'react';
import type { Product, ActivityLog } from '../types.ts';
import { calculateDiscount } from '../utils/store.ts';

interface AdminViewProps {
  productsCount: number;
  ordersCount: number;
  activityLogs: ActivityLog[];
  onAddNewProduct: (newProduct: Product) => void;
  onOpenDemoLink: (url: string) => void;
  onShowToast: (msg: string) => void;
  isForcedMobile?: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({
  productsCount,
  ordersCount,
  activityLogs,
  onAddNewProduct,
  onOpenDemoLink,
  onShowToast,
  isForcedMobile = false,
}) => {
  // Form state
  const [title, setTitle] = useState('SaaS AI Builder Multi-tenant');
  const [category, setCategory] = useState<'fullstack' | 'frontend' | 'backend' | 'mobile' | 'cms'>('fullstack');
  const [priceNormal, setPriceNormal] = useState('750.000');
  const [priceDiscount, setPriceDiscount] = useState('495.000');
  const [techStack, setTechStack] = useState<string[]>([
    'Next.js 14',
    'Tailwind CSS',
    'Node.js',
    'Prisma ORM',
    'PostgreSQL',
  ]);
  const [newTagInput, setNewTagInput] = useState('');
  const [thumbnailName, setThumbnailName] = useState('mockup-preview-dark.webp (1920x1080)');
  const [demoUrl, setDemoUrl] = useState('https://demo-saas.vanstore.dev');
  const [whatsappNumber, setWhatsappNumber] = useState('81234567890');
  const [repoUrl, setRepoUrl] = useState('https://github.com/vanstore-org/saas-builder-core-private');
  const [showRepoUrl, setShowRepoUrl] = useState(false);
  const [description, setDescription] = useState(
    '### Fitur Utama:\n- Multi-tenancy dengan subdomain otomatis\n- Integrasi Midtrans & Stripe Webhook\n- Auth system via NextAuth v5 + RBAC\n- High-contrast Cyber Dark & Sharp Red minimal'
  );
  const [isPreviewDesc, setIsPreviewDesc] = useState(false);
  const [licenseType, setLicenseType] = useState<'regular' | 'extended'>('regular');
  const [isPublished, setIsPublished] = useState(true);

  // Compute discount percentage dynamically
  const numNormal = parseInt(priceNormal.replace(/\D/g, ''), 10) || 750000;
  const numDiscount = parseInt(priceDiscount.replace(/\D/g, ''), 10) || 495000;
  const discountPercent = calculateDiscount(numNormal, numDiscount);

  const handleRemoveTag = (tagToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== tagToRemove));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(newTagInput.trim())) {
        setTechStack([...techStack, newTagInput.trim()]);
      }
      setNewTagInput('');
    }
  };

  const handleAddTagBtn = () => {
    if (newTagInput.trim() && !techStack.includes(newTagInput.trim())) {
      setTechStack([...techStack, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleSimpanProduct = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Judul produk wajib diisi!');
      return;
    }

    const created: Product = {
      id: `prod-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      repoPath: `packages/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/v1.0`,
      badge: isDraft ? 'DRAFT_MODE' : 'VERIFIED & DOKUMENTASI',
      badgeColor: isDraft
        ? 'border-neutral-600 bg-neutral-900 text-neutral-400'
        : 'border-red-500/40 text-red-500 bg-neutral-900',
      title: title.trim(),
      shortDesc: description.split('\n')[0].replace(/^#+\s*/, '') || 'Source code premium VanStore siap deploy.',
      fullDesc: description,
      category,
      categoryLabel:
        category === 'fullstack'
          ? 'FULLSTACK WEB APP'
          : category === 'frontend'
          ? 'FRONTEND TEMPLATE'
          : category === 'backend'
          ? 'BACKEND API'
          : category === 'mobile'
          ? 'MOBILE APP'
          : 'CMS & ECOMMERCE',
      techStack,
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      priceNormal: numNormal,
      priceDiscount: numDiscount,
      demoUrl: demoUrl || 'https://demo.vanstore.dev',
      whatsappNumber: whatsappNumber || '81234567890',
      repoUrl: repoUrl || 'https://github.com/vanstore-org',
      thumbnailUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA5Iwbtfc99a762JGwlqQxJ_pSbLmos3fompoomYrScGw_EYEdPOjzIAgc39jIg0wPI7S94l5f0KI2ISJMf_4JOjUzDeh2heEViEW8ro07U2DPt3yBlts2dbMgXZP6gbV2F6BcPzVjpX2rllecJyufg28i0jybdRRu8j3HstV-Dx7xI1ZU0dbB1csJ1pQvdSck9pq6kYQl0y9LKVbp852oXmsh9bQtMUmHYlVPLmEEIjWTvyOTnUu2Y',
      licenseType,
      isPublished: !isDraft && isPublished,
      coreLibsCount: techStack.length,
      dependencies: techStack.map((tech) => ({ name: tech, version: 'Latest' })),
      deploySteps: [
        {
          step: 1,
          title: 'Ekstrak ZIP & Setup Git',
          desc: 'Ekstrak paket kode sumber mentahan dan inisialisasi Git repository.',
          codeSnippet: 'git init && git add . && git commit -m "init"',
        },
        {
          step: 2,
          title: 'Install Dependencies & Konfigurasi Lingkungan',
          desc: 'Install library dependensi dan siapkan kredensial environment.',
          codeSnippet: 'npm install',
        },
        {
          step: 3,
          title: 'Setup Database & Migrasi',
          desc: 'Jalankan skrip migrasi database.',
        },
        {
          step: 4,
          title: 'Deploy ke Production',
          desc: 'Deploy ke Vercel atau VPS dengan sertifikat SSL gratis otomatis.',
        },
      ],
      deliverables: [
        'Full Raw Source Code (.zip mentahan)',
        'Database Schema SQL siap pakai',
        'Panduan Deployment & Konfigurasi PDF',
        licenseType === 'extended' ? 'Extended Developer Commercial License' : 'Regular Single Client License',
      ],
      createdAt: new Date().toISOString(),
    };

    onAddNewProduct(created);
    onShowToast(
      isDraft
        ? `Draft "${title}" tersimpan!`
        : `Source code "${title}" berhasil disimpan & dipublikasikan!`
    );
  };

  const containerClasses = isForcedMobile
    ? 'max-w-lg mx-auto'
    : 'max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto';

  return (
    <div className={`w-full pt-16 pb-[104px] px-4 lg:px-6 ${containerClasses}`}>
      <div
        className={
          isForcedMobile ? 'flex flex-col gap-6' : 'flex flex-col lg:grid lg:grid-cols-12 gap-6'
        }
      >
        {/* Left Column on Laptop (Admin Profile, Telemetry, Statistics, Terminal Log) */}
        <div className={isForcedMobile ? 'space-y-6' : 'lg:col-span-5 space-y-5'}>
          {/* Admin Profile & System Telemetry Header */}
          <section className="p-4 rounded-xl bg-[#121212]/95 border border-[#262626] relative overflow-hidden shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#ef4444]/50 flex items-center justify-center overflow-hidden shadow-inner">
                    <span className="material-symbols-outlined text-[#ef4444] text-2xl">
                      terminal
                    </span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#ef4444] ring-2 ring-[#121212]" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-headline text-base text-white font-bold">Admin Master</h1>
                    <span
                      className="material-symbols-outlined text-[#ef4444] text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#a3a3a3]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                      Server Online (99.9%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onShowToast('Panel preferensi admin: Node SG-01 Sync: OK')}
                  className="p-2 rounded-lg bg-[#1a1a1a] text-[#a3a3a3] hover:text-white transition-colors border border-[#262626] active:scale-95 cursor-pointer"
                  title="Pengaturan"
                >
                  <span className="material-symbols-outlined text-lg">tune</span>
                </button>
                <button
                  onClick={() => onShowToast('Sesi Admin Master aktif (PID: 8092)')}
                  className="p-2 rounded-lg bg-[#1a1a1a] text-[#a3a3a3] hover:text-[#ef4444] transition-colors border border-[#262626] active:scale-95 cursor-pointer"
                  title="Keluar"
                >
                  <span className="material-symbols-outlined text-lg">power_settings_new</span>
                </button>
              </div>
            </div>

            {/* System Quick Status Bar */}
            <div className="mt-3 pt-3 border-t border-[#262626] flex items-center justify-between font-mono text-[10px] sm:text-[11px] text-[#666666] gap-1">
              <span className="flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-xs text-[#ef4444]">dns</span>
                node-sg-01
              </span>
              <span className="text-white font-medium truncate text-center">Auto-Sync Git: Active</span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="material-symbols-outlined text-xs text-[#ef4444]">memory</span>
                28% CPU
              </span>
            </div>
          </section>

          {/* Overview Metric Cards */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="font-mono text-xs tracking-wider text-white uppercase flex items-center gap-1.5 font-bold">
                <span className="material-symbols-outlined text-sm text-[#ef4444]">monitoring</span>
                Statistik Toko
              </h2>
              <span className="font-mono text-xs text-[#ef4444] font-semibold">Live Data</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Card 1: Total Produk */}
              <div className="p-3.5 rounded-xl bg-[#121212]/95 border border-[#262626] hover:border-[#ef4444]/60 transition-all shadow-md backdrop-blur-md">
                <div className="flex items-center justify-between text-[#a3a3a3] mb-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#a3a3a3]">
                    TOTAL PRODUK
                  </span>
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#ef4444]/50 flex items-center justify-center text-[#ef4444]">
                    <span className="material-symbols-outlined text-sm">folder_code</span>
                  </div>
                </div>
                <div className="font-headline text-2xl text-white font-bold">{productsCount}</div>
                <div className="flex items-center gap-1 mt-1 font-mono text-[11px] text-[#ef4444] font-semibold">
                  <span className="material-symbols-outlined text-xs">arrow_upward</span>
                  <span>+3 minggu ini</span>
                </div>
              </div>

              {/* Card 2: Total Penjualan */}
              <div className="p-3.5 rounded-xl bg-[#121212]/95 border border-[#262626] hover:border-[#ef4444]/60 transition-all shadow-md backdrop-blur-md">
                <div className="flex items-center justify-between text-[#a3a3a3] mb-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#a3a3a3]">
                    TOTAL PENJUALAN
                  </span>
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#ef4444]/50 flex items-center justify-center text-[#ef4444]">
                    <span className="material-symbols-outlined text-sm">payments</span>
                  </div>
                </div>
                <div className="font-headline text-lg text-white font-bold tracking-tight">
                  Rp 14.850K
                </div>
                <div className="flex items-center gap-1 mt-1 font-mono text-[11px] text-[#ef4444] font-semibold">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  <span>+18.4% MoM</span>
                </div>
              </div>

              {/* Card 3: Order Masuk */}
              <div className="p-3.5 rounded-xl bg-[#121212]/95 border border-[#262626] hover:border-[#ef4444]/60 transition-all shadow-md backdrop-blur-md">
                <div className="flex items-center justify-between text-[#a3a3a3] mb-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#a3a3a3]">
                    ORDER MASUK
                  </span>
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#ef4444]/50 flex items-center justify-center text-[#ef4444]">
                    <span className="material-symbols-outlined text-sm">receipt_long</span>
                  </div>
                </div>
                <div className="font-headline text-2xl text-white font-bold">{ordersCount}</div>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] text-white font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
                  <span>Menunggu Konfirmasi</span>
                </div>
              </div>

              {/* Card 4: Klik Demo */}
              <div className="p-3.5 rounded-xl bg-[#121212]/95 border border-[#262626] hover:border-[#ef4444]/60 transition-all shadow-md backdrop-blur-md">
                <div className="flex items-center justify-between text-[#a3a3a3] mb-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#a3a3a3]">
                    KLIK DEMO
                  </span>
                  <div className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#ef4444]/50 flex items-center justify-center text-[#ef4444]">
                    <span className="material-symbols-outlined text-sm">ads_click</span>
                  </div>
                </div>
                <div className="font-headline text-2xl text-white font-bold">3.420x</div>
                <div className="flex items-center gap-1 mt-1 font-mono text-[11px] text-[#a3a3a3] font-medium">
                  <span className="material-symbols-outlined text-xs text-[#ef4444]">visibility</span>
                  <span>
                    Konversi <strong className="text-white">8.2%</strong>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Deployment / Activity Log Terminal Snippet */}
          <section className="p-4 rounded-xl bg-black border border-[#262626] font-mono text-xs shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-[#a3a3a3] border-b border-[#262626] pb-2 mb-2 font-mono">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <span className="material-symbols-outlined text-sm text-[#ef4444]">terminal</span>
                activity_stream.log
              </span>
              <span className="text-[#666666]">PID: 8092</span>
            </div>

            <div className="space-y-2 text-[#a3a3a3] font-mono text-[11px]">
              {activityLogs.map((log) => (
                <p key={log.id}>
                  <span className="text-[#ef4444] font-semibold">[{log.time}]</span> {log.title}{' '}
                  <span className="text-white font-medium">{log.target}</span> {log.detail}
                </p>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column on Laptop (Main Section: Form Tambah Produk Source Code Baru) */}
        <div className={isForcedMobile ? 'space-y-4' : 'lg:col-span-7 space-y-4'}>
          <section className="rounded-2xl bg-[#121212]/95 border border-[#262626] p-4 md:p-6 relative shadow-2xl backdrop-blur-md">
            {/* Section Terminal Header Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                </div>
                <span className="font-mono text-xs text-[#a3a3a3] ml-1">
                  pkg://create/source-code.ts
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#7f1d1d]/40 text-[#ef4444] border border-[#ef4444]/40 uppercase tracking-wider font-bold">
                CREATE_MODE
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-4 mb-5">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-xl text-[#ef4444]">code</span>
                <h2 className="font-headline text-lg md:text-xl text-white font-bold">
                  Tambah Produk Source Code Baru
                </h2>
              </div>
              <p className="text-xs text-[#a3a3a3] mt-1">
                Formulir kustomisasi lengkap produk mentahan website untuk dipublikasikan ke katalog.
              </p>
            </div>

            {/* Form Inputs Container */}
            <form className="space-y-4" onSubmit={(e) => handleSimpanProduct(e, false)}>
              {/* 1. Nama / Judul Source Code */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 flex items-center gap-1.5 font-medium">
                  <span>Judul / Nama Source Code</span>
                  <span className="text-[#ef4444] font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono text-sm text-[#ef4444] font-bold">$</span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white placeholder:text-[#666666] focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] focus:outline-none transition-all font-mono text-sm"
                    placeholder="e.g. SaaS AI Builder Multi-tenant"
                    type="text"
                  />
                </div>
              </div>

              {/* 2. Kategori Source Code */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 flex items-center gap-1.5 font-medium">
                  <span>Kategori Software</span>
                  <span className="text-[#ef4444] font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] focus:outline-none appearance-none transition-all text-sm cursor-pointer"
                  >
                    <option value="fullstack">Fullstack Web Application (Production Ready)</option>
                    <option value="frontend">Frontend Template &amp; UI Kit</option>
                    <option value="backend">Backend API &amp; Microservices</option>
                    <option value="mobile">Mobile App (Flutter / React Native)</option>
                    <option value="cms">Custom CMS &amp; E-Commerce Boilerplate</option>
                  </select>
                  <span className="absolute right-3 top-3 pointer-events-none text-[#ef4444] material-symbols-outlined text-lg">
                    expand_more
                  </span>
                </div>
              </div>

              {/* 3. Dual Pricing: Harga Asli & Diskon */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs text-white mb-1.5 font-medium">
                    Harga Normal (Rp)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-mono text-xs text-[#a3a3a3]">Rp</span>
                    <input
                      value={priceNormal}
                      onChange={(e) => setPriceNormal(e.target.value)}
                      className="w-full pl-9 pr-2.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white font-mono text-sm focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] focus:outline-none transition-all"
                      placeholder="750.000"
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-white mb-1.5 flex items-center justify-between font-medium">
                    <span>Harga Diskon</span>
                    {discountPercent > 0 && (
                      <span className="text-white bg-[#dc2626] px-1.5 py-0.5 rounded border border-[#ef4444] font-mono text-[10px] font-bold">
                        SAVE {discountPercent}%
                      </span>
                    )}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 font-mono text-xs text-[#ef4444] font-bold">
                      Rp
                    </span>
                    <input
                      value={priceDiscount}
                      onChange={(e) => setPriceDiscount(e.target.value)}
                      className="w-full pl-9 pr-2.5 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#ef4444]/60 text-white font-mono text-sm font-semibold focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] focus:outline-none transition-all"
                      placeholder="495.000"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Tech Stack / Framework Tags Input */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 flex items-center justify-between font-medium">
                  <span>Tech Stack / Framework</span>
                  <span className="text-[#666666] font-mono text-[10px]">Klik untuk lepas chip</span>
                </label>

                <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-[#262626] space-y-2 focus-within:border-[#ef4444] focus-within:ring-1 focus-within:ring-[#ef4444]">
                  {/* Active tag chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1a1a1a] border border-[#ef4444]/50 text-white font-mono text-xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                        {tech}
                        <button
                          onClick={() => handleRemoveTag(tech)}
                          className="hover:text-[#ef4444] ml-0.5 text-[#a3a3a3] cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input to add new tags */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[#262626]">
                    <span className="font-mono text-xs text-[#ef4444] font-bold">+</span>
                    <input
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="w-full bg-transparent border-none p-0 text-white font-mono text-xs focus:ring-0 focus:outline-none placeholder:text-[#666666]"
                      placeholder="Ketik tag lalu tekan enter (e.g. Docker, TypeScript, Redis)..."
                      type="text"
                    />
                    {newTagInput && (
                      <button
                        onClick={handleAddTagBtn}
                        type="button"
                        className="px-2 py-0.5 rounded bg-[#1a1a1a] text-xs font-mono text-[#ef4444] border border-[#ef4444]/40 cursor-pointer"
                      >
                        Tambah
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Cover / Thumbnail Mockup Dropzone */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 flex items-center justify-between font-medium">
                  <span>Thumbnail Mockup Web (16:9)</span>
                  <span className="text-[#666666] font-mono text-[10px]">PNG / WEBP max 5MB</span>
                </label>
                <div
                  onClick={() => {
                    const sampleNames = [
                      'mockup-preview-dark.webp (1920x1080)',
                      'dashboard-hero-isometric.webp (1920x1080)',
                      'fullstack-saas-mockup.png (2560x1440)',
                    ];
                    const next =
                      sampleNames[(sampleNames.indexOf(thumbnailName) + 1) % sampleNames.length];
                    setThumbnailName(next);
                    onShowToast(`Mockup terpilih: ${next}`);
                  }}
                  className="border-2 border-dashed border-[#262626] hover:border-[#ef4444] rounded-xl p-4 bg-[#0a0a0a] text-center transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-[#ef4444] border border-[#ef4444]/40 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 group-hover:border-[#ef4444] transition-transform shadow-md">
                    <span className="material-symbols-outlined text-xl">cloud_upload</span>
                  </div>
                  <p className="font-headline text-sm text-white font-semibold">
                    Tarik &amp; Letakkan Screenshot Mockup
                  </p>
                  <p className="text-xs text-[#a3a3a3] mt-0.5">
                    atau <span className="text-[#ef4444] underline font-medium">browse file komputer</span>
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121212] border border-[#262626] text-white font-mono text-xs">
                    <span className="material-symbols-outlined text-xs text-[#ef4444]">
                      check_circle
                    </span>
                    <span>{thumbnailName}</span>
                  </div>
                </div>
              </div>

              {/* 6. Link URL Live Preview / Demo */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 font-medium">
                  Link URL Live Preview / Demo Web
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 material-symbols-outlined text-[#a3a3a3] text-lg">
                    language
                  </span>
                  <input
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white font-mono text-xs focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] focus:outline-none transition-all"
                    placeholder="https://demo.example.com"
                    type="url"
                  />
                  <button
                    onClick={() => onOpenDemoLink(demoUrl)}
                    className="absolute right-2 px-2.5 py-1 rounded bg-[#1a1a1a] text-white hover:text-[#ef4444] font-mono text-[11px] border border-[#262626] hover:border-[#ef4444]/50 transition-all flex items-center gap-1 font-medium active:scale-95 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xs text-[#ef4444]">
                      open_in_new
                    </span>
                    Tes Link
                  </button>
                </div>
              </div>

              {/* 7. Nomor WhatsApp Penjual / CS */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 flex items-center justify-between font-medium">
                  <span>Nomor WhatsApp Penjual / Layanan CS</span>
                  <span className="text-white bg-[#7f1d1d]/50 px-1.5 py-0.5 rounded border border-[#ef4444]/50 font-mono text-[10px] font-bold">
                    Instant Checkout Ready
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-xl bg-[#1a1a1a] border border-[#262626] font-mono text-xs text-white font-semibold">
                    <span>+62</span>
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <span className="absolute left-3 material-symbols-outlined text-[#a3a3a3] text-lg">
                      chat
                    </span>
                    <input
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white font-mono text-sm focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] focus:outline-none transition-all"
                      placeholder="812-xxxx-xxxx"
                      type="tel"
                    />
                  </div>
                </div>
                <p className="font-mono text-[11px] text-[#a3a3a3] mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#ef4444]">bolt</span>
                  Template auto-chat WhatsApp: "Halo Admin VanStore, saya ingin beli source code [
                  {title || 'Nama Produk'}]..."
                </p>
              </div>

              {/* 8. Link Repositori / ZIP Mentahan */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 flex items-center justify-between font-medium">
                  <span>Link Repositori / ZIP Mentahan</span>
                  <span className="text-[#a3a3a3] font-mono text-[10px] flex items-center gap-1 bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#262626]">
                    <span className="material-symbols-outlined text-xs text-[#ef4444]">lock</span>
                    Terenkripsi AES-256
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 material-symbols-outlined text-[#a3a3a3] text-lg">
                    key
                  </span>
                  <input
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#0a0a0a] border border-[#262626] text-white font-mono text-xs focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] focus:outline-none transition-all"
                    placeholder="https://github.com/... atau https://drive.google.com/..."
                    type={showRepoUrl ? 'text' : 'password'}
                  />
                  <button
                    onClick={() => setShowRepoUrl(!showRepoUrl)}
                    className="absolute right-3 text-[#666666] hover:text-white cursor-pointer"
                    type="button"
                    title={showRepoUrl ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {showRepoUrl ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-[#666666] mt-1">
                  Tautan ini hanya akan dikirimkan otomatis ke buyer setelah pembayaran terverifikasi.
                </p>
              </div>

              {/* 9. Deskripsi Lengkap & Fitur (Toolbar) */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 font-medium">
                  Deskripsi Lengkap &amp; Spesifikasi Fitur
                </label>
                <div className="rounded-xl bg-[#0a0a0a] border border-[#262626] overflow-hidden focus-within:border-[#ef4444] focus-within:ring-1 focus-within:ring-[#ef4444]">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 p-1.5 bg-[#1a1a1a] border-b border-[#262626] text-[#a3a3a3] font-mono">
                    <button
                      onClick={() => setDescription((prev) => prev + '\n**Teks Tebal**')}
                      className="p-1 hover:bg-[#121212] rounded text-white hover:text-[#ef4444] cursor-pointer"
                      title="Bold"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">format_bold</span>
                    </button>
                    <button
                      onClick={() => setDescription((prev) => prev + '\n*Teks Miring*')}
                      className="p-1 hover:bg-[#121212] rounded text-white hover:text-[#ef4444] cursor-pointer"
                      title="Italic"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">format_italic</span>
                    </button>
                    <button
                      onClick={() => setDescription((prev) => prev + '\n```ts\n// kode\n```')}
                      className="p-1 hover:bg-[#121212] rounded text-white hover:text-[#ef4444] cursor-pointer"
                      title="Code Block"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">code</span>
                    </button>
                    <button
                      onClick={() => setDescription((prev) => prev + '\n- Item fitur baru')}
                      className="p-1 hover:bg-[#121212] rounded text-white hover:text-[#ef4444] cursor-pointer"
                      title="List"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
                    </button>
                    <div className="h-4 w-px bg-[#262626] mx-1" />
                    <button
                      onClick={() => setIsPreviewDesc(!isPreviewDesc)}
                      className={`p-1 hover:bg-[#121212] rounded flex items-center gap-1 text-xs ml-auto font-medium cursor-pointer ${
                        isPreviewDesc ? 'text-[#ef4444]' : 'text-white hover:text-[#ef4444]'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm text-[#ef4444]">preview</span>
                      <span>{isPreviewDesc ? 'Edit' : 'Preview'}</span>
                    </button>
                  </div>

                  {/* Text area or preview */}
                  {isPreviewDesc ? (
                    <div className="w-full p-3 bg-transparent text-white text-xs leading-relaxed whitespace-pre-wrap min-h-[96px]">
                      {description}
                    </div>
                  ) : (
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 bg-transparent border-none text-white text-xs placeholder:text-[#666666] focus:ring-0 focus:outline-none"
                      rows={4}
                    />
                  )}
                </div>
              </div>

              {/* 10. Lisensi Code */}
              <div>
                <label className="block font-mono text-xs text-white mb-1.5 font-medium">
                  Tipe Lisensi Penjualan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    onClick={() => setLicenseType('regular')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl cursor-pointer shadow-sm transition-all ${
                      licenseType === 'regular'
                        ? 'bg-[#1a1a1a] border border-[#ef4444]/80'
                        : 'bg-[#0a0a0a] border border-[#262626] hover:border-[#ef4444]/50'
                    }`}
                  >
                    <input
                      checked={licenseType === 'regular'}
                      onChange={() => setLicenseType('regular')}
                      className="text-[#dc2626] focus:ring-[#ef4444] bg-[#0a0a0a] border-[#262626]"
                      name="license"
                      type="radio"
                    />
                    <div>
                      <p className="font-headline text-xs font-semibold text-white">Regular License</p>
                      <p className="text-[11px] text-[#a3a3a3]">1 Domain Client</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setLicenseType('extended')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl cursor-pointer transition-all ${
                      licenseType === 'extended'
                        ? 'bg-[#1a1a1a] border border-[#ef4444]/80'
                        : 'bg-[#0a0a0a] border border-[#262626] hover:border-[#ef4444]/50'
                    }`}
                  >
                    <input
                      checked={licenseType === 'extended'}
                      onChange={() => setLicenseType('extended')}
                      className="text-[#dc2626] focus:ring-[#ef4444] bg-[#0a0a0a] border-[#262626]"
                      name="license"
                      type="radio"
                    />
                    <div>
                      <p className="font-headline text-xs font-semibold text-white">Extended Dev</p>
                      <p className="text-[11px] text-[#666666]">Unlimited Project</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* 11. Status Produk Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0a0a0a] border border-[#262626]">
                <div>
                  <span className="font-headline text-sm font-semibold text-white block">
                    Publikasikan Langsung ke Katalog
                  </span>
                  <span className="text-xs text-[#a3a3a3]">
                    Produk akan langsung tampil di explore buyer setelah disimpan.
                  </span>
                </div>

                {/* Red Accent Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="sr-only peer"
                    type="checkbox"
                  />
                  <div className="w-11 h-6 bg-[#1a1a1a] border border-[#262626] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#dc2626] peer-checked:border-[#ef4444]" />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                {/* Primary CTA Button */}
                <button
                  className="w-full py-3.5 px-4 rounded-xl font-headline text-sm font-bold text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-t border-red-400 border-b-2 border-red-900 shadow-[0_4px_16px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[0_2px_8px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-lg">cloud_done</span>
                  <span>Simpan &amp; Publikasikan Source Code</span>
                </button>

                {/* Secondary Draft Button */}
                <button
                  onClick={(e) => handleSimpanProduct(e, true)}
                  className="w-full py-3 px-4 rounded-xl font-mono text-xs text-white bg-[#1a1a1a] hover:bg-neutral-800 border border-[#262626] hover:border-white/40 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-[#a3a3a3]">
                    bookmark_border
                  </span>
                  <span>Simpan sebagai Draft</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
