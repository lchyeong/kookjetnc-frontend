import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { boardQueryKeys, fetchProjectRecord } from '@/features/board/api';
import {
  formatCount,
  formatPublishedDate,
  getApiErrorMessage,
} from '@/features/board/utils';
import styles from '@/pages/PageContent.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const ProjectRecordDetailPage = () => {
  const { projectRecordId } = useParams();
  const resolvedProjectRecordId = Number(projectRecordId);
  const isValidProjectRecordId =
    Boolean(projectRecordId) && !Number.isNaN(resolvedProjectRecordId);

  const projectRecordQuery = useQuery({
    enabled: isValidProjectRecordId,
    queryKey: boardQueryKeys.projectRecord(resolvedProjectRecordId),
    queryFn: () => fetchProjectRecord(resolvedProjectRecordId),
  });

  if (!isValidProjectRecordId) {
    return (
      <PlaceholderPage
        description='공사실적 식별자가 전달되지 않았습니다.'
        title='잘못된 요청입니다.'
      />
    );
  }

  if (projectRecordQuery.isLoading) {
    return (
      <PlaceholderPage
        description='공사실적 상세 정보를 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (projectRecordQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(projectRecordQuery.error)}
        secondary={<Link to={routePaths.projectRecords}>공사실적 목록으로 돌아가기</Link>}
        title='공사실적을 불러오지 못했습니다.'
      />
    );
  }

  const projectRecord = projectRecordQuery.data;

  if (!projectRecord) {
    return (
      <PlaceholderPage
        description='공사실적 데이터를 찾지 못했습니다.'
        secondary={<Link to={routePaths.projectRecords}>공사실적 목록으로 돌아가기</Link>}
        title='공사실적을 불러오지 못했습니다.'
      />
    );
  }

  return (
    <article className={styles['page']}>
      <section className={styles['hero']}>
        <div className={styles['splitActions']}>
          <div className={styles['actions']}>
            <span className={styles['pill']}>공사실적</span>
            <span className={styles['meta']}>
              등록일 {formatPublishedDate(projectRecord.publishedAt)}
            </span>
          </div>
          <span className={styles['meta']}>
            조회수 {formatCount(projectRecord.viewCount)}
          </span>
        </div>
        <h1 className={styles['title']}>{projectRecord.title}</h1>
        <p className={styles['description']}>{projectRecord.summary}</p>
      </section>

      <section className={styles['prose']}>{projectRecord.content}</section>

      <div className={styles['detailActions']}>
        <Link className={styles['link']} to={routePaths.projectRecords}>
          공사실적 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
};

export default ProjectRecordDetailPage;
