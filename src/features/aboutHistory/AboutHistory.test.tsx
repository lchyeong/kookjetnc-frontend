import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type * as ReactRouterDomModule from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AboutHistory from '@/features/aboutHistory/AboutHistory';
import { historyEntries } from '@/features/aboutHistory/data';
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

describe('AboutHistory', () => {
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

  it('renders the hero, timeline, description, and initial active year', () => {
    render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: '지속가능한 내일을 설계하는 국제티엔씨' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/국제티엔씨는 처음 냉동·냉장 시스템의 기준을 다져온 순간부터,/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /오늘의 에너지 효율화 솔루션과 친환경 자연냉매 CO₂ 시스템, 공조 기술에 이르기까지/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /언제나 더 효율적인 설비와 더 지속가능한 환경을 위해 끊임없이 걸어왔습니다./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/탄소와 온실가스 배출을 줄이고 에너지 효율을 높이는 기술/),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText('홈으로 이동')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '경영이념·연혁' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('button', { name: '회사소개' })).not.toBeInTheDocument();
    expect(screen.getByTestId('about-history-current-year')).toHaveTextContent('2001');
    expect(screen.getByTestId('about-history-decade-2000')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('about-history-decade-2005')).toBeInTheDocument();
    expect(screen.getByTestId('about-history-decade-2015')).toBeInTheDocument();
    expect(screen.getByTestId('about-history-decade-2025')).toBeInTheDocument();
    expect(screen.getByTestId('about-history-decade-2000')).toHaveAttribute(
      'data-year-range',
      '2000_2004',
    );
    expect(screen.getAllByTestId(/about-history-entry-/)).toHaveLength(historyEntries.length);
    expect(scrollTriggerCreateMock).toHaveBeenCalledTimes(historyEntries.length);
    expect(gsapMatchMediaMock).toHaveBeenCalledTimes(1);
  });

  it('renders the secondary hero sub navigation dropdown without restoring the primary dropdown', () => {
    render(
      <MemoryRouter initialEntries={['/about/history']}>
        <AboutHistory />
      </MemoryRouter>,
    );

    const subNav = screen.getByTestId('about-history-subnav');
    const homeLink = screen.getByTestId('about-history-subnav-home');
    const homeIcon = screen.getByTestId('about-history-subnav-home-icon');
    const secondaryButton = screen.getByTestId('about-history-subnav-button-secondary');

    expect(subNav).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeIcon.getAttribute('src')).toMatch(/data:image\/svg\+xml|icon_home\.svg/u);
    expect(secondaryButton).toHaveTextContent('경영이념·연혁');
    expect(secondaryButton).toHaveAttribute('aria-expanded', 'false');
    expect(subNav.firstElementChild).toContainElement(secondaryButton);
    expect(subNav.lastElementChild).toBe(homeLink);
    expect(screen.queryByTestId('about-history-subnav-button-primary')).not.toBeInTheDocument();
    expect(screen.queryByTestId('about-history-subnav-drawer-primary')).not.toBeInTheDocument();
    expect(screen.queryByTestId('about-history-subnav-drawer-secondary')).not.toBeInTheDocument();

    fireEvent.click(secondaryButton);

    const secondaryDrawer = screen.getByTestId('about-history-subnav-drawer-secondary');
    const drawerItems = within(secondaryDrawer).getAllByRole('menuitem');
    const currentItem = within(secondaryDrawer).getByRole('menuitem', { name: '경영이념·연혁' });

    expect(secondaryButton).toHaveAttribute('aria-expanded', 'true');
    expect(drawerItems.map((item) => item.textContent)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(currentItem).toHaveAttribute('href', '/about/history');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('closes the secondary drawer on ceo route click, outside click, and Escape', () => {
    render(
      <MemoryRouter initialEntries={['/about/history']}>
        <AboutHistory />
      </MemoryRouter>,
    );

    const secondaryButton = screen.getByTestId('about-history-subnav-button-secondary');

    fireEvent.click(secondaryButton);

    const greetingItem = screen.getByRole('menuitem', { name: 'CEO인사말' });

    expect(greetingItem).toHaveAttribute('href', '/about/greeting');
    fireEvent.click(greetingItem);
    expect(screen.queryByTestId('about-history-subnav-drawer-secondary')).not.toBeInTheDocument();

    fireEvent.click(secondaryButton);
    expect(screen.getByTestId('about-history-subnav-drawer-secondary')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('about-history-subnav-drawer-secondary')).not.toBeInTheDocument();

    fireEvent.click(secondaryButton);
    expect(screen.getByTestId('about-history-subnav-drawer-secondary')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('about-history-subnav-drawer-secondary')).not.toBeInTheDocument();
  });

  it('clears ScrollTrigger scroll memory before registering route animations', () => {
    render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    expect(scrollTriggerClearScrollMemoryMock).toHaveBeenCalled();
    expect(scrollTriggerClearScrollMemoryMock.mock.invocationCallOrder[0]).toBeLessThan(
      gsapFromToMock.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY,
    );
    expect(scrollTriggerClearScrollMemoryMock.mock.invocationCallOrder[0]).toBeLessThan(
      scrollTriggerCreateMock.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY,
    );
  });

  it('forces the document scroll to the top before mounting ScrollTriggers on push navigation', () => {
    useNavigationTypeMock.mockReturnValue('PUSH');

    render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    expect(restoreDocumentScrollTopMock).toHaveBeenCalled();
    expect(restoreDocumentScrollTopMock).toHaveBeenCalledWith(0);
    expect(restoreDocumentScrollTopMock.mock.invocationCallOrder[0]).toBeLessThan(
      gsapFromToMock.mock.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY,
    );
  });

  it('uses the timeline inner container as the rail reveal trigger and matches fadeInLeft/Right distance', () => {
    render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    const timelineInner = screen.getByTestId('about-history-timeline-inner');
    const currentYearRailInner = screen.getByTestId('about-history-current-year-rail-inner');
    const decadeRailInner = screen.getByTestId('about-history-decade-rail-inner');
    const yearRailRevealCall = gsapFromToMock.mock.calls.find((call) => {
      const fromVars = call[1] as { xPercent?: number } | undefined;

      return fromVars?.xPercent === -100;
    });
    const decadeRailRevealCall = gsapFromToMock.mock.calls.find((call) => {
      const fromVars = call[1] as { xPercent?: number } | undefined;

      return fromVars?.xPercent === 100;
    });

    expect(yearRailRevealCall).toBeDefined();
    expect(decadeRailRevealCall).toBeDefined();

    const [, yearRailFromVars, yearRailToVars] = yearRailRevealCall as [
      unknown,
      { opacity?: number; xPercent?: number },
      {
        duration?: number;
        scrollTrigger?: { once?: boolean; start?: string; trigger?: Element | null };
        xPercent?: number;
      },
    ];
    const [, decadeRailFromVars, decadeRailToVars] = decadeRailRevealCall as [
      unknown,
      { opacity?: number; xPercent?: number },
      {
        duration?: number;
        scrollTrigger?: { once?: boolean; start?: string; trigger?: Element | null };
        xPercent?: number;
      },
    ];

    expect(yearRailFromVars).toMatchObject({ opacity: 0, xPercent: -100 });
    expect(yearRailRevealCall?.[0]).toBe(currentYearRailInner);
    expect(yearRailToVars.duration).toBe(1);
    expect(yearRailToVars.xPercent).toBe(0);
    expect(yearRailToVars.scrollTrigger).toMatchObject({
      once: true,
      start: 'top 80%',
    });
    expect(yearRailToVars.scrollTrigger?.trigger).toBe(timelineInner);
    expect(decadeRailFromVars).toMatchObject({ opacity: 0, xPercent: 100 });
    expect(decadeRailRevealCall?.[0]).toBe(decadeRailInner);
    expect(decadeRailToVars.duration).toBe(1);
    expect(decadeRailToVars.xPercent).toBe(0);
    expect(decadeRailToVars.scrollTrigger).toMatchObject({
      once: true,
      start: 'top 80%',
    });
    expect(decadeRailToVars.scrollTrigger?.trigger).toBe(timelineInner);
  });

  it('matches the reference desktop hero ScrollTrigger settings and updates color state with overlay opacity', () => {
    render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    const heroExpandCall = gsapFromToMock.mock.calls.find((call) => {
      const fromVars = call[1] as { maxWidth?: string } | undefined;

      return fromVars?.maxWidth === '72.9166%';
    });
    const heroPinCall = gsapToMock.mock.calls.find((call) => {
      const vars = call[1] as { scrollTrigger?: { pin?: boolean } } | undefined;

      return vars?.scrollTrigger?.pin === true;
    });

    expect(heroExpandCall).toBeDefined();
    expect(heroPinCall).toBeDefined();

    const [, , heroExpandVars] = heroExpandCall as [
      unknown,
      unknown,
      {
        scrollTrigger?: {
          end?: string;
          onUpdate?: (self: { progress: number }) => void;
          scrub?: boolean;
          start?: string;
        };
      },
    ];
    const [, heroPinVars] = heroPinCall as [
      unknown,
      {
        scrollTrigger?: {
          end?: string;
          pin?: boolean;
          scrub?: boolean;
          start?: string;
        };
      },
    ];

    expect(heroExpandVars.scrollTrigger).toMatchObject({
      end: '150% 0%',
      scrub: true,
      start: '0px 0%',
    });
    expect(heroPinVars.scrollTrigger).toMatchObject({
      end: '180% 0%',
      pin: true,
      scrub: true,
      start: '0px 0%',
    });

    const heroElement = screen.getByTestId('about-history-hero');
    const onUpdate = heroExpandVars.scrollTrigger?.onUpdate;

    act(() => {
      onUpdate?.({ progress: 0.6 });
    });
    expect(heroElement).toHaveAttribute('data-hero-color-change', 'true');
    expect(
      Number(heroElement.style.getPropertyValue('--about-history-hero-overlay-opacity')),
    ).toBeGreaterThan(0);

    act(() => {
      onUpdate?.({ progress: 0.2 });
    });
    expect(heroElement).toHaveAttribute('data-hero-color-change', 'false');
    expect(Number(heroElement.style.getPropertyValue('--about-history-hero-overlay-opacity'))).toBe(
      0,
    );
  });

  it('updates the active year and decade marker when a later trigger enters', () => {
    render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    const laterEntryIndex = historyEntries.findIndex((entry) => entry.year === 2021);
    const laterEntryConfig = scrollTriggerCreateMock.mock.calls[laterEntryIndex]?.[0] as
      | {
          onEnter?: () => void;
        }
      | undefined;

    act(() => {
      laterEntryConfig?.onEnter?.();
    });

    expect(screen.getByTestId('about-history-current-year')).toHaveTextContent('2021');
    expect(screen.getByTestId('about-history-decade-2020')).toHaveAttribute('data-active', 'true');
  });

  it('maps a mid-decade entry to the matching five-year marker', () => {
    render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    const midDecadeEntryIndex = historyEntries.findIndex((entry) => entry.year === 2017);
    const midDecadeEntryConfig = scrollTriggerCreateMock.mock.calls[midDecadeEntryIndex]?.[0] as
      | {
          onEnter?: () => void;
        }
      | undefined;

    act(() => {
      midDecadeEntryConfig?.onEnter?.();
    });

    expect(screen.getByTestId('about-history-current-year')).toHaveTextContent('2017');
    expect(screen.getByTestId('about-history-decade-2015')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('about-history-decade-2010')).toHaveAttribute('data-active', 'false');
  });

  it('updates the active year and decade marker when scrolling back up', () => {
    render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    const previousEntryIndex = historyEntries.findIndex((entry) => entry.year === 2001);
    const previousEntryConfig = scrollTriggerCreateMock.mock.calls[previousEntryIndex]?.[0] as
      | {
          onEnterBack?: () => void;
        }
      | undefined;

    act(() => {
      previousEntryConfig?.onEnterBack?.();
    });

    expect(screen.getByTestId('about-history-current-year')).toHaveTextContent('2001');
    expect(screen.getByTestId('about-history-decade-2000')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('about-history-decade-2020')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('about-history-decade-2025')).toHaveAttribute('data-active', 'false');
  });

  it('cleans up ScrollTrigger instances and GSAP matchMedia on unmount', () => {
    const { unmount } = render(
      <MemoryRouter>
        <AboutHistory />
      </MemoryRouter>,
    );

    unmount();

    expect(scrollTriggerKillMocks).toHaveLength(historyEntries.length);
    expect(scrollTriggerKillMocks.every((killMock) => killMock.mock.calls.length === 1)).toBe(true);
    expect(gsapMatchMediaRevertMock).toHaveBeenCalledTimes(1);
  });
});
