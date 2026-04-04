import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import {
  boardQueryKeys,
  fetchConstructionCases,
} from '@/features/board/api';
import {
  formatPublishedDateOnly,
  getApiErrorMessage,
} from '@/features/board/utils';
import styles from '@/pages/ConstructionCasePage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const ConstructionCaseListPage = () => {
  const constructionCaseQuery = useQuery({
    queryKey: boardQueryKeys.constructionCases,
    queryFn: fetchConstructionCases,
  });

  if (constructionCaseQuery.isLoading) {
    return (
      <PlaceholderPage
        description='시공사례 목록을 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (constructionCaseQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(constructionCaseQuery.error)}
        title='시공사례를 불러오지 못했습니다.'
      />
    );
  }

  const constructionCases = constructionCaseQuery.data ?? [];

  return (
    <div className={styles['page']}>
      <section className={styles['hero']}>
        <h1 className={styles['title']}>시공사례</h1>
      </section>

      {constructionCases.length === 0 ? (
        <section className={styles['emptyCard']}>
          아직 등록된 시공사례가 없습니다.
        </section>
      ) : (
        <section className={styles['grid']}>
          {constructionCases.map((constructionCase) => (
            <article className={styles['card']} key={constructionCase.id}>
              <div className={styles['cardMedia']}>
                <img
                  alt={constructionCase.title}
                  loading='lazy'
                  src={constructionCase.thumbnailFileUrl}
                />
              </div>
              <div className={styles['cardBody']}>
                <h2 className={styles['cardTitle']}>{constructionCase.title}</h2>
                <p className={styles['cardDescription']}>{constructionCase.summary}</p>
                <div className={styles['cardFooter']}>
                  <span className={styles['metaText']}>
                    {formatPublishedDateOnly(constructionCase.publishedAt)}
                  </span>
                  <Link
                    className={styles['cardLink']}
                    to={routePaths.constructionCaseDetail(constructionCase.id)}
                  >
                    상세보기
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default ConstructionCaseListPage;
