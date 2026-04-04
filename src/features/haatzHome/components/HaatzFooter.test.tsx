import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HaatzFooter from '@/features/haatzHome/components/HaatzFooter';
import styles from '@/features/haatzHome/components/HaatzFooter.module.scss';

describe('HaatzFooter', () => {
  it('renders the updated kookje footer information while removing family site and social areas', () => {
    render(
      <MemoryRouter>
        <HaatzFooter />
      </MemoryRouter>,
    );

    expect(screen.getByText('회사소개')).toBeInTheDocument();
    expect(screen.getByText('에너지솔루션')).toBeInTheDocument();
    expect(screen.getByText('기계·공조설비')).toBeInTheDocument();
    expect(screen.getByText('냉장·냉동시스템')).toBeInTheDocument();
    expect(screen.getByText('실적·정보지원')).toBeInTheDocument();
    expect(screen.getByText('이용약관')).toBeInTheDocument();
    expect(screen.getByText('개인정보처리방침')).toBeInTheDocument();
    expect(screen.getByText('이메일무단수집거부')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '이용약관' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Family Site' })).not.toBeInTheDocument();
    expect(screen.queryByAltText('Instagram')).not.toBeInTheDocument();

    expect(screen.getByText('㈜국제티엔씨')).toBeInTheDocument();
    expect(screen.getByText('김기백')).toBeInTheDocument();
    expect(
      screen.getByText('경기도 남양주시 다산순환로 20, 현대프리미어캠퍼스 AA동 926~928호'),
    ).toBeInTheDocument();
    expect(screen.getByText('1661-8860')).toBeInTheDocument();
    expect(screen.getByText('031-551-2253')).toBeInTheDocument();
    expect(screen.getByText('kjtnc@kookje2001.com')).toBeInTheDocument();
    expect(screen.getByText('132-81-86022')).toBeInTheDocument();
    expect(
      screen.getByText('Copyright ⓒ 2024 ㈜국제티엔씨. All Right Reserved.'),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'Built By newzest studio.' })).toHaveAttribute(
      'href',
      'https://www.newzeststudio.com',
    );

    const topLists = document.querySelectorAll('footer ul');
    const infoLists = document.querySelectorAll(`.${styles['infoList']}`);
    const firstInfoList = infoLists[0];
    const secondInfoList = infoLists[1];

    expect(topLists[0].textContent).toContain('회사소개');
    expect(topLists[0].textContent).toContain('실적·정보지원');
    expect(topLists[1].textContent).toContain('이용약관');
    expect(topLists[1].textContent).toContain('이메일무단수집거부');
    expect(infoLists).toHaveLength(2);
    expect(firstInfoList.textContent).toContain('상호');
    expect(firstInfoList.textContent).toContain('대표자');
    expect(firstInfoList.textContent).toContain('주소');
    expect(secondInfoList.textContent).toContain('TEL');
    expect(secondInfoList.textContent).toContain('FAX');
    expect(secondInfoList.textContent).toContain('E-MAIL');
    expect(secondInfoList.textContent).toContain('사업자등록번호');
  });
});
