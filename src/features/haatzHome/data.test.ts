import { describe, expect, it } from 'vitest';

import callIcon from '@/assets/icons/icon_call.svg';
import kakaoIcon from '@/assets/icons/icon_kakao.svg';
import locationIcon from '@/assets/icons/icon_location.svg';
import { catalogCategories } from '@/features/catalog/data';
import {
  businessInquiryCategoryOptions,
  businessInquiryContactItems,
  businessInquiryPrivacyPolicy,
  businessInquirySectionContent,
  footerInfoItems,
  headerMenuGroups,
  newsCards,
  partnerLogos,
  productCards,
  quickLinks,
} from '@/features/haatzHome/data';
import { routePaths } from '@/routes/routeRegistry';

const expectedSubmenuLabels = {
  company: ['CEO인사말', '경영이념·연혁', '인증·특허', '조직도', '사업장 위치'],
  'energy-solution': [
    '자연냉매(CO2) 냉동냉장 멀티 시스템',
    '구트너 유니트 쿨러',
    '공조기 리필형 필터',
    '모터 직결제어시스템',
    '오픈 쇼케이스 도어',
  ],
  'mechanical-hvac': ['운영 컨설팅', '냉난방 설비', '공조설비', '위생설비', '자동제어'],
  'performance-info-support': ['시공사례', '공사실적', '기술자료', '웹카탈로그', '홍보영상'],
  'refrigeration-system': [
    '기술설계 · 전문시공',
    '수산물 콜드체인시스템',
    '유지보수 서비스',
    '내치형 냉동 쇼케이스',
    '쇼케이스 와인셀러',
  ],
} as const;

const expectedCatalogTopLevelTargets = {
  'energy-solution': routePaths.energySolution,
  'mechanical-hvac': routePaths.mechanicalHvac,
  'refrigeration-system': routePaths.refrigerationSystem,
} as const;

const expectedCatalogTabTargets = {
  'energy-solution': [
    routePaths.energySolution,
    routePaths.energySolution,
    routePaths.energySolution,
    routePaths.energySolution,
    routePaths.energySolution,
  ],
  'mechanical-hvac': [
    routePaths.mechanicalHvac,
    routePaths.mechanicalHvac,
    routePaths.mechanicalHvac,
    routePaths.mechanicalHvac,
    routePaths.mechanicalHvac,
  ],
  'refrigeration-system': [
    routePaths.refrigerationSystem,
    routePaths.refrigerationSystem,
    routePaths.refrigerationSystem,
    routePaths.refrigerationSystem,
    routePaths.refrigerationSystem,
  ],
} as const;

const expectedProductTitles = [
  '직결팬',
  '냉각수 펌프 인버터',
  '문달기',
  '시스템에어컨',
  '스탠드에어컨',
  '콜드체인',
  '오픈다단',
  '리치인',
  '평대',
  '유니트쿨러',
  '패널시스템',
  '워크인',
  '와인쇼케이스',
  '곤도라',
] as const;

const expectedMediaCoverageLinks = [
  'https://www.coldchainnews.kr/news/article.html?no=27790',
  'https://www.kyeonggi.com/article/20250929580341',
  'https://www.handmk.com/news/articleView.html?idxno=32497',
  'https://kangso.co.kr/View.aspx?No=3770299',
  'https://www.kharn.kr/news/article.html?no=30198',
] as const;

describe('haatz header menu data', () => {
  it('exposes the five top-level menu groups in the requested order', () => {
    expect(headerMenuGroups.map((group) => group.label)).toEqual([
      '회사소개',
      '에너지솔루션',
      '기계·공조설비',
      '냉장·냉동시스템',
      '실적·정보지원',
    ]);
  });

  it('keeps the current header groups structure while exposing the catalog routes and company pages as internal routes', () => {
    expect(headerMenuGroups).toHaveLength(5);

    for (const group of headerMenuGroups) {
      const expectedItems = expectedSubmenuLabels[group.id as keyof typeof expectedSubmenuLabels];

      expect(group.hoverItems.map((item) => item.label)).toEqual(expectedItems);
      expect(group.items.map((item) => item.label)).toEqual(expectedItems);

      if (group.id === 'company') {
        expect(group.isPlaceholder).toBe(true);
        expect(group.href).toBe('#');
        expect(group.to).toBeUndefined();

        const historyHoverItem = group.hoverItems.find((item) => item.label === '경영이념·연혁');
        const historyItem = group.items.find((item) => item.label === '경영이념·연혁');
        const certificationHoverItem = group.hoverItems.find((item) => item.label === '인증·특허');
        const certificationItem = group.items.find((item) => item.label === '인증·특허');

        expect(historyHoverItem).toMatchObject({
          href: routePaths.aboutHistory,
          label: '경영이념·연혁',
          to: routePaths.aboutHistory,
        });
        expect(historyItem).toMatchObject({
          href: routePaths.aboutHistory,
          label: '경영이념·연혁',
          to: routePaths.aboutHistory,
        });
        expect(certificationHoverItem).toMatchObject({
          href: routePaths.aboutCertification,
          label: '인증·특허',
          to: routePaths.aboutCertification,
        });
        expect(certificationItem).toMatchObject({
          href: routePaths.aboutCertification,
          label: '인증·특허',
          to: routePaths.aboutCertification,
        });
        expect(
          group.hoverItems
            .filter((item) => item.label !== '경영이념·연혁' && item.label !== '인증·특허')
            .every((item) => item.href === '#' && item.isPlaceholder),
        ).toBe(true);
        expect(
          group.items
            .filter((item) => item.label !== '경영이념·연혁' && item.label !== '인증·특허')
            .every((item) => item.href === '#' && item.isPlaceholder),
        ).toBe(true);
        continue;
      }

      if (group.id === 'performance-info-support') {
        expect(group.isPlaceholder).toBe(true);
        expect(group.href).toBe('#');
        expect(group.to).toBeUndefined();
        expect(group.hoverItems.every((item) => item.href === '#' && item.isPlaceholder)).toBe(
          true,
        );
        expect(group.items.every((item) => item.href === '#' && item.isPlaceholder)).toBe(true);
        continue;
      }

      const expectedTopLevelTarget =
        expectedCatalogTopLevelTargets[group.id as keyof typeof expectedCatalogTopLevelTargets];
      const expectedTabTargets =
        expectedCatalogTabTargets[group.id as keyof typeof expectedCatalogTabTargets];

      expect(group.isPlaceholder).toBeUndefined();
      expect(group.href).toBe(expectedTopLevelTarget);
      expect(group.to).toBe(expectedTopLevelTarget);
      expect(group.hoverItems.map((item) => item.href)).toEqual(expectedTabTargets);
      expect(group.hoverItems.map((item) => item.to)).toEqual(expectedTabTargets);
      expect(group.hoverItems.every((item) => item.isPlaceholder !== true)).toBe(true);
      expect(group.items.map((item) => item.href)).toEqual(expectedTabTargets);
      expect(group.items.map((item) => item.to)).toEqual(expectedTabTargets);
      expect(group.items.every((item) => item.isPlaceholder !== true)).toBe(true);
    }
  });

  it('keeps each catalog submenu aligned with the visible catalog product titles', () => {
    const catalogGroupIds = ['energy-solution', 'mechanical-hvac', 'refrigeration-system'] as const;

    for (const groupId of catalogGroupIds) {
      const menuGroup = headerMenuGroups.find((group) => group.id === groupId);
      const catalogTitles = catalogCategories[groupId].cards.map((card) => card.title);

      expect(menuGroup?.hoverItems.map((item) => item.label)).toEqual(catalogTitles);
    }
  });
});

describe('haatz quick menu data', () => {
  it('exposes the requested quick menu items in order with placeholder links', () => {
    expect(quickLinks).toEqual([
      {
        href: '#',
        id: 'call',
        imageAlt: 'A/S 신청 아이콘',
        imageSrc: callIcon,
        isPlaceholder: true,
        label: 'A/S 신청',
        lines: ['A/S 신청'],
      },
      {
        href: '#',
        id: 'kakao',
        imageAlt: '카카오톡 아이콘',
        imageSrc: kakaoIcon,
        isPlaceholder: true,
        label: '카카오톡',
        lines: ['카카오톡'],
      },
      {
        href: '#',
        id: 'location',
        imageAlt: '위치안내 아이콘',
        imageSrc: locationIcon,
        isPlaceholder: true,
        label: '위치안내',
        lines: ['위치안내'],
      },
    ]);
  });
});

describe('core equipment portfolio product data', () => {
  it('exposes the 14 requested equipment cards in numeric asset order with placeholder links', () => {
    expect(productCards).toHaveLength(14);
    expect(productCards.map((card) => card.title)).toEqual(expectedProductTitles);
    expect(productCards.every((card) => card.href === '#')).toBe(true);
    expect(productCards.every((card) => card.description.length > 0)).toBe(true);
    expect(new Set(productCards.map((card) => card.id)).size).toBe(14);
  });
});

describe('media coverage data', () => {
  it('exposes the five requested article cards in the provided link order', () => {
    expect(newsCards).toHaveLength(5);
    expect(newsCards.map((card) => card.href)).toEqual(expectedMediaCoverageLinks);
    expect(newsCards.every((card) => card.target === '_blank')).toBe(true);
    expect(newsCards.every((card) => card.description.length > 0)).toBe(true);
    expect(newsCards.every((card) => /^\d{4}\.\d{2}\.\d{2}$/.test(card.date))).toBe(true);
  });
});

describe('business inquiry data', () => {
  it('exposes the inquiry copy, privacy policy data, category options, contact items, and footer values needed by the home form', () => {
    expect(businessInquirySectionContent.title).toBe('국제티엔씨 사업 문의');
    expect(businessInquirySectionContent.description).toBe(
      '유통, 물류, 호텔 등 다양한 산업 군의 고객사와 협력적 파트너십 관계를 구축하고 있습니다.',
    );
    expect(businessInquirySectionContent.submitLabel).toBe('문의 접수하기');
    expect(businessInquirySectionContent.privacyModalTitle).toBe('개인정보처리방침');
    expect(businessInquirySectionContent.marketingNotice).toContain('마케팅 정보');
    expect(businessInquiryPrivacyPolicy.title).toBe('개인정보처리방침');
    expect(businessInquiryPrivacyPolicy.sections).toHaveLength(8);
    expect(businessInquiryPrivacyPolicy.sections[0].title).toBe(
      '1. 수집하는 개인정보의 항목 및 수집방법',
    );
    expect(businessInquiryCategoryOptions.map((item) => item.value)).toEqual([
      '',
      'refrigeration-system',
      'mechanical-hvac',
      'energy-solution',
      'service-maintenance',
      'other',
    ]);
    expect(footerInfoItems).toEqual([
      { label: '상호', value: '㈜국제티엔씨' },
      { label: '대표자', value: '김기백' },
      {
        label: '주소',
        value: '경기도 남양주시 다산순환로 20, 현대프리미어캠퍼스 AA동 926~928호',
      },
      { label: 'TEL', value: '1661-8860' },
      { label: 'FAX', value: '031-551-2253' },
      { label: 'E-MAIL', value: 'kjtnc@kookje2001.com' },
      { label: '사업자등록번호', value: '132-81-86022' },
    ]);
    expect(businessInquiryContactItems.map((item) => item.id)).toEqual([
      'phone',
      'email',
      'address',
    ]);
    expect(businessInquiryContactItems[0].href).toMatch(/^tel:/);
    expect(businessInquiryContactItems[0].value).toBe('1661-8860');
    expect(businessInquiryContactItems[1].href).toMatch(/^mailto:/);
    expect(businessInquiryContactItems[1].value).toBe('kjtnc@kookje2001.com');
    expect(businessInquiryContactItems[2].value).toBe(
      '경기도 남양주시 다산순환로 20, 현대프리미어캠퍼스 AA동 926~928호',
    );
    expect(partnerLogos.length).toBeGreaterThan(0);
    expect(new Set(partnerLogos.map((item) => item.id)).size).toBe(partnerLogos.length);
    expect(partnerLogos.map((item) => item.name)).toEqual(
      [...partnerLogos.map((item) => item.name)].sort((firstName, secondName) => {
        return firstName.localeCompare(secondName, 'ko');
      }),
    );
    expect(partnerLogos.map((item) => item.name)).toEqual(
      expect.arrayContaining(['롯데마트', '쿠팡', '한국전력']),
    );
    expect(partnerLogos.every((item) => item.alt === `${item.name} 로고`)).toBe(true);
  });
});
