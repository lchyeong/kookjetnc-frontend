import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { clearAdminAccessToken } from '@/features/board/auth';
import {
  deleteWebCatalog,
  fetchAdminWebCatalogs,
  webCatalogQueryKeys,
} from '@/features/board/webCatalogApi';
import {
  formatPublishedDate,
  getApiErrorMessage,
  isUnauthorizedError,
} from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const AdminWebCatalogListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const webCatalogQuery = useQuery({
    queryKey: webCatalogQueryKeys.adminWebCatalogs,
    queryFn: fetchAdminWebCatalogs,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWebCatalog,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: webCatalogQueryKeys.adminWebCatalogs });
      await queryClient.invalidateQueries({ queryKey: webCatalogQueryKeys.webCatalogs });
    },
  });

  if (webCatalogQuery.isError && isUnauthorizedError(webCatalogQuery.error)) {
    clearAdminAccessToken();
    return <Navigate replace to={routePaths.adminLogin} />;
  }

  const handleDelete = (webCatalogId: number) => {
    const confirmed = window.confirm('이 웹카탈로그를 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(webCatalogId, {
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
          <h2 className={styles['sectionTitle']}>웹카탈로그 관리</h2>
          <p className={styles['sectionDescription']}>
            PDF 중심으로 업로드하고, 표지와 페이지 미리보기는 이후 서버 처리 기준으로 확장합니다.
          </p>
        </div>
        <Button
          className={styles['adminPrimaryButton']}
          onClick={() => navigate(routePaths.adminWebCatalogCreate)}
          type='button'
        >
          웹카탈로그 등록
        </Button>
      </div>

      {webCatalogQuery.isLoading ? (
        <p className={styles['helper']}>웹카탈로그를 불러오는 중입니다.</p>
      ) : null}
      {webCatalogQuery.isError ? (
        <div className={styles['error']}>{getApiErrorMessage(webCatalogQuery.error)}</div>
      ) : null}

      {webCatalogQuery.data ? (
        <div className={styles['tableWrap']}>
          <table className={styles['table']}>
            <thead>
              <tr>
                <th>카탈로그</th>
                <th>페이지 수</th>
                <th>정렬</th>
                <th>상태</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {webCatalogQuery.data.map((webCatalog) => (
                <tr key={webCatalog.id}>
                  <td>
                    <div className={styles['mediaCell']}>
                      {webCatalog.coverImageUrl ? (
                        <img
                          alt={webCatalog.title}
                          className={styles['thumbnailPreview']}
                          src={webCatalog.coverImageUrl}
                        />
                      ) : null}
                      <div>
                        <strong>{webCatalog.title}</strong>
                        <div className={styles['helper']}>
                          {webCatalog.category} · {webCatalog.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{webCatalog.pageCount}</td>
                  <td>{webCatalog.displayOrder}</td>
                  <td>
                    <span
                      className={`${styles['statusBadge']} ${
                        webCatalog.isPublished ? styles['statusPublished'] : styles['statusDraft']
                      }`}
                    >
                      {webCatalog.isPublished ? '공개' : '비공개'}
                    </span>
                  </td>
                  <td>{formatPublishedDate(webCatalog.publishedAt)}</td>
                  <td>
                    <div className={styles['tableActions']}>
                      <Link className={styles['link']} to={routePaths.adminWebCatalogEdit(webCatalog.id)}>
                        수정
                      </Link>
                      <Button
                        className={styles['adminDangerButton']}
                        onClick={() => handleDelete(webCatalog.id)}
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

export default AdminWebCatalogListPage;
