import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import {
  boardQueryKeys,
  createNotice,
  fetchAdminNotice,
  type NoticeMutationInput,
  updateNotice,
} from '@/features/board/api';
import { clearAdminAccessToken } from '@/features/board/auth';
import {
  getApiErrorMessage,
  isUnauthorizedError,
  toDatetimeLocalValue,
} from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const defaultForm: NoticeMutationInput = {
  title: '',
  summary: '',
  content: '',
  isPinned: false,
  isPublished: true,
  publishedAt: '',
};

const AdminNoticeFormPage = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const resolvedNoticeId = Number(noticeId);
  const isEditMode = !Number.isNaN(resolvedNoticeId);
  const [form, setForm] = useState<NoticeMutationInput>(defaultForm);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const detailQuery = useQuery({
    queryKey: boardQueryKeys.adminNotice(resolvedNoticeId),
    queryFn: () => fetchAdminNotice(resolvedNoticeId),
    enabled: isEditMode,
  });

  const mutation = useMutation({
    mutationFn: (input: NoticeMutationInput) =>
      isEditMode ? updateNotice(resolvedNoticeId, input) : createNotice(input),
    onSuccess: () => {
      navigate(routePaths.adminNotices, { replace: true });
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
    if (!detailQuery.data) return;

    setForm({
      title: detailQuery.data.title,
      summary: detailQuery.data.summary,
      content: detailQuery.data.content,
      isPinned: detailQuery.data.isPinned,
      isPublished: detailQuery.data.isPublished,
      publishedAt: toDatetimeLocalValue(detailQuery.data.publishedAt),
    });
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
            {isEditMode ? '공지사항 수정' : '공지사항 작성'}
          </h2>
          <p className={styles['sectionDescription']}>
            제목, 요약, 본문과 공개 상태를 함께 저장합니다.
          </p>
        </div>
        <Link className={styles['link']} to={routePaths.adminNotices}>
          목록으로 돌아가기
        </Link>
      </div>

      {detailQuery.isLoading ? <p className={styles['helper']}>공지사항을 불러오는 중입니다.</p> : null}

      <form className={styles['form']} onSubmit={handleSubmit}>
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
          <label className={styles['label']} htmlFor='summary'>
            요약
          </label>
          <input
            className={styles['input']}
            id='summary'
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            required
            value={form.summary}
          />
        </div>

        <div className={styles['field']}>
          <label className={styles['label']} htmlFor='content'>
            본문
          </label>
          <textarea
            className={styles['textarea']}
            id='content'
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            required
            value={form.content}
          />
        </div>

        <div className={styles['formGrid']}>
          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='publishedAt'>
              발행일
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
            <span className={styles['label']}>게시 상태</span>
            <div className={styles['checkboxRow']}>
              <label className={styles['checkboxLabel']}>
                <input
                  checked={form.isPinned}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, isPinned: event.target.checked }))
                  }
                  type='checkbox'
                />
                고정 공지
              </label>
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
          </div>
        </div>

        {errorMessage ? <div className={styles['error']}>{errorMessage}</div> : null}

        <div className={styles['formActions']}>
          <Link className={styles['link']} to={routePaths.adminNotices}>
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

export default AdminNoticeFormPage;
