import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import { clearAdminAccessToken } from '@/features/board/auth';
import {
  createWebCatalog,
  fetchAdminWebCatalog,
  type WebCatalogMutationInput,
  updateWebCatalog,
  webCatalogQueryKeys,
} from '@/features/board/webCatalogApi';
import {
  getApiErrorMessage,
  isUnauthorizedError,
  toDatetimeLocalValue,
} from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const defaultForm: WebCatalogMutationInput = {
  title: '',
  description: '',
  category: '',
  pageCount: 1,
  displayOrder: 0,
  isPublished: true,
  publishedAt: '',
  file: null,
};

const AdminWebCatalogFormPage = () => {
  const navigate = useNavigate();
  const { webCatalogId } = useParams();
  const resolvedWebCatalogId = Number(webCatalogId);
  const isEditMode = !Number.isNaN(resolvedWebCatalogId);
  const [form, setForm] = useState<WebCatalogMutationInput>(defaultForm);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const detailQuery = useQuery({
    queryKey: webCatalogQueryKeys.adminWebCatalog(resolvedWebCatalogId),
    queryFn: () => fetchAdminWebCatalog(resolvedWebCatalogId),
    enabled: isEditMode,
  });

  const mutation = useMutation({
    mutationFn: (input: WebCatalogMutationInput) =>
      isEditMode ? updateWebCatalog(resolvedWebCatalogId, input) : createWebCatalog(input),
    onSuccess: () => {
      navigate(routePaths.adminWebCatalogs, { replace: true });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        clearAdminAccessToken();
        navigate(routePaths.adminLogin, { replace: true });
        return;
      }

      setErrorMessage(getApiErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!detailQuery.data) {
      return;
    }

    setForm({
      title: detailQuery.data.title,
      description: detailQuery.data.description,
      category: detailQuery.data.category,
      pageCount: detailQuery.data.pageCount,
      displayOrder: detailQuery.data.displayOrder,
      isPublished: detailQuery.data.isPublished,
      publishedAt: toDatetimeLocalValue(detailQuery.data.publishedAt),
      file: null,
    });
    setCurrentFileName(detailQuery.data.fileName);
  }, [detailQuery.data]);

  if (detailQuery.isError && isUnauthorizedError(detailQuery.error)) {
    clearAdminAccessToken();
    return <Navigate replace to={routePaths.adminLogin} />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    mutation.mutate(form);
  };

  return (
    <section className={styles['panel']}>
      <div className={styles['toolbar']}>
        <div>
          <h2 className={styles['sectionTitle']}>
            {isEditMode ? '웹카탈로그 수정' : '웹카탈로그 등록'}
          </h2>
          <p className={styles['sectionDescription']}>
            PDF 원본, 페이지 수, 진열 순서를 기준으로 웹카탈로그 전시 항목을 관리합니다.
          </p>
        </div>
        <Link className={styles['link']} to={routePaths.adminWebCatalogs}>
          목록으로 돌아가기
        </Link>
      </div>

      {detailQuery.isLoading ? (
        <p className={styles['helper']}>웹카탈로그를 불러오는 중입니다.</p>
      ) : null}

      <form className={styles['form']} onSubmit={handleSubmit}>
        <div className={styles['formGrid']}>
          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='title'>
              제목
            </label>
            <input
              className={styles['input']}
              id='title'
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
              value={form.title}
            />
          </div>

          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='category'>
              카테고리
            </label>
            <input
              className={styles['input']}
              id='category'
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
              required
              value={form.category}
            />
          </div>
        </div>

        <div className={styles['field']}>
          <label className={styles['label']} htmlFor='description'>
            설명
          </label>
          <textarea
            className={styles['textareaSm']}
            id='description'
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            required
            value={form.description}
          />
        </div>

        <div className={styles['formGrid']}>
          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='pageCount'>
              페이지 수
            </label>
            <input
              className={styles['input']}
              id='pageCount'
              min='1'
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  pageCount: Number(event.target.value) || 0,
                }))
              }
              required
              type='number'
              value={form.pageCount}
            />
          </div>

          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='displayOrder'>
              진열 순서
            </label>
            <input
              className={styles['input']}
              id='displayOrder'
              min='0'
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  displayOrder: Number(event.target.value) || 0,
                }))
              }
              required
              type='number'
              value={form.displayOrder}
            />
          </div>
        </div>

        <div className={styles['formGrid']}>
          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='publishedAt'>
              등록일
            </label>
            <input
              className={styles['input']}
              id='publishedAt'
              onChange={(event) =>
                setForm((current) => ({ ...current, publishedAt: event.target.value }))
              }
              required
              type='datetime-local'
              value={form.publishedAt}
            />
          </div>

          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='file'>
              PDF 파일
            </label>
            <input
              accept='application/pdf'
              className={styles['fileInput']}
              id='file'
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  file: event.target.files?.[0] ?? null,
                }))
              }
              required={!isEditMode}
              type='file'
            />
            <p className={styles['helper']}>
              {currentFileName
                ? `현재 파일: ${currentFileName} (새 PDF를 선택하지 않으면 유지됩니다.)`
                : '업로드할 PDF를 선택해 주세요.'}
            </p>
          </div>
        </div>

        <div className={styles['checkboxRow']}>
          <label className={styles['checkboxLabel']}>
            <input
              checked={form.isPublished}
              onChange={(event) =>
                setForm((current) => ({ ...current, isPublished: event.target.checked }))
              }
              type='checkbox'
            />
            공개
          </label>
        </div>

        <p className={styles['helper']}>
          현재 프론트 목업에서는 샘플 항목만 페이지 미리보기가 연결되어 있습니다. 실제 서버 연결 단계에서는
          PDF 업로드 후 썸네일과 페이지 이미지 자동 생성을 붙이면 됩니다.
        </p>

        {errorMessage ? <div className={styles['error']}>{errorMessage}</div> : null}

        <div className={styles['formActions']}>
          <Link className={styles['link']} to={routePaths.adminWebCatalogs}>
            취소
          </Link>
          <Button
            className={styles['adminPrimaryButton']}
            disabled={mutation.isPending}
            type='submit'
          >
            {mutation.isPending ? '저장 중...' : isEditMode ? '수정 저장' : '등록'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AdminWebCatalogFormPage;
