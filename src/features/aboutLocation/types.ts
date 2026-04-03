export interface LocationHeroContent {
  backgroundAlt: string;
  backgroundSrc: string;
  description: string;
  eyebrow: string;
  title: string;
}

export interface LocationSubNavLink {
  href: string;
  isPlaceholder?: boolean;
  label: string;
  to?: string;
}

export interface LocationOfficeLocation {
  addressLine1: string;
  addressLine2: string;
  mapQuery: string;
  visitSummary: string;
}

export interface LocationInfoItem {
  description: string;
  id: string;
  title: string;
}

export interface LocationInfoGroup {
  id: string;
  items: LocationInfoItem[];
  label: string;
}
