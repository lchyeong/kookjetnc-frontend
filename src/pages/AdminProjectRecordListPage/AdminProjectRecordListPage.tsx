import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import {
  boardQueryKeys,
  deleteProjectRecord,
  fetchAdminProjectRecords,
} from '@/features/board/api';
import { clearAdminAccessToken } from '@/features/board/auth';
import {
  formatCount,
  formatPublishedDate,
  getApiErrorMessage,
  isUnauthorizedError,
} from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const AdminProjectRecordListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const projectRecordQuery = useQuery({
    queryKey: boardQueryKeys.adminProjectRecords,
    queryFn: fetchAdminProjectRecords,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProjectRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardQueryKeys.adminProjectRecords });
      await queryClient.invalidateQueries({ queryKey: boardQueryKeys.projectRecords });
    },
  });

  if (projectRecordQuery.isError && isUnauthorizedError(projectRecordQuery.error)) {
    clearAdminAccessToken();
    return <Navigate replace to={routePaths.adminLogin} />;
  }

  const handleDelete = (projectRecordId: number) => {
    const confirmed = window.confirm('이 공사실적을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(projectRecordId, {
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
          <h2 className={styles['sectionTitle']}>공사실적 관리</h2>
          <p className={styles['sectionDescription']}>
            일반 게시판 형식으로 제목, 요약, 본문, 공개 상태를 관리합니다.
          </p>
        </div>
        <Button
          className={styles['adminPrimaryButton']}
          onClick={() => navigate(routePaths.adminProjectRecordCreate)}
          type='button'
        >
          공사실적 등록
        </Button>
      </div>

      {projectRecordQuery.isLoading ? (
        <p className={styles['helper']}>공사실적을 불러오는 중입니다.</p>
      ) : null}
      {projectRecordQuery.isError ? (
        <div className={styles['error']}>{getApiErrorMessage(projectRecordQuery.error)}</div>
      ) : null}

      {projectRecordQuery.data ? (
        <div className={styles['tableWrap']}>
          <table className={styles['table']}>
            <thead>
              <tr>
                <th>제목</th>
                <th>조회수</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {projectRecordQuery.data.map((projectRecord) => (
                <tr key={projectRecord.id}>
                  <td>
                    <strong>{projectRecord.title}</strong>
                    <div className={styles['helper']}>{projectRecord.summary}</div>
                  </td>
                  <td>{formatCount(projectRecord.viewCount)}</td>
                  <td>
                    <span
                      className={`${styles['statusBadge']} ${
                        projectRecord.isPublished
                          ? styles['statusPublished']
                          : styles['statusDraft']
                      }`}
                    >
                      {projectRecord.isPublished ? '공개' : '비공개'}
                    </span>
                  </td>
                  <td>{formatPublishedDate(projectRecord.publishedAt)}</td>
                  <td>
                    <div className={styles['tableActions']}>
                      <Link
                        className={styles['link']}
                        to={routePaths.adminProjectRecordEdit(projectRecord.id)}
                      >
                        수정
                      </Link>
                      <Button
                        className={styles['adminDangerButton']}
                        onClick={() => handleDelete(projectRecord.id)}
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

export default AdminProjectRecordListPage;
