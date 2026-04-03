import { describe, expect, it } from 'vitest';

import {
  locationHeroContent,
  locationInfoGroups,
  locationOfficeLocation,
  locationSecondarySubNavLinks,
} from '@/features/aboutLocation/data';

describe('about location data', () => {
  it('exposes the hero copy and about navigation links', () => {
    expect(locationHeroContent.eyebrow).toBe('사업장 위치');
    expect(locationHeroContent.title).toBe('사업장 위치 안내');
    expect(locationHeroContent.description).toBe('');
    expect(locationSecondarySubNavLinks.map((link) => link.label)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(locationSecondarySubNavLinks[0]).toMatchObject({
      href: '/about/greeting',
      label: 'CEO인사말',
      to: '/about/greeting',
    });
    expect(locationSecondarySubNavLinks[4]).toMatchObject({
      href: '/about/location',
      label: '사업장 위치',
      to: '/about/location',
    });
  });

  it('exposes the office address and transit groups', () => {
    expect(locationOfficeLocation).toMatchObject({
      addressLine1: '경기도 남양주시 다산순환로 20,',
      addressLine2: '현대프리미어캠퍼스 AA동 926~928호',
      mapQuery: '경기도 남양주시 다산순환로 20',
    });
    expect(locationInfoGroups).toHaveLength(2);
    expect(locationInfoGroups[0]).toMatchObject({
      id: 'subway',
      label: '지하철',
    });
    expect(locationInfoGroups[0]?.items).toEqual([
      { description: '1번 출구 도보 20분', id: 'donong', title: '도농역(경의중앙선)' },
      { description: '1번 출구 도보 20분', id: 'dasan', title: '다산역(8호선)' },
    ]);
    expect(locationInfoGroups[1]?.items).toEqual([
      {
        description: '도농고앞 정류장 하차 후 도보 3분',
        id: 'bus-95',
        title: '95번',
      },
    ]);
  });
});
