import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { boardQueryKeys, fetchResources } from '@/features/board/api';
import { formatFileSize, formatPublishedDate, getApiErrorMessage } from '@/features/board/utils';
import styles from '@/pages/PageContent.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const ResourceListPage = () => {
  const resourceQuery = useQuery({
    queryKey: boardQueryKeys.resources,
    queryFn: fetchResources,
  });

  if (resourceQuery.isLoading) {
    return (
      <PlaceholderPage
        description='자료실 목록을 불러오는 중입니다.'
        eyebrow='Resources'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (resourceQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(resourceQuery.error)}
        eyebrow='Resources'
        title='자료실을 불러오지 못했습니다.'
      />
    );
  }

  const resources = resourceQuery.data ?? [];

  return (
    <div className={styles['page']}>
      <section className={styles['hero']}>
        <p className={styles['eyebrow']}>Resource Library</p>
        <h1 className={styles['title']}>자료실</h1>
        <p className={styles['description']}>
          업로드된 파일 메타데이터와 다운로드 링크를 실제 API로 조회합니다.
        </p>
      </section>

      <section className={styles['list']}>
        {resources.length === 0 ? (
          <article className={styles['card']}>
            <p className={styles['description']}>등록된 자료가 없습니다.</p>
          </article>
        ) : null}

        {resources.map((resource) => (
          <article className={styles['card']} key={resource.id}>
            <div className={styles['splitActions']}>
              <div className={styles['actions']}>
                <span className={styles['pill']}>{resource.category}</span>
                <span className={styles['meta']}>{formatPublishedDate(resource.publishedAt)}</span>
              </div>
              <span className={styles['meta']}>
                {resource.fileName} · {formatFileSize(resource.fileSize)}
              </span>
            </div>
            <h2>{resource.title}</h2>
            <p className={styles['description']}>{resource.description}</p>
            <div className={styles['detailActions']}>
              <Link className={styles['link']} to={routePaths.resourceDetail(resource.id)}>
                상세 보기
              </Link>
              <a
                className={styles['link']}
                href={resource.fileUrl}
                rel='noreferrer'
                target='_blank'
              >
                자료 다운로드
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default ResourceListPage;
