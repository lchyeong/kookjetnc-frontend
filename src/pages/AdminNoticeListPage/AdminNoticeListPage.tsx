import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import {
  boardQueryKeys,
  deleteNotice,
  fetchAdminNotices,
} from '@/features/board/api';
import { clearAdminAccessToken } from '@/features/board/auth';
import {
  formatPublishedDate,
  getApiErrorMessage,
  isUnauthorizedError,
} from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const AdminNoticeListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const noticeQuery = useQuery({
    queryKey: boardQueryKeys.adminNotices,
    queryFn: fetchAdminNotices,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardQueryKeys.adminNotices });
    },
  });

  if (noticeQuery.isError && isUnauthorizedError(noticeQuery.error)) {
    clearAdminAccessToken();
    return <Navigate replace to={routePaths.adminLogin} />;
  }

  const handleDelete = (noticeId: number) => {
    const confirmed = window.confirm('이 공지사항을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteMutation.mutate(noticeId, {
      onError: (error) => {
        if (isUnauthorizedError(error)) {
          clearAdminAccessToken();
          navigate(routePaths.adminLogin, { replace: true });
        }
      },
    });
  };

  return (
    <section className={styles['panel']}>
      <div className={styles['toolbar']}>
        <div>
          <h2 className={styles['sectionTitle']}>공지사항 관리</h2>
          <p className={styles['sectionDescription']}>
            고정 여부와 공개 여부를 함께 관리합니다.
          </p>
        </div>
        <Button
          className={styles['adminPrimaryButton']}
          onClick={() => navigate(routePaths.adminNoticeCreate)}
          type='button'
        >
          공지사항 작성
        </Button>
      </div>

      {noticeQuery.isLoading ? <p className={styles['helper']}>공지사항을 불러오는 중입니다.</p> : null}
      {noticeQuery.isError ? (
        <div className={styles['error']}>{getApiErrorMessage(noticeQuery.error)}</div>
      ) : null}

      {noticeQuery.data ? (
        <div className={styles['tableWrap']}>
          <table className={styles['table']}>
            <thead>
              <tr>
                <th>제목</th>
                <th>상태</th>
                <th>발행일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {noticeQuery.data.map((notice) => (
                <tr key={notice.id}>
                  <td>
                    <strong>{notice.title}</strong>
                    <div className={styles['helper']}>{notice.summary}</div>
                  </td>
                  <td>
                    <span
                      className={`${styles['statusBadge']} ${
                        notice.isPublished ? styles['statusPublished'] : styles['statusDraft']
                      }`}
                    >
                      {notice.isPublished ? '공개' : '비공개'}
                    </span>
                  </td>
                  <td>{formatPublishedDate(notice.publishedAt)}</td>
                  <td>
                    <div className={styles['tableActions']}>
                      <Link className={styles['link']} to={routePaths.adminNoticeEdit(notice.id)}>
                        수정
                      </Link>
                      <Button
                        className={styles['adminDangerButton']}
                        onClick={() => handleDelete(notice.id)}
                        size='sm'
                        type='button'
                        variant='danger'
                      >
                        삭제
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
};

export default AdminNoticeListPage;
