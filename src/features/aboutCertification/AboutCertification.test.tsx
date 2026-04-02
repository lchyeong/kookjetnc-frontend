import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type * as ReactRouterDomModule from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AboutCertification from '@/features/aboutCertification/AboutCertification';
import { certificationEntries } from '@/features/aboutCertification/data';
import type * as RootLayoutScrollLockModule from '@/pages/RootLayout/rootLayoutScrollLock';

const scrollTriggerKillMocks: Array<ReturnType<typeof vi.fn>> = [];
const gsapAnimationKillMocks: Array<ReturnType<typeof vi.fn>> = [];

const {
  gsapFromToMock,
  gsapMatchMediaAddMock,
  gsapMatchMediaMock,
  gsapMatchMediaRevertMock,
  gsapRegisterPluginMock,
  gsapToMock,
  restoreDocumentScrollTopMock,
  scrollTriggerClearScrollMemoryMock,
  scrollTriggerCreateMock,
  useNavigationTypeMock,
} = vi.hoisted(() => {
  const createAnimationHandle = () => {
    const kill = vi.fn();
    gsapAnimationKillMocks.push(kill);

    return { kill };
  };
  const matchMediaRevertMock = vi.fn();
  const matchMediaAddMock = vi.fn().mockImplementation((_query, callback: () => void) => {
    callback();
  });

  return {
    gsapFromToMock: vi.fn().mockImplementation(() => {
      return createAnimationHandle();
    }),
    gsapMatchMediaAddMock: matchMediaAddMock,
    gsapMatchMediaMock: vi.fn().mockImplementation(() => {
      return {
        add: matchMediaAddMock,
        revert: matchMediaRevertMock,
      };
    }),
    gsapMatchMediaRevertMock: matchMediaRevertMock,
    gsapRegisterPluginMock: vi.fn(),
    gsapToMock: vi.fn().mockImplementation(() => {
      return createAnimationHandle();
    }),
    restoreDocumentScrollTopMock: vi.fn(),
    scrollTriggerClearScrollMemoryMock: vi.fn(),
    scrollTriggerCreateMock: vi.fn().mockImplementation(() => {
      const kill = vi.fn();
      scrollTriggerKillMocks.push(kill);

      return { kill };
    }),
    useNavigationTypeMock: vi.fn(() => 'POP'),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof ReactRouterDomModule>('react-router-dom');

  return {
    ...actual,
    useNavigationType: useNavigationTypeMock,
  };
});

vi.mock('@/pages/RootLayout/rootLayoutScrollLock', async () => {
  const actual = await vi.importActual<typeof RootLayoutScrollLockModule>(
    '@/pages/RootLayout/rootLayoutScrollLock',
  );

  return {
    ...actual,
    restoreDocumentScrollTop: restoreDocumentScrollTopMock,
  };
});

vi.mock('gsap', () => {
  return {
    gsap: {
      fromTo: gsapFromToMock,
      matchMedia: gsapMatchMediaMock,
      registerPlugin: gsapRegisterPluginMock,
      to: gsapToMock,
    },
  };
});

vi.mock('gsap/ScrollTrigger', () => {
  return {
    ScrollTrigger: {
      clearScrollMemory: scrollTriggerClearScrollMemoryMock,
      create: scrollTriggerCreateMock,
    },
  };
});

describe('AboutCertification', () => {
  beforeEach(() => {
    scrollTriggerKillMocks.length = 0;
    gsapAnimationKillMocks.length = 0;
    gsapFromToMock.mockClear();
    gsapMatchMediaAddMock.mockClear();
    gsapMatchMediaMock.mockClear();
    gsapMatchMediaRevertMock.mockClear();
    gsapRegisterPluginMock.mockClear();
    gsapToMock.mockClear();
    restoreDocumentScrollTopMock.mockClear();
    scrollTriggerClearScrollMemoryMock.mockClear();
    scrollTriggerCreateMock.mockClear();
    useNavigationTypeMock.mockReturnValue('POP');
  });

  it('renders the hero, archive timeline, and 21 document entries', () => {
    render(
      <MemoryRouter initialEntries={['/about/certification']}>
        <AboutCertification />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: '국제티엔씨가 축적해 온 인증과 권리의 흐름' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Representative Credentials')).not.toBeInTheDocument();
    expect(screen.getByText(/인증서와 특허·디자인 등록 자산을/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '건설업 등록증' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '냉동창고 안전관리 특허' }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId(/about-certification-entry-/)).toHaveLength(
      certificationEntries.length,
    );
    expect(screen.queryByTestId('about-certification-current-panel')).not.toBeInTheDocument();
    expect(screen.getByTestId('about-certification-category-certification')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(scrollTriggerCreateMock).toHaveBeenCalledTimes(certificationEntries.length);
  });

  it('renders the secondary sub navigation dropdown with the certification route active', () => {
    render(
      <MemoryRouter initialEntries={['/about/certification']}>
        <AboutCertification />
      </MemoryRouter>,
    );

    const subNav = screen.getByTestId('about-certification-subnav');
    const secondaryButton = screen.getByTestId('about-certification-subnav-button-secondary');

    expect(subNav).toBeInTheDocument();
    expect(secondaryButton).toHaveTextContent('인증·특허');
    expect(secondaryButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondaryButton);

    const secondaryDrawer = screen.getByTestId('about-certification-subnav-drawer-secondary');
    const drawerItems = within(secondaryDrawer).getAllByRole('menuitem');
    const currentItem = within(secondaryDrawer).getByRole('menuitem', { name: '인증·특허' });
    const historyItem = within(secondaryDrawer).getByRole('menuitem', { name: '경영이념·연혁' });

    expect(secondaryButton).toHaveAttribute('aria-expanded', 'true');
    expect(drawerItems.map((item) => item.textContent)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(historyItem).toHaveAttribute('href', '/about/history');
    expect(currentItem).toHaveAttribute('href', '/about/certification');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('updates the active sequence and category when a later trigger enters', () => {
    render(
      <MemoryRouter initialEntries={['/about/certification']}>
        <AboutCertification />
      </MemoryRouter>,
    );

    const laterEntryIndex = certificationEntries.findIndex((entry) => entry.sequence === 13);
    const laterEntryConfig = scrollTriggerCreateMock.mock.calls[laterEntryIndex]?.[0] as
      | {
          onEnter?: () => void;
        }
      | undefined;

    act(() => {
      laterEntryConfig?.onEnter?.();
    });

    expect(screen.getByTestId('about-certification-category-patent-design')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(screen.getByTestId('about-certification-category-certification')).toHaveAttribute(
      'data-active',
      'false',
    );
    expect(
      screen.getByRole('heading', { level: 2, name: '복합 냉각장치 및 필터 세정방법 특허' }),
    ).toBeInTheDocument();
  });

  it('closes the secondary drawer on placeholder click, outside click, and Escape', () => {
    render(
      <MemoryRouter initialEntries={['/about/certification']}>
        <AboutCertification />
      </MemoryRouter>,
    );

    const secondaryButton = screen.getByTestId('about-certification-subnav-button-secondary');

    fireEvent.click(secondaryButton);

    const placeholderItem = screen.getByRole('menuitem', { name: 'CEO인사말' });

    expect(window.location.hash).toBe('');
    fireEvent.click(placeholderItem);
    expect(window.location.hash).toBe('');
    expect(
      screen.queryByTestId('about-certification-subnav-drawer-secondary'),
    ).not.toBeInTheDocument();

    fireEvent.click(secondaryButton);
    expect(screen.getByTestId('about-certification-subnav-drawer-secondary')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(
      screen.queryByTestId('about-certification-subnav-drawer-secondary'),
    ).not.toBeInTheDocument();

    fireEvent.click(secondaryButton);
    expect(screen.getByTestId('about-certification-subnav-drawer-secondary')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(
      screen.queryByTestId('about-certification-subnav-drawer-secondary'),
    ).not.toBeInTheDocument();
  });
});
