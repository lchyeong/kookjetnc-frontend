import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastViewport } from '@/components/feedback/Toast/ToastViewport';
import CatalogDetailView from '@/features/catalog/CatalogDetailView';
import { catalogCategories } from '@/features/catalog/data';
import type { CatalogCard, CatalogCategory } from '@/features/catalog/types';
import { routePaths } from '@/routes/routeRegistry';
import { useToastStore } from '@/stores/useToastStore';

import styles from './CatalogDetailView.module.scss';

const energyCategory = catalogCategories['energy-solution'];
const refrigerationCategory = catalogCategories['refrigeration-system'];
const card = energyCategory.cards[0];
const guntnerCard =
  energyCategory.cards.find((entry) => entry.slug === 'gutner-unit-cooler-high-flow') ??
  energyCategory.cards[1];
const fallbackCard =
  refrigerationCategory.cards.find((entry) => entry.detailImages === undefined) ??
  refrigerationCategory.cards[0];
let clipboardWriteText = vi.fn<() => Promise<void>>();

const renderDetailView = (
  selectedCard: CatalogCard = card,
  selectedCategory: CatalogCategory = energyCategory,
  initialEntry = routePaths.catalogDetail(selectedCategory.id, selectedCard.slug),
) => {
  window.history.pushState({}, '', initialEntry);

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <CatalogDetailView card={selectedCard} category={selectedCategory} />
      <ToastViewport />
    </MemoryRouter>,
  );
};

describe('CatalogDetailView', () => {
  beforeEach(() => {
    clipboardWriteText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: clipboardWriteText,
      },
    });
  });

  afterEach(() => {
    useToastStore.getState().clearToasts();
    window.history.pushState({}, '', '/');
  });

  it('renders the product detail content without metric or recommendation sections and keeps a category back link', () => {
    const { container } = renderDetailView();

    expect(screen.getByRole('heading', { name: card.title })).toBeInTheDocument();
    expect(screen.getAllByText(card.model)).toHaveLength(1);
    expect(screen.getByRole('heading', { name: '제품 상세정보' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '제품 특징' })).toBeInTheDocument();
    expect(
      screen.getByText(
        '국내 대형마트 최초 적용 사례로 소개된 자연냉매 CO2(R744) 기반 리테일 냉동·냉장 멀티 시스템입니다.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(card.detailDescription)).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('img', {
        name: /자연냉매\(CO2\) 냉동냉장 멀티 시스템 상세 이미지/u,
      }),
    ).toHaveLength(18);
    expect(
      screen.getByRole('img', { name: '자연냉매(CO2) 냉동냉장 멀티 시스템 상세 이미지 1' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: '자연냉매(CO2) 냉동냉장 멀티 시스템 상세 이미지 18' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('권장 적용')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: '함께 보면 좋은 제품들을 추천드려요.' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: `${energyCategory.label} 목록으로 돌아가기` }),
    ).toHaveAttribute('href', routePaths.catalogCategory(energyCategory.id));
    expect(screen.queryByRole('link', { name: '자세히보기' })).not.toBeInTheDocument();
    expect(container.querySelector(`.${styles['mainImage']}`)).toBeInTheDocument();
  });

  it('keeps the existing story card text layout for cards without detail image sequences', () => {
    renderDetailView(
      fallbackCard,
      refrigerationCategory,
      routePaths.catalogDetail(refrigerationCategory.id, fallbackCard.slug),
    );

    expect(screen.getAllByText(fallbackCard.model).length).toBeGreaterThan(0);
    expect(screen.getByText(fallbackCard.detailDescription)).toBeInTheDocument();
    expect(
      screen.queryByRole('img', { name: new RegExp(`${fallbackCard.title} 상세 이미지`, 'u') }),
    ).not.toBeInTheDocument();
  });

  it('renders model tabs for the guntner unit cooler and switches detail content when another series is selected', () => {
    renderDetailView(guntnerCard);

    expect(screen.getByRole('tab', { name: 'GACC' })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByText(
        '컴팩트한 본체와 위생 중심 구조를 바탕으로 냉동·냉장 저장고와 워크인 공간에 폭넓게 적용하는 기본형 라인입니다.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Güntner Air Cooler 기준')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: '구트너 유니트 쿨러 GACC 카달로그 이미지' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'GASC' }));

    expect(screen.getByRole('tab', { name: 'GASC' })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByText(
        '슬림한 평면형 본체와 EC 팬 옵션을 중심으로 작업장과 소분실의 공간 활용을 높이는 공간 절약형 라인입니다.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: '구트너 유니트 쿨러 GASC 카달로그 이미지' }),
    ).toBeInTheDocument();
  });

  it('supports direct linking to a specific guntner series tab through the query string', () => {
    renderDetailView(
      guntnerCard,
      energyCategory,
      `${routePaths.catalogDetail(energyCategory.id, guntnerCard.slug)}?series=gadc`,
    );

    expect(screen.getByRole('tab', { name: 'GADC' })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByText(
        '양방향 균일 토출과 평면형 구성을 바탕으로 대형마트 쿨링존과 물류 신선실처럼 긴 공간에 대응하는 라인입니다.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: '구트너 유니트 쿨러 GADC 카달로그 이미지' }),
    ).toBeInTheDocument();
  });

  it('cycles the main gallery image when the thumbnail controls are used', () => {
    const { container } = renderDetailView();
    const mainImage = container.querySelector(`.${styles['mainImage']}`);

    expect(mainImage).toHaveAttribute('alt', card.gallery[0]?.alt);

    fireEvent.click(screen.getByRole('button', { name: '다음 썸네일 보기' }));

    expect(mainImage).toHaveAttribute('alt', card.gallery[1]?.alt);
  });

  it('copies the current detail URL and shows a toast when the share button is pressed', async () => {
    renderDetailView();

    fireEvent.click(screen.getByRole('button', { name: '제품 상세 링크 공유' }));

    expect(clipboardWriteText).toHaveBeenCalledWith(window.location.href);
    expect(await screen.findByText('제품 상세 링크를 복사했습니다.')).toBeInTheDocument();
  });
});
