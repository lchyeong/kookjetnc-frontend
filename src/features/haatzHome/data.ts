import callIcon from '@/assets/icons/icon_call.svg';
import kakaoIcon from '@/assets/icons/icon_kakao.svg';
import locationIcon from '@/assets/icons/icon_location.svg';
import hiwinSystemImage01 from '@/assets/images/1번이미지.jpg';
import hiwinSystemImage02 from '@/assets/images/2번이미지.jpg';
import hiwinSystemImage03 from '@/assets/images/3번이미지.jpg';
import hiwinSystemImage04 from '@/assets/images/4번이미지.jpg';
import mediaCoverageBackgroundImage from '@/assets/images/news/background.jpg';
import newsImage1 from '@/assets/images/news/news_image1.jpg';
import newsImage2 from '@/assets/images/news/news_image2.jpg';
import newsImage3 from '@/assets/images/news/news_image3.png';
import newsImage4 from '@/assets/images/news/news_image4.webp';
import newsImage5 from '@/assets/images/news/news_image5.jpg';
import productImage01 from '@/assets/images/products/1.직결팬.png';
import productImage10 from '@/assets/images/products/10.유니트쿨러.png';
import productImage11 from '@/assets/images/products/11.패널시스템.png';
import productImage12 from '@/assets/images/products/12.워크인.png';
import productImage13 from '@/assets/images/products/13.와인쇼케이스.png';
import productImage14 from '@/assets/images/products/14.곤도라.png';
import productImage02 from '@/assets/images/products/2.냉각수펌프인버터.png';
import productImage03 from '@/assets/images/products/3.문달기.png';
import productImage04 from '@/assets/images/products/4.시스템에어컨.png';
import productImage05 from '@/assets/images/products/5.스탠드에어컨.png';
import productImage06 from '@/assets/images/products/6.콜드체인.png';
import productImage07 from '@/assets/images/products/7.오픈다단.png';
import productImage08 from '@/assets/images/products/8.리치인.png';
import productImage09 from '@/assets/images/products/9.평대.png';
import popupExampleImage from '@/assets/images/팝업예시.png';
import heroVideo1Source from '@/assets/videos/video_hero1.mp4';
import heroVideo2Source from '@/assets/videos/video_hero2.mp4';
import heroVideo3Source from '@/assets/videos/video_hero3.mp4';
import { catalogCategories } from '@/features/catalog/data';
import type {
  BusinessInquiryPrivacyPolicy,
  FooterInfoItem,
  HeaderMenuGroup,
  HeroSlide,
  HaatzLink,
  HiwinSystemSlide,
  LifestyleCategory,
  NewsCard,
  NoticePopup,
  PartnerLogoItem,
  ProductCard,
  QuickLink,
  ServiceCard,
} from '@/features/haatzHome/types';
import { routePaths, type CatalogCategorySlug } from '@/routes/routeRegistry';

const SNAPSHOT_BASE = '/reference/haatz-home/2026-03-23';
const HAATZ_BASE = 'https://www.haatz.com';
const KOR_BASE = `${HAATZ_BASE}/kor`;
const ENG_BASE = `${HAATZ_BASE}/eng`;
const partnerLogoModules = import.meta.glob<string>(
  '/src/assets/partners/*.{png,jpg,jpeg,webp,svg}',
  {
    eager: true,
    import: 'default',
  },
);

const snapshotAsset = (path: string) => {
  return `${SNAPSHOT_BASE}${path}`;
};

const korHref = (path: string) => {
  return `${KOR_BASE}${path}`;
};

const MENU_PLACEHOLDER_HREF = '#';

const createPlaceholderLink = (label = '준비 중입니다') => {
  return {
    href: MENU_PLACEHOLDER_HREF,
    isPlaceholder: true,
    label,
  } satisfies HaatzLink;
};

const createPlaceholderLinks = (labels: string[]) => {
  return labels.map((label) => createPlaceholderLink(label));
};

const createInternalLink = (to: string, label: string) => {
  return {
    href: to,
    label,
    to,
  } satisfies HaatzLink;
};

const getAssetNameFromPath = (path: string) => {
  return (
    path
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '') ?? path
  );
};

const createCatalogMenuLinks = (categorySlug: CatalogCategorySlug) => {
  return catalogCategories[categorySlug].tabs
    .filter((tab) => tab.id !== 'all')
    .map((tab) => {
      const to = routePaths.catalogCategory(categorySlug);

      return createInternalLink(to, tab.label);
    });
};

const companyPlaceholderLinks = createPlaceholderLinks([
  'CEO인사말',
  '인증·특허',
  '조직도',
  '사업장 위치',
]);
const energySolutionLinks = createCatalogMenuLinks('energy-solution');
const mechanicalHvacLinks = createCatalogMenuLinks('mechanical-hvac');
const refrigerationSystemLinks = createCatalogMenuLinks('refrigeration-system');
const companyLinksWithHistoryRoute = [
  companyPlaceholderLinks[0],
  {
    href: routePaths.aboutHistory,
    label: '경영이념·연혁',
    to: routePaths.aboutHistory,
  },
  {
    href: routePaths.aboutCertification,
    label: '인증·특허',
    to: routePaths.aboutCertification,
  },
  {
    href: routePaths.aboutOrganization,
    label: '조직도',
    to: routePaths.aboutOrganization,
  },
  companyPlaceholderLinks[3],
];

export const headerMenuGroups: HeaderMenuGroup[] = [
  {
    id: 'company',
    isPlaceholder: true,
    label: '회사소개',
    href: MENU_PLACEHOLDER_HREF,
    descriptionTitle: '회사소개',
    description: '기업 개요와 주요 정보를\n새 분류 체계에 맞춰\n정리하고 있습니다.',
    hoverItems: companyLinksWithHistoryRoute,
    items: companyLinksWithHistoryRoute,
  },
  {
    id: 'energy-solution',
    label: '에너지솔루션',
    href: routePaths.energySolution,
    to: routePaths.energySolution,
    descriptionTitle: '에너지솔루션',
    description: '에너지 효율과 운영 최적화에\n맞춘 솔루션 정보를\n준비하고 있습니다.',
    hoverItems: energySolutionLinks,
    items: energySolutionLinks,
  },
  {
    id: 'mechanical-hvac',
    label: '기계·공조설비',
    href: routePaths.mechanicalHvac,
    to: routePaths.mechanicalHvac,
    descriptionTitle: '기계·공조설비',
    description: '기계·공조설비 관련 정보를\n새로운 메뉴 구조에 맞춰\n정리하고 있습니다.',
    hoverItems: mechanicalHvacLinks,
    items: mechanicalHvacLinks,
  },
  {
    id: 'refrigeration-system',
    label: '냉장·냉동시스템',
    href: routePaths.refrigerationSystem,
    to: routePaths.refrigerationSystem,
    descriptionTitle: '냉장·냉동시스템',
    description: '냉장·냉동시스템 카테고리의\n세부 콘텐츠를\n준비하고 있습니다.',
    hoverItems: refrigerationSystemLinks,
    items: refrigerationSystemLinks,
  },
  {
    id: 'performance-info-support',
    isPlaceholder: true,
    label: '실적·정보지원',
    href: MENU_PLACEHOLDER_HREF,
    descriptionTitle: '실적·정보지원',
    description: '실적 자료와 정보지원 메뉴를\n새 분류 기준으로\n정리하고 있습니다.',
    hoverItems: createPlaceholderLinks([
      '시공사례',
      '공사실적',
      '기술자료',
      '웹카탈로그',
      '홍보영상',
    ]),
    items: createPlaceholderLinks(['시공사례', '공사실적', '기술자료', '웹카탈로그', '홍보영상']),
  },
];

export const languageLinks: HaatzLink[] = [
  { href: korHref('/main/main.html'), label: 'KOR' },
  { href: `${ENG_BASE}/main/main.html`, label: 'ENG' },
];

export const familySiteLinks: HaatzLink[] = [
  { href: 'https://www.haatzmall.com', label: '하츠몰', target: '_blank' },
  { href: 'http://www.byucksan.com', label: '벽산', target: '_blank' },
  { href: 'https://www.byucksanpaint.com', label: '벽산페인트', target: '_blank' },
];

export const footerPolicyLinks: HaatzLink[] = [
  { href: korHref('/pop/term-popup.html'), label: '이용약관' },
  { href: korHref('/pop/privacy-popup.html'), label: '개인정보처리방침' },
  { href: korHref('/pop/email-popup.html'), label: '이메일무단수집거부' },
];

export const heroVideoSequence = [heroVideo1Source, heroVideo2Source, heroVideo3Source] as const;

export const heroSlides: HeroSlide[] = [
  {
    id: 'hero-video',
    mediaType: 'video',
    mediaSrc: heroVideoSequence[0],
    mediaAlt: '오랜 노하우와 앞선 기술로 삶의 공간을 디자인하는 하츠 메인 비주얼',
    title: '오랜 노하우와 앞선 기술로\n하츠는 주방을 넘어\n삶의 공간을 디자인합니다.',
  },
  {
    id: 'hero-image',
    mediaType: 'image',
    mediaSrc: snapshotAsset('/upload/banner/202512/1767141339_m0145653_20251231093539.jpg'),
    mediaAlt: '공간을 넘어 삶의 가치를 디자인하는 하츠 메인 이미지',
    title: '공간을 넘어, 삶의 가치를 디자인하다.',
    description:
      '30년의 노하우로, 주방을 넘어 공기와 생활 전반까지, 하츠가 당신의 공간을 완성합니다.',
  },
];

export const hiwinSystemSlides: HiwinSystemSlide[] = [
  {
    id: 'mechanical-engineering',
    activeLabel: 'Mechanical Engineering',
    tabLabel: 'Mechanical Engineering',
    title: '기계설비 종합 엔지니어링',
    description:
      '축적된 기술 역량으로 공정 조건과 현장 환경을 정밀 반영한\n기계설비의 컨설팅·정밀 설계·책임 시공을 안정적으로 수행합니다',
    href: MENU_PLACEHOLDER_HREF,
    desktopImageSrc: hiwinSystemImage01,
    isPlaceholder: true,
    mobileImageSrc: hiwinSystemImage01,
  },
  {
    id: 'hvac-system',
    activeLabel: 'HVAC Engineering',
    tabLabel: 'HVAC Engineering',
    title: '공조설비 시스템 엔지니어링',
    description:
      '열부하와 운전 조건을 정밀 분석한 최적의 GHP·EHP 시스템으로\n공조설비의 기술 컨설팅·정밀 설계·책임 시공을 수행합니다',
    href: MENU_PLACEHOLDER_HREF,
    desktopImageSrc: hiwinSystemImage02,
    isPlaceholder: true,
    mobileImageSrc: hiwinSystemImage02,
  },
  {
    id: 'energy-saving',
    activeLabel: 'Energy Optimization',
    tabLabel: 'Energy Optimization',
    title: '에너지 최적화 솔루션',
    description:
      '현장 운전 특성에 최적화된 Fan·Pump 인버터 제어 기술로\n전력 소비 절감과 설비 효율 고도화를 동시에 구현합니다',
    href: MENU_PLACEHOLDER_HREF,
    desktopImageSrc: hiwinSystemImage03,
    isPlaceholder: true,
    mobileImageSrc: hiwinSystemImage03,
  },
  {
    id: 'fire-prevention',
    activeLabel: 'Fire Safety System',
    tabLabel: 'Fire Safety System',
    title: '화재예방 안전 솔루션',
    description:
      '화재 위험 신호를 실시간 모니터링하는 경보 알림 시스템으로\n사전 예방형 안전관리 체계와 신속한 대응 환경을 구축합니다',
    href: MENU_PLACEHOLDER_HREF,
    desktopImageSrc: hiwinSystemImage04,
    isPlaceholder: true,
    mobileImageSrc: hiwinSystemImage04,
  },
];

export const lifestyleCategories: LifestyleCategory[] = [
  {
    id: 'kitchen',
    href: korHref('/product/kitchen_list.html'),
    label: '빌트인 주방가전',
    title: '빌트인 주방가전',
    titleEn: 'Built-in Kitchen Appliances',
    description: '세련된 디자인과 정교한 기술력으로 주방의 새로운 기준을 제시합니다.',
    imageSrc: snapshotAsset('/assets/images/main/main2-2.jpg'),
  },
  {
    id: 'air',
    href: korHref('/product/airappliances_list.html'),
    label: '환기·공기질 솔루션',
    title: '환기·공기질 솔루션',
    titleEn: 'Ventilation & Air Quality Solutions',
    description: '효율적인 환기와 정교한 공기 제어로, 조용하고 깨끗한 생활환경을 실현합니다.',
    imageSrc: snapshotAsset('/assets/images/main/main2-3.jpg'),
  },
  {
    id: 'bath',
    href: korHref('/product/haatzbath_list.html'),
    label: '욕실 솔루션',
    title: '욕실 솔루션',
    titleEn: 'Bathroom Solutions',
    description:
      '감각적인 디자인과 섬세한 기능이 어우러져, 욕실을 단순한 공간이 아닌 나만의 안식처로 바꿉니다.',
    imageSrc: snapshotAsset('/assets/images/main/main2-4.jpg'),
  },
  {
    id: 'lifestyle',
    href: korHref('/product/expendables_list.html'),
    label: '생활 소형가전',
    title: '생활 소형가전',
    titleEn: 'Home & Lifestyle Appliances',
    description:
      '일상에 영감을 더하는 디자인과 실용성으로, 더 편리하고 여유로운 라이프를 제안합니다.',
    imageSrc: snapshotAsset('/assets/images/main/main2-5.jpg'),
  },
];

export const lifestyleDefaultImage = snapshotAsset('/assets/images/main/main2-1.jpg');

export const serviceCards: ServiceCard[] = [
  {
    id: 'find-haatz',
    href: korHref('/product/find_haatz.html'),
    title: '나에게 꼭 맞는\n하츠 제품은?',
    description: '공간과 라이프스타일에 맞춘 최적의 하츠 솔루션!',
    imageSrc: snapshotAsset('/assets/images/main/main3-1.jpg'),
    variant: 'feature',
  },
  {
    id: 'as-service',
    href: korHref('/support/service__1.html'),
    title: 'A/S 신청 및 확인',
    description: '간편하게 접수하고, 진행상황까지 한눈에 확인하세요.',
    imageSrc: snapshotAsset('/assets/images/main/main3-2.png'),
    variant: 'primary',
  },
  {
    id: 'dealer',
    href: korHref('/support/buy.html'),
    title: '전국 대리점 찾기',
    description: '가까운 대리점을 쉽고 빠르게 확인하세요.',
    imageSrc: snapshotAsset('/assets/images/main/main3-3.png'),
    variant: 'secondary',
  },
  {
    id: 'faq',
    href: korHref('/support/faq.html'),
    title: '자주 묻는 질문',
    description: '고객님들이 가장 많이 찾는 답변을 한곳에 모았습니다.',
    imageSrc: snapshotAsset('/assets/images/main/main3-4.png'),
    variant: 'secondary',
  },
  {
    id: 'manual',
    href: korHref('/support/manuals.html'),
    title: '사용 설명서',
    description: '제품 사용을 쉽고 정확하게 안내해드립니다.',
    imageSrc: snapshotAsset('/assets/images/main/main3-5.png'),
    variant: 'secondary',
  },
];

export const productCards: ProductCard[] = [
  {
    id: 'direct-fan',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage01,
    imageAlt: '직결팬 장비 이미지',
    title: '직결팬',
    description: '공조 및 환기 시스템에 안정적으로 적용할 수 있는 직결 구동형 팬 장비입니다.',
  },
  {
    id: 'cooling-water-pump-inverter',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage02,
    imageAlt: '냉각수 펌프 인버터 장비 이미지',
    title: '냉각수 펌프 인버터',
    description: '유량 제어와 에너지 효율 운전을 함께 고려한 냉각수 펌프 인버터 솔루션입니다.',
  },
  {
    id: 'door-system',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage03,
    imageAlt: '문달기 장비 이미지',
    title: '문달기',
    description: '냉장·냉동 공간의 단열 성능과 운영 편의성을 높이는 도어 시스템입니다.',
  },
  {
    id: 'system-air-conditioner',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage04,
    imageAlt: '시스템에어컨 장비 이미지',
    title: '시스템에어컨',
    description: '공간 특성에 맞춘 냉난방 환경을 구현하는 시스템 에어컨 설비입니다.',
  },
  {
    id: 'stand-air-conditioner',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage05,
    imageAlt: '스탠드에어컨 장비 이미지',
    title: '스탠드에어컨',
    description: '독립적인 공간 제어가 필요한 현장에 적합한 스탠드형 공조 장비입니다.',
  },
  {
    id: 'cold-chain',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage06,
    imageAlt: '콜드체인 장비 이미지',
    title: '콜드체인',
    description: '신선도 유지와 저온 유통 품질 확보를 위한 콜드체인 설비입니다.',
  },
  {
    id: 'open-multideck',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage07,
    imageAlt: '오픈다단 장비 이미지',
    title: '오픈다단',
    description: '상품 접근성과 진열 효율을 높이는 오픈형 다단 쇼케이스입니다.',
  },
  {
    id: 'reach-in',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage08,
    imageAlt: '리치인 장비 이미지',
    title: '리치인',
    description: '매장 운영 환경에 맞춰 다양한 품목을 안정적으로 보관하는 리치인 쇼케이스입니다.',
  },
  {
    id: 'flat-deck',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage09,
    imageAlt: '평대 장비 이미지',
    title: '평대',
    description: '시인성과 동선을 고려해 상품 전시 효과를 높이는 평대형 쇼케이스입니다.',
  },
  {
    id: 'unit-cooler',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage10,
    imageAlt: '유니트쿨러 장비 이미지',
    title: '유니트쿨러',
    description: '저온 저장 공간의 온도 균일성과 냉각 성능을 지원하는 유니트쿨러입니다.',
  },
  {
    id: 'panel-system',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage11,
    imageAlt: '패널시스템 장비 이미지',
    title: '패널시스템',
    description: '냉장·냉동 및 특수 공간 시공에 활용되는 고효율 단열 패널 시스템입니다.',
  },
  {
    id: 'walk-in',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage12,
    imageAlt: '워크인 장비 이미지',
    title: '워크인',
    description: '대용량 보관과 현장 운영 효율을 고려한 워크인 냉장·냉동 시스템입니다.',
  },
  {
    id: 'wine-showcase',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage13,
    imageAlt: '와인쇼케이스 장비 이미지',
    title: '와인쇼케이스',
    description: '보관 조건과 디스플레이 품질을 함께 고려한 와인 전용 쇼케이스입니다.',
  },
  {
    id: 'gondola',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: productImage14,
    imageAlt: '곤도라 장비 이미지',
    title: '곤도라',
    description: '매장 레이아웃 구성과 상품 진열 확장에 유리한 곤도라 타입 진열 설비입니다.',
  },
];

export const newsCards: NewsCard[] = [
  {
    id: 'media-1',
    href: 'https://www.coldchainnews.kr/news/article.html?no=27790',
    imageSrc: newsImage1,
    imageAlt: '국제티엔씨 CO2 냉동·냉장 시스템 기사 이미지',
    target: '_blank',
    title: '[쇼케이스 선도기업] 국제티엔씨',
    description:
      '국제티엔씨가 CO2 냉동·냉장 시스템과 고효율 에어쿨러를 중심으로 친환경 냉동·냉장 토털솔루션 경쟁력을 소개한 기획 기사입니다.',
    date: '2025.09.02',
  },
  {
    id: 'media-2',
    href: 'https://www.kyeonggi.com/article/20250929580341',
    imageSrc: newsImage2,
    imageAlt: '국제티엔씨 친환경 에너지 절감 기사 이미지',
    target: '_blank',
    title:
      '㈜국제티엔씨, 냉동·공조 토털 솔루션·친환경 에너지 절감 앞장 [경기도 혁신의 중심, 유망중소기업]',
    description:
      '25년간 축적한 냉동·냉장 설계·시공 역량과 공조 분야 확장을 바탕으로 친환경 에너지 절감 토털솔루션 기업으로 성장한 배경을 다룬 기사입니다.',
    date: '2025.10.01',
  },
  {
    id: 'media-3',
    href: 'https://www.handmk.com/news/articleView.html?idxno=32497',
    imageSrc: newsImage3,
    imageAlt: '국제티엔씨 김기백 대표 인터뷰 기사 이미지',
    target: '_blank',
    title: '냉동·냉장 시스템의 진화, 지속가능한 미래를 열다 - 국제티엔씨 김기백 대표',
    description:
      '김기백 대표 인터뷰를 통해 국제티엔씨의 품질 중심 경영, 자연냉매 CO2 시스템 도입, 냉동·공조 분야 확장 전략을 조명한 기사입니다.',
    date: '2025.09.03',
  },
  {
    id: 'media-4',
    href: 'https://kangso.co.kr/View.aspx?No=3770299',
    imageSrc: newsImage4,
    imageAlt: '국제티엔씨 김기백 대표 강소기업뉴스 인터뷰 이미지',
    target: '_blank',
    title: '[인터뷰] 냉동·냉장 시스템의 진화, 지속가능한 미래를 열다 - 국제티엔씨 김기백 대표',
    description:
      '대형마트 냉동·공조 시공 경험과 자연냉매 CO2 시스템 도입, 엔지니어링 전문 인력 육성 방향을 중심으로 국제티엔씨의 성장 전략을 다룬 인터뷰 기사입니다.',
    date: '2025.09.04',
  },
  {
    id: 'media-5',
    href: 'https://www.kharn.kr/news/article.html?no=30198',
    imageSrc: newsImage5,
    imageAlt: '국제티엔씨 김연수 상무 전시회 인터뷰 기사 이미지',
    imageObjectPosition: '50% 26%',
    target: '_blank',
    title: '[日 HVAC&R에서 만난 사람들] 김연수 국제티엔씨 상무',
    description:
      '자연냉매 전환과 데이터 기반 에너지 절감, 현장 맞춤형 시스템 최적화를 국제티엔씨의 핵심 경쟁력으로 소개한 전시회 인터뷰 기사입니다.',
    date: '2026.02.28',
  },
];

export const footerInfoItems: FooterInfoItem[] = [
  { label: '상호', value: '㈜국제티엔씨' },
  { label: '대표자', value: '김기백' },
  { label: '주소', value: '경기도 남양주시 다산순환로 20, 현대프리미어캠퍼스 AA동 926~928호' },
  { label: 'TEL', value: '1661-8860' },
  { label: 'FAX', value: '031-551-2253' },
  { label: 'E-MAIL', value: 'kjtnc@kookje2001.com' },
  { label: '사업자등록번호', value: '132-81-86022' },
];

const inquiryPhoneValue =
  footerInfoItems.find((item) => item.label === 'TEL')?.value.match(/\d{2,4}-\d{3,4}-\d{4}/)?.[0] ??
  '1661-8860';
const inquiryEmailValue =
  footerInfoItems.find((item) => item.label === 'E-MAIL')?.value ?? 'kjtnc@kookje2001.com';
const inquiryAddressValue =
  footerInfoItems.find((item) => item.label === '주소')?.value ??
  '경기도 남양주시 다산순환로 20, 현대프리미어캠퍼스 AA동 926~928호';

export const partnerLogos: PartnerLogoItem[] = Object.entries(partnerLogoModules)
  .map(([path, src]) => {
    const name = getAssetNameFromPath(path);

    return {
      alt: `${name} 로고`,
      id: name,
      name,
      src,
    } satisfies PartnerLogoItem;
  })
  .sort((firstLogo, secondLogo) => firstLogo.name.localeCompare(secondLogo.name, 'ko'));

export const businessInquirySectionContent = {
  description:
    '유통, 물류, 호텔 등 다양한 산업 군의 고객사와 협력적 파트너십 관계를 구축하고 있습니다.',
  eyebrow: 'Business Inquiry',
  infoDescription: '냉장·냉동, 기계·공조설비, 에너지솔루션 문의를 간단히 접수할 수 있습니다.',
  infoTitle: '필요한 내용만 남겨주시면 됩니다.',
  marketingNotice:
    '신규 서비스, 이벤트, 뉴스레터 등 마케팅 정보를 받아보실 수 있으며, 동의하지 않아도 문의 접수에는 제한이 없습니다.',
  privacyModalTitle: '개인정보처리방침',
  privacyNotice:
    '문의 접수를 위해 회사명, 담당자명, 연락처, 이메일, 문의 내용을 수집·이용합니다. 수집된 정보는 문의 응대와 회신을 위해 사용되며, 내부 기준과 관련 법령에 따라 보관됩니다. 필수 동의를 거부하실 경우 문의 접수가 제한될 수 있습니다.',
  resetLabel: '다시 작성하기',
  responsePromise: '영업일 기준 24시간 내 1차 회신',
  successDescription: '영업일 기준 24시간 내 1차 회신드리겠습니다.',
  successTitle: '문의가 접수되었습니다',
  submitLabel: '문의 접수하기',
  title: '국제티엔씨 사업 문의',
} as const;

export const businessInquiryPrivacyPolicy: BusinessInquiryPrivacyPolicy = {
  effectiveDate: '2018년 1월 2일',
  intro: [
    '회사는 개인정보 보호 관련 법령을 준수하며, 문의 접수와 상담 과정에서 수집되는 개인정보를 안전하게 관리하기 위해 개인정보처리방침을 운영합니다.',
    '개인정보를 수집, 이용, 제공하는 경우에는 사전에 내용을 안내하고 동의 절차를 거치며, 동의를 거부하는 경우 서비스의 전부 또는 일부 이용이 제한될 수 있습니다.',
  ],
  sections: [
    {
      id: 'collection',
      items: [
        '서비스 이용 시 수집 항목: 이름, 이메일 주소, 연락처, 주소',
        '수집 방법: 홈페이지를 통한 정보 입력, 로그 분석 프로그램을 통한 자동 로그 수집',
      ],
      paragraphs: [
        '회사는 제공받은 정보가 어떤 용도와 방식으로 이용되는지, 그리고 보호를 위해 어떤 조치를 취하고 있는지 투명하게 안내합니다.',
      ],
      title: '1. 수집하는 개인정보의 항목 및 수집방법',
    },
    {
      id: 'purpose',
      items: [
        '고지사항 전달, 불만 처리, A/S 등 원활한 의사소통 경로 확보',
        '신규 서비스 개발, 이용 통계 분석, 이벤트 및 광고성 정보 전달 등 마케팅 활용',
      ],
      paragraphs: ['회사는 수집한 개인정보를 다음 목적 범위 안에서만 활용합니다.'],
      title: '2. 개인정보 수집 및 이용 목적',
    },
    {
      id: 'retention',
      items: [
        '일반 보유 기간: 서비스 이용 목적 종료 시까지',
        '계약 또는 청약철회 등에 관한 기록: 5년',
        '대금 결제 및 재화 등의 공급에 관한 기록: 5년',
        '소비자 불만에 관한 기록: 3년',
        '분쟁 처리에 관한 기록: 10년',
      ],
      paragraphs: [
        '개인정보는 목적이 종료되면 지체 없이 파기하며, 법령 또는 별도 고지에 따라 보존이 필요한 경우에는 해당 기간 동안 보관합니다.',
      ],
      title: '3. 수집한 개인정보의 보유 및 이용기간',
    },
    {
      id: 'destruction',
      items: [
        '파기 절차: 목적 달성 후 내부 방침 및 관련 법령에 따라 일정 기간 저장한 뒤 파기',
        '파기 방법: 종이 문서는 분쇄 또는 소각, 전자 파일은 복구할 수 없는 방식으로 삭제',
      ],
      title: '4. 개인정보의 파기',
    },
    {
      id: 'rights',
      items: ['개인정보 열람 및 정정 요구', '개인정보 수집, 이용, 제공에 대한 동의 철회'],
      paragraphs: [
        '이용자는 본인의 개인정보를 정확하고 최신 상태로 유지할 책임이 있으며, 허위 정보 입력으로 발생하는 문제에 대해서는 본인 책임이 따를 수 있습니다.',
        '권리 행사를 원할 경우 담당자에게 서면, 전화, 전자우편 등으로 요청할 수 있으며, 회사는 지체 없이 필요한 조치를 진행합니다.',
      ],
      title: '5. 이용자의 권리와 의무',
    },
    {
      id: 'cookie',
      items: [
        '접속 빈도, 방문 시간 등 이용 패턴 분석',
        '관심 분야 파악을 통한 서비스 개선 및 이벤트 운영 참고',
        '브라우저 설정을 통해 모든 쿠키 허용, 저장 시 확인, 저장 거부 선택 가능',
      ],
      paragraphs: [
        '회사는 페이지 뷰 현황 등 최소 범위의 정보에 한해 쿠키를 운영할 수 있으며, 그 외의 다른 정보는 수집하지 않습니다.',
      ],
      title: '6. 쿠키에 의한 개인정보 수집',
    },
    {
      id: 'protection',
      items: [
        'SSL 등 보안 장치를 통한 안전한 전송',
        '개인정보 접근 권한 최소화',
        '정기적인 개인정보 보호 교육',
        '개인정보와 일반 데이터 분리 보관',
        '전산실 및 자료 보관실 등 보호구역 출입 통제',
      ],
      paragraphs: [
        '회사는 개인정보의 분실, 도난, 유출, 변조, 훼손을 방지하기 위해 기술적·관리적 보호조치를 시행합니다.',
      ],
      title: '7. 개인정보 보호를 위한 기술적·관리적 보호조치',
    },
    {
      id: 'contact',
      items: [
        `개인정보 관련 문의 이메일: ${inquiryEmailValue}`,
        `개인정보 관련 문의 전화: ${inquiryPhoneValue}`,
        '개인정보침해신고센터: 118 / privacy.kisa.or.kr',
        '대검찰청 사이버수사과: 1301 / spo.go.kr',
        '경찰청 사이버안전국: 182 / ecrm.police.go.kr',
      ],
      paragraphs: [
        '개인정보와 관련한 문의나 불만 사항이 있을 경우 아래 연락처를 통해 문의할 수 있으며, 회사는 지체 없이 확인 후 조치합니다.',
      ],
      title: '8. 개인정보 관련 문의 및 민원 안내',
    },
  ],
  title: '개인정보처리방침',
};

export const businessInquiryCategoryOptions = [
  { label: '문의 분야를 선택해주세요', value: '' },
  { label: '냉장·냉동시스템', value: 'refrigeration-system' },
  { label: '기계·공조설비', value: 'mechanical-hvac' },
  { label: '에너지솔루션', value: 'energy-solution' },
  { label: '유지보수/서비스', value: 'service-maintenance' },
  { label: '기타', value: 'other' },
] as const;

export const businessInquiryContactItems = [
  {
    description: '대표 문의 전화를 통해 사업 상담 접수가 가능합니다.',
    href: `tel:${inquiryPhoneValue.replace(/-/g, '')}`,
    id: 'phone',
    label: '대표번호',
    value: inquiryPhoneValue,
  },
  {
    description: '대표 문의 메일로 자료 전달과 사업 상담을 이어갈 수 있습니다.',
    href: `mailto:${inquiryEmailValue}`,
    id: 'email',
    label: '문의 메일',
    value: inquiryEmailValue,
  },
  {
    description: '현장 미팅과 사업 협의 시 참고할 수 있는 사업장 주소입니다.',
    href: '#',
    id: 'address',
    label: '사업장',
    value: inquiryAddressValue,
  },
] as const;

export const businessInquiryPrivacyLink =
  footerPolicyLinks.find((item) => item.label === '개인정보처리방침')?.href ?? '#';

export const socialLinks = [
  {
    href: 'https://www.instagram.com/haatz_official',
    label: 'Instagram',
    iconSrc: snapshotAsset('/assets/images/main/icon-instargram.png'),
    target: '_blank' as const,
  },
  {
    href: 'https://blog.naver.com/haatz_official',
    label: 'Blog',
    iconSrc: snapshotAsset('/assets/images/main/icon-blog.png'),
    target: '_blank' as const,
  },
  {
    href: 'https://www.youtube.com/@_haatz',
    label: 'YouTube',
    iconSrc: snapshotAsset('/assets/images/main/icon-youtube.png'),
    target: '_blank' as const,
  },
] as const;

export const quickLinks: QuickLink[] = [
  {
    id: 'call',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: callIcon,
    imageAlt: 'A/S 신청 아이콘',
    isPlaceholder: true,
    label: 'A/S 신청',
    lines: ['A/S 신청'],
  },
  {
    id: 'kakao',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: kakaoIcon,
    imageAlt: '카카오톡 아이콘',
    isPlaceholder: true,
    label: '카카오톡',
    lines: ['카카오톡'],
  },
  {
    id: 'location',
    href: MENU_PLACEHOLDER_HREF,
    imageSrc: locationIcon,
    imageAlt: '위치안내 아이콘',
    isPlaceholder: true,
    label: '위치안내',
    lines: ['위치안내'],
  },
];

export const noticePopup: NoticePopup = {
  id: 'haatz-main-notice',
  storageKey: 'haatz-home.notice-hidden-until',
  imageSrc: popupExampleImage,
  imageAlt: '제 38기 주주총회 소집공고 팝업 이미지',
  cta: {
    href: korHref('/about/investor__7.html?bmain=view&uid=11&search=%26page%3D'),
    label: '제 38기 주주총회 소집공고',
    target: '_blank',
  },
};

export const heroWordImages = {
  first: snapshotAsset('/assets/images/main/main1-1.png'),
  second: snapshotAsset('/assets/images/main/main1-2.png'),
} as const;

export const headerAssets = {
  logo: '/logo_kookje.png',
  logoAlt: 'Kookje',
  menu: snapshotAsset('/assets/images/main/menu.png'),
} as const;

export const quickAssets = {
  cursor: snapshotAsset('/assets/images/main/cs-cursor.png'),
  sectionFiveBackground: mediaCoverageBackgroundImage,
  top: snapshotAsset('/assets/images/main/top.png'),
  heroPrev: snapshotAsset('/assets/images/main/main1-left.png'),
  heroNext: snapshotAsset('/assets/images/main/main1-right.png'),
} as const;
