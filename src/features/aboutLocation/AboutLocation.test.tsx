import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import AboutLocation from '@/features/aboutLocation/AboutLocation';
import {
  locationHeroContent,
  locationInfoGroups,
  locationOfficeLocation,
} from '@/features/aboutLocation/data';

describe('AboutLocation', () => {
  it('renders the hero, map panel, and transit cards', () => {
    render(
      <MemoryRouter initialEntries={['/about/location']}>
        <AboutLocation />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: locationHeroContent.title }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('about-location-map-frame')).toBeInTheDocument();
    expect(screen.getByTestId('about-location-info-address')).toHaveTextContent(
      `${locationOfficeLocation.addressLine1}${locationOfficeLocation.addressLine2}`,
    );
    expect(screen.getByTestId('about-location-info-subway')).toBeInTheDocument();
    expect(screen.getByTestId('about-location-info-bus')).toBeInTheDocument();
    expect(screen.getByText('지도를 표시할 수 없습니다.')).toBeInTheDocument();
  });

  it('renders the secondary sub navigation dropdown with the location route active', () => {
    render(
      <MemoryRouter initialEntries={['/about/location']}>
        <AboutLocation />
      </MemoryRouter>,
    );

    const secondaryButton = screen.getByTestId('about-location-subnav-button-secondary');

    expect(secondaryButton).toHaveTextContent('사업장 위치');
    expect(secondaryButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondaryButton);

    const secondaryDrawer = screen.getByTestId('about-location-subnav-drawer-secondary');
    const drawerItems = within(secondaryDrawer).getAllByRole('menuitem');
    const currentItem = within(secondaryDrawer).getByRole('menuitem', { name: '사업장 위치' });

    expect(drawerItems.map((item) => item.textContent)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(currentItem).toHaveAttribute('href', '/about/location');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('renders all configured transit groups', () => {
    render(
      <MemoryRouter initialEntries={['/about/location']}>
        <AboutLocation />
      </MemoryRouter>,
    );

    for (const group of locationInfoGroups) {
      expect(screen.getByTestId(`about-location-info-${group.id}`)).toBeInTheDocument();
    }
  });
});
