import historyHeroBackgroundSrc from '@/assets/images/news/background.jpg';
import newsImage1 from '@/assets/images/news/news_image1.jpg';
import newsImage2 from '@/assets/images/news/news_image2.jpg';
import newsImage3 from '@/assets/images/news/news_image3.png';
import newsImage4 from '@/assets/images/news/news_image4.webp';
import newsImage5 from '@/assets/images/news/news_image5.jpg';
import productImage01 from '@/assets/images/products/1.직결팬.png';
import productImage11 from '@/assets/images/products/11.패널시스템.png';
import productImage02 from '@/assets/images/products/2.냉각수펌프인버터.png';
import productImage03 from '@/assets/images/products/3.문달기.png';
import productImage04 from '@/assets/images/products/4.시스템에어컨.png';
import type {
  HistoryDecadeMarker,
  HistoryEntry,
  HistoryHeroContent,
  HistorySubNavLink,
} from '@/features/aboutHistory/types';
import { routePaths } from '@/routes/routeRegistry';

const HISTORY_SNAPSHOT_BASE = '/reference/haatz-history/2026-03-31';
const historyAsset = (path: string) => {
  return `${HISTORY_SNAPSHOT_BASE}${path}`;
};

const createHistoryInternalLink = (to: string, label: string): HistorySubNavLink => {
  return {
    href: to,
    label,
    to,
  };
};

const createHistoryEntry = (
  year: number,
  slug: string,
  subject: string,
  description: string,
  imageSrc: string,
): HistoryEntry => {
  return {
    description,
    id: `history-${String(year)}-${slug}`,
    imageAlt: `${String(year)}년 ${subject} 연혁 이미지`,
    imageSrc,
    subject,
    year,
  };
};

export const historyHeroContent: HistoryHeroContent = {
  backgroundAlt: '국제티엔씨 연혁 페이지 상단 비주얼',
  backgroundSrc: historyHeroBackgroundSrc,
  description:
    '국제티엔씨는 처음 냉동·냉장 시스템의 기준을 다져온 순간부터,\n오늘의 에너지 효율화 솔루션과 친환경 자연냉매 CO₂ 시스템, 공조 기술에 이르기까지\n언제나 더 효율적인 설비와 더 지속가능한 환경을 위해 끊임없이 걸어왔습니다.',
  eyebrow: '경영이념·연혁',
  title: '지속가능한 내일을 설계하는 국제티엔씨',
};

export const historyTimelineBackgroundSrc = historyAsset('/background/history1-bg.jpg');

export const historySecondarySubNavLinks: HistorySubNavLink[] = [
  createHistoryInternalLink(routePaths.aboutGreeting, 'CEO인사말'),
  createHistoryInternalLink(routePaths.aboutHistory, '경영이념·연혁'),
  createHistoryInternalLink(routePaths.aboutCertification, '인증·특허'),
  createHistoryInternalLink(routePaths.aboutOrganization, '조직도'),
  createHistoryInternalLink(routePaths.aboutLocation, '사업장 위치'),
];

export const historyDecadeMarkers: HistoryDecadeMarker[] = [
  { endYear: 2004, key: '2000_2004', label: '2000', startYear: 2000 },
  { endYear: 2009, key: '2005_2009', label: '2005', startYear: 2005 },
  { endYear: 2014, key: '2010_2014', label: '2010', startYear: 2010 },
  { endYear: 2019, key: '2015_2019', label: '2015', startYear: 2015 },
  { endYear: 2024, key: '2020_2024', label: '2020', startYear: 2020 },
  { endYear: 2029, key: '2025_2029', label: '2025', startYear: 2025 },
];

export const historyEntries: HistoryEntry[] = [
  createHistoryEntry(2001, 'founding', '국제냉동기계 창립', '· 국제냉동기계 창립', newsImage2),
  createHistoryEntry(
    2009,
    'corporation',
    '(주) 국제티엔씨로 법인 전환',
    '· (주) 국제티엔씨로 법인 전환',
    newsImage5,
  ),
  createHistoryEntry(
    2010,
    'associations',
    '설비기술 단체 회원 가입',
    '· 한국설비기술협회 회원\n· 공조·냉동·설비연구조합 회원\n· 경기동부상공회의소 회원',
    productImage01,
  ),
  createHistoryEntry(
    2011,
    'guarantee',
    '대한설비건설공제조합 회원',
    '· 대한설비건설공제조합 회원',
    productImage11,
  ),
  createHistoryEntry(
    2012,
    'license',
    '기계설비 공사업 건설업 등록증 취득',
    '· 건설업 등록증 (기계설비 공사업) 취득',
    productImage04,
  ),
  createHistoryEntry(
    2013,
    'ibk',
    '기업은행 패밀리 기업 인증',
    '· 기업은행 패밀리 기업 인증',
    newsImage5,
  ),
  createHistoryEntry(
    2014,
    'clean-management',
    '클린경영인증 획득',
    '· 클린경영인증 획득',
    newsImage4,
  ),
  createHistoryEntry(
    2015,
    'copyright-design',
    '저작권 및 디자인 등록',
    '· 저작권 등록 (C-2015-013574호)외 10건\n· 디자인 등록 (제30-2014-0051620호)',
    productImage02,
  ),
  createHistoryEntry(2016, 'patent', '특허 등록', '· 특허 등록 (제10-1659465호)', productImage02),
  createHistoryEntry(
    2017,
    'research-quality',
    '기업부설연구소 설립 및 품질우수기업 선정',
    '· 기업부설연구소 설립\n· 구리시 우수기업 표창\n· 2017 한국품질우수기업 「냉난방공사」 부문',
    newsImage3,
  ),
  createHistoryEntry(
    2018,
    'guntner',
    'Guntner사 에어쿨러 공급계약',
    '· 독일 Guntner사와 냉동·냉장 에어쿨러 공급계약',
    productImage11,
  ),
  createHistoryEntry(
    2019,
    'kaplanlar',
    '쇼케이스 독점 공급 계약 및 기술 인증 확대',
    '· 국립전파연구원 적합등록 (쇼케이스 Plug-In)\n· 터키 Kaplanlar사와 쇼케이스 국내 독점 공급 계약\n· 한국환경공단 냉매회수업 등록\n· 대한기계설비협회 정회원\n· NICE평가정보 기술평가우수기업 인증',
    productImage03,
  ),
  createHistoryEntry(
    2020,
    'venture',
    '일생활균형 협약파트너 지정 및 벤처기업인증',
    '· 고용노동부 일생활균형 협약파트너 지정\n· 벤처기업인증 (기술보증기금)',
    productImage04,
  ),
  createHistoryEntry(
    2021,
    'innovation',
    '특허 등록 및 이노비즈 인증',
    '· 특허 등록 (제10-2335375호)\n· 구리지점 설립\n· 기술혁신형 중소기업 (Inno-Biz) 인증\n· 경기도지사 표창 (일자리창출)\n· 중소벤처기업진흥공당 인재육성형 중소기업 지정',
    newsImage4,
  ),
  createHistoryEntry(
    2022,
    'relocation',
    '본사 이전 및 다산지점 설립',
    '· 본사 이전 및 다산지점 설립 (쇼룸 조성)\n· 디자인등록 (제30-1150084호)',
    newsImage3,
  ),
  createHistoryEntry(
    2023,
    'mou',
    '경기도 유망중소기업 선정',
    '· 경기도 유망중소기업 선정\n· 식품 매장 도어 최다 제작 파트너사 MOU 체결',
    productImage03,
  ),
  createHistoryEntry(
    2024,
    'certifications',
    '디자인·특허 등록 및 공장 등록',
    '· 기술혁신형 중소기업(Inno-Biz) 재인증\n· 디자인 등록 (제30-1271019호)\n· 특허 등록 (제10-2675817호)\n· 남양주시 공장 등록\n· 디자인 등록 (제30-1273808호)\n· 조달청 등록\n· 기술역량 우수기업 인증',
    productImage02,
  ),
  createHistoryEntry(
    2025,
    'co2',
    '국내 대형마트 최초 CO₂ 시스템 설계 시공',
    '· 국내 대형마트 최초 CO₂ 시스템 설계 시공\n· Haier Carrier사 CO₂ 멀티시스템 독점 공급계약 체결\n· 남양주시 제2공장 등록\n· 실내건축 공사업 등록증 취득\n· 에너지 효율 특허제품 3종 MOU 체결\n· 롯데월드타워 공조기 필터 공급계약 체결',
    newsImage1,
  ),
];

export const historyInitialYear = historyEntries[0]?.year ?? 2001;

export const getHistoryDecadeMarker = (year: number) => {
  return (
    historyDecadeMarkers.find((marker) => year >= marker.startYear && year <= marker.endYear) ??
    historyDecadeMarkers[0]
  );
};
