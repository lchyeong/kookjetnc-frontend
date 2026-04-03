import heroImage01 from '@/assets/images/1번이미지.jpg';
import heroImage02 from '@/assets/images/2번이미지.jpg';
import heroImage03 from '@/assets/images/3번이미지.jpg';
import heroImage04 from '@/assets/images/4번이미지.jpg';
import { energyImages } from '@/assets/images/energy';
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
  CatalogSeriesTab,
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
  seriesTabs?: CatalogSeriesTab[];
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
    imageSrc: energyImages.co2.multiSystem,
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
      { src: energyImages.co2.multiSystem },
      { src: energyImages.co2.multiSystem },
      { src: energyImages.co2.multiSystem },
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
    model: 'GACC · GASC · GADC · GACV',
    summary:
      '식품 냉동·냉장 공간의 위생 기준, 풍량 방향, 설치 공간 제약에 맞춰 선택할 수 있는 Güntner 에어쿨러 제품군입니다.',
    detailDescription:
      '군트너 에어쿨러는 HACCP 위생 대응, Eurovent 및 TUV/PED 기반의 성능·안전 기준, 부식 방지 소재 옵션을 공통 기반으로 두고 설치 공간과 냉기 분포 방식에 따라 모델을 나눕니다. 저장고와 워크인 공간 중심의 GACC, 슬림 설치가 필요한 GASC, 양방향 토출이 필요한 GADC, 폭넓은 사양 선택이 가능한 GACV로 운영 조건에 맞춰 선택할 수 있도록 구성했습니다.',
    imageSrc: energyImages.guntner.gallery.gacc01,
    imageAlt: '구트너 유니트 쿨러 이미지',
    tags: ['#군트너', '#유니트쿨러', '#HACCP'],
    highlights: [
      'HACCP 위생 인증 기반의 식품 안전 재질과 손쉬운 세척 구조를 공통 전제로 둔 Güntner 에어쿨러 제품군입니다.',
      'Eurovent 멤버십과 TUV/PED 대응 기준을 바탕으로 성능 검증과 압력 장비 기준을 함께 고려합니다.',
      '냉동·냉장 저장고, 작업장, 물류 신선실처럼 공간 특성이 다른 현장에 맞춰 컴팩트·슬림·듀얼·바리오 계열을 선택할 수 있습니다.',
      '공통 위생 기준과 내식성 설계를 바탕으로 공간 조건과 냉기 분포 방식에 맞는 제품군 선택이 가능합니다.',
    ],
    metrics: [
      { label: '적용 공간', value: '저장고·작업장·물류존' },
      { label: '모델 구성', value: 'GACC / GASC / GADC / GACV' },
      { label: '공통 기준', value: '위생·내식성·정비성' },
      { label: '운영 포인트', value: '공간별 맞춤 선택' },
    ],
    gallery: createGallery(
      '구트너 유니트 쿨러',
      { src: energyImages.guntner.gallery.gacc01, alt: '구트너 유니트 쿨러 갤러리 이미지 1' },
      { src: energyImages.guntner.gallery.gacc02, alt: '구트너 유니트 쿨러 갤러리 이미지 2' },
      { src: energyImages.guntner.gallery.gacc03, alt: '구트너 유니트 쿨러 갤러리 이미지 3' },
    ),
    detailImages: createGallery('구트너 유니트 쿨러 공통 정보', {
      src: energyImages.guntner.catalogPages.common,
      alt: '구트너 유니트 쿨러 공통 인증 및 제품군 정보',
    }),
    seriesTabs: [
      {
        id: 'gacc',
        label: 'GACC',
        model: 'Cubic COMPACT Air Cooler',
        summary:
          '컴팩트한 본체와 위생 중심 구조를 바탕으로 냉동·냉장 저장고와 워크인 공간에 폭넓게 적용하는 기본형 라인입니다.',
        detailDescription:
          '샘플 페이지와 카달로그 기준 GACC는 저장고와 워크인 공간에 맞춘 대표 라인입니다. 컴팩트한 큐빅 디자인, HACCP 대응 구조, 경첩식 트레이와 천장 브라켓 구성을 통해 설치와 유지관리 접근성을 확보하고, 부식 방지 AlMg 케이스와 코일 보호 옵션으로 장기 운영 안정성을 확보합니다.',
        tags: ['#GACC', '#컴팩트', '#워크인'],
        highlights: [
          '중형 냉동·냉장 저장고와 대형마트 워크인 공간에 맞춘 큐빅형 유니트 쿨러입니다.',
          '식품 안전 재질과 손쉬운 세척 구조를 전제로 하는 HACCP 위생 인증 제품군입니다.',
          '부식 방지 AlMg 알루미늄 합금 케이스와 분체도장 마감으로 내식성과 유지관리를 함께 확보합니다.',
          '샘플 기준 냉동·냉장 겸용 모델부터 워크인 냉동·냉장, 소생고 대응 모델까지 폭이 넓습니다.',
        ],
        metrics: [
          { label: '권장 공간', value: '저장고·워크인' },
          { label: '대표 구조', value: '컴팩트 천장형' },
          { label: '주요 포인트', value: '컴팩트·위생' },
        ],
        gallery: createGallery(
          '구트너 유니트 쿨러 GACC',
          { src: energyImages.guntner.gallery.gacc01, alt: '구트너 유니트 쿨러 GACC 이미지 1' },
          { src: energyImages.guntner.gallery.gacc02, alt: '구트너 유니트 쿨러 GACC 이미지 2' },
          { src: energyImages.guntner.gallery.gacc03, alt: '구트너 유니트 쿨러 GACC 이미지 3' },
        ),
        detailImages: createGallery('구트너 유니트 쿨러 GACC', {
          src: energyImages.guntner.catalogPages.gacc,
          alt: '구트너 유니트 쿨러 GACC 카달로그 이미지',
        }),
      },
      {
        id: 'gasc',
        label: 'GASC',
        model: 'Slim COMPACT Air Cooler',
        summary:
          '슬림한 평면형 본체와 EC 팬 옵션을 중심으로 작업장과 소분실의 공간 활용을 높이는 공간 절약형 라인입니다.',
        detailDescription:
          '카달로그 기준 GASC는 작업장 및 소분실처럼 장비 돌출을 줄여야 하는 공간을 겨냥합니다. 슬림 디자인으로 천장 점유를 최소화하고, 식품 안전 재질과 힌지 구조로 위생 점검성을 확보하며, EC 팬 옵션과 ErP 대응으로 에너지 절감 운영에 유리한 구성을 제공합니다.',
        tags: ['#GASC', '#슬림형', '#EC팬'],
        highlights: [
          '슬림 디자인으로 공간 활용을 극대화해 소형 저온실과 작업장 동선 간섭을 줄입니다.',
          'HACCP 위생 인증 기반의 식품 안전 재질과 접이식 트레이 구조로 청소와 점검이 쉽습니다.',
          '카달로그 기준 EC fan 선택 시 최대 60% 수준의 에너지 절감 운전을 기대할 수 있습니다.',
          '부식 방지 AlMg 알루미늄 합금 케이스와 Coil Defender 계열 옵션으로 내식성을 높일 수 있습니다.',
        ],
        metrics: [
          { label: '권장 공간', value: '작업장·소분실' },
          { label: '대표 구조', value: '슬림 평면형' },
          { label: '주요 포인트', value: '슬림·에너지 절감' },
        ],
        gallery: createGallery(
          '구트너 유니트 쿨러 GASC',
          {
            src: energyImages.guntner.catalogPages.gasc,
            alt: '구트너 유니트 쿨러 GASC 카달로그 이미지 1',
          },
          {
            src: energyImages.guntner.catalogPages.common,
            alt: '구트너 유니트 쿨러 공통 인증 이미지',
          },
          {
            src: energyImages.guntner.catalogPages.gasc,
            alt: '구트너 유니트 쿨러 GASC 카달로그 이미지 2',
          },
        ),
        detailImages: createGallery('구트너 유니트 쿨러 GASC', {
          src: energyImages.guntner.catalogPages.gasc,
          alt: '구트너 유니트 쿨러 GASC 카달로그 이미지',
        }),
      },
      {
        id: 'gadc',
        label: 'GADC',
        model: 'Dual COMPACT Air Cooler',
        summary:
          '양방향 균일 토출과 평면형 구성을 바탕으로 대형마트 쿨링존과 물류 신선실처럼 긴 공간에 대응하는 라인입니다.',
        detailDescription:
          '카달로그 기준 GADC는 평면형 본체와 양방향 냉기 분포를 핵심으로 합니다. 공기 교환이 잦은 물류·매장 공간에서 부드럽고 균일한 냉기 분포를 제공하고, 제습이 강하지 않아 신선식품 보관에 유리하며, 드레인 파이프를 최소화하는 설치 구성이 특징입니다.',
        tags: ['#GADC', '#양방향토출', '#신선실'],
        highlights: [
          '긴 실내 공간의 중앙에서 양쪽으로 냉기를 분배해 균일한 냉각을 유도합니다.',
          '대형마트 쿨링존과 물류창고 신선실처럼 출입이 잦은 공간의 온도 편차 대응에 적합합니다.',
          '제습이 강하지 않아 신선식품 보관 환경에 유리하며 작업 구역의 체감 냉풍을 낮추는 데 유리합니다.',
          '위생 설계와 부식 방지 케이스, 드레인 배관 부담을 낮춘 설치 구성이 함께 강조됩니다.',
        ],
        metrics: [
          { label: '권장 공간', value: '쿨링존·신선실' },
          { label: '대표 구조', value: '양방향 평면형' },
          { label: '주요 포인트', value: '양방향·저제습' },
        ],
        gallery: createGallery(
          '구트너 유니트 쿨러 GADC',
          {
            src: energyImages.guntner.catalogPages.gadc,
            alt: '구트너 유니트 쿨러 GADC 카달로그 이미지 1',
          },
          {
            src: energyImages.guntner.catalogPages.common,
            alt: '구트너 유니트 쿨러 공통 인증 이미지',
          },
          {
            src: energyImages.guntner.catalogPages.gadc,
            alt: '구트너 유니트 쿨러 GADC 카달로그 이미지 2',
          },
        ),
        detailImages: createGallery('구트너 유니트 쿨러 GADC', {
          src: energyImages.guntner.catalogPages.gadc,
          alt: '구트너 유니트 쿨러 GADC 카달로그 이미지',
        }),
      },
      {
        id: 'gacv',
        label: 'GACV',
        model: 'Cubic VARIO Air Cooler',
        summary:
          '폭넓은 케이싱 구성과 팬 조합, 재질 선택을 지원해 현장 조건에 맞춘 맞춤 구성이 가능한 바리오형 라인입니다.',
        detailDescription:
          'GACV는 다양한 케이싱 설계와 팬 조합, 재질 선택이 가능한 바리오형 에어쿨러입니다. 힌지형 드립 트레이와 팬 플레이트 구조로 세척과 점검이 쉽고, 전기·핫가스·브라인 제상 방식과 에어 인렛 후드, 다운블로우 덕트, 에어 삭스 연결 같은 부속 옵션을 폭넓게 조합할 수 있어 산업용 냉각 현장의 맞춤 구성이 용이합니다.',
        tags: ['#GACV', '#VARIO', '#커스터마이즈'],
        highlights: [
          '공식 Güntner 기준으로 다양한 케이싱 설계, 팬 콘셉트, 재질 조합을 선택할 수 있는 바리오형 에어쿨러입니다.',
          '힌지형 드립 트레이와 팬 플레이트 구조로 세척과 육안 점검 접근성을 높였습니다.',
          '식품 안전 재질, 자연냉매 최적화, AC·EC 팬 선택, 전기·핫가스·브라인 제상 옵션을 폭넓게 제공합니다.',
          '에어 인렛 후드, 다운블로우 덕트, 에어 삭스 연결 등 현장별 부속 옵션 확장이 넓은 편입니다.',
        ],
        metrics: [
          { label: '권장 공간', value: '맞춤형 산업 냉각' },
          { label: '대표 구조', value: '바리오 커스터마이즈형' },
          { label: '주요 포인트', value: '커스터마이즈·위생' },
        ],
        gallery: createGallery(
          '구트너 유니트 쿨러 GACV',
          {
            src: energyImages.guntner.catalogPages.common,
            alt: '구트너 유니트 쿨러 공통 제품군 이미지 1',
          },
          {
            src: energyImages.guntner.catalogPages.common,
            alt: '구트너 유니트 쿨러 공통 제품군 이미지 2',
          },
          {
            src: energyImages.guntner.catalogPages.common,
            alt: '구트너 유니트 쿨러 공통 제품군 이미지 3',
          },
        ),
      },
    ],
    filters: {
      application: ['cold-storage', 'logistics'],
      equipment: ['cooler'],
      priority: ['maintenance', 'energy-saving'],
    },
  }),
  createCard('energy-solution', {
    id: 'ahu-refill-filter-modular',
    tabId: 'ahu-refill-filter',
    title: '공조기 리필형 필터',
    model: '리필형 프리필터 · 미듐필터',
    summary:
      '기존 공조기 프레임을 재사용하고 필터만 간편 교체하는 특허형 구조로 유지관리비와 에너지 비용을 함께 줄이는 공조기 필터 솔루션입니다.',
    detailDescription:
      '기계설비 브로셔 기준 공조기 리필형 필터는 재사용 특허 프레임에 리필형 미듐필터와 프리필터를 결합해 적용하는 구조입니다. 최초 1회 기존 공조기에 프레임을 삽입한 뒤에는 필터만 교체하는 방식으로 운용해 프레임 폐기와 교체 시간을 줄이고, 다중망 필터 적용과 난연 소재 구성을 통해 공기질 확보와 에너지 비용 절감, 유지관리 안전성을 함께 고려합니다.',
    imageSrc: productImage04,
    imageAlt: '공조기 리필형 필터 이미지',
    tags: ['#공조기', '#리필형필터', '#특허제품'],
    highlights: [
      '프레임 하나에 두 개 필터를 적용하는 일체형 리필 구조로 최초 설치 후에는 필터만 교환하는 방식입니다.',
      '기존 공조기에 프레임을 삽입해 재사용하고, 필터만 교체해 프레임은 약 5~10년 재사용하는 운용을 전제로 합니다.',
      '다중망 필터 구조와 공기 누수 저감 구조로 공조기 에너지 비용 절감과 상용 인증 확보를 함께 강조합니다.',
      '브로셔 기준 난연 소재 적용, 폐기물 저감, 롯데타워 공급 계약 사례까지 포함된 특허 제품군입니다.',
    ],
    metrics: [
      { label: '적용 설비', value: '공조기·AHU' },
      { label: '교체 방식', value: '필터만 교체' },
      { label: '프레임 운용', value: '약 5~10년 재사용' },
      { label: '운영 효과', value: '유지관리비·폐기물 절감' },
    ],
    gallery: createGallery(
      '공조기 리필형 필터',
      { src: productImage04, alt: '공조기 리필형 필터 대표 이미지' },
      {
        src: energyImages.ahuFilter.replacementProcess,
        alt: '공조기 리필형 필터 교체 전중후 이미지',
      },
      {
        src: energyImages.ahuFilter.comparisonChart,
        alt: '공조기 리필형 필터 비교표 이미지',
      },
    ),
    detailImages: createGallery(
      '공조기 리필형 필터',
      {
        src: energyImages.ahuFilter.brochurePage,
        alt: '공조기 리필형 필터 브로셔 상세 이미지',
      },
      {
        src: energyImages.ahuFilter.comparisonChart,
        alt: '공조기 리필형 필터 비교 자료 이미지',
      },
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
    model: '저전력 직결팬 · Easy Shaft',
    summary:
      '벨트와 풀리 구조를 줄인 저전력 직결 기술로 공조 송풍기의 전력 사용량과 유지관리 부담을 함께 낮추는 특허형 직결 제어 솔루션입니다.',
    detailDescription:
      '기계설비 브로셔 기준 저전력 직결팬은 벨트와 체인, 구리스 주입 요소를 줄인 일체형 직결 구조를 통해 30~40% 전력 절감 효과를 제안합니다. 무벨트 운용으로 유지보수가 쉬워지고 관리자의 안전사고 예방에 유리하며, 고효율 모터와 인버터 설치 시 관련 지원금 대상까지 고려하는 구성을 특징으로 합니다. 리뉴얼 가이드 18페이지의 제안 자료는 Easy Shaft 구조와 에너지 절감, 유지보수 비용 감소, 안전사고 예방 관점의 보조 설명 자료로 함께 활용할 수 있습니다.',
    imageSrc: productImage01,
    imageAlt: '모터 직결제어시스템 이미지',
    tags: ['#직결제어', '#저전력직결팬', '#전력절감'],
    highlights: [
      '특허 기반 저전력 직결 기술로 안전성을 확보하면서 약 30~40% 수준의 전력 절감 효과를 제안합니다.',
      '벨트, 체인, 구리스 주입 요소를 줄여 유지보수 관리가 쉬워지고 유지관리비 절감에 유리합니다.',
      '무벨트 구조로 관리자의 유지보수 편의와 작업 안전성을 함께 높이는 방향으로 설계되었습니다.',
      '브로셔 기준 고효율 모터 및 인버터 설치 시 관련 지원금 대상까지 고려하는 제품군입니다.',
    ],
    metrics: [
      { label: '적용 설비', value: '공조 송풍기·냉각탑 팬' },
      { label: '구동 방식', value: '직결형 일체 구조' },
      { label: '전력 효과', value: '약 30~40% 절감' },
      { label: '운영 포인트', value: '유지관리·안전성 개선' },
    ],
    gallery: createGallery(
      '모터 직결제어시스템',
      { src: productImage01, alt: '모터 직결제어시스템 대표 이미지' },
      {
        src: energyImages.motorDirectControl.easyShaftComparison,
        alt: '모터 직결제어시스템 Easy Shaft 비교 이미지',
      },
      {
        src: energyImages.motorDirectControl.valuePropositionPanels,
        alt: '모터 직결제어시스템 가치 제안 이미지',
      },
    ),
    detailImages: createGallery(
      '모터 직결제어시스템',
      {
        src: energyImages.motorDirectControl.brochurePage,
        alt: '모터 직결제어시스템 브로셔 상세 이미지',
      },
      {
        src: energyImages.motorDirectControl.guidePage,
        alt: '모터 직결제어시스템 가이드 참고 이미지',
      },
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
    model: 'Sliding Door · Swing Door',
    summary:
      '오픈다단 쇼케이스에 Sliding 또는 Swing 도어를 적용해 냉기 손실을 줄이고 전기료 절감, 정부지원금 활용, 투자비 회수까지 함께 검토하는 리테일 개선 솔루션입니다.',
    detailDescription:
      '리뉴얼 가이드 19페이지 기준 오픈 쇼케이스 도어는 기존 문달기 제안의 특장점과 시공 사례를 유지하면서 Sliding Door와 Swing Door 두 타입으로 정리하는 방향입니다. 카달로그 기준 Sliding Door는 2m 미만의 좁은 동선에 적합하고 Swing Door 대비 약 15% 저렴하며, 약 40% 전기료 절감과 60% 수준의 정부지원금 혜택으로 9개월 내 투자비 회수를 제안합니다. Swing Door는 넓은 동선과 고습 환경에 적합하고 결로방지히터 적용으로 상품 시인성을 높이며, 약 40% 전기료 절감과 50% 수준의 정부지원금 혜택으로 13개월 내 투자비 회수를 제안합니다.',
    imageSrc: productImage03,
    imageAlt: '오픈 쇼케이스 도어 이미지',
    tags: ['#쇼케이스도어', '#리테일개선', '#전기료절감'],
    highlights: [
      'Sliding Door는 좁은 동선에 적합하고 Swing Door 대비 약 15% 저렴한 구성이 특징입니다.',
      'Swing Door는 넓은 동선과 고습 환경에 적합하며 결로방지히터 적용으로 상품 시인성을 높입니다.',
      '두 타입 모두 카달로그 기준 약 40% 전기료 절감 효과와 한전 지원 기준 충족을 전제로 구성됩니다.',
      '리뉴얼 가이드 기준 시공 공정 안내와 실제 설치 사례를 함께 활용하는 업데이트형 상세 페이지 구성 대상입니다.',
    ],
    metrics: [
      { label: '적용 대상', value: '오픈 쇼케이스' },
      { label: '도어 타입', value: 'Sliding · Swing' },
      { label: '운영 효과', value: '전기료 약 40% 절감' },
      { label: '도입 포인트', value: '지원금·투자비 회수' },
    ],
    gallery: createGallery(
      '오픈 쇼케이스 도어',
      { src: productImage03 },
      { src: productImage07 },
      { src: productImage08 },
    ),
    detailImages: createGallery(
      '오픈 쇼케이스 도어',
      {
        src: energyImages.openShowcaseDoor.catalogPage71,
        alt: '오픈 쇼케이스 도어 슬라이딩 도어 카달로그 이미지',
      },
      {
        src: energyImages.openShowcaseDoor.catalogPage72,
        alt: '오픈 쇼케이스 도어 스윙 도어 카달로그 이미지',
      },
      {
        src: energyImages.openShowcaseDoor.guidePage19,
        alt: '오픈 쇼케이스 도어 리뉴얼 가이드 이미지',
      },
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
