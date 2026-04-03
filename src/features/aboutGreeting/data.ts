import ceoSignatureSrc from '@/assets/images/aboutGreeting/sign.png';
import ceoPortraitSrc from '@/assets/images/aboutGreeting/tnc-ceo.jpg';
import heroBackgroundSrc from '@/assets/images/news/background.jpg';
import { routePaths } from '@/routes/routeRegistry';

import type { GreetingHeroContent, GreetingMessageContent, GreetingSubNavLink } from './types';

const ABOUT_SECTION_SNAPSHOT_BASE = '/reference/haatz-history/2026-03-31';

const aboutSectionAsset = (path: string) => {
  return `${ABOUT_SECTION_SNAPSHOT_BASE}${path}`;
};

const createGreetingInternalLink = (to: string, label: string): GreetingSubNavLink => {
  return {
    href: to,
    label,
    to,
  };
};

export const greetingHeroContent: GreetingHeroContent = {
  backgroundAlt: '국제티엔씨 CEO 인사말 페이지 상단 비주얼',
  backgroundSrc: heroBackgroundSrc,
  description: '',
  eyebrow: 'CEO인사말',
  title:
    '365일 신속한 대응과 끊임없는 신기술 연구를 통해\n고객의 가치를 창출하고자 노력하고 있습니다.',
};

export const greetingOverviewBackgroundSrc = aboutSectionAsset('/background/history1-bg.jpg');

export const greetingSecondarySubNavLinks: GreetingSubNavLink[] = [
  createGreetingInternalLink(routePaths.aboutGreeting, 'CEO인사말'),
  createGreetingInternalLink(routePaths.aboutHistory, '경영이념·연혁'),
  createGreetingInternalLink(routePaths.aboutCertification, '인증·특허'),
  createGreetingInternalLink(routePaths.aboutOrganization, '조직도'),
  createGreetingInternalLink(routePaths.aboutLocation, '사업장 위치'),
];

export const greetingMessageContent: GreetingMessageContent = {
  companyLabel: '㈜국제티엔씨 대표이사',
  paragraphs: [
    '(주)국제티엔씨는 2001년 축적된 경험과 실력을 갖춘 기술 인력을 중심으로 냉동 · 냉장 시스템 전문 기업으로 설립되었습니다.',
    '정확한 설계, 완벽한 시공, 철저한 유지관리로 최적의 통합 관리 시스템을 구축하는 한편, 기술 컨설팅, 위탁 교육, 정밀 진단에 이르기까지 고객을 위한 최상의 서비스를 제공하였으며, 유니트 쿨러 · 쇼케이스 수입 판매 등 외연을 확장하며 성장해 왔습니다.',
    '기술만큼은 최고라는 초심을 유지하며 향후 에너지 효율 향상, 관리 비용 절감을 목표로 선진 기술 도입과 혁신을 통해 한걸음 앞서 고객의 미래를 준비하고, 냉동 · 냉장 전문 기업으로서 환경적 책임을 다하기 위해 최선을 다하겠습니다.',
  ],
  portraitAlt: '(주)국제티엔씨 대표이사',
  portraitSrc: ceoPortraitSrc,
  sectionEyebrow: '대표 인사',
  signatureAlt: '대표이사 김기백',
  signatureSrc: ceoSignatureSrc,
  title: '국제티엔씨는 기술과 책임으로 고객의 미래를 준비합니다.',
};
