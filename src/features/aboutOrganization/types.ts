export interface OrganizationHeroContent {
  backgroundAlt: string;
  backgroundSrc: string;
  description: string;
  eyebrow: string;
  title: string;
}

export interface OrganizationSubNavLink {
  href: string;
  isPlaceholder?: boolean;
  label: string;
  to?: string;
}

export interface OrganizationTeam {
  id: string;
  items: string[];
  title: string;
}

export interface OrganizationGroup {
  id: string;
  label: string;
  teams: OrganizationTeam[];
}

export interface OrganizationCapabilityNode {
  descriptions: string[];
  id: string;
  label: string;
  value: string;
}
