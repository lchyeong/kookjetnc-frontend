import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { newsCards, productCards, quickAssets } from '@/features/haatzHome/data';
import HaatzHome from '@/features/haatzHome/HaatzHome';

interface MockSwiperInstance {
  activeIndex: number;
  clickedIndex: number;
  clickedSlide: Pick<HTMLElement, 'getAttribute'> | null;
  realIndex: number;
  slideNext: ReturnType<typeof vi.fn>;
  slidePrev: ReturnType<typeof vi.fn>;
  slideToLoop: ReturnType<typeof vi.fn>;
  slides: HTMLElement[];
}

let productSwiperInstance: MockSwiperInstance;
let newsSwiperInstance: MockSwiperInstance;

const createMockSwiperInstance = (): MockSwiperInstance => {
  return {
    activeIndex: 0,
    clickedIndex: -1,
    clickedSlide: null,
    realIndex: 0,
    slideNext: vi.fn(),
    slidePrev: vi.fn(),
    slideToLoop: vi.fn(),
    slides: [],
  };
};

vi.mock('@/features/haatzHome/components/HaatzHeroSection', () => ({
  default: () => <div data-testid='mock-hero-section' />,
}));

vi.mock('@/features/haatzHome/components/HiwinSystemSection', () => ({
  HiwinSystemHeadingSection: () => <div data-testid='mock-hiwin-heading-section' />,
  default: () => <div data-testid='mock-hiwin-system-section' />,
}));

vi.mock('@/features/haatzHome/components/BusinessInquirySection', () => ({
  default: () => <div data-testid='mock-business-inquiry-section' />,
}));

vi.mock('swiper/modules', () => ({
  Autoplay: {},
}));

vi.mock('swiper/react', async () => {
  const React = await import('react');

  return {
    Swiper: ({
      children,
      onAutoplayTimeLeft,
      onClick,
      onInit,
      onSwiper,
    }: {
      children: React.ReactNode;
      onAutoplayTimeLeft?: unknown;
      onClick?: (swiper: MockSwiperInstance, event: MouseEvent | TouchEvent | PointerEvent) => void;
      onInit?: (swiper: MockSwiperInstance) => void;
      onSwiper?: (swiper: MockSwiperInstance) => void;
    }) => {
      const swiper = onAutoplayTimeLeft ? newsSwiperInstance : productSwiperInstance;

      onSwiper?.(swiper);
      onInit?.(swiper);

      return React.createElement(
        'div',
        {
          'data-testid': onAutoplayTimeLeft ? 'mock-news-swiper' : 'mock-product-swiper',
          onClick: (event: React.MouseEvent<HTMLDivElement>) => {
            onClick?.(swiper, event.nativeEvent);
          },
        },
        children,
      );
    },
    SwiperSlide: ({ children }: { children: React.ReactNode }) => {
      return <div data-testid='mock-swiper-slide'>{children}</div>;
    },
  };
});

describe('HaatzHome core equipment portfolio', () => {
  beforeEach(() => {
    productSwiperInstance = createMockSwiperInstance();
    newsSwiperInstance = createMockSwiperInstance();
  });

  it('slides to the clicked product image', () => {
    render(<HaatzHome />);

    productSwiperInstance.clickedIndex = 0;
    productSwiperInstance.clickedSlide = {
      getAttribute: (name: string) => {
        return name === 'data-swiper-slide-index' ? '0' : null;
      },
    };

    fireEvent.click(screen.getByTestId(`product-image-trigger-${productCards[0].id}`));

    expect(productSwiperInstance.slideToLoop).toHaveBeenCalledWith(0);
  });

  it('keeps the existing view more link click free from carousel navigation', () => {
    render(<HaatzHome />);

    productSwiperInstance.clickedIndex = 0;
    productSwiperInstance.clickedSlide = {
      getAttribute: (name: string) => {
        return name === 'data-swiper-slide-index' ? '0' : null;
      },
    };

    fireEvent.click(screen.getAllByRole('link', { name: /view more/i })[0]);

    expect(productSwiperInstance.slideToLoop).not.toHaveBeenCalled();
  });

  it('applies the requested media coverage background and image focus adjustment', () => {
    render(<HaatzHome />);

    const mediaCoverageSection = screen
      .getByRole('heading', { name: '국제티엔씨의 언론보도' })
      .closest('section');
    const fifthNewsImage = screen.getByAltText(newsCards[4]?.imageAlt ?? '');

    expect(mediaCoverageSection).not.toBeNull();
    expect(mediaCoverageSection).toHaveStyle({
      backgroundImage: `url(${quickAssets.sectionFiveBackground})`,
    });
    expect(fifthNewsImage).toHaveStyle({
      objectPosition: newsCards[4]?.imageObjectPosition ?? '',
    });
  });
});
