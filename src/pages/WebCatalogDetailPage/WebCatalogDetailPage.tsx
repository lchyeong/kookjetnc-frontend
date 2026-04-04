import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import {
  fetchWebCatalog,
  webCatalogQueryKeys,
} from '@/features/board/webCatalogApi';
import { formatPublishedDate, getApiErrorMessage } from '@/features/board/utils';
import styles from '@/pages/WebCatalogPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const WebCatalogDetailPage = () => {
  const { webCatalogId } = useParams();
  const resolvedWebCatalogId = Number(webCatalogId);
  const isValidWebCatalogId = Boolean(webCatalogId) && !Number.isNaN(resolvedWebCatalogId);
  const [currentSpreadStart, setCurrentSpreadStart] = useState(0);

  const webCatalogQuery = useQuery({
    enabled: isValidWebCatalogId,
    queryKey: webCatalogQueryKeys.webCatalog(resolvedWebCatalogId),
    queryFn: () => fetchWebCatalog(resolvedWebCatalogId),
  });

  useEffect(() => {
    setCurrentSpreadStart(0);
  }, [resolvedWebCatalogId]);

  if (!isValidWebCatalogId) {
    return (
      <PlaceholderPage
        description='웹카탈로그 식별자가 전달되지 않았습니다.'
        title='잘못된 요청입니다.'
      />
    );
  }

  if (webCatalogQuery.isLoading) {
    return (
      <PlaceholderPage
        description='웹카탈로그 상세 정보를 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (webCatalogQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(webCatalogQuery.error)}
        secondary={<Link to={routePaths.webCatalogs}>웹카탈로그 목록으로 돌아가기</Link>}
        title='웹카탈로그를 불러오지 못했습니다.'
      />
    );
  }

  const webCatalog = webCatalogQuery.data;

  if (!webCatalog) {
    return (
      <PlaceholderPage
        description='웹카탈로그 데이터를 찾지 못했습니다.'
        secondary={<Link to={routePaths.webCatalogs}>웹카탈로그 목록으로 돌아가기</Link>}
        title='웹카탈로그를 불러오지 못했습니다.'
      />
    );
  }

  const leftPage = webCatalog.previewPages[currentSpreadStart] ?? null;
  const rightPage = webCatalog.previewPages[currentSpreadStart + 1] ?? null;
  const hasViewer = webCatalog.previewPages.length > 0;
  const spreadLabel = hasViewer
    ? `${currentSpreadStart + 1} / ${webCatalog.previewPages.length}`
    : '미리보기 준비 중';

  return (
    <article className={styles['page']}>
      <section className={styles['hero']}>
        <h1 className={styles['title']}>{webCatalog.title}</h1>
        <p className={styles['description']}>{webCatalog.description}</p>
        <div className={styles['heroMeta']}>
          <span className={styles['metaChip']}>{webCatalog.category}</span>
          <span className={styles['metaChip']}>{webCatalog.pageCount}p</span>
          <span className={styles['metaChip']}>
            등록일 {formatPublishedDate(webCatalog.publishedAt)}
          </span>
        </div>
      </section>

      <section className={styles['detailGrid']}>
        <aside className={styles['coverPanel']}>
          <div className={styles['coverPoster']}>
            {webCatalog.coverImageUrl ? (
              <img alt={webCatalog.title} src={webCatalog.coverImageUrl} />
            ) : null}
          </div>
          <p className={styles['coverHelper']}>
            원본 PDF를 기준으로 표지 썸네일과 페이지 미리보기를 구성하는 전시형 카탈로그 화면입니다.
          </p>
          <div className={styles['detailActions']}>
            <a className={styles['actionLink']} href={webCatalog.fileUrl} rel='noreferrer' target='_blank'>
              PDF 열기
            </a>
            <Link className={styles['textLink']} to={routePaths.webCatalogs}>
              목록으로 돌아가기
            </Link>
          </div>
        </aside>

        <div className={styles['readerPanel']}>
          <div className={styles['readerHeader']}>
            <div>
              <h2 className={styles['readerTitle']}>Magazine View</h2>
              <p className={styles['readerStatus']}>{spreadLabel}</p>
            </div>
            <div className={styles['readerControls']}>
              <button
                className={styles['readerButton']}
                disabled={!hasViewer || currentSpreadStart === 0}
                onClick={() => setCurrentSpreadStart((current) => Math.max(0, current - 2))}
                type='button'
              >
                이전 펼침
              </button>
              <button
                className={styles['readerButton']}
                disabled={!hasViewer || currentSpreadStart + 2 >= webCatalog.previewPages.length}
                onClick={() =>
                  setCurrentSpreadStart((current) =>
                    Math.min(
                      webCatalog.previewPages.length - 1,
                      current + 2,
                    ),
                  )
                }
                type='button'
              >
                다음 펼침
              </button>
            </div>
          </div>

          {hasViewer ? (
            <>
              <div className={styles['spread']}>
                {leftPage ? (
                  <figure className={styles['pageCard']}>
                    <img alt={`${webCatalog.title} ${leftPage.pageNumber}페이지`} src={leftPage.imageUrl} />
                    <figcaption className={styles['pageNumber']}>Page {leftPage.pageNumber}</figcaption>
                  </figure>
                ) : null}

                {rightPage ? (
                  <figure className={styles['pageCard']}>
                    <img alt={`${webCatalog.title} ${rightPage.pageNumber}페이지`} src={rightPage.imageUrl} />
                    <figcaption className={styles['pageNumber']}>Page {rightPage.pageNumber}</figcaption>
                  </figure>
                ) : (
                  <div className={styles['pagePlaceholder']}>다음 페이지가 없는 마지막 펼침입니다.</div>
                )}
              </div>

              <div className={styles['thumbnailRail']}>
                {webCatalog.previewPages.map((page, index) => {
                  const alignedIndex = Math.floor(index / 2) * 2;
                  return (
                    <button
                      className={styles['thumbnailButton']}
                      data-active={alignedIndex === currentSpreadStart}
                      key={page.id}
                      onClick={() => setCurrentSpreadStart(alignedIndex)}
                      type='button'
                    >
                      <img alt={`${webCatalog.title} 썸네일 ${page.pageNumber}`} src={page.imageUrl} />
                      <span className={styles['thumbnailCaption']}>Page {page.pageNumber}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className={styles['emptyPanel']}>
              이 항목은 현재 PDF만 등록된 상태입니다. 서버 연결 단계에서 PDF 첫 페이지 썸네일과
              내부 페이지 미리보기를 자동 생성하면 동일한 뷰어 안에서 바로 펼쳐 볼 수 있습니다.
            </div>
          )}
        </div>
      </section>
    </article>
  );
};

export default WebCatalogDetailPage;
