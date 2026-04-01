export interface HaatzLink {
  href: string;
  isPlaceholder?: boolean;
  label: string;
  target?: '_blank';
  to?: string;
}

export interface HaatzNestedLink extends HaatzLink {
  children?: HaatzLink[];
}

export interface HeaderMenuGroup extends HaatzLink {
  description: string;
  descriptionTitle: string;
  hoverItems: HaatzLink[];
  id: string;
  items: HaatzNestedLink[];
}

export interface HeroSlide {
  description?: string;
  id: string;
  mediaAlt: string;
  mediaSrc: string;
  mediaType: 'image' | 'video';
  title: string;
}

export interface LifestyleCategory extends HaatzLink {
  description: string;
  id: string;
  imageSrc: string;
  title: string;
  titleEn: string;
}

export interface HiwinSystemSlide {
  activeLabel: string;
  description: string;
  desktopImageSrc: string;
  href: string;
  id: string;
  isPlaceholder?: boolean;
  mobileImageSrc: string;
  target?: '_blank';
  tabLabel: string;
  title: string;
}

export interface ServiceCard {
  description: string;
  href: string;
  id: string;
  imageSrc?: string;
  target?: '_blank';
  title: string;
  variant: 'feature' | 'primary' | 'secondary';
}

export interface ProductCard {
  description: string;
  href: string;
  id: string;
  imageAlt: string;
  imageSrc: string;
  label?: string;
  target?: '_blank';
  title: string;
}

export interface NewsCard {
  date: string;
  description: string;
  href: string;
  id: string;
  imageAlt: string;
  imageObjectPosition?: string;
  imageSrc: string;
  label?: string;
  target?: '_blank';
  title: string;
}

export interface FooterInfoItem {
  label: string;
  value: string;
}

export interface QuickLink extends HaatzLink {
  id: string;
  imageAlt: string;
  imageSrc: string;
  lines: string[];
}

export interface PartnerLogoItem {
  alt: string;
  id: string;
  name: string;
  src: string;
}

export interface BusinessInquiryPrivacyPolicySection {
  id: string;
  items?: string[];
  paragraphs?: string[];
  title: string;
}

export interface BusinessInquiryPrivacyPolicy {
  effectiveDate: string;
  intro: string[];
  sections: BusinessInquiryPrivacyPolicySection[];
  title: string;
}

export interface NoticePopup {
  cta: HaatzLink;
  id: string;
  imageAlt: string;
  imageSrc: string;
  storageKey: string;
}
