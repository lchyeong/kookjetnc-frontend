import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import {
  fetchWebCatalogs,
  webCatalogQueryKeys,
} from '@/features/board/webCatalogApi';
import { formatPublishedDate, getApiErrorMessage } from '@/features/board/utils';
import styles from '@/pages/WebCatalogPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const WebCatalogListPage = () => {
  const webCatalogQuery = useQuery({
    queryKey: webCatalogQueryKeys.webCatalogs,
    queryFn: fetchWebCatalogs,
  });

  if (webCatalogQuery.isLoading) {
    return (
      <PlaceholderPage
        description='웹카탈로그 목록을 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (webCatalogQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(webCatalogQuery.error)}
        title='웹카탈로그를 불러오지 못했습니다.'
      />
    );
  }

  const webCatalogs = webCatalogQuery.data ?? [];

  return (
    <div className={styles['page']}>
      <section className={styles['hero']}>
        <h1 className={styles['title']}>웹카탈로그</h1>
      </section>

      <section className={styles['shelf']}>
        {webCatalogs.map((webCatalog) => (
          <article className={styles['bookCard']} key={webCatalog.id}>
            <Link className={styles['bookVisual']} to={routePaths.webCatalogDetail(webCatalog.id)}>
              {webCatalog.coverImageUrl ? (
                <img alt={webCatalog.title} loading='lazy' src={webCatalog.coverImageUrl} />
              ) : null}
            </Link>

            <div className={styles['bookBody']}>
              <div className={styles['bookMetaRow']}>
                <span className={styles['bookCategory']}>{webCatalog.category}</span>
                <span className={styles['bookInfo']}>{webCatalog.pageCount}p</span>
              </div>

              <h2 className={styles['bookTitle']}>{webCatalog.title}</h2>
              <p className={styles['bookDescription']}>{webCatalog.description}</p>
              <p className={styles['bookInfo']}>
                {formatPublishedDate(webCatalog.publishedAt)}
              </p>

              <div className={styles['cardActions']}>
                <Link className={styles['actionLink']} to={routePaths.webCatalogDetail(webCatalog.id)}>
                  펼쳐보기
                </Link>
                <a className={styles['textLink']} href={webCatalog.fileUrl} rel='noreferrer' target='_blank'>
                  PDF 다운로드
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default WebCatalogListPage;
