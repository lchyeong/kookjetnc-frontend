export interface GreetingHeroContent {
  backgroundAlt: string;
  backgroundSrc: string;
  description: string;
  eyebrow: string;
  title: string;
}

export interface GreetingSubNavLink {
  href: string;
  isPlaceholder?: boolean;
  label: string;
  to?: string;
}

export interface GreetingMessageContent {
  companyLabel: string;
  paragraphs: string[];
  portraitAlt: string;
  portraitSrc: string;
  sectionEyebrow: string;
  signatureAlt: string;
  signatureSrc: string;
  title: string;
}
