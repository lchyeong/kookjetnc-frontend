import heroImage01 from '@/assets/images/1번이미지.jpg';
import heroImage02 from '@/assets/images/2번이미지.jpg';
import heroImage03 from '@/assets/images/3번이미지.jpg';
import heroImage04 from '@/assets/images/4번이미지.jpg';
import co2MultiSystemImage from '@/assets/images/energy/co2/co2_multi_system.png';
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
import type {
  CatalogCard,
  CatalogCategory,
  CatalogFilterGroup,
  CatalogGalleryImage,
  CatalogMetric,
  CatalogTab,
} from '@/features/catalog/types';
import type { CatalogCategorySlug } from '@/routes/routeRegistry';

const co2DetailImageModules = import.meta.glob<string>(
  '/src/assets/images/energy/co2/*.{jpg,jpeg,png,webp}',
  {
    eager: true,
    import: 'default',
  },
);

interface CatalogCardSeed {
  detailDescription: string;
  detailImages?: CatalogGalleryImage[];
  filters: Record<string, string[]>;
  gallery: CatalogGalleryImage[];
  highlights: string[];
  id: string;
  imageAlt: string;
  imageSrc: string;
  metrics: CatalogMetric[];
  model: string;
  summary: string;
  tabId: string;
  tags: string[];
  title: string;
}

const createGallery = (
  title: string,
  ...items: Array<{ src: string; alt?: string }>
): CatalogGalleryImage[] => {
  return items.map((item, index) => {
    return {
      alt: item.alt ?? `${title} 갤러리 이미지 ${String(index + 1)}`,
      src: item.src,
    };
  });
};

const createCo2DetailImages = (title: string): CatalogGalleryImage[] => {
  return Object.entries(co2DetailImageModules)
    .map(([path, src]) => {
      const match = path.match(/\/(\d+)\.(?:png|jpe?g|webp)$/i);

      if (!match) {
        return null;
      }

      return {
        alt: `${title} 상세 이미지 ${match[1]}`,
        order: Number(match[1]),
        src,
      };
    })
    .filter(
      (
        item,
      ): item is {
        alt: string;
        order: number;
        src: string;
      } => item !== null,
    )
    .sort((left, right) => left.order - right.order)
    .map(({ alt, src }) => {
      return { alt, src };
    });
};

const createCard = (categoryId: CatalogCategorySlug, seed: CatalogCardSeed): CatalogCard => {
  return {
    ...seed,
    categoryId,
    slug: seed.id,
  };
};

const allTab: CatalogTab = {
  id: 'all',
  label: '전체',
};

const energyTabs: CatalogTab[] = [
  allTab,
  { id: 'co2-natural-refrigerant-system', label: '자연냉매(CO2) 냉동냉장 멀티 시스템' },
  { id: 'gutner-unit-cooler', label: '구트너 유니트 쿨러' },
  { id: 'ahu-refill-filter', label: '공조기 리필형 필터' },
  { id: 'motor-direct-control-system', label: '모터 직결제어시스템' },
  { id: 'open-showcase-door', label: '오픈 쇼케이스 도어' },
];

const mechanicalTabs: CatalogTab[] = [
  allTab,
  { id: 'operating-consulting', label: '운영 컨설팅' },
  { id: 'heating-cooling-facility', label: '냉난방 설비' },
  { id: 'hvac-facility', label: '공조설비' },
  { id: 'plumbing-facility', label: '위생설비' },
  { id: 'automatic-control', label: '자동제어' },
];

const refrigerationTabs: CatalogTab[] = [
  allTab,
  { id: 'technical-design-specialized-construction', label: '기술설계 · 전문시공' },
  { id: 'seafood-cold-chain-system', label: '수산물 콜드체인시스템' },
  { id: 'maintenance-service', label: '유지보수 서비스' },
  { id: 'built-in-frozen-showcase', label: '내치형 냉동 쇼케이스' },
  { id: 'showcase-wine-cellar', label: '쇼케이스 와인셀러' },
];

const energyFilterGroups: CatalogFilterGroup[] = [
  {
    id: 'application',
    label: '적용 분야',
    options: [
      { id: 'retail', label: '리테일 매장' },
      { id: 'logistics', label: '물류센터' },
      { id: 'cold-storage', label: '저온창고' },
    ],
  },
  {
    id: 'equipment',
    label: '구성 장비',
    options: [
      { id: 'refrigerant-system', label: '냉매시스템' },
      { id: 'cooler', label: '쿨러' },
      { id: 'control', label: '제어' },
      { id: 'filter', label: '필터' },
      { id: 'door', label: '도어' },
    ],
  },
  {
    id: 'priority',
    label: '운영 포인트',
    options: [
      { id: 'energy-saving', label: '에너지 절감' },
      { id: 'eco-friendly', label: '친환경' },
      { id: 'maintenance', label: '유지관리성' },
    ],
  },
];

const mechanicalFilterGroups: CatalogFilterGroup[] = [
  {
    id: 'discipline',
    label: '설비 영역',
    options: [
      { id: 'consulting', label: '운영 컨설팅' },
      { id: 'heating-cooling', label: '냉난방 설비' },
      { id: 'air-conditioning', label: '공조설비' },
      { id: 'plumbing', label: '위생설비' },
      { id: 'control', label: '자동제어' },
    ],
  },
  {
    id: 'site',
    label: '적용 공간',
    options: [
      { id: 'commercial', label: '상업시설' },
      { id: 'office', label: '업무시설' },
      { id: 'logistics', label: '물류시설' },
    ],
  },
  {
    id: 'delivery',
    label: '수행 범위',
    options: [
      { id: 'design', label: '설계' },
      { id: 'construction', label: '시공' },
      { id: 'commissioning', label: '운전 최적화' },
    ],
  },
];

const refrigerationFilterGroups: CatalogFilterGroup[] = [
  {
    id: 'system',
    label: '시스템 유형',
    options: [
      { id: 'engineering', label: '전문 시공' },
      { id: 'cold-chain', label: '콜드체인' },
      { id: 'maintenance', label: '유지보수' },
      { id: 'showcase', label: '쇼케이스' },
      { id: 'cellar', label: '와인셀러' },
    ],
  },
  {
    id: 'product',
    label: '보관 품목',
    options: [
      { id: 'seafood', label: '수산물' },
      { id: 'frozen-food', label: '냉동식품' },
      { id: 'beverage', label: '음료·주류' },
    ],
  },
  {
    id: 'operation',
    label: '운영 포인트',
    options: [
      { id: 'temperature', label: '저온 유지' },
      { id: 'layout', label: '동선 효율' },
      { id: 'service', label: '유지관리' },
    ],
  },
];

const energyCards: CatalogCard[] = [
  createCard('energy-solution', {
    id: 'co2-natural-refrigerant-system-retail',
    tabId: 'co2-natural-refrigerant-system',
    title: '자연냉매(CO2) 냉동냉장 멀티 시스템',
    model: 'QCMT100 ACO 6 EC MX, QCLT167 ACO 12 EC MX',
    summary:
      '리테일 매장과 저온 물류센터의 냉동·냉장 부하를 함께 고려해 친환경 전환과 고효율 운전을 동시에 설계하는 자연냉매 시스템입니다.',
    detailDescription:
      '고효율 압축 유닛과 현장 운영 데이터 기반 제어 로직을 조합해 매장과 물류 거점의 냉동·냉장 부하를 세밀하게 제어합니다. 기존 HFC 기반 설비 교체 단계부터 자연냉매 전환 로드맵, 냉매 회수 안정성, 구역별 부하 밸런스까지 함께 설계할 수 있도록 구성했습니다.',
    imageSrc: co2MultiSystemImage,
    imageAlt: '자연냉매(CO2) 냉동냉장 멀티 시스템 이미지',
    tags: ['#친환경', '#자연냉매', '#에너지절감'],
    highlights: [
      '국내 대형마트 최초 적용 사례로 소개된 자연냉매 CO2(R744) 기반 리테일 냉동·냉장 멀티 시스템입니다.',
      'CO2 냉동기 유니트, 가스쿨러, 냉동·냉장 쇼케이스, 유니트 쿨러, 냉매 배관, CO2 누설 경보장치를 통합 구성해 매장 냉동·냉장 설비를 일체형으로 운영합니다.',
      '중온·저온 부하를 함께 다루는 멀티 시스템과 조절형 이젝터 기반 운전 기술로 매장 규모별 확장과 고효율 운전에 대응합니다.',
      'ODP 0, GWP 1의 자연냉매 특성과 높은 열전달 효율, 불연성·무독성 특성을 바탕으로 에너지 절감과 친환경 매장 운영에 기여합니다.',
    ],
    metrics: [
      { label: '권장 적용', value: '리테일·물류센터' },
      { label: '운영 방식', value: '가변 부하·구역 제어' },
      { label: '냉매 전략', value: '자연냉매 CO2' },
      { label: '지원 범위', value: '설계·시공·시운전' },
    ],
    gallery: createGallery(
      '자연냉매(CO2) 냉동냉장 멀티 시스템',
      { src: co2MultiSystemImage },
      { src: co2MultiSystemImage },
      { src: co2MultiSystemImage },
    ),
    detailImages: createCo2DetailImages('자연냉매(CO2) 냉동냉장 멀티 시스템'),
    filters: {
      application: ['retail', 'logistics', 'cold-storage'],
      equipment: ['refrigerant-system', 'control'],
      priority: ['energy-saving', 'eco-friendly', 'maintenance'],
    },
  }),
  createCard('energy-solution', {
    id: 'gutner-unit-cooler-high-flow',
    tabId: 'gutner-unit-cooler',
    title: '구트너 유니트 쿨러',
    model: 'ES-GUC-480',
    summary:
      '저온 저장 공간의 온도 편차를 줄이고 풍량 밸런스를 안정적으로 유지하도록 설계한 유니트 쿨러입니다.',
    detailDescription:
      '저온 저장실 전역의 온도 편차를 줄이도록 코일 성능과 팬 운전을 조합한 고풍량 유니트 쿨러입니다. 세척성과 점검 접근성을 높여 장기 운영에 적합하도록 설계했습니다.',
    imageSrc: productImage10,
    imageAlt: '구트너 유니트 쿨러 이미지',
    tags: ['#유니트쿨러', '#저온창고', '#온도균일'],
    highlights: [
      '저온 저장 구간 전역에 균일한 송풍을 전달하는 풍량 설계',
      '현장 세척 동선을 고려한 유지관리 접근성',
      '냉매 시스템 및 제상 로직과 연동 가능한 운전 인터페이스',
    ],
    metrics: [
      { label: '적용 온도', value: '-30℃ ~ 10℃' },
      { label: '팬 제어', value: '다단 풍량 조절' },
      { label: '제상 방식', value: '현장 조건별 설정' },
      { label: '운영 포인트', value: '온도 편차 최소화' },
    ],
    gallery: createGallery(
      '구트너 유니트 쿨러',
      { src: productImage10 },
      { src: productImage11 },
      { src: productImage06 },
    ),
    filters: {
      application: ['cold-storage', 'logistics'],
      equipment: ['cooler'],
      priority: ['energy-saving', 'maintenance'],
    },
  }),
  createCard('energy-solution', {
    id: 'ahu-refill-filter-modular',
    tabId: 'ahu-refill-filter',
    title: '공조기 리필형 필터',
    model: 'ES-AF-120',
    summary:
      '교체 시간을 줄이고 폐기 비용을 낮출 수 있도록 리필형 구조로 설계한 공조기 필터 솔루션입니다.',
    detailDescription:
      '공조기 프레임은 그대로 유지하고 필터 매체만 교체하는 리필형 구조를 채택해, 현장 점검 시간과 소모품 폐기량을 동시에 줄이는 공조기 필터 솔루션입니다.',
    imageSrc: productImage04,
    imageAlt: '공조기 리필형 필터 이미지',
    tags: ['#공조기', '#리필필터', '#운영비절감'],
    highlights: [
      '기존 프레임을 활용해 필터 매체만 빠르게 교체할 수 있는 구조',
      '현장별 분진 부하와 운전 시간을 고려한 교체 주기 가이드',
      '에너지 손실을 줄이기 위한 압력 강하 관리 포인트 제공',
    ],
    metrics: [
      { label: '적용 설비', value: '공조기·AHU' },
      { label: '교체 방식', value: '리필형 모듈' },
      { label: '관리 항목', value: '차압·분진량' },
      { label: '운영 효과', value: '소모품 비용 절감' },
    ],
    gallery: createGallery(
      '공조기 리필형 필터',
      { src: productImage04 },
      { src: productImage05 },
      { src: heroImage02 },
    ),
    filters: {
      application: ['retail'],
      equipment: ['filter'],
      priority: ['energy-saving', 'maintenance'],
    },
  }),
  createCard('energy-solution', {
    id: 'motor-direct-control-system-smart-fan',
    tabId: 'motor-direct-control-system',
    title: '모터 직결제어시스템',
    model: 'ES-MD-210/320',
    summary:
      '환기·공조 팬과 냉각수 계통 펌프의 운전 데이터를 기반으로 모터 직결 제어를 수행해 에너지 사용량을 정밀하게 조정합니다.',
    detailDescription:
      '팬 부하 변화, 실내 조건, 냉각수 계통 압력을 함께 판단해 직결 제어를 수행하는 시스템입니다. 환기·공조 팬과 브라인·냉각수 펌프 모두에 적용할 수 있도록 구성해, 현장의 운영 패턴에 따라 속도 제어와 경보 기준을 세밀하게 조정할 수 있습니다.',
    imageSrc: productImage01,
    imageAlt: '모터 직결제어시스템 이미지',
    tags: ['#직결제어', '#운전최적화', '#전력절감'],
    highlights: [
      '팬 효율 곡선과 펌프 압력 변화를 함께 고려한 운전 포인트 자동 추천',
      '현장 알람과 제어 이력을 한 화면에서 관리하는 통합 대시보드 구성',
      '설비 점검 이력과 연동 가능한 유지보수 기록 체계',
    ],
    metrics: [
      { label: '제어 대상', value: '환기·공조 팬·냉각수 펌프' },
      { label: '연동 방식', value: '현장 데이터 기반' },
      { label: '운전 기준', value: '실부하 추종 제어' },
      { label: '운영 효과', value: '부하별 속도 최적화' },
    ],
    gallery: createGallery(
      '모터 직결제어시스템',
      { src: productImage01 },
      { src: productImage02 },
      { src: productImage04 },
    ),
    filters: {
      application: ['retail', 'logistics', 'cold-storage'],
      equipment: ['control'],
      priority: ['energy-saving', 'maintenance'],
    },
  }),
  createCard('energy-solution', {
    id: 'open-showcase-door-retrofit',
    tabId: 'open-showcase-door',
    title: '오픈 쇼케이스 도어',
    model: 'ES-OD-118',
    summary:
      '오픈 쇼케이스에 도어를 적용해 냉기 손실을 줄이고 매장 동선에 맞는 개폐감을 유지하는 솔루션입니다.',
    detailDescription:
      '매장 동선을 해치지 않는 개폐 각도와 도어 프레임 구조를 적용해 기존 오픈 쇼케이스를 효율적으로 개선합니다. 냉기 손실과 결로 이슈를 함께 관리할 수 있도록 설계했습니다.',
    imageSrc: productImage03,
    imageAlt: '오픈 쇼케이스 도어 이미지',
    tags: ['#쇼케이스도어', '#냉기손실저감', '#리테일개선'],
    highlights: [
      '기존 오픈 쇼케이스에 맞춘 리트로핏 프레임 구성',
      '개폐 빈도와 결로 관리를 고려한 도어 하드웨어 사양',
      '매장 운영 동선을 유지하는 사용자 경험 중심 설계',
    ],
    metrics: [
      { label: '적용 대상', value: '오픈 쇼케이스' },
      { label: '설치 방식', value: '리트로핏 시공' },
      { label: '운영 효과', value: '냉기 손실 저감' },
      { label: '점검 항목', value: '결로·개폐감' },
    ],
    gallery: createGallery(
      '오픈 쇼케이스 도어',
      { src: productImage03 },
      { src: productImage07 },
      { src: productImage08 },
    ),
    filters: {
      application: ['retail'],
      equipment: ['door'],
      priority: ['energy-saving', 'maintenance'],
    },
  }),
];

const mechanicalCards: CatalogCard[] = [
  createCard('mechanical-hvac', {
    id: 'operating-consulting-diagnostic',
    tabId: 'operating-consulting',
    title: '운영 컨설팅',
    model: 'MH-OC-101/240',
    summary:
      '설비 운전 이력, 현장 부하, BIM 검토를 함께 반영해 에너지 손실 구간과 개보수 우선순위를 정리하는 운영 컨설팅입니다.',
    detailDescription:
      '운전 로그, 현장 점검, 설비 인터뷰, BIM 기반 배치 검토를 결합해 운영 병목 구간을 진단하고 단계별 개선안으로 정리합니다. 유지보수 동선, 장비 교체성, 배관 접근성까지 함께 검토해 이후 설계·시공·자동제어 개선까지 연결하기 위한 기초 데이터로 활용합니다.',
    imageSrc: productImage05,
    imageAlt: '운영 컨설팅 이미지',
    tags: ['#운영컨설팅', '#현장진단', '#BIM검토'],
    highlights: [
      '운영 로그와 현장 인터뷰를 함께 분석하는 진단 프로세스',
      'BIM 기반으로 유지보수 동선과 장비 접근성을 검토하는 분석 체계',
      '후속 설계·시공 개선안까지 연결 가능한 진단 리포트 제공',
    ],
    metrics: [
      { label: '수행 범위', value: '진단·BIM 검토' },
      { label: '주요 대상', value: '상업·업무·물류 시설' },
      { label: '산출물', value: '개선 로드맵·리뷰 리포트' },
      { label: '후속 연계', value: '개선 설계 제안' },
    ],
    gallery: createGallery(
      '운영 컨설팅',
      { src: productImage05 },
      { src: productImage14 },
      { src: heroImage02 },
      { src: heroImage01 },
    ),
    filters: {
      discipline: ['consulting'],
      site: ['commercial', 'office', 'logistics'],
      delivery: ['design', 'commissioning'],
    },
  }),
  createCard('mechanical-hvac', {
    id: 'heating-cooling-facility-modular',
    tabId: 'heating-cooling-facility',
    title: '냉난방 설비',
    model: 'MH-HC-330',
    summary:
      '공간별 부하를 고려해 냉난방 설비 모듈을 조합하고 운영 계절에 따라 유연하게 대응하는 설비 패키지입니다.',
    detailDescription:
      '실내 부하와 운영 시간대가 다른 복합 공간에서 효율적인 냉난방 제어를 구현하도록 설계한 모듈러 패키지입니다. 현장 규모와 계통 구성을 기준으로 단계적 확장도 가능합니다.',
    imageSrc: productImage04,
    imageAlt: '냉난방 설비 이미지',
    tags: ['#냉난방설비', '#모듈러', '#복합공간'],
    highlights: [
      '공간별 부하 차이를 반영한 모듈 단위 설비 조합',
      '계절별 운전 모드와 실사용 시간을 고려한 제어 시나리오',
      '향후 증설을 고려한 단계적 확장 구조',
    ],
    metrics: [
      { label: '적용 대상', value: '복합 상업시설' },
      { label: '설계 방식', value: '모듈러 조합' },
      { label: '운영 모드', value: '계절별 최적화' },
      { label: '확장성', value: '단계별 증설 가능' },
    ],
    gallery: createGallery(
      '냉난방 설비',
      { src: productImage04 },
      { src: productImage05 },
      { src: heroImage03 },
    ),
    filters: {
      discipline: ['heating-cooling'],
      site: ['commercial', 'office'],
      delivery: ['design', 'construction'],
    },
  }),
  createCard('mechanical-hvac', {
    id: 'hvac-facility-air-handler',
    tabId: 'hvac-facility',
    title: '공조설비',
    model: 'MH-HV-220',
    summary:
      '공기질과 열쾌적을 동시에 관리하기 위해 공조기, 덕트, 제어 연동을 통합 설계한 공조설비입니다.',
    detailDescription:
      '공조기와 배관, 덕트, 제어 설비를 통합 설계해 실내 환경의 안정성과 유지관리성을 동시에 확보하는 패키지입니다. 사용 영역에 따라 외기량과 회수열 전략을 조정할 수 있습니다.',
    imageSrc: productImage05,
    imageAlt: '공조설비 이미지',
    tags: ['#공조설비', '#공기질', '#덕트시스템'],
    highlights: [
      '공조기, 덕트, 제어를 하나의 패키지로 통합 설계',
      '실내 사용 특성에 따라 외기량과 회수열 전략을 조정',
      '시운전 단계에서 공기질과 온열 환경을 함께 검증',
    ],
    metrics: [
      { label: '핵심 장비', value: '공조기·덕트' },
      { label: '운영 목표', value: '공기질·쾌적도' },
      { label: '지원 단계', value: '설계·시공·시운전' },
      { label: '적용 공간', value: '오피스·상업시설' },
    ],
    gallery: createGallery(
      '공조설비',
      { src: productImage05 },
      { src: productImage04 },
      { src: heroImage02 },
    ),
    filters: {
      discipline: ['air-conditioning'],
      site: ['office', 'commercial'],
      delivery: ['design', 'construction', 'commissioning'],
    },
  }),
  createCard('mechanical-hvac', {
    id: 'plumbing-facility-hygiene',
    tabId: 'plumbing-facility',
    title: '위생설비',
    model: 'MH-PL-120',
    summary:
      '급배수와 위생기구 동선을 통합 검토해 사용 편의성과 유지관리 접근성을 함께 맞추는 위생설비입니다.',
    detailDescription:
      '급수·배수 계통과 위생기구 배치를 함께 검토해 위생 동선과 설비 유지관리성을 동시에 확보합니다. 리뉴얼 현장의 제한 조건에 맞는 배관 개선안도 함께 제안합니다.',
    imageSrc: productImage09,
    imageAlt: '위생설비 이미지',
    tags: ['#위생설비', '#급배수', '#리뉴얼'],
    highlights: [
      '위생 동선과 유지보수 접근성을 함께 고려한 급배수 설계',
      '리뉴얼 현장에 맞는 배관 개선안 및 공정 순서 제안',
      '기기 배치와 사용성 검토를 병행하는 설계 프로세스',
    ],
    metrics: [
      { label: '설비 범위', value: '급수·배수·위생기구' },
      { label: '적용 현장', value: '상업·업무시설' },
      { label: '주요 포인트', value: '동선·유지관리' },
      { label: '지원 단계', value: '설계·시공' },
    ],
    gallery: createGallery(
      '위생설비',
      { src: productImage09 },
      { src: productImage14 },
      { src: heroImage04 },
    ),
    filters: {
      discipline: ['plumbing'],
      site: ['commercial', 'office'],
      delivery: ['design', 'construction'],
    },
  }),
  createCard('mechanical-hvac', {
    id: 'automatic-control-bms',
    tabId: 'automatic-control',
    title: '자동제어',
    model: 'MH-AC-450/550',
    summary:
      '공조·냉난방·전력 데이터를 통합해 BMS와 원격 운영 환경에서 설비 상태와 알람을 한 번에 관리할 수 있는 자동제어입니다.',
    detailDescription:
      '현장에 이미 구축된 설비 데이터를 수집하고, 운영자가 필요한 알람과 이력 위젯을 중심으로 BMS 화면과 원격 모니터링 흐름을 함께 구성하는 자동제어 솔루션입니다. 확장 시 신규 계통 편입과 현장 대응 프로세스까지 함께 고려합니다.',
    imageSrc: productImage02,
    imageAlt: '자동제어 이미지',
    tags: ['#자동제어', '#BMS', '#원격운영'],
    highlights: [
      '설비 상태와 알람을 한 화면에서 관리하는 운영자 중심 BMS 구성',
      '원격 운영과 현장 대응 흐름을 함께 반영한 자동제어 구조',
      '이력 데이터 기반의 점검 우선순위 판단 지원',
    ],
    metrics: [
      { label: '연동 범위', value: '공조·냉난방·전력' },
      { label: '운영 화면', value: 'BMS·원격 모니터링' },
      { label: '주요 기능', value: '알람·이력·분석' },
      { label: '확장성', value: '신규 설비 편입 가능' },
    ],
    gallery: createGallery(
      '자동제어',
      { src: productImage02 },
      { src: productImage01 },
      { src: heroImage03 },
    ),
    filters: {
      discipline: ['control'],
      site: ['commercial', 'logistics', 'office'],
      delivery: ['commissioning', 'construction'],
    },
  }),
];

const refrigerationCards: CatalogCard[] = [
  createCard('refrigeration-system', {
    id: 'technical-design-specialized-construction-retail',
    tabId: 'technical-design-specialized-construction',
    title: '기술설계 · 전문시공',
    model: 'RS-EN-110/260',
    summary:
      '대형 리테일과 저온 물류센터를 대상으로 설계부터 시공, 시운전까지 연속성 있게 수행하는 엔지니어링 패키지입니다.',
    detailDescription:
      '매장 레이아웃, 상품 동선, 설비실 여건과 물류센터 구역별 요구 온도를 함께 고려해 냉동·냉장 시스템을 설계하고, 실제 시공과 시운전까지 일관되게 이어지는 엔지니어링 패키지입니다. 유지보수 동선과 시공 정확도까지 함께 반영해 리테일과 물류 현장 모두에 대응하도록 구성했습니다.',
    imageSrc: productImage11,
    imageAlt: '기술설계 전문시공 이미지',
    tags: ['#전문시공', '#엔지니어링', '#시운전'],
    highlights: [
      '설계 단계부터 시공 및 시운전까지 일관된 수행 구조',
      '매장 동선과 물류센터 구역 조건을 함께 반영한 냉동·냉장 설비 배치',
      '운영 개시 직전의 성능 검증과 하자 리스크 점검',
    ],
    metrics: [
      { label: '수행 범위', value: '설계·시공·시운전' },
      { label: '적용 현장', value: '리테일·물류센터' },
      { label: '핵심 장비', value: '패널·배관·쇼케이스' },
      { label: '운영 목표', value: '운영 안정화' },
    ],
    gallery: createGallery(
      '기술설계 전문시공',
      { src: productImage11 },
      { src: productImage12 },
      { src: productImage08 },
      { src: productImage06 },
    ),
    filters: {
      system: ['engineering'],
      product: ['frozen-food', 'seafood'],
      operation: ['layout', 'temperature', 'service'],
    },
  }),
  createCard('refrigeration-system', {
    id: 'seafood-cold-chain-system-fresh',
    tabId: 'seafood-cold-chain-system',
    title: '수산물 콜드체인시스템',
    model: 'RS-CC-310',
    summary:
      '수산물 처리와 보관, 출하 동선을 고려해 선도 유지와 저온 이력 관리를 동시에 수행하는 콜드체인시스템입니다.',
    detailDescription:
      '수산물의 입고부터 보관, 출하 전 처리 구간까지 이어지는 전 과정을 저온 이력 기준으로 관리하는 콜드체인 패키지입니다. 선도 유지와 작업 동선 효율을 함께 반영했습니다.',
    imageSrc: productImage06,
    imageAlt: '수산물 콜드체인시스템 이미지',
    tags: ['#수산물', '#콜드체인', '#선도관리'],
    highlights: [
      '입고부터 출하까지 이어지는 저온 이력 관리 구조',
      '수산물 선도 유지에 초점을 둔 보관·작업 구간 설계',
      '운영자 체크포인트를 반영한 일상 점검 프로세스',
    ],
    metrics: [
      { label: '보관 품목', value: '수산물' },
      { label: '운영 방식', value: '저온 이력 관리' },
      { label: '핵심 목표', value: '선도 유지' },
      { label: '지원 범위', value: '설계·운영 가이드' },
    ],
    gallery: createGallery(
      '수산물 콜드체인시스템',
      { src: productImage06 },
      { src: productImage12 },
      { src: heroImage04 },
    ),
    filters: {
      system: ['cold-chain'],
      product: ['seafood'],
      operation: ['temperature', 'layout'],
    },
  }),
  createCard('refrigeration-system', {
    id: 'maintenance-service-monitoring',
    tabId: 'maintenance-service',
    title: '유지보수 서비스',
    model: 'RS-MS-140',
    summary:
      '설비 이상 징후를 조기에 확인하고 대응할 수 있도록 점검 기록과 알람 체계를 결합한 유지보수 서비스입니다.',
    detailDescription:
      '운영 현장에 설치된 센서와 점검 기록을 함께 관리해 설비 이상 징후를 조기에 포착하도록 설계된 유지보수 서비스입니다. 정기 리포트와 긴급 대응 프로세스를 함께 제공합니다.',
    imageSrc: productImage10,
    imageAlt: '유지보수 서비스 이미지',
    tags: ['#유지보수', '#원격모니터링', '#알람대응'],
    highlights: [
      '센서 데이터와 점검 이력을 함께 보는 유지보수 체계',
      '정기 리포트와 긴급 대응 기준을 분리한 운영 프로세스',
      '설비 이상 징후를 조기에 감지하는 알람 로직',
    ],
    metrics: [
      { label: '서비스 방식', value: '원격 모니터링' },
      { label: '점검 기준', value: '정기·긴급 분리' },
      { label: '주요 대상', value: '저온 설비 전반' },
      { label: '효과', value: '장애 조기 대응' },
    ],
    gallery: createGallery(
      '유지보수 서비스',
      { src: productImage10 },
      { src: productImage06 },
      { src: productImage02 },
    ),
    filters: {
      system: ['maintenance'],
      product: ['frozen-food', 'beverage'],
      operation: ['service'],
    },
  }),
  createCard('refrigeration-system', {
    id: 'built-in-frozen-showcase-reach-in',
    tabId: 'built-in-frozen-showcase',
    title: '내치형 냉동 쇼케이스',
    model: 'RS-FS-520/610',
    summary:
      '공간 효율과 보관 안정성을 동시에 고려해 리치인과 오픈데크 운영에 대응하는 내치형 냉동 쇼케이스입니다.',
    detailDescription:
      '리치인 구조의 보관 안정성과 오픈데크 구조의 진열 효과를 함께 고려해 구성한 내치형 냉동 쇼케이스입니다. 매장 운영 동선, 진열 밀도, 야간 커버 운영 기준까지 함께 반영해 다양한 매장 운영 방식에 대응합니다.',
    imageSrc: productImage08,
    imageAlt: '내치형 냉동 쇼케이스 이미지',
    tags: ['#냉동쇼케이스', '#리치인', '#오픈데크'],
    highlights: [
      '매장 운영 동선에 맞는 리치인 도어와 오픈데크 구조 선택지 제공',
      '보관 안정성과 진열 효율을 함께 고려한 레이아웃',
      '야간 커버 운영과 상품 교체 작업까지 고려한 접근성 중심 설계',
    ],
    metrics: [
      { label: '쇼케이스 타입', value: '리치인·오픈데크형' },
      { label: '주요 품목', value: '냉동식품' },
      { label: '운영 포인트', value: '동선·진열 효율' },
      { label: '지원 범위', value: '납품·시공' },
    ],
    gallery: createGallery(
      '내치형 냉동 쇼케이스',
      { src: productImage08 },
      { src: productImage07 },
      { src: productImage03 },
    ),
    filters: {
      system: ['showcase'],
      product: ['frozen-food'],
      operation: ['layout', 'temperature'],
    },
  }),
  createCard('refrigeration-system', {
    id: 'showcase-wine-cellar-premium',
    tabId: 'showcase-wine-cellar',
    title: '쇼케이스 와인셀러',
    model: 'RS-WC-220',
    summary:
      '온도와 습도, 디스플레이 품질을 함께 고려해 주류 매장과 F&B 공간에 적합한 와인셀러 구성입니다.',
    detailDescription:
      '보관 환경과 진열 연출을 동시에 관리해야 하는 와인·주류 공간을 위해 설계한 프리미엄형 와인셀러입니다. 온도와 습도뿐 아니라 진열 조도와 개폐 빈도까지 함께 고려합니다.',
    imageSrc: productImage13,
    imageAlt: '쇼케이스 와인셀러 이미지',
    tags: ['#와인셀러', '#주류보관', '#프리미엄디스플레이'],
    highlights: [
      '보관 조건과 디스플레이 조도를 함께 관리하는 설계',
      '주류 매장과 F&B 공간에 맞춘 전면 진열 구조',
      '개폐 빈도와 고객 동선을 반영한 운영 기준 제공',
    ],
    metrics: [
      { label: '보관 품목', value: '음료·주류' },
      { label: '핵심 관리', value: '온도·습도·조도' },
      { label: '적용 공간', value: '주류 매장·F&B' },
      { label: '디자인 포인트', value: '전면 진열' },
    ],
    gallery: createGallery(
      '쇼케이스 와인셀러',
      { src: productImage13 },
      { src: productImage08 },
      { src: heroImage01 },
    ),
    filters: {
      system: ['cellar'],
      product: ['beverage'],
      operation: ['temperature', 'layout'],
    },
  }),
];

export const catalogCategories = {
  'energy-solution': {
    id: 'energy-solution',
    label: '에너지솔루션',
    hero: {
      backgroundImageSrc: heroImage01,
      eyebrow: '에너지솔루션',
      title: '에너지솔루션',
      subtitle: '설비 효율과 친환경 전환을 동시에 설계하는 국제티엔씨 솔루션 카탈로그',
      description:
        '레퍼런스 사이트의 제품 리스트 구조를 기반으로, 국제티엔씨 에너지솔루션 제품과 제어 기술을 탐색할 수 있도록 구성한 임시 카탈로그입니다.',
      spotlight: ['친환경 냉매 전환', '에너지 절감 운전', '유지관리 최적화'],
    },
    tabs: energyTabs,
    filterGroups: energyFilterGroups,
    cards: energyCards,
  },
  'mechanical-hvac': {
    id: 'mechanical-hvac',
    label: '기계·공조설비',
    hero: {
      backgroundImageSrc: heroImage02,
      eyebrow: '기계·공조설비',
      title: '기계·공조설비',
      subtitle: '설계, 시공, 자동제어까지 이어지는 국제티엔씨 기계·공조설비 카탈로그',
      description:
        '하츠 레퍼런스의 화면 구조와 상호작용을 유지하면서, 국제티엔씨 기계·공조설비 항목을 기준으로 재구성한 임시 목록 페이지입니다.',
      spotlight: ['통합 설계', '현장 시공', '운전 최적화'],
    },
    tabs: mechanicalTabs,
    filterGroups: mechanicalFilterGroups,
    cards: mechanicalCards,
  },
  'refrigeration-system': {
    id: 'refrigeration-system',
    label: '냉장·냉동시스템',
    hero: {
      backgroundImageSrc: heroImage03,
      eyebrow: '냉장·냉동시스템',
      title: '냉장·냉동시스템',
      subtitle: '저온 유통과 쇼케이스 운영을 위한 국제티엔씨 냉장·냉동시스템 카탈로그',
      description:
        '하츠 제품소개 페이지와 같은 정보 구조를 먼저 맞춘 뒤, 국제티엔씨 냉장·냉동시스템 항목을 기준으로 카드와 상세 정보를 배치한 임시 구현입니다.',
      spotlight: ['전문 시공', '콜드체인', '쇼케이스 운영'],
    },
    tabs: refrigerationTabs,
    filterGroups: refrigerationFilterGroups,
    cards: refrigerationCards,
  },
} satisfies Record<CatalogCategorySlug, CatalogCategory>;

export const catalogCategoryList = Object.values(catalogCategories);

export const isCatalogCategorySlug = (value: string): value is CatalogCategorySlug => {
  return Object.prototype.hasOwnProperty.call(catalogCategories, value);
};

export const getCatalogCategory = (slug: string) => {
  return isCatalogCategorySlug(slug) ? catalogCategories[slug] : undefined;
};

export const getCatalogEntry = (categorySlug: string, itemSlug: string) => {
  const category = getCatalogCategory(categorySlug);

  if (!category) {
    return undefined;
  }

  const card = category.cards.find((entry) => entry.slug === itemSlug);

  if (!card) {
    return undefined;
  }

  return {
    card,
    category,
  };
};
