export interface HistoryDecadeMarker {
  endYear: number;
  key: string;
  label: string;
  startYear: number;
}

export interface HistoryEntry {
  description: string;
  id: string;
  imageAlt: string;
  imageSrc?: string;
  subject: string;
  year: number;
}

export interface HistoryHeroContent {
  backgroundAlt: string;
  backgroundSrc: string;
  description: string;
  eyebrow: string;
  title: string;
}

export interface HistorySubNavLink {
  href: string;
  isPlaceholder?: boolean;
  label: string;
  to?: string;
}
