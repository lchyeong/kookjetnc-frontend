import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { boardQueryKeys, fetchNotice } from '@/features/board/api';
import { formatPublishedDate, getApiErrorMessage } from '@/features/board/utils';
import styles from '@/pages/PageContent.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const NoticeDetailPage = () => {
  const { noticeId } = useParams();
  const resolvedNoticeId = Number(noticeId);
  const isValidNoticeId = Boolean(noticeId) && !Number.isNaN(resolvedNoticeId);

  const noticeQuery = useQuery({
    enabled: isValidNoticeId,
    queryKey: boardQueryKeys.notice(resolvedNoticeId),
    queryFn: () => fetchNotice(resolvedNoticeId),
  });

  if (!isValidNoticeId) {
    return (
      <PlaceholderPage
        description='공지사항 식별자가 전달되지 않았습니다.'
        title='잘못된 요청입니다.'
      />
    );
  }

  if (noticeQuery.isLoading) {
    return (
      <PlaceholderPage
        description='공지사항 상세 정보를 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (noticeQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(noticeQuery.error)}
        secondary={<Link to={routePaths.notices}>공지사항 목록으로 돌아가기</Link>}
        title='공지사항을 불러오지 못했습니다.'
      />
    );
  }

  const notice = noticeQuery.data;

  if (!notice) {
    return (
      <PlaceholderPage
        description='공지사항 데이터를 찾지 못했습니다.'
        secondary={<Link to={routePaths.notices}>공지사항 목록으로 돌아가기</Link>}
        title='공지사항을 불러오지 못했습니다.'
      />
    );
  }

  return (
    <article className={styles['page']}>
      <section className={styles['hero']}>
        <div className={styles['actions']}>
          {notice.isPinned ? <span className={styles['pill']}>고정 공지</span> : null}
          <span className={styles['meta']}>{formatPublishedDate(notice.publishedAt)}</span>
        </div>
        <h1 className={styles['title']}>{notice.title}</h1>
        <p className={styles['description']}>{notice.summary}</p>
      </section>

      <section className={styles['prose']}>{notice.content}</section>

      <div className={styles['detailActions']}>
        <Link className={styles['link']} to={routePaths.notices}>
          공지사항 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
};

export default NoticeDetailPage;
