import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import CatalogCategoryView from '@/features/catalog/CatalogCategoryView';
import { catalogCategories } from '@/features/catalog/data';
import { routePaths, type CatalogCategorySlug } from '@/routes/routeRegistry';

const categoryCases = [
  {
    slug: 'energy-solution' as const,
    route: routePaths.energySolution,
    firstSlug: 'co2-natural-refrigerant-system-retail',
    removedTitles: ['CO2 자연냉매 시스템 물류센터형', '모터 직결제어시스템 펌프형'],
    titles: [
      '자연냉매(CO2) 냉동냉장 멀티 시스템',
      '구트너 유니트 쿨러',
      '공조기 리필형 필터',
      '모터 직결제어시스템',
      '오픈 쇼케이스 도어',
    ],
  },
  {
    slug: 'mechanical-hvac' as const,
    route: routePaths.mechanicalHvac,
    firstSlug: 'operating-consulting-diagnostic',
    removedTitles: ['운영 컨설팅 BIM 검토형', '자동제어 원격운영형'],
    titles: ['운영 컨설팅', '냉난방 설비', '공조설비', '위생설비', '자동제어'],
  },
  {
    slug: 'refrigeration-system' as const,
    route: routePaths.refrigerationSystem,
    firstSlug: 'technical-design-specialized-construction-retail',
    removedTitles: ['기술설계 · 전문시공 물류형', '내치형 냉동 쇼케이스 오픈데크형'],
    titles: [
      '기술설계 · 전문시공',
      '수산물 콜드체인시스템',
      '유지보수 서비스',
      '내치형 냉동 쇼케이스',
      '쇼케이스 와인셀러',
    ],
  },
] as const;

const renderCategoryView = (categorySlug: CatalogCategorySlug, initialEntry?: string) => {
  const category = catalogCategories[categorySlug];

  return render(
    <MemoryRouter initialEntries={[initialEntry ?? routePaths.catalogCategory(categorySlug)]}>
      <CatalogCategoryView category={category} />
    </MemoryRouter>,
  );
};

describe('CatalogCategoryView', () => {
  it('renders each catalog hero and exposes five cards aligned with the header labels', () => {
    for (const categoryCase of categoryCases) {
      const category = catalogCategories[categoryCase.slug];
      const { container, unmount } = renderCategoryView(categoryCase.slug);

      expect(
        screen.getByRole('heading', {
          name: category.hero.subtitle,
        }),
      ).toBeInTheDocument();
      expect(container).toHaveTextContent('총 5개 상품');
      expect(screen.getAllByRole('link', { name: '자세히보기' })).toHaveLength(5);
      expect(screen.getAllByRole('link', { name: '자세히보기' })[0]).toHaveAttribute(
        'href',
        routePaths.catalogDetail(categoryCase.slug, categoryCase.firstSlug),
      );
      expect(
        screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
      ).toEqual(categoryCase.titles);

      unmount();
    }
  });

  it('keeps rendering the full energy catalog even when the legacy tab query string is present', () => {
    const { container } = renderCategoryView(
      'energy-solution',
      `${routePaths.energySolution}?tab=motor-direct-control-system`,
    );

    expect(container).toHaveTextContent('총 5개 상품');
    expect(screen.getByText('모터 직결제어시스템')).toBeInTheDocument();
    expect(screen.queryByText('모터 직결제어시스템 펌프형')).not.toBeInTheDocument();
    expect(screen.getByText('구트너 유니트 쿨러')).toBeInTheDocument();
  });

  it('does not expose removed variant titles for any catalog category', () => {
    for (const categoryCase of categoryCases) {
      const { unmount } = renderCategoryView(categoryCase.slug);

      for (const removedTitle of categoryCase.removedTitles) {
        expect(screen.queryByText(removedTitle)).not.toBeInTheDocument();
      }

      unmount();
    }
  });

  it('does not render the removed filter, tab, or search UI', () => {
    const { container } = renderCategoryView('energy-solution');

    expect(container.querySelector('aside')).toBeNull();
    expect(screen.queryByPlaceholderText('검색어를 입력하세요.')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '자연냉매(CO2) 냉동냉장 멀티 시스템' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('상세필터')).not.toBeInTheDocument();
  });
});
