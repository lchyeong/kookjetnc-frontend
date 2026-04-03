import heroBackgroundSrc from '@/assets/images/news/background.jpg';
import { routePaths } from '@/routes/routeRegistry';

import type {
  LocationHeroContent,
  LocationInfoGroup,
  LocationOfficeLocation,
  LocationSubNavLink,
} from './types';

const ABOUT_SECTION_SNAPSHOT_BASE = '/reference/haatz-history/2026-03-31';
const aboutSectionAsset = (path: string) => {
  return `${ABOUT_SECTION_SNAPSHOT_BASE}${path}`;
};

const createLocationInternalLink = (to: string, label: string): LocationSubNavLink => {
  return {
    href: to,
    label,
    to,
  };
};

export const locationHeroContent: LocationHeroContent = {
  backgroundAlt: '국제티엔씨 사업장 위치 페이지 상단 비주얼',
  backgroundSrc: heroBackgroundSrc,
  description: '',
  eyebrow: '사업장 위치',
  title: '사업장 위치 안내',
};

export const locationSecondarySubNavLinks: LocationSubNavLink[] = [
  createLocationInternalLink(routePaths.aboutGreeting, 'CEO인사말'),
  createLocationInternalLink(routePaths.aboutHistory, '경영이념·연혁'),
  createLocationInternalLink(routePaths.aboutCertification, '인증·특허'),
  createLocationInternalLink(routePaths.aboutOrganization, '조직도'),
  createLocationInternalLink(routePaths.aboutLocation, '사업장 위치'),
];

export const locationOverviewBackgroundSrc = aboutSectionAsset('/background/history1-bg.jpg');

export const locationOfficeLocation: LocationOfficeLocation = {
  addressLine1: '경기도 남양주시 다산순환로 20,',
  addressLine2: '현대프리미어캠퍼스 AA동 926~928호',
  mapQuery: '경기도 남양주시 다산순환로 20',
  visitSummary: '도농역·다산역에서 도보 20분, 95번 버스 정류장 하차 후 도보 3분',
};

export const locationInfoGroups: LocationInfoGroup[] = [
  {
    id: 'subway',
    label: '지하철',
    items: [
      {
        description: '1번 출구 도보 20분',
        id: 'donong',
        title: '도농역(경의중앙선)',
      },
      {
        description: '1번 출구 도보 20분',
        id: 'dasan',
        title: '다산역(8호선)',
      },
    ],
  },
  {
    id: 'bus',
    label: '버스',
    items: [
      {
        description: '도농고앞 정류장 하차 후 도보 3분',
        id: 'bus-95',
        title: '95번',
      },
    ],
  },
];
