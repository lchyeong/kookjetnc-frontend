import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import {
  boardQueryKeys,
  fetchConstructionCase,
} from '@/features/board/api';
import {
  formatCount,
  formatPublishedDateOnly,
  getApiErrorMessage,
} from '@/features/board/utils';
import styles from '@/pages/ConstructionCasePage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const ConstructionCaseDetailPage = () => {
  const { constructionCaseId } = useParams();
  const resolvedConstructionCaseId = Number(constructionCaseId);
  const isValidConstructionCaseId =
    Boolean(constructionCaseId) && !Number.isNaN(resolvedConstructionCaseId);

  const constructionCaseQuery = useQuery({
    enabled: isValidConstructionCaseId,
    queryKey: boardQueryKeys.constructionCase(resolvedConstructionCaseId),
    queryFn: () => fetchConstructionCase(resolvedConstructionCaseId),
  });

  if (!isValidConstructionCaseId) {
    return (
      <PlaceholderPage
        description='시공사례 식별자가 전달되지 않았습니다.'
        title='잘못된 요청입니다.'
      />
    );
  }

  if (constructionCaseQuery.isLoading) {
    return (
      <PlaceholderPage
        description='시공사례 상세 정보를 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (constructionCaseQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(constructionCaseQuery.error)}
        secondary={<Link to={routePaths.constructionCases}>시공사례 목록으로 돌아가기</Link>}
        title='시공사례를 불러오지 못했습니다.'
      />
    );
  }

  const constructionCase = constructionCaseQuery.data;

  if (!constructionCase) {
    return (
      <PlaceholderPage
        description='시공사례 데이터를 찾지 못했습니다.'
        secondary={<Link to={routePaths.constructionCases}>시공사례 목록으로 돌아가기</Link>}
        title='시공사례를 불러오지 못했습니다.'
      />
    );
  }

  return (
    <article className={styles['page']}>
      <section className={styles['hero']}>
        <h1 className={styles['title']}>{constructionCase.title}</h1>
        <p className={styles['description']}>{constructionCase.summary}</p>
        <div className={styles['metaRow']}>
          <span className={styles['metaText']}>
            등록일 {formatPublishedDateOnly(constructionCase.publishedAt)}
          </span>
          <span className={styles['metaText']}>
            조회수 {formatCount(constructionCase.viewCount)}
          </span>
        </div>
      </section>

      <div className={styles['heroMedia']}>
        <img alt={constructionCase.title} src={constructionCase.thumbnailFileUrl} />
      </div>

      {constructionCase.galleryImages.length > 0 ? (
        <section className={styles['detailSection']}>
          <h2 className={styles['sectionTitle']}>세부 이미지</h2>
          <div className={styles['galleryGrid']}>
            {constructionCase.galleryImages.map((image) => (
              <figure className={styles['galleryCard']} key={image.id}>
                <img alt={`${constructionCase.title} 상세 이미지`} src={image.fileUrl} />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles['detailSection']}>
        <h2 className={styles['sectionTitle']}>상세 내용</h2>
        <div
          className={styles['prose']}
          dangerouslySetInnerHTML={{ __html: constructionCase.content }}
        />
      </section>

      <div className={styles['actions']}>
        <Link className={styles['backLink']} to={routePaths.constructionCases}>
          시공사례 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
};

export default ConstructionCaseDetailPage;
