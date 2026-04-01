import type { CatalogCategorySlug } from '@/routes/routeRegistry';

export interface CatalogHero {
  backgroundImageSrc: string;
  description: string;
  eyebrow: string;
  spotlight: string[];
  subtitle: string;
  title: string;
}

export interface CatalogTab {
  id: string;
  label: string;
}

export interface CatalogFilterOption {
  id: string;
  label: string;
}

export interface CatalogFilterGroup {
  id: string;
  label: string;
  options: CatalogFilterOption[];
}

export interface CatalogGalleryImage {
  alt: string;
  src: string;
}

export interface CatalogMetric {
  label: string;
  value: string;
}

export interface CatalogCard {
  categoryId: CatalogCategorySlug;
  detailDescription: string;
  detailImages?: CatalogGalleryImage[];
  filters: Record<string, string[]>;
  gallery: CatalogGalleryImage[];
  highlights: string[];
  id: string;
  imageAlt: string;
  imageSrc: string;
  metrics: CatalogMetric[];
  model: string;
  slug: string;
  summary: string;
  tabId: string;
  tags: string[];
  title: string;
}

export interface CatalogCategory {
  cards: CatalogCard[];
  hero: CatalogHero;
  id: CatalogCategorySlug;
  label: string;
  tabs: CatalogTab[];
  filterGroups: CatalogFilterGroup[];
}
