import { describe, expect, it } from 'vitest';

import {
  getHistoryDecadeMarker,
  historyDecadeMarkers,
  historyEntries,
  historyHeroContent,
  historyInitialYear,
  historySecondarySubNavLinks,
} from '@/features/aboutHistory/data';

describe('about history data', () => {
  it('exposes the hero copy and full history timeline snapshot', () => {
    expect(historyHeroContent.eyebrow).toBe('경영이념·연혁');
    expect(historyHeroContent.title).toBe('지속가능한 내일을 설계하는 국제티엔씨');
    expect(historyHeroContent.description).toBe(
      '국제티엔씨는 처음 냉동·냉장 시스템의 기준을 다져온 순간부터,\n오늘의 에너지 효율화 솔루션과 친환경 자연냉매 CO₂ 시스템, 공조 기술에 이르기까지\n언제나 더 효율적인 설비와 더 지속가능한 환경을 위해 끊임없이 걸어왔습니다.',
    );
    expect(historyEntries).toHaveLength(18);
    expect(historyEntries.map((entry) => entry.year)).toEqual([
      2001, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022,
      2023, 2024, 2025,
    ]);
    expect(historyEntries[0].year).toBe(2001);
    expect(historyEntries[0].subject).toBe('국제냉동기계 창립');
    expect(historyEntries.find((entry) => entry.year === 2017)?.description).toContain(
      '기업부설연구소 설립',
    );
    expect(historyEntries.find((entry) => entry.year === 2019)?.description).toContain(
      'Kaplanlar사와 쇼케이스 국내 독점 공급 계약',
    );
    expect(historyEntries.find((entry) => entry.year === 2020)?.description).toContain(
      '고용노동부 일생활균형 협약파트너 지정',
    );
    expect(historyEntries.find((entry) => entry.year === 2024)?.description).toContain(
      '남양주시 공장 등록',
    );
    expect(historyEntries.at(-1)?.year).toBe(2025);
    expect(historyEntries.at(-1)?.subject).toBe('국내 대형마트 최초 CO₂ 시스템 설계 시공');
  });

  it('exposes five-year markers and derives the active range from a year', () => {
    expect(historyDecadeMarkers).toHaveLength(6);
    expect(historyDecadeMarkers.map((marker) => marker.label)).toEqual([
      '2000',
      '2005',
      '2010',
      '2015',
      '2020',
      '2025',
    ]);
    expect(historyInitialYear).toBe(2001);
    expect(getHistoryDecadeMarker(2001).key).toBe('2000_2004');
    expect(getHistoryDecadeMarker(2009).key).toBe('2005_2009');
    expect(getHistoryDecadeMarker(2012).key).toBe('2010_2014');
    expect(getHistoryDecadeMarker(2017).key).toBe('2015_2019');
    expect(getHistoryDecadeMarker(2021).key).toBe('2020_2024');
    expect(getHistoryDecadeMarker(2025).key).toBe('2025_2029');
  });

  it('exposes the secondary about history sub navigation links', () => {
    expect(historySecondarySubNavLinks.map((link) => link.label)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(historySecondarySubNavLinks[0]).toMatchObject({
      href: '#',
      isPlaceholder: true,
      label: 'CEO인사말',
    });
    expect(historySecondarySubNavLinks[1]).toMatchObject({
      href: '/about/history',
      label: '경영이념·연혁',
      to: '/about/history',
    });
  });
});
