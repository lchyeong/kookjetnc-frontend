import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type * as ReactRouterDomModule from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AboutOrganization from '@/features/aboutOrganization/AboutOrganization';
import {
  organizationCapabilityNodes,
  organizationGroups,
  organizationHeroContent,
} from '@/features/aboutOrganization/data';
import type * as RootLayoutScrollLockModule from '@/pages/RootLayout/rootLayoutScrollLock';

const scrollTriggerKillMocks: Array<ReturnType<typeof vi.fn>> = [];
const gsapAnimationKillMocks: Array<ReturnType<typeof vi.fn>> = [];

const {
  gsapFromToMock,
  gsapMatchMediaAddMock,
  gsapMatchMediaMock,
  gsapMatchMediaRevertMock,
  gsapRegisterPluginMock,
  gsapTimelineMock,
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
    gsapTimelineMock: vi.fn().mockImplementation(() => {
      const animationHandle = createAnimationHandle();

      return {
        ...animationHandle,
        fromTo: vi.fn().mockReturnThis(),
        to: vi.fn().mockReturnThis(),
      };
    }),
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
      timeline: gsapTimelineMock,
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

describe('AboutOrganization', () => {
  beforeEach(() => {
    scrollTriggerKillMocks.length = 0;
    gsapAnimationKillMocks.length = 0;
    gsapFromToMock.mockClear();
    gsapMatchMediaAddMock.mockClear();
    gsapMatchMediaMock.mockClear();
    gsapMatchMediaRevertMock.mockClear();
    gsapRegisterPluginMock.mockClear();
    gsapTimelineMock.mockClear();
    gsapToMock.mockClear();
    restoreDocumentScrollTopMock.mockClear();
    scrollTriggerClearScrollMemoryMock.mockClear();
    scrollTriggerCreateMock.mockClear();
    useNavigationTypeMock.mockReturnValue('POP');
  });

  it('renders the hero, organization groups, and capability nodes', () => {
    render(
      <MemoryRouter initialEntries={['/about/organization']}>
        <AboutOrganization />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: organizationHeroContent.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(organizationHeroContent.description)).toBeInTheDocument();
    expect(screen.getByText('대표이사')).toBeInTheDocument();
    expect(screen.getByTestId('about-organization-group-mechanical-equipment')).toBeInTheDocument();
    expect(
      screen.getByTestId('about-organization-group-refrigeration-equipment'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('about-organization-group-management-support')).toBeInTheDocument();
    expect(screen.getAllByTestId(/about-organization-capability-/)).toHaveLength(
      organizationCapabilityNodes.length,
    );
    expect(screen.getByTestId('about-organization-capability-partners')).toHaveTextContent(
      '파트너사78개사',
    );
    expect(screen.getByTestId('about-organization-section-structure')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(scrollTriggerCreateMock).toHaveBeenCalledTimes(2);
  });

  it('renders the secondary sub navigation dropdown with the organization route active', () => {
    render(
      <MemoryRouter initialEntries={['/about/organization']}>
        <AboutOrganization />
      </MemoryRouter>,
    );

    const secondaryButton = screen.getByTestId('about-organization-subnav-button-secondary');

    expect(secondaryButton).toHaveTextContent('조직도');
    expect(secondaryButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(secondaryButton);

    const secondaryDrawer = screen.getByTestId('about-organization-subnav-drawer-secondary');
    const drawerItems = within(secondaryDrawer).getAllByRole('menuitem');
    const currentItem = within(secondaryDrawer).getByRole('menuitem', { name: '조직도' });

    expect(drawerItems.map((item) => item.textContent)).toEqual([
      'CEO인사말',
      '경영이념·연혁',
      '인증·특허',
      '조직도',
      '사업장 위치',
    ]);
    expect(currentItem).toHaveAttribute('href', '/about/organization');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
  });

  it('updates the active section rail when the capability section trigger enters', () => {
    render(
      <MemoryRouter initialEntries={['/about/organization']}>
        <AboutOrganization />
      </MemoryRouter>,
    );

    const capabilitySectionConfig = scrollTriggerCreateMock.mock.calls[1]?.[0] as
      | {
          onEnter?: () => void;
        }
      | undefined;

    act(() => {
      capabilitySectionConfig?.onEnter?.();
    });

    expect(screen.getByTestId('about-organization-section-capability')).toHaveAttribute(
      'data-active',
      'true',
    );
    expect(screen.getByTestId('about-organization-section-structure')).toHaveAttribute(
      'data-active',
      'false',
    );
  });

  it('renders all configured groups and capability nodes', () => {
    render(
      <MemoryRouter initialEntries={['/about/organization']}>
        <AboutOrganization />
      </MemoryRouter>,
    );

    for (const group of organizationGroups) {
      expect(screen.getByTestId(`about-organization-group-${group.id}`)).toBeInTheDocument();
    }

    for (const node of organizationCapabilityNodes) {
      expect(screen.getByTestId(`about-organization-capability-${node.id}`)).toBeInTheDocument();
    }
  });
});
