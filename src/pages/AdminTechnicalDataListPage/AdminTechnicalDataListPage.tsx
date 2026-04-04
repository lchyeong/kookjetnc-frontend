import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import {
  boardQueryKeys,
  deleteTechnicalData,
  fetchAdminTechnicalDataList,
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

const AdminTechnicalDataListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const technicalDataQuery = useQuery({
    queryKey: boardQueryKeys.adminTechnicalData,
    queryFn: fetchAdminTechnicalDataList,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTechnicalData,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardQueryKeys.adminTechnicalData });
      await queryClient.invalidateQueries({ queryKey: boardQueryKeys.technicalData });
    },
  });

  if (technicalDataQuery.isError && isUnauthorizedError(technicalDataQuery.error)) {
    clearAdminAccessToken();
    return <Navigate replace to={routePaths.adminLogin} />;
  }

  const handleDelete = (technicalDataId: number) => {
    const confirmed = window.confirm('이 기술자료를 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(technicalDataId, {
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
          <h2 className={styles['sectionTitle']}>기술자료 관리</h2>
          <p className={styles['sectionDescription']}>
            PDF 등 첨부 파일과 공개 상태를 함께 관리합니다.
          </p>
        </div>
        <Button
          className={styles['adminPrimaryButton']}
          onClick={() => navigate(routePaths.adminTechnicalDataCreate)}
          type='button'
        >
          기술자료 등록
        </Button>
      </div>

      {technicalDataQuery.isLoading ? (
        <p className={styles['helper']}>기술자료를 불러오는 중입니다.</p>
      ) : null}
      {technicalDataQuery.isError ? (
        <div className={styles['error']}>{getApiErrorMessage(technicalDataQuery.error)}</div>
      ) : null}

      {technicalDataQuery.data ? (
        <div className={styles['tableWrap']}>
          <table className={styles['table']}>
            <thead>
              <tr>
                <th>제목</th>
                <th>파일</th>
                <th>조회수</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {technicalDataQuery.data.map((technicalData) => (
                <tr key={technicalData.id}>
                  <td>
                    <strong>{technicalData.title}</strong>
                    <div className={styles['helper']}>
                      {technicalData.category} · {technicalData.description}
                    </div>
                  </td>
                  <td>{technicalData.fileName}</td>
                  <td>{formatCount(technicalData.viewCount)}</td>
                  <td>
                    <span
                      className={`${styles['statusBadge']} ${
                        technicalData.isPublished
                          ? styles['statusPublished']
                          : styles['statusDraft']
                      }`}
                    >
                      {technicalData.isPublished ? '공개' : '비공개'}
                    </span>
                  </td>
                  <td>{formatPublishedDate(technicalData.publishedAt)}</td>
                  <td>
                    <div className={styles['tableActions']}>
                      <Link
                        className={styles['link']}
                        to={routePaths.adminTechnicalDataEdit(technicalData.id)}
                      >
                        수정
                      </Link>
                      <Button
                        className={styles['adminDangerButton']}
                        onClick={() => handleDelete(technicalData.id)}
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

export default AdminTechnicalDataListPage;
