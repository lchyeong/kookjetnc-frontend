import certificatePlaceholderSrc from '@/assets/images/certification/certificate-placeholder.svg';
import heroBackgroundSrc from '@/assets/images/news/background.jpg';
import type {
  CertificationCategoryMarker,
  CertificationEntry,
  CertificationHeroContent,
  CertificationSubNavLink,
} from '@/features/aboutCertification/types';
import { routePaths } from '@/routes/routeRegistry';

const ABOUT_SECTION_SNAPSHOT_BASE = '/reference/haatz-history/2026-03-31';

const aboutSectionAsset = (path: string) => {
  return `${ABOUT_SECTION_SNAPSHOT_BASE}${path}`;
};

const createCertificationInternalLink = (to: string, label: string): CertificationSubNavLink => {
  return {
    href: to,
    label,
    to,
  };
};

const createCertificationEntry = (
  categoryId: string,
  categoryLabel: string,
  index: number,
  title: string,
): CertificationEntry => {
  const serialLabel = String(index).padStart(2, '0');

  return {
    categoryId,
    categoryLabel,
    id: `${categoryId}-${serialLabel}`,
    imageAlt: `${title} 임시 증빙 이미지`,
    imageSrc: certificatePlaceholderSrc,
    sequence: index,
    serialLabel,
    title,
  };
};

export const certificationHeroContent: CertificationHeroContent = {
  backgroundAlt: '국제티엔씨 인증 및 특허 페이지 상단 비주얼',
  backgroundSrc: heroBackgroundSrc,
  description:
    '국제티엔씨의 인증서와 특허·디자인 등록 자산을\n연속적인 흐름으로 확인할 수 있도록 구성한 페이지입니다.',
  eyebrow: '인증·특허',
  title: '국제티엔씨가 축적해 온 인증과 권리의 흐름',
};

export const certificationArchiveBackgroundSrc = aboutSectionAsset('/background/history1-bg.jpg');

export const certificationSecondarySubNavLinks: CertificationSubNavLink[] = [
  createCertificationInternalLink(routePaths.aboutGreeting, 'CEO인사말'),
  createCertificationInternalLink(routePaths.aboutHistory, '경영이념·연혁'),
  createCertificationInternalLink(routePaths.aboutCertification, '인증·특허'),
  createCertificationInternalLink(routePaths.aboutOrganization, '조직도'),
  createCertificationInternalLink(routePaths.aboutLocation, '사업장 위치'),
];

export const certificationCategoryMarkers: CertificationCategoryMarker[] = [
  {
    count: 12,
    endIndex: 12,
    id: 'certification',
    label: '인증서',
    startIndex: 1,
  },
  {
    count: 9,
    endIndex: 21,
    id: 'patent-design',
    label: '특허·디자인',
    startIndex: 13,
  },
];

const certificationDocumentEntries = Array.from({ length: 12 }, (_, index) => {
  const certificationTitles = [
    '건설업 등록증',
    '실내건축업 등록증',
    '제 1공장 등록 증명서',
    '제 2공장 등록 증명서',
    '냉매회수업 등록증',
    '기술혁신형 중소기업 이노비즈 인증서',
    '벤처기업 확인서',
    '기술역량 우수기업 인증서',
    '인재육성형 중소기업 지정서',
    '유망중소기업 인증서',
    '한국품질우수 기업선정',
    '국립전파연구원 적합등록 필증',
  ] as const;

  return createCertificationEntry(
    'certification',
    '인증서',
    index + 1,
    certificationTitles[index] ?? `인증서 ${String(index + 1).padStart(2, '0')}`,
  );
});

const patentDesignEntries = Array.from({ length: 9 }, (_, index) => {
  const patentDesignTitles = [
    '쇼케이스용 라벨홀더 디자인',
    '에너지절감 라벨 디자인',
    '배수관 드레인용 슬러지 처리기 디자인',
    '와인 냉장고 쇼케이스형 디자인',
    'CO2 시스템 라벨',
    '파나소닉급프 렌치',
    '복합 냉각장치 및 필터 세정방법 특허',
    '와인 쇼케이스 특허',
    '냉동창고 안전관리 특허',
  ] as const;

  return createCertificationEntry(
    'patent-design',
    '특허·디자인',
    index + 13,
    patentDesignTitles[index] ?? `특허·디자인 ${String(index + 1).padStart(2, '0')}`,
  );
});

export const certificationEntries: CertificationEntry[] = [
  ...certificationDocumentEntries,
  ...patentDesignEntries,
];

export const certificationInitialEntry = certificationEntries[0];

export const getCertificationCategoryMarker = (entryIndex: number) => {
  return (
    certificationCategoryMarkers.find(
      (marker) => entryIndex >= marker.startIndex && entryIndex <= marker.endIndex,
    ) ?? certificationCategoryMarkers[0]
  );
};
