import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import AboutGreeting from '@/features/aboutGreeting/AboutGreeting';
import { greetingHeroContent, greetingMessageContent } from '@/features/aboutGreeting/data';

describe('AboutGreeting', () => {
  it('renders the hero, ceo portrait, and greeting copy', () => {
    render(
      <MemoryRouter initialEntries={['/about/greeting']}>
        <AboutGreeting />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: greetingHeroContent.title }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('about-greeting-message-section')).toBeInTheDocument();
    expect(screen.getByAltText(greetingMessageContent.portraitAlt)).toBeInTheDocument();
    expect(screen.getByAltText(greetingMessageContent.signatureAlt)).toBeInTheDocument();
    expect(screen.getByTestId('about-greeting-message-copy')).toHaveTextContent(
      greetingMessageContent.paragraphs[0] ?? '',
    );
  });

  it('renders the secondary sub navigation dropdown with the greeting route active', () => {
    render(
      <MemoryRouter initialEntries={['/about/greeting']}>
        <AboutGreeting />
      </MemoryRouter>,
    );

    const secondaryButton = screen.getByTestId('about-greeting-subnav-button-secondary');

    expect(secondaryButton).toHaveTextContent('CEO인사말');
    expect(secondaryButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondaryButton);

    const secondaryDrawer = screen.getByTestId('about-greeting-subnav-drawer-secondary');
    const drawerItems = within(secondaryDrawer).getAllByRole('menuitem');
    const currentItem = within(secondaryDrawer).getByRole('menuitem', { name: 'CEO인사말' });

    expect(drawerItems.map((item) => item.textContent)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(currentItem).toHaveAttribute('href', '/about/greeting');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });
});
