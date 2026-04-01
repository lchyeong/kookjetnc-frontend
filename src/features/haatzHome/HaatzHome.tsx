import { useRef, useState } from 'react';

import type SwiperClass from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import BusinessInquirySection from '@/features/haatzHome/components/BusinessInquirySection';
import HaatzHeroSection from '@/features/haatzHome/components/HaatzHeroSection';
import HiwinSystemSection, {
  HiwinSystemHeadingSection,
} from '@/features/haatzHome/components/HiwinSystemSection';
import { newsCards, productCards, quickAssets } from '@/features/haatzHome/data';
import { classNames } from '@/utils/classNames';

import 'swiper/css';

import styles from './HaatzHome.module.scss';

interface LoopSlide<T> {
  item: T;
  renderKey: string;
}

const buildLoopSlides = <T extends { id: string }>(items: T[], minimumCount: number) => {
  if (items.length === 0) {
    return [] satisfies LoopSlide<T>[];
  }

  const loopItems = [...items];

  while (loopItems.length < minimumCount) {
    loopItems.push(items[loopItems.length % items.length]);
  }

  return loopItems.map((item, index) => {
    return {
      item,
      renderKey: `${item.id}-${String(index)}`,
    } satisfies LoopSlide<T>;
  });
};

const updateProductSlideClasses = (swiper: SwiperClass) => {
  const moveLeftClass = styles['productSlideMoveLeft'];
  const moveRightClass = styles['productSlideMoveRight'];
  const slides = Array.from(swiper.slides);
  const total = slides.length;

  slides.forEach((slide) => {
    slide.classList.remove(moveLeftClass, moveRightClass);
  });

  slides.forEach((slide, index) => {
    if (index === swiper.activeIndex) {
      return;
    }

    const forwardDistance = (index - swiper.activeIndex + total) % total;
    const backwardDistance = (swiper.activeIndex - index + total) % total;

    if (backwardDistance > 0 && backwardDistance < forwardDistance) {
      slide.classList.add(moveLeftClass);
      return;
    }

    if (forwardDistance > 0 && forwardDistance < backwardDistance) {
      slide.classList.add(moveRightClass);
    }
  });
};

const toggleNewsSlideParity = (swiper: SwiperClass) => {
  const evenClass = styles['newsSlideEven'];
  const oddClass = styles['newsSlideOdd'];

  Array.from(swiper.slides).forEach((slide) => {
    if (slide.classList.contains(evenClass)) {
      slide.classList.remove(evenClass);
      slide.classList.add(oddClass);
      return;
    }

    if (slide.classList.contains(oddClass)) {
      slide.classList.remove(oddClass);
      slide.classList.add(evenClass);
    }
  });
};

const productSlides = buildLoopSlides(productCards, 14);
const NEWS_AUTOPLAY_DELAY_MS = 5000;
const PRODUCT_IMAGE_TRIGGER_SELECTOR = '[data-product-image-trigger="true"]';

const clampUnitProgress = (value: number) => {
  return Math.min(1, Math.max(0, value));
};

const getProductLoopIndexFromClickedSlide = (swiper: SwiperClass) => {
  const clickedSlide = swiper.clickedSlide as HTMLElement | null | undefined;
  const loopIndexAttribute = clickedSlide?.getAttribute('data-swiper-slide-index');
  const parsedLoopIndex = Number.parseInt(loopIndexAttribute ?? '', 10);

  if (Number.isInteger(parsedLoopIndex) && parsedLoopIndex >= 0) {
    return parsedLoopIndex;
  }

  if (Number.isInteger(swiper.clickedIndex) && swiper.clickedIndex >= 0) {
    return swiper.clickedIndex % productCards.length;
  }

  return null;
};

const HaatzHome = () => {
  const productSwiperRef = useRef<SwiperClass | null>(null);
  const newsSwiperRef = useRef<SwiperClass | null>(null);
  const newsProgressTrackRef = useRef<HTMLDivElement | null>(null);
  const newsProgressFillRef = useRef<HTMLSpanElement | null>(null);
  const [newsActiveIndex, setNewsActiveIndex] = useState(0);

  const syncNewsAutoplayProgress = (value: number) => {
    const progress = clampUnitProgress(value);
    const progressPercent = String(Math.round(progress * 100));

    newsProgressTrackRef.current?.setAttribute('aria-valuenow', progressPercent);
    newsProgressFillRef.current?.style.setProperty('--news-progress-scale', String(progress));
    newsProgressFillRef.current?.setAttribute('data-progress', progressPercent);
  };

  const syncNewsActiveIndex = (swiper: SwiperClass) => {
    setNewsActiveIndex(swiper.realIndex % newsCards.length);
  };

  const handleNewsSwiper = (swiper: SwiperClass) => {
    newsSwiperRef.current = swiper;
    syncNewsActiveIndex(swiper);
    syncNewsAutoplayProgress(0);
  };

  const handleProductSwiper = (swiper: SwiperClass) => {
    productSwiperRef.current = swiper;
    updateProductSlideClasses(swiper);
  };

  const handleProductImageClick = (
    swiper: SwiperClass,
    event: MouseEvent | TouchEvent | PointerEvent,
  ) => {
    const eventTarget = event.target;

    if (!(eventTarget instanceof Element)) {
      return;
    }

    if (!eventTarget.closest(PRODUCT_IMAGE_TRIGGER_SELECTOR)) {
      return;
    }

    const targetLoopIndex = getProductLoopIndexFromClickedSlide(swiper);

    if (targetLoopIndex === null) {
      return;
    }

    productSwiperRef.current?.slideToLoop(targetLoopIndex);
  };

  const handleNewsSlideChangeTransitionStart = (swiper: SwiperClass) => {
    toggleNewsSlideParity(swiper);
    syncNewsActiveIndex(swiper);
    syncNewsAutoplayProgress(0);
  };

  const handleNewsAutoplayTimeLeft = (
    _swiper: SwiperClass,
    _timeLeft: number,
    percentage: number,
  ) => {
    syncNewsAutoplayProgress(1 - percentage);
  };

  const handleNewsNavigation = (direction: 'prev' | 'next') => {
    const swiper = newsSwiperRef.current;

    if (!swiper) {
      return;
    }

    syncNewsAutoplayProgress(0);

    if (direction === 'prev') {
      swiper.slidePrev();
      return;
    }

    swiper.slideNext();
  };

  return (
    <div className={styles['page']}>
      <HaatzHeroSection />

      <section className={classNames(styles['section'], styles['hiwinSection'])}>
        <HiwinSystemHeadingSection />
        <HiwinSystemSection />
      </section>

      <section className={classNames(styles['section'], styles['contentSection'])}>
        <div className={styles['sectionPanel']}>
          <div className={classNames(styles['sectionHeading'], styles['productSectionHeading'])}>
            <p className={styles['eyebrow']}>Core Equipment Portfolio</p>
            <h2 className={styles['sectionTitle']}>
              <span>국제티엔씨의 주요 취급 설비</span>
            </h2>
          </div>

          <div className={styles['productCarouselWrap']}>
            <Swiper
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                0: { centeredSlides: true, slidesPerView: 2, spaceBetween: 12 },
                480: { centeredSlides: true, slidesPerView: 3, spaceBetween: 16 },
                769: { centeredSlides: true, slidesPerView: 3.5, spaceBetween: 24 },
                1201: { centeredSlides: true, slidesPerView: 4.5, spaceBetween: 28 },
                1601: { centeredSlides: true, slidesPerView: 6.5, spaceBetween: 36 },
              }}
              centeredSlides
              className={styles['productSwiper']}
              loop
              modules={[Autoplay]}
              onClick={handleProductImageClick}
              onInit={handleProductSwiper}
              onLoopFix={updateProductSlideClasses}
              onSwiper={handleProductSwiper}
              onSlideChangeTransitionStart={updateProductSlideClasses}
            >
              {productSlides.map(({ item, renderKey }) => {
                return (
                  <SwiperSlide key={renderKey}>
                    <article className={styles['productCard']}>
                      <div className={styles['productImageMotion']}>
                        <button
                          aria-label={`${item.title} 카드로 이동`}
                          className={styles['productImageTrigger']}
                          data-product-image-trigger='true'
                          data-testid={`product-image-trigger-${item.id}`}
                          type='button'
                        >
                          <div className={styles['productImageBox']}>
                            <img alt={item.imageAlt} src={item.imageSrc} />
                          </div>
                        </button>
                      </div>
                      <div className={styles['productCardBody']}>
                        <div className={styles['productCopyGroup']}>
                          <p className={styles['productTitle']}>
                            <span className={styles['productTitleText']}>{item.title}</span>
                          </p>
                          {item.description ? (
                            <p className={styles['productDescription']}>{item.description}</p>
                          ) : (
                            <span className={styles['productDescriptionPlaceholder']} />
                          )}
                        </div>
                        <a className={styles['fillButton']} href={item.href} target={item.target}>
                          <span className={styles['fillButtonLabel']}>view more</span>
                          <span aria-hidden='true' className={styles['fillButtonIcon']}>
                            <svg viewBox='0 0 16 16'>
                              <path d='M8 3v10' />
                              <path d='M3 8h10' />
                            </svg>
                          </span>
                        </a>
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </section>

      <section
        className={classNames(styles['section'], styles['contentSection'], styles['newsSection'])}
        style={{ backgroundImage: `url(${quickAssets.sectionFiveBackground})` }}
      >
        <div className={styles['sectionPanel']}>
          <div className={styles['sectionHeading']}>
            <p className={classNames(styles['eyebrow'], styles['eyebrowInverse'])}>
              Media Coverage
            </p>
            <h2 className={classNames(styles['sectionTitle'], styles['sectionTitleInverse'])}>
              <span>국제티엔씨의 언론보도</span>
            </h2>
            <p
              className={classNames(
                styles['sectionDescription'],
                styles['sectionDescriptionInverse'],
              )}
            >
              국제티엔씨의 최신 소식과 미디어 정보를 확인하세요.
            </p>
          </div>

          <div className={styles['newsControls']} data-testid='pr-news-controls'>
            <div className={styles['newsTimeBox']}>
              <div
                aria-label='Media Coverage 자동 재생 진행률'
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={0}
                aria-valuetext={`현재 ${String(newsActiveIndex + 1)}번째 소식 자동 재생 중`}
                className={styles['newsTimeTrack']}
                data-testid='pr-news-progress-track'
                ref={newsProgressTrackRef}
                role='progressbar'
              >
                <span
                  className={styles['newsTimeFill']}
                  data-progress='0'
                  data-testid='pr-news-progress-fill'
                  ref={newsProgressFillRef}
                />
              </div>
            </div>

            <div className={styles['newsNavButtons']}>
              <button
                aria-label='이전 소식'
                className={styles['newsNavButton']}
                data-testid='pr-news-prev-button'
                onClick={() => {
                  handleNewsNavigation('prev');
                }}
                type='button'
              >
                <svg aria-hidden='true' viewBox='0 0 24 24'>
                  <path d='M14.5 6.5 9 12l5.5 5.5' />
                </svg>
              </button>

              <button
                aria-label='다음 소식'
                className={styles['newsNavButton']}
                data-testid='pr-news-next-button'
                onClick={() => {
                  handleNewsNavigation('next');
                }}
                type='button'
              >
                <svg aria-hidden='true' viewBox='0 0 24 24'>
                  <path d='M9.5 6.5 15 12l-5.5 5.5' />
                </svg>
              </button>
            </div>
          </div>

          <Swiper
            autoplay={{
              delay: NEWS_AUTOPLAY_DELAY_MS,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1.05, spaceBetween: 12 },
              769: { slidesPerView: 2, spaceBetween: 16 },
              1025: { slidesPerView: 3, spaceBetween: 20 },
              1601: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className={styles['newsSwiper']}
            loop
            modules={[Autoplay]}
            onAutoplayTimeLeft={handleNewsAutoplayTimeLeft}
            onSlideChangeTransitionStart={handleNewsSlideChangeTransitionStart}
            onSwiper={handleNewsSwiper}
          >
            {newsCards.map((item, index) => {
              return (
                <SwiperSlide
                  className={index % 2 === 0 ? styles['newsSlideEven'] : styles['newsSlideOdd']}
                  key={item.id}
                >
                  <a
                    className={styles['newsCard']}
                    href={item.href}
                    rel={item.target === '_blank' ? 'noreferrer' : undefined}
                    target={item.target}
                  >
                    <div className={styles['newsImageBox']}>
                      <span className={styles['newsIndex']}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <img
                        alt={item.imageAlt}
                        src={item.imageSrc}
                        style={
                          item.imageObjectPosition
                            ? { objectPosition: item.imageObjectPosition }
                            : undefined
                        }
                      />
                    </div>

                    <div className={styles['newsCardBody']}>
                      <p className={styles['newsTitle']}>{item.title}</p>
                      <p className={styles['newsDescription']}>{item.description}</p>
                      <p className={styles['newsDate']}>{item.date}</p>
                    </div>
                  </a>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      <section className={classNames(styles['section'], styles['contentSection'])}>
        <BusinessInquirySection />
      </section>
    </div>
  );
};

export default HaatzHome;
