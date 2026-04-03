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
    const ahuFilterEntry = getCatalogEntry('energy-solution', 'ahu-refill-filter-modular');
    const guntnerEntry = getCatalogEntry('energy-solution', 'gutner-unit-cooler-high-flow');
    const motorEntry = getCatalogEntry('energy-solution', 'motor-direct-control-system-smart-fan');
    const consultingEntry = getCatalogEntry('mechanical-hvac', 'operating-consulting-diagnostic');
    const controlEntry = getCatalogEntry('mechanical-hvac', 'automatic-control-bms');
    const engineeringEntry = getCatalogEntry(
      'refrigeration-system',
      'technical-design-specialized-construction-retail',
    );
    const openShowcaseDoorEntry = getCatalogEntry('energy-solution', 'open-showcase-door-retrofit');
    const showcaseEntry = getCatalogEntry(
      'refrigeration-system',
      'built-in-frozen-showcase-reach-in',
    );
    const ahuFilterCard = ahuFilterEntry?.card;
    const co2Card = co2Entry?.card;
    const guntnerCard = guntnerEntry?.card;
    const motorCard = motorEntry?.card;
    const openShowcaseDoorCard = openShowcaseDoorEntry?.card;

    expect(co2Entry).toBeDefined();
    expect(co2Entry?.category.id).toBe('energy-solution');
    expect(co2Card?.title).toBe('자연냉매(CO2) 냉동냉장 멀티 시스템');
    expect(co2Card?.slug).toBe('co2-natural-refrigerant-system-retail');
    expect(new Set(co2Card?.gallery.map((image) => image.src)).size).toBe(1);
    expect(co2Card?.gallery.every((image) => image.src === co2Card.imageSrc)).toBe(true);
    expect(co2Card?.detailImages).toHaveLength(18);
    expect(co2Card?.detailImages?.[0]?.alt).toBe(
      '자연냉매(CO2) 냉동냉장 멀티 시스템 상세 이미지 1',
    );
    expect(co2Card?.detailImages?.[17]?.alt).toBe(
      '자연냉매(CO2) 냉동냉장 멀티 시스템 상세 이미지 18',
    );
    expect(co2Card?.highlights).toContain(
      '국내 대형마트 최초 적용 사례로 소개된 자연냉매 CO2(R744) 기반 리테일 냉동·냉장 멀티 시스템입니다.',
    );
    expect(co2Card?.highlights).toContain(
      'ODP 0, GWP 1의 자연냉매 특성과 높은 열전달 효율, 불연성·무독성 특성을 바탕으로 에너지 절감과 친환경 매장 운영에 기여합니다.',
    );

    expect(ahuFilterEntry).toBeDefined();
    expect(ahuFilterEntry?.category.id).toBe('energy-solution');
    expect(ahuFilterCard?.title).toBe('공조기 리필형 필터');
    expect(ahuFilterCard?.slug).toBe('ahu-refill-filter-modular');
    expect(ahuFilterCard?.model).toBe('리필형 프리필터 · 미듐필터');
    expect(ahuFilterCard?.detailImages).toHaveLength(2);
    expect(ahuFilterCard?.gallery).toHaveLength(3);
    expect(ahuFilterCard?.detailImages?.[0]?.alt).toBe('공조기 리필형 필터 브로셔 상세 이미지');
    expect(ahuFilterCard?.detailImages?.[1]?.alt).toBe('공조기 리필형 필터 비교 자료 이미지');
    expect(ahuFilterCard?.highlights).toContain(
      '프레임 하나에 두 개 필터를 적용하는 일체형 리필 구조로 최초 설치 후에는 필터만 교환하는 방식입니다.',
    );
    expect(ahuFilterCard?.highlights).toContain(
      '브로셔 기준 난연 소재 적용, 폐기물 저감, 롯데타워 공급 계약 사례까지 포함된 특허 제품군입니다.',
    );

    expect(guntnerEntry).toBeDefined();
    expect(guntnerEntry?.category.id).toBe('energy-solution');
    expect(guntnerCard?.title).toBe('구트너 유니트 쿨러');
    expect(guntnerCard?.slug).toBe('gutner-unit-cooler-high-flow');
    expect(new Set(guntnerCard?.gallery.map((image) => image.src)).size).toBe(3);
    expect(guntnerCard?.detailImages).toHaveLength(1);
    expect(guntnerCard?.detailImages?.[0]?.alt).toBe('구트너 유니트 쿨러 공통 인증 및 제품군 정보');
    expect(guntnerCard?.model).toBe('GACC · GASC · GADC · GACV');
    expect(guntnerCard?.seriesTabs).toHaveLength(4);
    expect(guntnerCard?.seriesTabs?.map((series) => series.label)).toEqual([
      'GACC',
      'GASC',
      'GADC',
      'GACV',
    ]);
    expect(guntnerCard?.seriesTabs?.[0]?.detailImages?.[0]?.alt).toBe(
      '구트너 유니트 쿨러 GACC 카달로그 이미지',
    );
    expect(guntnerCard?.seriesTabs?.[3]?.detailImages).toBeUndefined();
    expect(guntnerCard?.highlights).toContain(
      'HACCP 위생 인증 기반의 식품 안전 재질과 손쉬운 세척 구조를 공통 전제로 둔 Güntner 에어쿨러 제품군입니다.',
    );

    expect(motorEntry).toBeDefined();
    expect(motorEntry?.category.id).toBe('energy-solution');
    expect(motorCard?.title).toBe('모터 직결제어시스템');
    expect(motorCard?.slug).toBe('motor-direct-control-system-smart-fan');
    expect(motorCard?.model).toBe('저전력 직결팬 · Easy Shaft');
    expect(motorCard?.detailImages).toHaveLength(2);
    expect(motorCard?.gallery).toHaveLength(3);
    expect(motorCard?.detailImages?.[0]?.alt).toBe('모터 직결제어시스템 브로셔 상세 이미지');
    expect(motorCard?.detailImages?.[1]?.alt).toBe('모터 직결제어시스템 가이드 참고 이미지');
    expect(motorCard?.highlights).toContain(
      '특허 기반 저전력 직결 기술로 안전성을 확보하면서 약 30~40% 수준의 전력 절감 효과를 제안합니다.',
    );
    expect(motorCard?.highlights).toContain(
      '무벨트 구조로 관리자의 유지보수 편의와 작업 안전성을 함께 높이는 방향으로 설계되었습니다.',
    );

    expect(openShowcaseDoorEntry).toBeDefined();
    expect(openShowcaseDoorEntry?.category.id).toBe('energy-solution');
    expect(openShowcaseDoorCard?.title).toBe('오픈 쇼케이스 도어');
    expect(openShowcaseDoorCard?.slug).toBe('open-showcase-door-retrofit');
    expect(openShowcaseDoorCard?.model).toBe('Sliding Door · Swing Door');
    expect(openShowcaseDoorCard?.detailImages).toHaveLength(3);
    expect(openShowcaseDoorCard?.detailImages?.[0]?.alt).toBe(
      '오픈 쇼케이스 도어 슬라이딩 도어 카달로그 이미지',
    );
    expect(openShowcaseDoorCard?.detailImages?.[1]?.alt).toBe(
      '오픈 쇼케이스 도어 스윙 도어 카달로그 이미지',
    );
    expect(openShowcaseDoorCard?.detailImages?.[2]?.alt).toBe(
      '오픈 쇼케이스 도어 리뉴얼 가이드 이미지',
    );
    expect(openShowcaseDoorCard?.highlights).toContain(
      'Sliding Door는 좁은 동선에 적합하고 Swing Door 대비 약 15% 저렴한 구성이 특징입니다.',
    );
    expect(openShowcaseDoorCard?.highlights).toContain(
      '두 타입 모두 카달로그 기준 약 40% 전기료 절감 효과와 한전 지원 기준 충족을 전제로 구성됩니다.',
    );

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
