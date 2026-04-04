import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { boardQueryKeys, fetchResource } from '@/features/board/api';
import { formatFileSize, formatPublishedDate, getApiErrorMessage } from '@/features/board/utils';
import styles from '@/pages/PageContent.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const ResourceDetailPage = () => {
  const { resourceId } = useParams();
  const resolvedResourceId = Number(resourceId);
  const isValidResourceId = Boolean(resourceId) && !Number.isNaN(resolvedResourceId);

  const resourceQuery = useQuery({
    enabled: isValidResourceId,
    queryKey: boardQueryKeys.resource(resolvedResourceId),
    queryFn: () => fetchResource(resolvedResourceId),
  });

  if (!isValidResourceId) {
    return (
      <PlaceholderPage
        description='자료 식별자가 전달되지 않았습니다.'
        title='잘못된 요청입니다.'
      />
    );
  }

  if (resourceQuery.isLoading) {
    return (
      <PlaceholderPage
        description='자료 상세 정보를 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (resourceQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(resourceQuery.error)}
        secondary={<Link to={routePaths.resources}>자료실 목록으로 돌아가기</Link>}
        title='자료를 불러오지 못했습니다.'
      />
    );
  }

  const resource = resourceQuery.data;

  if (!resource) {
    return (
      <PlaceholderPage
        description='자료 데이터를 찾지 못했습니다.'
        secondary={<Link to={routePaths.resources}>자료실 목록으로 돌아가기</Link>}
        title='자료를 불러오지 못했습니다.'
      />
    );
  }

  return (
    <article className={styles['page']}>
      <section className={styles['hero']}>
        <div className={styles['splitActions']}>
          <div className={styles['actions']}>
            <span className={styles['pill']}>{resource.category}</span>
            <span className={styles['meta']}>{formatPublishedDate(resource.publishedAt)}</span>
          </div>
          <span className={styles['meta']}>
            {resource.fileName} · {formatFileSize(resource.fileSize)}
          </span>
        </div>
        <h1 className={styles['title']}>{resource.title}</h1>
        <p className={styles['description']}>{resource.description}</p>
      </section>

      <section className={styles['prose']}>{resource.content}</section>

      <div className={styles['detailActions']}>
        <a className={styles['link']} href={resource.fileUrl} rel='noreferrer' target='_blank'>
          자료 다운로드
        </a>
        <Link className={styles['link']} to={routePaths.resources}>
          자료실 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
};

export default ResourceDetailPage;
