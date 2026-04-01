import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import QuickMenu from '@/features/haatzHome/components/QuickMenu';

describe('QuickMenu', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  it('renders the three requested quick menu entries with disabled placeholder links', () => {
    render(<QuickMenu />);

    const quickLinks = screen.getAllByRole('link');

    expect(quickLinks).toHaveLength(3);
    expect(quickLinks.map((link) => link.textContent)).toEqual([
      'A/S 신청',
      '카카오톡',
      '위치안내',
    ]);
    expect(quickLinks.every((link) => link.getAttribute('aria-disabled') === 'true')).toBe(true);
  });

  it('prevents navigation when a placeholder quick menu entry is clicked', () => {
    render(<QuickMenu />);

    const callLink = screen.getByRole('link', { name: /A\/S 신청 아이콘\s*A\/S 신청/ });
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });

    callLink.dispatchEvent(clickEvent);

    expect(clickEvent.defaultPrevented).toBe(true);
  });

  it('scrolls to the top when the top button is clicked', () => {
    render(<QuickMenu />);

    const topButton = screen.getByRole('button', { name: '페이지 상단으로 이동' });

    expect(topButton.querySelector('svg')).not.toBeNull();
    expect(topButton.querySelector('img')).toBeNull();

    fireEvent.click(topButton);

    expect(window.scrollTo).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: 0,
    });
  });
});
