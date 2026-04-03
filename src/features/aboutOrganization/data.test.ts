import { describe, expect, it } from 'vitest';

import {
  organizationCapabilityLead,
  organizationCapabilityNodes,
  organizationGroups,
  organizationHeroContent,
  organizationSecondarySubNavLinks,
} from '@/features/aboutOrganization/data';

describe('about organization data', () => {
  it('exposes the organization hero copy and sub navigation links', () => {
    expect(organizationHeroContent.eyebrow).toBe('조직도');
    expect(organizationHeroContent.title).toBe(
      '전문 기술인력이 유기적으로 연결된 국제티엔씨의 조직 구조',
    );
    expect(organizationHeroContent.description).toBe(
      '기술 노하우와 다양한 경험을 보유한 전문인력으로 조직을 운영합니다.',
    );
    expect(organizationHeroContent.backgroundSrc).toContain('background');
    expect(organizationSecondarySubNavLinks.map((link) => link.label)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(organizationSecondarySubNavLinks[0]).toMatchObject({
      href: '/about/greeting',
      label: 'CEO인사말',
      to: '/about/greeting',
    });
    expect(organizationSecondarySubNavLinks[1]).toMatchObject({
      href: '/about/history',
      label: '경영이념·연혁',
      to: '/about/history',
    });
    expect(organizationSecondarySubNavLinks[2]).toMatchObject({
      href: '/about/certification',
      label: '인증·특허',
      to: '/about/certification',
    });
    expect(organizationSecondarySubNavLinks[3]).toMatchObject({
      href: '/about/organization',
      label: '조직도',
      to: '/about/organization',
    });
    expect(organizationSecondarySubNavLinks[4]).toMatchObject({
      href: '/about/location',
      label: '사업장 위치',
      to: '/about/location',
    });
  });

  it('exposes the branching organization groups and linear capability nodes', () => {
    expect(organizationGroups).toHaveLength(3);
    expect(organizationGroups.map((group) => group.label)).toEqual([
      '기계설비',
      '냉동냉장설비',
      '경영지원',
    ]);
    expect(organizationGroups[0]?.teams[0]).toMatchObject({
      items: ['냉난방기', '공조 설비', 'ESCO 제안'],
      title: '솔루션 영업팀',
    });
    expect(organizationGroups[1]?.teams[2]).toMatchObject({
      items: ['ESCO 공사', '냉설비 공사', '사전점검 · AS'],
      title: '기술 공사팀',
    });
    expect(organizationGroups[2]?.teams[0]?.items).toEqual([
      '경리',
      '인사',
      '수입',
      '회계',
      '총무',
      '마케팅',
    ]);
    expect(organizationCapabilityLead).toContain('공종별 78개 파트너사와 협업');
    expect(organizationCapabilityNodes).toHaveLength(4);
    expect(organizationCapabilityNodes.at(-1)).toMatchObject({
      id: 'partners',
      label: '파트너사',
      value: '78개사',
    });
  });
});
