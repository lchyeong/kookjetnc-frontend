import { useState } from 'react';

import { Link } from 'react-router-dom';

import type { CatalogCard, CatalogCategory } from '@/features/catalog/types';
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

const CatalogDetailView = ({ card, category }: CatalogDetailViewProps) => {
  const showToast = useToastStore((state) => state.showToast);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const hasDetailImages = (card.detailImages?.length ?? 0) > 0;

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
      if (direction === 'prev') {
        return current === 0 ? card.gallery.length - 1 : current - 1;
      }

      return current === card.gallery.length - 1 ? 0 : current + 1;
    });
  };

  const activeGalleryImage = card.gallery[activeGalleryIndex] ?? card.gallery[0];

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
                  {card.gallery.map((image, index) => {
                    const isActive = index === activeGalleryIndex;

                    return (
                      <button
                        aria-label={`${card.title} 썸네일 ${String(index + 1)}`}
                        className={classNames(
                          styles['thumbItem'],
                          isActive && styles['thumbItemActive'],
                        )}
                        key={`${card.id}-thumb-${String(index)}-${image.src}`}
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
                <p className={styles['model']}>{card.model}</p>
              </div>

              <p className={styles['summary']}>{card.summary}</p>

              <ul className={styles['tagList']}>
                {card.tags.map((tag) => {
                  return (
                    <li className={styles['tagItem']} key={tag}>
                      {tag}
                    </li>
                  );
                })}
              </ul>

              <div className={styles['infoPanel']}>
                <div className={styles['infoPanelHeader']}>
                  <p className={styles['infoPanelEyebrow']}>{category.label}</p>
                  <h2 className={styles['infoPanelTitle']}>제품 특징</h2>
                </div>

                <ul className={styles['highlightList']}>
                  {card.highlights.map((item) => {
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

              <div className={styles['editorSection']}>
                <article
                  className={classNames(
                    styles['storyCard'],
                    hasDetailImages && styles['storyCardSequence'],
                  )}
                >
                  {hasDetailImages ? (
                    <div className={styles['detailImageSequence']}>
                      {card.detailImages?.map((image, index) => {
                        return (
                          <figure
                            className={styles['detailImageFigure']}
                            key={`${card.id}-detail-${String(index)}-${image.src}`}
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
                      <div className={styles['storyMedia']}>
                        <img alt={card.gallery[0]?.alt} src={card.gallery[0]?.src} />
                      </div>
                      <div className={styles['storyBody']}>
                        <p className={styles['storyEyebrow']}>{card.model}</p>
                        <h3 className={styles['storyTitle']}>{`${card.title} 운영 제안`}</h3>
                        <p className={styles['storyText']}>{card.detailDescription}</p>
                      </div>
                    </>
                  )}
                </article>

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
