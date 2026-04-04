import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import {
  boardQueryKeys,
  createTechnicalData,
  fetchAdminTechnicalData,
  type TechnicalDataMutationInput,
  updateTechnicalData,
} from '@/features/board/api';
import { clearAdminAccessToken } from '@/features/board/auth';
import {
  getApiErrorMessage,
  isUnauthorizedError,
  toDatetimeLocalValue,
} from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const defaultForm: TechnicalDataMutationInput = {
  title: '',
  description: '',
  content: '',
  category: '',
  isPublished: true,
  publishedAt: '',
  file: null,
};

const AdminTechnicalDataFormPage = () => {
  const navigate = useNavigate();
  const { technicalDataId } = useParams();
  const resolvedTechnicalDataId = Number(technicalDataId);
  const isEditMode = !Number.isNaN(resolvedTechnicalDataId);
  const [form, setForm] = useState<TechnicalDataMutationInput>(defaultForm);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const detailQuery = useQuery({
    queryKey: boardQueryKeys.adminTechnicalDatum(resolvedTechnicalDataId),
    queryFn: () => fetchAdminTechnicalData(resolvedTechnicalDataId),
    enabled: isEditMode,
  });

  const mutation = useMutation({
    mutationFn: (input: TechnicalDataMutationInput) =>
      isEditMode
        ? updateTechnicalData(resolvedTechnicalDataId, input)
        : createTechnicalData(input),
    onSuccess: () => {
      navigate(routePaths.adminTechnicalData, { replace: true });
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
      content: detailQuery.data.content,
      category: detailQuery.data.category,
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
            {isEditMode ? '기술자료 수정' : '기술자료 등록'}
          </h2>
          <p className={styles['sectionDescription']}>
            PDF 등 첨부 파일과 게시 정보를 함께 저장합니다.
          </p>
        </div>
        <Link className={styles['link']} to={routePaths.adminTechnicalData}>
          목록으로 돌아가기
        </Link>
      </div>

      {detailQuery.isLoading ? (
        <p className={styles['helper']}>기술자료를 불러오는 중입니다.</p>
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
          <input
            className={styles['input']}
            id='description'
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            required
            value={form.description}
          />
        </div>

        <div className={styles['field']}>
          <label className={styles['label']} htmlFor='content'>
            본문
          </label>
          <textarea
            className={styles['textarea']}
            id='content'
            onChange={(event) =>
              setForm((current) => ({ ...current, content: event.target.value }))
            }
            required
            value={form.content}
          />
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
              첨부 파일
            </label>
            <input
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
                ? `현재 파일: ${currentFileName} (새 파일을 선택하지 않으면 유지됩니다.)`
                : '업로드할 파일을 선택해 주세요.'}
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

        {errorMessage ? <div className={styles['error']}>{errorMessage}</div> : null}

        <div className={styles['formActions']}>
          <Link className={styles['link']} to={routePaths.adminTechnicalData}>
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

export default AdminTechnicalDataFormPage;
