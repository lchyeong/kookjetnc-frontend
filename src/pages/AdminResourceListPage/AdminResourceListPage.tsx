import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import {
  boardQueryKeys,
  deleteResource,
  fetchAdminResources,
} from '@/features/board/api';
import { clearAdminAccessToken } from '@/features/board/auth';
import {
  formatPublishedDate,
  getApiErrorMessage,
  isUnauthorizedError,
} from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const AdminResourceListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resourceQuery = useQuery({
    queryKey: boardQueryKeys.adminResources,
    queryFn: fetchAdminResources,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardQueryKeys.adminResources });
    },
  });

  if (resourceQuery.isError && isUnauthorizedError(resourceQuery.error)) {
    clearAdminAccessToken();
    return <Navigate replace to={routePaths.adminLogin} />;
  }

  const handleDelete = (resourceId: number) => {
    const confirmed = window.confirm('이 자료를 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteMutation.mutate(resourceId, {
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
          <h2 className={styles['sectionTitle']}>자료실 관리</h2>
          <p className={styles['sectionDescription']}>
            파일 업로드와 공개 상태를 함께 관리합니다.
          </p>
        </div>
        <Button
          className={styles['adminPrimaryButton']}
          onClick={() => navigate(routePaths.adminResourceCreate)}
          type='button'
        >
          자료 등록
        </Button>
      </div>

      {resourceQuery.isLoading ? <p className={styles['helper']}>자료를 불러오는 중입니다.</p> : null}
      {resourceQuery.isError ? (
        <div className={styles['error']}>{getApiErrorMessage(resourceQuery.error)}</div>
      ) : null}

      {resourceQuery.data ? (
        <div className={styles['tableWrap']}>
          <table className={styles['table']}>
            <thead>
              <tr>
                <th>제목</th>
                <th>파일</th>
                <th>상태</th>
                <th>발행일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {resourceQuery.data.map((resource) => (
                <tr key={resource.id}>
                  <td>
                    <strong>{resource.title}</strong>
                    <div className={styles['helper']}>
                      {resource.category} · {resource.description}
                    </div>
                  </td>
                  <td>{resource.fileName}</td>
                  <td>
                    <span
                      className={`${styles['statusBadge']} ${
                        resource.isPublished ? styles['statusPublished'] : styles['statusDraft']
                      }`}
                    >
                      {resource.isPublished ? '공개' : '비공개'}
                    </span>
                  </td>
                  <td>{formatPublishedDate(resource.publishedAt)}</td>
                  <td>
                    <div className={styles['tableActions']}>
                      <Link className={styles['link']} to={routePaths.adminResourceEdit(resource.id)}>
                        수정
                      </Link>
                      <Button
                        className={styles['adminDangerButton']}
                        onClick={() => handleDelete(resource.id)}
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

export default AdminResourceListPage;
