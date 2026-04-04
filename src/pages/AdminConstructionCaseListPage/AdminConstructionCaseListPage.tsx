import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import {
  boardQueryKeys,
  deleteConstructionCase,
  fetchAdminConstructionCases,
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

const AdminConstructionCaseListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const constructionCaseQuery = useQuery({
    queryKey: boardQueryKeys.adminConstructionCases,
    queryFn: fetchAdminConstructionCases,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConstructionCase,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: boardQueryKeys.adminConstructionCases });
    },
  });

  if (constructionCaseQuery.isError && isUnauthorizedError(constructionCaseQuery.error)) {
    clearAdminAccessToken();
    return <Navigate replace to={routePaths.adminLogin} />;
  }

  const handleDelete = (constructionCaseId: number) => {
    const confirmed = window.confirm('이 시공사례를 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(constructionCaseId, {
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
          <h2 className={styles['sectionTitle']}>시공사례 관리</h2>
          <p className={styles['sectionDescription']}>
            대표 이미지, 상세 갤러리, 본문과 공개 상태를 함께 관리합니다.
          </p>
        </div>
        <Button
          className={styles['adminPrimaryButton']}
          onClick={() => navigate(routePaths.adminConstructionCaseCreate)}
          type='button'
        >
          시공사례 등록
        </Button>
      </div>

      {constructionCaseQuery.isLoading ? (
        <p className={styles['helper']}>시공사례를 불러오는 중입니다.</p>
      ) : null}
      {constructionCaseQuery.isError ? (
        <div className={styles['error']}>{getApiErrorMessage(constructionCaseQuery.error)}</div>
      ) : null}

      {constructionCaseQuery.data ? (
        <div className={styles['tableWrap']}>
          <table className={styles['table']}>
            <thead>
              <tr>
                <th>사례</th>
                <th>조회수</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {constructionCaseQuery.data.map((constructionCase) => (
                <tr key={constructionCase.id}>
                  <td>
                    <div className={styles['mediaCell']}>
                      <img
                        alt={constructionCase.title}
                        className={styles['thumbnailPreview']}
                        src={constructionCase.thumbnailFileUrl}
                      />
                      <div>
                        <strong>{constructionCase.title}</strong>
                        <div className={styles['helper']}>{constructionCase.summary}</div>
                      </div>
                    </div>
                  </td>
                  <td>{formatCount(constructionCase.viewCount)}</td>
                  <td>
                    <span
                      className={`${styles['statusBadge']} ${
                        constructionCase.isPublished
                          ? styles['statusPublished']
                          : styles['statusDraft']
                      }`}
                    >
                      {constructionCase.isPublished ? '공개' : '비공개'}
                    </span>
                  </td>
                  <td>{formatPublishedDate(constructionCase.publishedAt)}</td>
                  <td>
                    <div className={styles['tableActions']}>
                      <Link
                        className={styles['link']}
                        to={routePaths.adminConstructionCaseEdit(constructionCase.id)}
                      >
                        수정
                      </Link>
                      <Button
                        className={styles['adminDangerButton']}
                        onClick={() => handleDelete(constructionCase.id)}
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

export default AdminConstructionCaseListPage;
