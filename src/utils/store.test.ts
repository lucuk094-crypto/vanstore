import test from 'node:test';
import assert from 'node:assert/strict';
import { formatRupiah, calculateDiscount, createWhatsAppUrl, filterProducts } from './store.ts';
import type { Product } from '../types.ts';

test('formatRupiah formats Indonesian currency correctly', () => {
  assert.equal(formatRupiah(299000), 'Rp 299.000');
  assert.equal(formatRupiah(14850000), 'Rp 14.850.000');
  assert.equal(formatRupiah(0), 'Rp 0');
});

test('calculateDiscount calculates integer savings percentage correctly', () => {
  assert.equal(calculateDiscount(599000, 299000), 50);
  assert.equal(calculateDiscount(750000, 495000), 34);
  assert.equal(calculateDiscount(200000, 200000), 0);
  assert.equal(calculateDiscount(0, 100), 0);
});

test('createWhatsAppUrl creates valid wa.me link with encoded params', () => {
  const url = createWhatsAppUrl('081234567890', 'SaaS AI Builder', 299000);
  assert.ok(url.startsWith('https://wa.me/6281234567890'));
  assert.ok(url.includes(encodeURIComponent('SaaS AI Builder')));
});

test('filterProducts filters by keyword and category properly', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      slug: 'saas-ai',
      repoPath: 'packages/ai-builder/v2.4',
      badge: 'VERIFIED',
      title: 'SaaS AI Builder Multi-tenant Fullstack',
      shortDesc: 'Production ready SaaS',
      fullDesc: 'Complete details',
      category: 'fullstack',
      categoryLabel: 'Fullstack Next.js',
      techStack: ['Next.js 14', 'Tailwind', 'Stripe', 'Supabase'],
      rating: 4.9,
      reviewsCount: 142,
      salesCount: 142,
      priceNormal: 599000,
      priceDiscount: 299000,
      demoUrl: 'https://demo.vanstore.dev',
      whatsappNumber: '81234567890',
      repoUrl: 'https://github.com/...',
      thumbnailUrl: '',
      licenseType: 'regular',
      isPublished: true,
      coreLibsCount: 7,
      dependencies: [],
      deploySteps: [],
      deliverables: [],
      createdAt: '2026-01-01',
    },
    {
      id: '2',
      slug: 'laravel-store',
      repoPath: 'repos/laravel-store/v11.2',
      badge: 'SIAP PAKAI',
      title: 'E-Commerce Marketplace Multi-vendor',
      shortDesc: 'Platform belanja multi seller',
      fullDesc: 'Complete details',
      category: 'cms',
      categoryLabel: 'Laravel 11',
      techStack: ['Laravel 11', 'Livewire 3', 'Midtrans', 'MySQL'],
      rating: 5.0,
      reviewsCount: 89,
      salesCount: 89,
      priceNormal: 350000,
      priceDiscount: 249000,
      demoUrl: 'https://demo.vanstore.dev',
      whatsappNumber: '81234567890',
      repoUrl: 'https://github.com/...',
      thumbnailUrl: '',
      licenseType: 'regular',
      isPublished: true,
      coreLibsCount: 5,
      dependencies: [],
      deploySteps: [],
      deliverables: [],
      createdAt: '2026-01-02',
    },
  ];

  // Test keyword search
  const searchResults = filterProducts(mockProducts, 'laravel', 'Semua', 'Terbaru');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, '2');

  // Test category filter
  const nextResults = filterProducts(mockProducts, '', 'Next.js 14', 'Terbaru');
  assert.equal(nextResults.length, 1);
  assert.equal(nextResults[0].id, '1');

  // Test sort by price
  const sorted = filterProducts(mockProducts, '', 'Semua', 'Harga Terendah');
  assert.equal(sorted[0].priceDiscount, 249000);
});
