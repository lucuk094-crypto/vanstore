import type { Product } from '../types.ts';

/**
 * Format a number to Indonesian Rupiah currency string, e.g. 299000 -> "Rp 299.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  return `Rp ${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/**
 * Calculate percentage saved: ((normal - discount) / normal) * 100
 */
export function calculateDiscount(priceNormal: number, priceDiscount: number): number {
  if (!priceNormal || priceNormal <= 0 || priceDiscount >= priceNormal) {
    return 0;
  }
  const diff = priceNormal - priceDiscount;
  return Math.round((diff / priceNormal) * 100);
}

/**
 * Generate a unique VanStore Order ID
 */
export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `#VN-${randomNum}`;
}

/**
 * Create a WhatsApp prefilled link with encoded message
 */
export function createWhatsAppUrl(
  phone: string,
  productTitle: string,
  price: number,
  license: string = 'Regular'
): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const targetPhone = cleanPhone.startsWith('62')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? `62${cleanPhone.slice(1)}`
    : `62${cleanPhone}`;

  const message = `Halo Admin VanStore, saya ingin order source code "${productTitle}" seharga ${formatRupiah(
    price
  )} (${license} License). Mohon instruksi pembayaran & pengiriman link repo. Terima kasih!`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Filter and sort products based on search term, category ecosystem pill, and sorting criteria
 */
export function filterProducts(
  products: Product[],
  query: string,
  categoryFilter: string,
  sortBy: string
): Product[] {
  let list = [...products];

  // 1. Text Search query
  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    list = list.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.shortDesc.toLowerCase().includes(q) || p.fullDesc.toLowerCase().includes(q);
      const matchStack = p.techStack.some((t) => t.toLowerCase().includes(q));
      const matchRepo = p.repoPath.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchStack || matchRepo;
    });
  }

  // 2. Category / Ecosystem pill filter
  if (categoryFilter && categoryFilter !== 'Semua' && categoryFilter !== 'all') {
    const cat = categoryFilter.toLowerCase();
    list = list.filter((p) => {
      if (cat.includes('next.js') || cat === 'next.js 14') {
        return p.techStack.some((t) => t.toLowerCase().includes('next.js')) || p.category === 'fullstack';
      }
      if (cat.includes('laravel') || cat === 'laravel 11') {
        return p.techStack.some((t) => t.toLowerCase().includes('laravel')) || p.repoPath.includes('laravel');
      }
      if (cat.includes('react') || cat === 'react saas') {
        return p.techStack.some((t) => t.toLowerCase().includes('react')) || p.title.toLowerCase().includes('saas');
      }
      if (cat.includes('flutter') || cat === 'flutter mobile') {
        return p.techStack.some((t) => t.toLowerCase().includes('flutter')) || p.category === 'mobile';
      }
      if (cat.includes('vue')) {
        return p.techStack.some((t) => t.toLowerCase().includes('vue'));
      }
      if (cat.includes('node')) {
        return p.techStack.some((t) => t.toLowerCase().includes('node'));
      }
      return p.category === cat || p.techStack.some((t) => t.toLowerCase().includes(cat));
    });
  }

  // 3. Sorting
  if (sortBy === 'Terpopuler' || sortBy === 'popular') {
    list.sort((a, b) => b.salesCount - a.salesCount);
  } else if (sortBy === 'Harga Terendah' || sortBy === 'price_asc') {
    list.sort((a, b) => a.priceDiscount - b.priceDiscount);
  } else if (sortBy === 'Rating Tertinggi' || sortBy === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else {
    // Default 'Terbaru'
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return list;
}
