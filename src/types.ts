export interface TechDependency {
  name: string;
  version: string;
}

export interface DeployStep {
  step: number;
  title: string;
  desc: string;
  codeSnippet?: string;
}

export interface Product {
  id: string;
  slug: string;
  repoPath: string;
  badge: string;
  badgeColor?: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: 'all' | 'fullstack' | 'frontend' | 'backend' | 'mobile' | 'cms';
  categoryLabel: string;
  techStack: string[];
  rating: number;
  reviewsCount: number;
  salesCount: number;
  priceNormal: number;
  priceDiscount: number;
  demoUrl: string;
  whatsappNumber: string;
  repoUrl: string;
  thumbnailUrl: string;
  licenseType: 'regular' | 'extended';
  isPublished: boolean;
  coreLibsCount: number;
  dependencies: TechDependency[];
  deploySteps: DeployStep[];
  deliverables: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  customerWhatsapp: string;
  license: 'regular' | 'extended';
  amount: number;
  status: 'confirmed' | 'pending' | 'delivered';
  timestamp: string;
  downloadToken: string;
  licenseKey: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  title: string;
  target: string;
  detail: string;
}

export type TabType = 'catalog' | 'explore' | 'orders' | 'admin';
