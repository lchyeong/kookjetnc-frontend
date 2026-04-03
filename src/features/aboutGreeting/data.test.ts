import { describe, expect, it } from 'vitest';

import {
  greetingHeroContent,
  greetingMessageContent,
  greetingSecondarySubNavLinks,
} from '@/features/aboutGreeting/data';

describe('about greeting data', () => {
  it('exposes the hero copy and company sub navigation links', () => {
    expect(greetingHeroContent.eyebrow).toBe('CEO인사말');
    expect(greetingHeroContent.title).toBe(
      '365일 신속한 대응과 끊임없는 신기술 연구를 통해\n고객의 가치를 창출하고자 노력하고 있습니다.',
    );
    expect(greetingSecondarySubNavLinks.map((link) => link.label)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(greetingSecondarySubNavLinks[0]).toMatchObject({
      href: '/about/greeting',
      label: 'CEO인사말',
      to: '/about/greeting',
    });
  });

  it('exposes the ceo greeting copy and sample asset references', () => {
    expect(greetingMessageContent.sectionEyebrow).toBe('대표 인사');
    expect(greetingMessageContent.title).toBe(
      '국제티엔씨는 기술과 책임으로 고객의 미래를 준비합니다.',
    );
    expect(greetingMessageContent.companyLabel).toBe('㈜국제티엔씨 대표이사');
    expect(greetingMessageContent.paragraphs).toHaveLength(3);
    expect(greetingMessageContent.paragraphs[0]).toContain('2001년');
    expect(greetingMessageContent.paragraphs[1]).toContain('정확한 설계, 완벽한 시공');
    expect(greetingMessageContent.paragraphs[2]).toContain('환경적 책임을 다하기 위해');
    expect(greetingMessageContent.portraitSrc).toContain('tnc-ceo.jpg');
    expect(greetingMessageContent.signatureSrc).toContain('sign.png');
  });
});
