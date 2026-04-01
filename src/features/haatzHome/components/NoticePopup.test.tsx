import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POPUP_REVEAL_DELAY_MS } from '@/features/haatzHome/components/haatzHero';
import NoticePopup from '@/features/haatzHome/components/NoticePopup';
import { noticePopup } from '@/features/haatzHome/data';
import { useHaatzHomeUiStore } from '@/stores/useHaatzHomeUiStore';

describe('NoticePopup', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-23T09:00:00+09:00'));
    useHaatzHomeUiStore.setState({
      headerHidden: false,
      introPhase: 'idle',
      popupEligible: false,
      popupPhase: 'hidden',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the notice popup only after the intro completes and the reveal delay passes', () => {
    render(<NoticePopup />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      useHaatzHomeUiStore.getState().setPopupEligible(true);
      vi.advanceTimersByTime(POPUP_REVEAL_DELAY_MS + 400);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      useHaatzHomeUiStore.getState().setIntroPhase('complete');
    });

    act(() => {
      vi.advanceTimersByTime(POPUP_REVEAL_DELAY_MS + 400);
    });

    expect(screen.getByRole('dialog', { name: noticePopup.cta.label })).toBeInTheDocument();
    expect(screen.queryByText('제 38기 주주총회 소집공고')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: noticePopup.imageAlt })).toHaveAttribute(
      'href',
      noticePopup.cta.href,
    );
  });

  it('persists the dismissal until tomorrow when closing with the checkbox checked', () => {
    render(<NoticePopup />);

    act(() => {
      useHaatzHomeUiStore.getState().setPopupEligible(true);
      useHaatzHomeUiStore.getState().setIntroPhase('complete');
    });

    act(() => {
      vi.advanceTimersByTime(POPUP_REVEAL_DELAY_MS + 400);
    });

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    const storedValue = window.localStorage.getItem(noticePopup.storageKey);

    expect(storedValue).not.toBeNull();
    expect(Number(storedValue)).toBeGreaterThan(Date.now());
  });
});
