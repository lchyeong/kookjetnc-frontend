import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastViewport } from '@/components/feedback/Toast/ToastViewport';
import CatalogDetailView from '@/features/catalog/CatalogDetailView';
import { catalogCategories } from '@/features/catalog/data';
import { routePaths } from '@/routes/routeRegistry';
import { useToastStore } from '@/stores/useToastStore';

import styles from './CatalogDetailView.module.scss';

const category = catalogCategories['energy-solution'];
const card = category.cards[0];
const fallbackCard = category.cards[1];
let clipboardWriteText = vi.fn<() => Promise<void>>();

const renderDetailView = (
  selectedCard = card,
  initialEntry = routePaths.catalogDetail(category.id, selectedCard.slug),
) => {
  window.history.pushState({}, '', initialEntry);

  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <CatalogDetailView card={selectedCard} category={category} />
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
      screen.getByText('국내 대형마트 최초 적용 사례로 소개된 자연냉매 CO2(R744) 기반 리테일 냉동·냉장 멀티 시스템입니다.'),
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
    expect(screen.queryByRole('heading', { name: '함께 보면 좋은 제품들을 추천드려요.' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: `${category.label} 목록으로 돌아가기` }),
    ).toHaveAttribute('href', routePaths.catalogCategory(category.id));
    expect(screen.queryByRole('link', { name: '자세히보기' })).not.toBeInTheDocument();
    expect(container.querySelector(`.${styles['mainImage']}`)).toBeInTheDocument();
  });

  it('keeps the existing story card text layout for non-CO2 detail cards', () => {
    renderDetailView(fallbackCard);

    expect(screen.getAllByText(fallbackCard.model)).toHaveLength(2);
    expect(screen.getByText(fallbackCard.detailDescription)).toBeInTheDocument();
    expect(
      screen.queryByRole('img', { name: /구트너 유니트 쿨러 상세 이미지/u }),
    ).not.toBeInTheDocument();
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
