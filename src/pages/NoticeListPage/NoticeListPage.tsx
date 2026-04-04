import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { boardQueryKeys, fetchNotices } from '@/features/board/api';
import { formatPublishedDate, getApiErrorMessage } from '@/features/board/utils';
import styles from '@/pages/PageContent.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const NoticeListPage = () => {
  const noticeQuery = useQuery({
    queryKey: boardQueryKeys.notices,
    queryFn: fetchNotices,
  });

  if (noticeQuery.isLoading) {
    return (
      <PlaceholderPage
        description='공지사항 목록을 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (noticeQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(noticeQuery.error)}
        title='공지사항을 불러오지 못했습니다.'
      />
    );
  }

  const notices = noticeQuery.data ?? [];

  return (
    <div className={styles['page']}>
      <section className={styles['hero']}>
        <h1 className={styles['title']}>공지사항</h1>
      </section>

      <section className={styles['list']}>
        {notices.length === 0 ? (
          <article className={styles['card']}>
            <p className={styles['description']}>등록된 공지사항이 없습니다.</p>
          </article>
        ) : null}

        {notices.map((notice) => (
          <article className={styles['card']} key={notice.id}>
            <h2>{notice.title}</h2>
            <p className={styles['description']}>{notice.summary}</p>
            <div className={styles['splitActions']}>
              <div className={styles['actions']}>
                {notice.isPinned ? <span className={styles['pill']}>고정 공지</span> : null}
                <span className={styles['meta']}>{formatPublishedDate(notice.publishedAt)}</span>
              </div>
              <Link className={styles['link']} to={routePaths.noticeDetail(notice.id)}>
                상세보기
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default NoticeListPage;
