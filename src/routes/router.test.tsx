import { QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import styles from '@/pages/RootLayout/RootLayout.module.scss';
import { createQueryClient } from '@/query/queryClient';
import { appRoutes } from '@/routes/router';
import { routePaths } from '@/routes/routeRegistry';

const renderRoute = (initialEntry: string) => {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialEntry],
  });

  const rendered = render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return {
    ...rendered,
    router,
  };
};

describe('router', () => {
  beforeEach(() => {
    const scrollingElement = document.documentElement;
    scrollingElement.scrollTop = 0;

    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: scrollingElement,
    });

    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: vi.fn((leftOrOptions: ScrollToOptions | number, top?: number) => {
        if (typeof leftOrOptions === 'object') {
          scrollingElement.scrollTop = leftOrOptions.top ?? scrollingElement.scrollTop;
          return;
        }

        scrollingElement.scrollTop = typeof top === 'number' ? top : scrollingElement.scrollTop;
      }),
    });
  });

  it('renders the haatz home route', () => {
    renderRoute('/');

    expect(
      screen.getByRole('heading', { name: /냉장·냉동을 넘어\s*지속 가능성으로/u }),
    ).toBeInTheDocument();
    expect(document.querySelector('main')).toHaveClass(
      styles['main'],
      styles['mainFullBleed'],
      styles['mainClipX'],
      styles['mainHome'],
    );
  });

  it('renders the internal about history route', () => {
    renderRoute('/about/history');

    expect(
      screen.getByRole('heading', { name: '지속가능한 내일을 설계하는 국제티엔씨' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('about-history-current-year')).toBeInTheDocument();
    expect(document.querySelector('main')).toHaveClass(styles['main'], styles['mainFullBleed']);
    expect(document.querySelector('main')).not.toHaveClass(styles['mainClipX'], styles['mainHome']);
  });

  it('renders the energy solution catalog route with the shared quick menu', () => {
    renderRoute(routePaths.energySolution);

    expect(
      screen.getByRole('heading', {
        name: '설비 효율과 친환경 전환을 동시에 설계하는 국제티엔씨 솔루션 카탈로그',
      }),
    ).toBeInTheDocument();
    expect(document.body).toHaveTextContent('총 5개 상품');
    expect(screen.getByRole('link', { name: /A\/S 신청 아이콘\s*A\/S 신청/u })).toBeInTheDocument();
    expect(document.querySelector('main')).toHaveClass(styles['main']);
    expect(document.querySelector('main')).not.toHaveClass(
      styles['mainFullBleed'],
      styles['mainClipX'],
      styles['mainHome'],
    );
  });

  it('renders the mechanical hvac catalog route with five products', () => {
    renderRoute(routePaths.mechanicalHvac);

    expect(
      screen.getByRole('heading', {
        name: '설계, 시공, 자동제어까지 이어지는 국제티엔씨 기계·공조설비 카탈로그',
      }),
    ).toBeInTheDocument();
    expect(document.body).toHaveTextContent('총 5개 상품');
    expect(screen.getByRole('heading', { level: 3, name: '운영 컨설팅' })).toBeInTheDocument();
    expect(screen.queryByText('운영 컨설팅 BIM 검토형')).not.toBeInTheDocument();
  });

  it('renders the refrigeration system catalog route with five products', () => {
    renderRoute(routePaths.refrigerationSystem);

    expect(
      screen.getByRole('heading', {
        name: '저온 유통과 쇼케이스 운영을 위한 국제티엔씨 냉장·냉동시스템 카탈로그',
      }),
    ).toBeInTheDocument();
    expect(document.body).toHaveTextContent('총 5개 상품');
    expect(
      screen.getByRole('heading', { level: 3, name: '기술설계 · 전문시공' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('기술설계 · 전문시공 물류형')).not.toBeInTheDocument();
  });

  it('renders the catalog detail route', () => {
    renderRoute(
      routePaths.catalogDetail('energy-solution', 'co2-natural-refrigerant-system-retail'),
    );

    expect(
      screen.getByRole('heading', { name: '자연냉매(CO2) 냉동냉장 멀티 시스템' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '제품 특징' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '에너지솔루션 목록으로 돌아가기' }),
    ).toBeInTheDocument();
  });

  it('renders the mechanical hvac detail route', () => {
    renderRoute(routePaths.catalogDetail('mechanical-hvac', 'operating-consulting-diagnostic'));

    expect(screen.getByRole('heading', { name: '운영 컨설팅' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '기계·공조설비 목록으로 돌아가기' }),
    ).toBeInTheDocument();
  });

  it('renders the refrigeration system detail route', () => {
    renderRoute(
      routePaths.catalogDetail(
        'refrigeration-system',
        'technical-design-specialized-construction-retail',
      ),
    );

    expect(screen.getByRole('heading', { name: '기술설계 · 전문시공' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '냉장·냉동시스템 목록으로 돌아가기' }),
    ).toBeInTheDocument();
  });

  it('renders not found for removed energy solution detail routes', () => {
    renderRoute(
      routePaths.catalogDetail('energy-solution', 'co2-natural-refrigerant-system-logistics'),
    );

    expect(screen.getByText('This page does not exist in the starter.')).toBeInTheDocument();
  });

  it('renders not found for the removed motor detail route', () => {
    renderRoute(routePaths.catalogDetail('energy-solution', 'motor-direct-control-system-pump'));

    expect(screen.getByText('This page does not exist in the starter.')).toBeInTheDocument();
  });

  it('renders not found for removed mechanical hvac detail routes', () => {
    renderRoute(routePaths.catalogDetail('mechanical-hvac', 'operating-consulting-bim'));

    expect(screen.getByText('This page does not exist in the starter.')).toBeInTheDocument();
  });

  it('renders not found for the removed automatic control detail route', () => {
    renderRoute(routePaths.catalogDetail('mechanical-hvac', 'automatic-control-remote'));

    expect(screen.getByText('This page does not exist in the starter.')).toBeInTheDocument();
  });

  it('renders not found for removed refrigeration detail routes', () => {
    renderRoute(
      routePaths.catalogDetail(
        'refrigeration-system',
        'technical-design-specialized-construction-logistics',
      ),
    );

    expect(screen.getByText('This page does not exist in the starter.')).toBeInTheDocument();
  });

  it('renders not found for the removed frozen showcase detail route', () => {
    renderRoute(
      routePaths.catalogDetail('refrigeration-system', 'built-in-frozen-showcase-open-deck'),
    );

    expect(screen.getByText('This page does not exist in the starter.')).toBeInTheDocument();
  });

  it('renders the not found route', () => {
    renderRoute('/missing-route');

    expect(screen.getByText('This page does not exist in the starter.')).toBeInTheDocument();
  });

  it('resets document scroll to the top when navigating to the about history route', async () => {
    const { router } = renderRoute('/');
    const scrollingElement = document.documentElement;

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /냉장·냉동을 넘어\s*지속 가능성으로/u }),
      ).toBeInTheDocument();
    });

    vi.mocked(window.scrollTo).mockClear();
    scrollingElement.scrollTop = 720;

    await act(async () => {
      await router.navigate('/about/history');
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: '지속가능한 내일을 설계하는 국제티엔씨' }),
      ).toBeInTheDocument();
    });

    expect(scrollingElement.scrollTop).toBe(0);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
  });

  it('restores saved scroll position on POP navigation for non-home routes', async () => {
    const { router } = renderRoute('/about/history');
    const scrollingElement = document.documentElement;

    await waitFor(() => {
      expect(screen.getByTestId('about-history-current-year')).toBeInTheDocument();
    });

    vi.mocked(window.scrollTo).mockClear();
    scrollingElement.scrollTop = 340;

    await act(async () => {
      await router.navigate('/missing-route');
    });

    await waitFor(() => {
      expect(screen.getByText('This page does not exist in the starter.')).toBeInTheDocument();
    });

    expect(scrollingElement.scrollTop).toBe(0);

    vi.mocked(window.scrollTo).mockClear();
    scrollingElement.scrollTop = 640;

    await act(async () => {
      await router.navigate(-1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('about-history-current-year')).toBeInTheDocument();
    });

    expect(scrollingElement.scrollTop).toBe(340);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 340);
  });

  it('forces the home route back to the top on POP navigation', async () => {
    const { router } = renderRoute('/');
    const scrollingElement = document.documentElement;

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /냉장·냉동을 넘어\s*지속 가능성으로/u }),
      ).toBeInTheDocument();
    });

    vi.mocked(window.scrollTo).mockClear();
    scrollingElement.scrollTop = 410;

    await act(async () => {
      await router.navigate('/about/history');
    });

    await waitFor(() => {
      expect(screen.getByTestId('about-history-current-year')).toBeInTheDocument();
    });

    vi.mocked(window.scrollTo).mockClear();
    scrollingElement.scrollTop = 275;

    await act(async () => {
      await router.navigate(-1);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /냉장·냉동을 넘어\s*지속 가능성으로/u }),
      ).toBeInTheDocument();
    });

    expect(scrollingElement.scrollTop).toBe(0);
    const lastScrollToCall = vi.mocked(window.scrollTo).mock.calls.at(-1) as unknown[] | undefined;
    const lastScrollToArg = lastScrollToCall?.[0];

    expect(lastScrollToCall).toBeDefined();

    if (
      typeof lastScrollToArg === 'object' &&
      lastScrollToArg !== null &&
      'top' in lastScrollToArg
    ) {
      expect(lastScrollToArg.top).toBe(0);
    } else {
      expect(lastScrollToCall).toEqual([0, 0]);
    }
  });
});
