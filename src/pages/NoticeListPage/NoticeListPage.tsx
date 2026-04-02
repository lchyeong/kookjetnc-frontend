import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { boardQueryKeys, fetchNotices } from '@/features/board/api';
import { formatPublishedDate, getApiErrorMessage } from '@/features/board/utils';
import { routePaths } from '@/routes/routeRegistry';

import styles from '@/pages/PageContent.module.scss';

const NoticeListPage = () => {
  const noticeQuery = useQuery({
    queryKey: boardQueryKeys.notices,
    queryFn: fetchNotices,
  });

  if (noticeQuery.isLoading) {
    return (
      <PlaceholderPage
        description='공지사항 목록을 불러오는 중입니다.'
        eyebrow='Notice'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (noticeQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(noticeQuery.error)}
        eyebrow='Notice'
        title='공지사항을 불러오지 못했습니다.'
      />
    );
  }

  return (
    <div className={styles['page']}>
      <section className={styles['hero']}>
        <p className={styles['eyebrow']}>Notice Board</p>
        <h1 className={styles['title']}>공지사항</h1>
        <p className={styles['description']}>
          운영 공지와 시스템 변경 사항을 실제 백엔드 API로 조회합니다.
        </p>
      </section>

      <section className={styles['list']}>
        {noticeQuery.data.length === 0 ? (
          <article className={styles['card']}>
            <p className={styles['description']}>등록된 공지사항이 없습니다.</p>
          </article>
        ) : null}

        {noticeQuery.data.map((notice) => (
          <article className={styles['card']} key={notice.id}>
            <div className={styles['actions']}>
              {notice.isPinned ? <span className={styles['pill']}>고정 공지</span> : null}
              <span className={styles['meta']}>{formatPublishedDate(notice.publishedAt)}</span>
            </div>
            <h2>{notice.title}</h2>
            <p className={styles['description']}>{notice.summary}</p>
            <Link className={styles['link']} to={routePaths.noticeDetail(notice.id)}>
              상세 보기
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};

export default NoticeListPage;
