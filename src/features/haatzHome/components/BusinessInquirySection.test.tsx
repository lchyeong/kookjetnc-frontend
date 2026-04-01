import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BusinessInquirySection from '@/features/haatzHome/components/BusinessInquirySection';
import { businessInquiryContactItems, partnerLogos } from '@/features/haatzHome/data';

describe('BusinessInquirySection', () => {
  it('renders the condensed inquiry copy, looping partner logos, and centered form fields without the info panel', () => {
    const { container } = render(<BusinessInquirySection />);

    const phoneContact = businessInquiryContactItems.find((item) => item.id === 'phone');
    const emailContact = businessInquiryContactItems.find((item) => item.id === 'email');
    const marquee = screen.getByTestId('business-inquiry-partner-marquee');

    expect(screen.getByText('국제티엔씨 사업 문의')).toBeInTheDocument();
    expect(screen.getByText('사업 문의를 남겨주세요')).toBeInTheDocument();
    expect(
      screen.getByText('필요한 분야와 현장 조건을 남겨주시면 검토 후 회신드리겠습니다.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '주요 고객사 로고' })).toBe(marquee);
    expect(screen.getAllByRole('img')).toHaveLength(partnerLogos.length);
    expect(screen.getByRole('img', { name: '롯데마트 로고' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '쿠팡 로고' })).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"] img').length).toBe(partnerLogos.length);
    expect(screen.queryByText('Project Request')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '개인정보처리방침 보기' })).toBeInTheDocument();
    expect(screen.getByLabelText(/\[필수\] 개인정보 수집·이용 동의/)).toBeInTheDocument();
    expect(screen.getByLabelText(/\[선택\] 마케팅 정보 수신 동의/)).toBeInTheDocument();
    expect(
      screen.getByText(/신규 서비스, 이벤트, 뉴스레터 등 마케팅 정보를 받아보실 수 있으며/),
    ).toBeInTheDocument();
    expect(screen.queryByText('영업일 기준 24시간 내 1차 회신')).not.toBeInTheDocument();
    expect(screen.queryByText('필요한 내용만 남겨주시면 됩니다.')).not.toBeInTheDocument();
    expect(screen.getByText(phoneContact?.label ?? '대표번호')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: phoneContact?.value ?? '' })).toHaveAttribute(
      'href',
      phoneContact?.href ?? '',
    );
    expect(screen.getByText(emailContact?.label ?? '문의 메일')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: emailContact?.value ?? '' })).toHaveAttribute(
      'href',
      emailContact?.href ?? '',
    );
    expect(screen.queryByText('사업장')).not.toBeInTheDocument();
    expect(screen.queryByText('통합 사업 문의 접수')).not.toBeInTheDocument();
    expect(screen.queryByText('대표 문의 전화로 사업 상담을 접수합니다.')).not.toBeInTheDocument();
    expect(
      screen.queryByText('문의 메일로 자료 전달과 후속 상담을 이어갑니다.'),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(/문의 분야/)).toBeInTheDocument();
    expect(screen.getByLabelText(/회사명/)).toBeInTheDocument();
    expect(screen.getByLabelText(/담당자명/)).toBeInTheDocument();
    expect(screen.getByLabelText(/연락처/)).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
    expect(screen.getByLabelText(/문의 내용/)).toBeInTheDocument();
  });

  it('opens the inline privacy policy modal and closes it with Escape while locking body scroll', () => {
    render(<BusinessInquirySection />);

    fireEvent.click(screen.getByRole('button', { name: '개인정보처리방침 보기' }));

    expect(screen.getByRole('dialog', { name: '개인정보처리방침' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByText('1. 수집하는 개인정보의 항목 및 수집방법')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog', { name: '개인정보처리방침' })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('shows validation messages when the required fields are missing', async () => {
    render(<BusinessInquirySection />);

    fireEvent.click(screen.getByRole('button', { name: '문의 접수하기' }));

    expect(await screen.findByText('문의 분야를 선택해주세요.')).toBeInTheDocument();
    expect(screen.getByText('회사명을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('담당자명을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('연락처를 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('이메일을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('문의 내용을 입력해주세요.')).toBeInTheDocument();
    expect(screen.getByText('개인정보 수집·이용에 동의해주세요.')).toBeInTheDocument();
  });

  it('switches to the success state after a valid submission and can reset back to the form', async () => {
    render(<BusinessInquirySection />);

    fireEvent.change(screen.getByLabelText(/문의 분야/), {
      target: { value: 'mechanical-hvac' },
    });
    fireEvent.change(screen.getByLabelText(/회사명/), {
      target: { value: '국제티엔씨' },
    });
    fireEvent.change(screen.getByLabelText(/담당자명/), {
      target: { value: '홍길동' },
    });
    fireEvent.change(screen.getByLabelText(/연락처/), {
      target: { value: '010-1234-5678' },
    });
    fireEvent.change(screen.getByLabelText(/이메일/), {
      target: { value: 'contact@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/문의 내용/), {
      target: { value: '냉장·냉동시스템 교체 관련 상담을 요청드립니다.' },
    });
    fireEvent.click(screen.getByLabelText(/\[필수\] 개인정보 수집·이용 동의/));
    fireEvent.click(screen.getByRole('button', { name: '문의 접수하기' }));

    expect(await screen.findByText('문의가 접수되었습니다')).toBeInTheDocument();
    expect(screen.getByText('영업일 기준 24시간 내 1차 회신드리겠습니다.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '다시 작성하기' }));

    expect(screen.getByRole('button', { name: '문의 접수하기' })).toBeInTheDocument();
  });
});
