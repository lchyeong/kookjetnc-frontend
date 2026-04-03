import { useState } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import type { CatalogCard, CatalogCategory, CatalogSeriesTab } from '@/features/catalog/types';
import { routePaths } from '@/routes/routeRegistry';
import { useToastStore } from '@/stores/useToastStore';
import { classNames } from '@/utils/classNames';

import styles from './CatalogDetailView.module.scss';

const ShareIcon = () => {
  return (
    <svg aria-hidden='true' viewBox='0 0 32 32'>
      <path
        d='M24 29.333C26.209 29.333 28 27.542 28 25.333C28 23.124 26.209 21.333 24 21.333C21.791 21.333 20 23.124 20 25.333C20 27.542 21.791 29.333 24 29.333Z'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='M8 20C10.209 20 12 18.209 12 16C12 13.791 10.209 12 8 12C5.791 12 4 13.791 4 16C4 18.209 5.791 20 8 20Z'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='M11.453 18.013L20.56 23.32'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='M24 10.667C26.209 10.667 28 8.876 28 6.667C28 4.458 26.209 2.667 24 2.667C21.791 2.667 20 4.458 20 6.667C20 8.876 21.791 10.667 24 10.667Z'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path
        d='M20.547 8.68L11.453 13.987'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  );
};

const ThumbChevron = ({ direction }: { direction: 'prev' | 'next' }) => {
  const path = direction === 'prev' ? 'M6 15L12 9L18 15' : 'M6 9L12 15L18 9';

  return (
    <svg aria-hidden='true' viewBox='0 0 24 24'>
      <path
        d={path}
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  );
};

interface CatalogDetailViewProps {
  card: CatalogCard;
  category: CatalogCategory;
}

interface DetailStoryProps {
  item: Pick<CatalogCard, 'detailDescription' | 'detailImages'> | CatalogSeriesTab;
  leadImage?: {
    alt: string;
    src: string;
  };
  storyTitle: string;
  storyEyebrow: string;
}

const DetailStory = ({ item, leadImage, storyEyebrow, storyTitle }: DetailStoryProps) => {
  const hasDetailImages = (item.detailImages?.length ?? 0) > 0;

  return (
    <article
      className={classNames(
        styles['storyCard'],
        hasDetailImages && styles['storyCardSequence'],
        !hasDetailImages && !leadImage && styles['storyCardTextOnly'],
      )}
    >
      {hasDetailImages ? (
        <div className={styles['detailImageSequence']}>
          {item.detailImages?.map((image, index) => {
            return (
              <figure
                className={styles['detailImageFigure']}
                key={`${storyTitle}-${String(index)}-${image.src}`}
              >
                <img
                  alt={image.alt}
                  className={styles['detailImage']}
                  loading='lazy'
                  src={image.src}
                />
              </figure>
            );
          })}
        </div>
      ) : (
        <>
          {leadImage ? (
            <div className={styles['storyMedia']}>
              <img alt={leadImage.alt} src={leadImage.src} />
            </div>
          ) : null}
          <div className={styles['storyBody']}>
            <p className={styles['storyEyebrow']}>{storyEyebrow}</p>
            <h3 className={styles['storyTitle']}>{storyTitle}</h3>
            <p className={styles['storyText']}>{item.detailDescription}</p>
          </div>
        </>
      )}
    </article>
  );
};

const CatalogDetailView = ({ card, category }: CatalogDetailViewProps) => {
  const showToast = useToastStore((state) => state.showToast);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const seriesTabs = card.seriesTabs ?? [];
  const hasSeriesTabs = seriesTabs.length > 0;
  const selectedSeriesId = searchParams.get('series');
  const activeSeries = hasSeriesTabs
    ? (seriesTabs.find((series) => series.id === selectedSeriesId) ?? seriesTabs[0])
    : undefined;
  const detailSource = activeSeries ?? card;
  const galleryImages = activeSeries?.gallery ?? card.gallery;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast({
        message: '제품 상세 링크를 복사했습니다.',
        variant: 'success',
      });
    } catch {
      showToast({
        message: '링크 복사에 실패했습니다. 브라우저 권한을 확인해 주세요.',
        variant: 'error',
      });
    }
  };

  const handleGalleryStep = (direction: 'prev' | 'next') => {
    setActiveGalleryIndex((current) => {
      if (galleryImages.length === 0) {
        return 0;
      }

      if (direction === 'prev') {
        return current === 0 ? galleryImages.length - 1 : current - 1;
      }

      return current === galleryImages.length - 1 ? 0 : current + 1;
    });
  };

  const handleSeriesChange = (seriesId: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (seriesId === seriesTabs[0]?.id) {
      nextSearchParams.delete('series');
    } else {
      nextSearchParams.set('series', seriesId);
    }

    setActiveGalleryIndex(0);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const activeGalleryImage = galleryImages[activeGalleryIndex] ?? galleryImages[0];

  return (
    <div className={styles['page']}>
      <main className={styles['detailSection']}>
        <section className={styles['mainSection']}>
          <div className={styles['viewInner']}>
            <div className={styles['gallery']}>
              <div className={styles['thumbArea']}>
                <button
                  aria-label='이전 썸네일 보기'
                  className={classNames(styles['thumbControl'], styles['thumbControlPrev'])}
                  onClick={() => {
                    handleGalleryStep('prev');
                  }}
                  type='button'
                >
                  <ThumbChevron direction='prev' />
                </button>

                <div className={styles['thumbList']}>
                  {galleryImages.map((image, index) => {
                    const isActive = index === activeGalleryIndex;

                    return (
                      <button
                        aria-label={`${card.title} 썸네일 ${String(index + 1)}`}
                        className={classNames(
                          styles['thumbItem'],
                          isActive && styles['thumbItemActive'],
                        )}
                        key={`${detailSource.id}-thumb-${String(index)}-${image.src}`}
                        onClick={() => {
                          setActiveGalleryIndex(index);
                        }}
                        type='button'
                      >
                        <img alt={image.alt} src={image.src} />
                      </button>
                    );
                  })}
                </div>

                <button
                  aria-label='다음 썸네일 보기'
                  className={classNames(styles['thumbControl'], styles['thumbControlNext'])}
                  onClick={() => {
                    handleGalleryStep('next');
                  }}
                  type='button'
                >
                  <ThumbChevron direction='next' />
                </button>
              </div>

              <div className={styles['mainImageArea']}>
                <img
                  alt={activeGalleryImage.alt}
                  className={styles['mainImage']}
                  src={activeGalleryImage.src}
                />
              </div>
            </div>

            <div className={styles['content']}>
              <div className={styles['contentHead']}>
                <div className={styles['titleWrap']}>
                  <h1 className={styles['title']}>{card.title}</h1>
                  <button
                    aria-label='제품 상세 링크 공유'
                    className={styles['shareButton']}
                    onClick={() => {
                      void handleShare();
                    }}
                    type='button'
                  >
                    <ShareIcon />
                  </button>
                </div>
                <p className={styles['model']}>
                  {activeSeries ? `${activeSeries.label} · ${activeSeries.model}` : card.model}
                </p>
              </div>

              <p className={styles['summary']}>{detailSource.summary}</p>

              {activeSeries ? (
                <div className={styles['seriesNav']}>
                  <div className={styles['seriesNavHeader']}>
                    <p className={styles['seriesNavEyebrow']}>모델 선택</p>
                    <p className={styles['seriesNavCaption']}>
                      공통 제품군 정보는 아래에서 함께 확인할 수 있습니다.
                    </p>
                  </div>
                  <div
                    className={styles['seriesTabList']}
                    role='tablist'
                    aria-label='구트너 모델 선택'
                  >
                    {seriesTabs.map((series) => {
                      const isActive = series.id === activeSeries.id;

                      return (
                        <button
                          aria-selected={isActive}
                          className={classNames(
                            styles['seriesTabButton'],
                            isActive && styles['seriesTabButtonActive'],
                          )}
                          key={series.id}
                          onClick={() => {
                            handleSeriesChange(series.id);
                          }}
                          role='tab'
                          type='button'
                        >
                          {series.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <ul className={styles['tagList']}>
                {detailSource.tags.map((tag) => {
                  return (
                    <li className={styles['tagItem']} key={tag}>
                      {tag}
                    </li>
                  );
                })}
              </ul>

              <div className={styles['infoPanel']}>
                <div className={styles['infoPanelHeader']}>
                  <p className={styles['infoPanelEyebrow']}>
                    {activeSeries ? '선택 모델 핵심' : category.label}
                  </p>
                  <h2 className={styles['infoPanelTitle']}>
                    {activeSeries ? activeSeries.label : '제품 특징'}
                  </h2>
                </div>

                <ul className={styles['highlightList']}>
                  {detailSource.highlights.map((item) => {
                    return (
                      <li className={styles['highlightItem']} key={item}>
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className={styles['infoSection']}>
          <div className={styles['infoInner']}>
            <div className={styles['editorWrap']}>
              <h2 className={styles['sectionTitle']}>제품 상세정보</h2>

              {activeSeries ? (
                <div className={styles['editorSection']}>
                  <section className={styles['detailBlock']}>
                    <div className={styles['detailBlockHeader']}>
                      <p className={styles['galleryPanelEyebrow']}>제품군 공통 정보</p>
                      <h3 className={styles['galleryPanelTitle']}>Güntner Air Cooler 기준</h3>
                    </div>
                    <DetailStory
                      item={card}
                      leadImage={card.gallery[0]}
                      storyEyebrow={card.model}
                      storyTitle={`${card.title} 제품군 개요`}
                    />
                  </section>

                  <section className={styles['detailBlock']}>
                    <div className={styles['detailBlockHeader']}>
                      <p className={styles['galleryPanelEyebrow']}>모델 상세 정보</p>
                      <h3 className={styles['galleryPanelTitle']}>
                        {`${activeSeries.label} 상세 안내`}
                      </h3>
                    </div>
                    <DetailStory
                      item={activeSeries}
                      leadImage={activeSeries.gallery?.[0] ?? card.gallery[0]}
                      storyEyebrow={activeSeries.model}
                      storyTitle={`${activeSeries.label} 운영 포인트`}
                    />
                  </section>

                  <article className={styles['galleryPanel']}>
                    <div className={styles['galleryPanelHeader']}>
                      <p className={styles['galleryPanelEyebrow']}>주요 구성 이미지</p>
                      <h3 className={styles['galleryPanelTitle']}>
                        {`${card.title} ${activeSeries.label} 갤러리`}
                      </h3>
                    </div>
                    <div className={styles['galleryGrid']}>
                      {galleryImages.map((image, index) => {
                        return (
                          <figure
                            className={styles['galleryFigure']}
                            key={`${activeSeries.id}-${String(index)}-${image.src}`}
                          >
                            <img alt={image.alt} src={image.src} />
                            <figcaption>{image.alt}</figcaption>
                          </figure>
                        );
                      })}
                    </div>
                  </article>
                </div>
              ) : (
                <div className={styles['editorSection']}>
                  <DetailStory
                    item={card}
                    leadImage={card.gallery[0]}
                    storyEyebrow={card.model}
                    storyTitle={`${card.title} 운영 제안`}
                  />

                  <article className={styles['galleryPanel']}>
                    <div className={styles['galleryPanelHeader']}>
                      <p className={styles['galleryPanelEyebrow']}>주요 구성 이미지</p>
                      <h3 className={styles['galleryPanelTitle']}>{`${card.title} 갤러리`}</h3>
                    </div>
                    <div className={styles['galleryGrid']}>
                      {card.gallery.map((image, index) => {
                        return (
                          <figure
                            className={styles['galleryFigure']}
                            key={`${card.id}-${String(index)}-${image.src}`}
                          >
                            <img alt={image.alt} src={image.src} />
                            <figcaption>{image.alt}</figcaption>
                          </figure>
                        );
                      })}
                    </div>
                  </article>
                </div>
              )}
            </div>

            <div className={styles['backLinkWrap']}>
              <Link className={styles['backLink']} to={routePaths.catalogCategory(category.id)}>
                {`${category.label} 목록으로 돌아가기`}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CatalogDetailView;
