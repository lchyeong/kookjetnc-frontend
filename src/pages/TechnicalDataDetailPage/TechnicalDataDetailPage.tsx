import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { boardQueryKeys, fetchTechnicalData } from '@/features/board/api';
import {
  formatCount,
  formatPublishedDate,
  getApiErrorMessage,
} from '@/features/board/utils';
import styles from '@/pages/PageContent.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const TechnicalDataDetailPage = () => {
  const { technicalDataId } = useParams();
  const resolvedTechnicalDataId = Number(technicalDataId);
  const isValidTechnicalDataId =
    Boolean(technicalDataId) && !Number.isNaN(resolvedTechnicalDataId);

  const technicalDataQuery = useQuery({
    enabled: isValidTechnicalDataId,
    queryKey: boardQueryKeys.technicalDatum(resolvedTechnicalDataId),
    queryFn: () => fetchTechnicalData(resolvedTechnicalDataId),
  });

  if (!isValidTechnicalDataId) {
    return (
      <PlaceholderPage
        description='기술자료 식별자가 전달되지 않았습니다.'
        title='잘못된 요청입니다.'
      />
    );
  }

  if (technicalDataQuery.isLoading) {
    return (
      <PlaceholderPage
        description='기술자료 상세 정보를 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (technicalDataQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(technicalDataQuery.error)}
        secondary={<Link to={routePaths.technicalData}>기술자료 목록으로 돌아가기</Link>}
        title='기술자료를 불러오지 못했습니다.'
      />
    );
  }

  const technicalData = technicalDataQuery.data;

  if (!technicalData) {
    return (
      <PlaceholderPage
        description='기술자료 데이터를 찾지 못했습니다.'
        secondary={<Link to={routePaths.technicalData}>기술자료 목록으로 돌아가기</Link>}
        title='기술자료를 불러오지 못했습니다.'
      />
    );
  }

  return (
    <article className={styles['page']}>
      <section className={styles['hero']}>
        <div className={styles['splitActions']}>
          <div className={styles['actions']}>
            <span className={styles['pill']}>{technicalData.category}</span>
            <span className={styles['meta']}>
              등록일 {formatPublishedDate(technicalData.publishedAt)}
            </span>
          </div>
          <span className={styles['meta']}>조회수 {formatCount(technicalData.viewCount)}</span>
        </div>
        <h1 className={styles['title']}>{technicalData.title}</h1>
        <p className={styles['description']}>{technicalData.description}</p>
        <p className={styles['meta']}>첨부파일 {technicalData.fileName}</p>
      </section>

      <section className={styles['prose']}>{technicalData.content}</section>

      <div className={styles['detailActions']}>
        <a className={styles['link']} href={technicalData.fileUrl} rel='noreferrer' target='_blank'>
          자료 다운로드
        </a>
        <Link className={styles['link']} to={routePaths.technicalData}>
          기술자료 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
};

export default TechnicalDataDetailPage;
