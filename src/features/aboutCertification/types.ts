export interface CertificationHeroContent {
  backgroundAlt: string;
  backgroundSrc: string;
  description: string;
  eyebrow: string;
  title: string;
}

export interface CertificationSubNavLink {
  href: string;
  isPlaceholder?: boolean;
  label: string;
  to?: string;
}

export interface CertificationCategoryMarker {
  count: number;
  endIndex: number;
  id: string;
  label: string;
  startIndex: number;
}

export interface CertificationEntry {
  categoryId: string;
  categoryLabel: string;
  imageAlt: string;
  imageSrc: string;
  id: string;
  sequence: number;
  serialLabel: string;
  title: string;
}
