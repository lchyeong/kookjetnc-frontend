import { describe, expect, it } from 'vitest';

import {
  catalogCategoryList,
  getCatalogCategory,
  getCatalogEntry,
  isCatalogCategorySlug,
} from '@/features/catalog/data';

const expectedCardCounts = {
  'energy-solution': 5,
  'mechanical-hvac': 5,
  'refrigeration-system': 5,
} as const;

describe('catalog data', () => {
  it('exposes the three requested catalog categories with stable tab and card structures', () => {
    expect(catalogCategoryList.map((category) => category.id)).toEqual([
      'energy-solution',
      'mechanical-hvac',
      'refrigeration-system',
    ]);

    for (const category of catalogCategoryList) {
      expect(category.tabs[0]).toEqual({
        id: 'all',
        label: '전체',
      });
      expect(category.filterGroups).toHaveLength(3);
      expect(category.cards).toHaveLength(expectedCardCounts[category.id]);
      expect(new Set(category.cards.map((card) => card.slug)).size).toBe(category.cards.length);
      expect(category.cards.every((card) => card.categoryId === category.id)).toBe(true);
      expect(category.cards.every((card) => card.gallery.length >= 3)).toBe(true);
      expect(category.cards.every((card) => card.tags.length >= 3)).toBe(true);
    }
  });

  it('resolves category and item slugs for the catalog routes', () => {
    expect(isCatalogCategorySlug('energy-solution')).toBe(true);
    expect(isCatalogCategorySlug('unknown-category')).toBe(false);

    expect(getCatalogCategory('mechanical-hvac')?.label).toBe('기계·공조설비');
    expect(getCatalogCategory('refrigeration-system')?.label).toBe('냉장·냉동시스템');
    expect(getCatalogCategory('unknown-category')).toBeUndefined();

    const co2Entry = getCatalogEntry('energy-solution', 'co2-natural-refrigerant-system-retail');
    const motorEntry = getCatalogEntry('energy-solution', 'motor-direct-control-system-smart-fan');
    const consultingEntry = getCatalogEntry('mechanical-hvac', 'operating-consulting-diagnostic');
    const controlEntry = getCatalogEntry('mechanical-hvac', 'automatic-control-bms');
    const engineeringEntry = getCatalogEntry(
      'refrigeration-system',
      'technical-design-specialized-construction-retail',
    );
    const showcaseEntry = getCatalogEntry(
      'refrigeration-system',
      'built-in-frozen-showcase-reach-in',
    );

    expect(co2Entry).toBeDefined();
    expect(co2Entry?.category.id).toBe('energy-solution');
    expect(co2Entry?.card.title).toBe('자연냉매(CO2) 냉동냉장 멀티 시스템');
    expect(co2Entry?.card.slug).toBe('co2-natural-refrigerant-system-retail');
    expect(new Set(co2Entry?.card.gallery.map((image) => image.src)).size).toBe(1);
    expect(co2Entry?.card.gallery.every((image) => image.src === co2Entry?.card.imageSrc)).toBe(
      true,
    );
    expect(co2Entry?.card.detailImages).toHaveLength(18);
    expect(co2Entry?.card.detailImages?.[0]?.alt).toBe(
      '자연냉매(CO2) 냉동냉장 멀티 시스템 상세 이미지 1',
    );
    expect(co2Entry?.card.detailImages?.[17]?.alt).toBe(
      '자연냉매(CO2) 냉동냉장 멀티 시스템 상세 이미지 18',
    );
    expect(co2Entry?.card.highlights).toContain(
      '국내 대형마트 최초 적용 사례로 소개된 자연냉매 CO2(R744) 기반 리테일 냉동·냉장 멀티 시스템입니다.',
    );
    expect(co2Entry?.card.highlights).toContain(
      'ODP 0, GWP 1의 자연냉매 특성과 높은 열전달 효율, 불연성·무독성 특성을 바탕으로 에너지 절감과 친환경 매장 운영에 기여합니다.',
    );

    expect(motorEntry).toBeDefined();
    expect(motorEntry?.category.id).toBe('energy-solution');
    expect(motorEntry?.card.title).toBe('모터 직결제어시스템');
    expect(motorEntry?.card.slug).toBe('motor-direct-control-system-smart-fan');

    expect(consultingEntry).toBeDefined();
    expect(consultingEntry?.category.id).toBe('mechanical-hvac');
    expect(consultingEntry?.card.title).toBe('운영 컨설팅');
    expect(consultingEntry?.card.slug).toBe('operating-consulting-diagnostic');

    expect(controlEntry).toBeDefined();
    expect(controlEntry?.category.id).toBe('mechanical-hvac');
    expect(controlEntry?.card.title).toBe('자동제어');
    expect(controlEntry?.card.slug).toBe('automatic-control-bms');

    expect(engineeringEntry).toBeDefined();
    expect(engineeringEntry?.category.id).toBe('refrigeration-system');
    expect(engineeringEntry?.card.title).toBe('기술설계 · 전문시공');
    expect(engineeringEntry?.card.slug).toBe('technical-design-specialized-construction-retail');

    expect(showcaseEntry).toBeDefined();
    expect(showcaseEntry?.category.id).toBe('refrigeration-system');
    expect(showcaseEntry?.card.title).toBe('내치형 냉동 쇼케이스');
    expect(showcaseEntry?.card.slug).toBe('built-in-frozen-showcase-reach-in');

    expect(
      getCatalogEntry('energy-solution', 'co2-natural-refrigerant-system-logistics'),
    ).toBeUndefined();
    expect(getCatalogEntry('energy-solution', 'motor-direct-control-system-pump')).toBeUndefined();
    expect(getCatalogEntry('mechanical-hvac', 'operating-consulting-bim')).toBeUndefined();
    expect(getCatalogEntry('mechanical-hvac', 'automatic-control-remote')).toBeUndefined();
    expect(
      getCatalogEntry(
        'refrigeration-system',
        'technical-design-specialized-construction-logistics',
      ),
    ).toBeUndefined();
    expect(
      getCatalogEntry('refrigeration-system', 'built-in-frozen-showcase-open-deck'),
    ).toBeUndefined();
    expect(getCatalogEntry('energy-solution', 'missing-item')).toBeUndefined();
    expect(getCatalogEntry('missing-category', 'missing-item')).toBeUndefined();
  });
});
