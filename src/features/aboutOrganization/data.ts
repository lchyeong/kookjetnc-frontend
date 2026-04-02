import heroBackgroundSrc from '@/assets/images/news/background.jpg';
import { routePaths } from '@/routes/routeRegistry';

import type {
  OrganizationCapabilityNode,
  OrganizationGroup,
  OrganizationHeroContent,
  OrganizationSubNavLink,
} from './types';

const ORGANIZATION_MENU_PLACEHOLDER_HREF = '#';
const ABOUT_SECTION_SNAPSHOT_BASE = '/reference/haatz-history/2026-03-31';

const aboutSectionAsset = (path: string) => {
  return `${ABOUT_SECTION_SNAPSHOT_BASE}${path}`;
};

const createOrganizationPlaceholderLink = (label: string): OrganizationSubNavLink => {
  return {
    href: ORGANIZATION_MENU_PLACEHOLDER_HREF,
    isPlaceholder: true,
    label,
  };
};

const createOrganizationInternalLink = (to: string, label: string): OrganizationSubNavLink => {
  return {
    href: to,
    label,
    to,
  };
};

export const organizationHeroContent: OrganizationHeroContent = {
  backgroundAlt: '국제티엔씨 조직도 페이지 상단 비주얼',
  backgroundSrc: heroBackgroundSrc,
  description: '기술 노하우와 다양한 경험을 보유한 전문인력으로 조직을 운영합니다.',
  eyebrow: '조직도',
  title: '전문 기술인력이 유기적으로 연결된 국제티엔씨의 조직 구조',
};

export const organizationOverviewBackgroundSrc = aboutSectionAsset('/background/history1-bg.jpg');

export const organizationSecondarySubNavLinks: OrganizationSubNavLink[] = [
  createOrganizationPlaceholderLink('CEO인사말'),
  createOrganizationInternalLink(routePaths.aboutHistory, '경영이념·연혁'),
  createOrganizationInternalLink(routePaths.aboutCertification, '인증·특허'),
  createOrganizationInternalLink(routePaths.aboutOrganization, '조직도'),
  createOrganizationPlaceholderLink('사업장 위치'),
];

export const organizationGroups: OrganizationGroup[] = [
  {
    id: 'mechanical-equipment',
    label: '기계설비',
    teams: [
      {
        id: 'solution-sales',
        items: ['냉난방기', '공조 설비', 'ESCO 제안'],
        title: '솔루션 영업팀',
      },
      {
        id: 'facility-construction',
        items: ['설비 공사', '유지 보수', 'ESCO 공사'],
        title: '설비 공사팀',
      },
    ],
  },
  {
    id: 'refrigeration-equipment',
    label: '냉동냉장설비',
    teams: [
      {
        id: 'esco-business',
        items: ['CO₂ 장비', '인버터 냉동기', '시스템 에어컨'],
        title: 'ESCO 사업팀',
      },
      {
        id: 'technical-sales',
        items: ['군트너 쿨러', '콘덴싱 유니트', '쇼케이스'],
        title: '기술 영업팀',
      },
      {
        id: 'technical-construction',
        items: ['ESCO 공사', '냉설비 공사', '사전점검 · AS'],
        title: '기술 공사팀',
      },
    ],
  },
  {
    id: 'management-support',
    label: '경영지원',
    teams: [
      {
        id: 'management-support-team',
        items: ['경리', '인사', '수입', '회계', '총무', '마케팅'],
        title: '경영관리팀',
      },
    ],
  },
];

export const organizationCapabilityLead =
  '기계설비 분야에서 기술 컨설팅, 설계 및 시공, 유지 보수 역량을 보유한 전문 기술인력이 공종별 78개 파트너사와 협업하여 최적의 솔루션을 제공합니다.';

export const organizationCapabilityNodes: OrganizationCapabilityNode[] = [
  {
    descriptions: ['기술 컨설팅', '신기술 제안', '전사적 지원'],
    id: 'executives',
    label: '임원',
    value: '5명',
  },
  {
    descriptions: ['전문 기술 지원', '프로젝트 통합 관리', '현장 지원관리'],
    id: 'leaders',
    label: '조직 리더',
    value: '6명',
  },
  {
    descriptions: ['현장 설비 진단', '기술 설계, 시공 감리', '품질/공정 관리'],
    id: 'members',
    label: '조직원',
    value: '18명',
  },
  {
    descriptions: ['공종별 장비 공급', '현장 시공', '유지 보수 서비스 수행'],
    id: 'partners',
    label: '파트너사',
    value: '78개사',
  },
];
