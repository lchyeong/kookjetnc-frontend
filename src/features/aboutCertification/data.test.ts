import { describe, expect, it } from 'vitest';

import {
  certificationCategoryMarkers,
  certificationEntries,
  certificationHeroContent,
  certificationInitialEntry,
  certificationSecondarySubNavLinks,
  getCertificationCategoryMarker,
} from '@/features/aboutCertification/data';

describe('about certification data', () => {
  it('exposes the hero copy without english summary labels', () => {
    expect(certificationHeroContent.eyebrow).toBe('인증·특허');
    expect(certificationHeroContent.title).toBe('국제티엔씨가 축적해 온 인증과 권리의 흐름');
    expect(certificationHeroContent.description).toContain('인증서와 특허·디자인 등록 자산');
  });

  it('exposes the company sub navigation links with history and certification routes', () => {
    expect(certificationSecondarySubNavLinks.map((link) => link.label)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(certificationSecondarySubNavLinks[1]).toMatchObject({
      href: '/about/history',
      label: '경영이념·연혁',
      to: '/about/history',
    });
    expect(certificationSecondarySubNavLinks[2]).toMatchObject({
      href: '/about/certification',
      label: '인증·특허',
      to: '/about/certification',
    });
  });

  it('builds 12 certification entries and 9 patent-design entries', () => {
    expect(certificationCategoryMarkers).toEqual([
      { count: 12, endIndex: 12, id: 'certification', label: '인증서', startIndex: 1 },
      { count: 9, endIndex: 21, id: 'patent-design', label: '특허·디자인', startIndex: 13 },
    ]);
    expect(certificationEntries).toHaveLength(21);
    expect(certificationEntries[0]).toMatchObject({
      categoryId: 'certification',
      serialLabel: '01',
      title: '건설업 등록증',
    });
    expect(certificationEntries[11]).toMatchObject({
      categoryId: 'certification',
      serialLabel: '12',
      title: '국립전파연구원 적합등록 필증',
    });
    expect(certificationEntries[12]).toMatchObject({
      categoryId: 'patent-design',
      serialLabel: '13',
      title: '쇼케이스용 라벨홀더 디자인',
    });
    expect(certificationEntries.at(-1)).toMatchObject({
      categoryId: 'patent-design',
      serialLabel: '21',
      title: '냉동창고 안전관리 특허',
    });
    expect(certificationInitialEntry).toMatchObject({
      categoryId: 'certification',
      serialLabel: '01',
      title: '건설업 등록증',
    });
  });

  it('maps entry indices to the matching category marker', () => {
    expect(getCertificationCategoryMarker(1).id).toBe('certification');
    expect(getCertificationCategoryMarker(12).id).toBe('certification');
    expect(getCertificationCategoryMarker(13).id).toBe('patent-design');
    expect(getCertificationCategoryMarker(21).id).toBe('patent-design');
  });
});
