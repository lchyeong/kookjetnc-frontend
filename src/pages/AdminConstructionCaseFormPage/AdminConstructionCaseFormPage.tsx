import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/ui/Button/Button';
import {
  boardQueryKeys,
  createConstructionCase,
  fetchAdminConstructionCase,
  type ConstructionCaseGalleryImage,
  type ConstructionCaseMutationInput,
  updateConstructionCase,
} from '@/features/board/api';
import { clearAdminAccessToken } from '@/features/board/auth';
import RichTextEditor from '@/features/board/RichTextEditor';
import {
  getApiErrorMessage,
  isUnauthorizedError,
  toDatetimeLocalValue,
} from '@/features/board/utils';
import styles from '@/pages/AdminBoardPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const defaultForm: ConstructionCaseMutationInput = {
  title: '',
  summary: '',
  content: '',
  isPublished: true,
  publishedAt: '',
  thumbnail: null,
  galleryImages: [],
  removeGallery: false,
};

const AdminConstructionCaseFormPage = () => {
  const navigate = useNavigate();
  const { constructionCaseId } = useParams();
  const resolvedConstructionCaseId = Number(constructionCaseId);
  const isEditMode = !Number.isNaN(resolvedConstructionCaseId);
  const [form, setForm] = useState<ConstructionCaseMutationInput>(defaultForm);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(null);
  const [currentThumbnailName, setCurrentThumbnailName] = useState<string | null>(null);
  const [currentGalleryImages, setCurrentGalleryImages] = useState<ConstructionCaseGalleryImage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const detailQuery = useQuery({
    queryKey: boardQueryKeys.adminConstructionCase(resolvedConstructionCaseId),
    queryFn: () => fetchAdminConstructionCase(resolvedConstructionCaseId),
    enabled: isEditMode,
  });

  const mutation = useMutation({
    mutationFn: (input: ConstructionCaseMutationInput) =>
      isEditMode
        ? updateConstructionCase(resolvedConstructionCaseId, input)
        : createConstructionCase(input),
    onSuccess: () => {
      navigate(routePaths.adminConstructionCases, { replace: true });
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
      summary: detailQuery.data.summary,
      content: detailQuery.data.content,
      isPublished: detailQuery.data.isPublished,
      publishedAt: toDatetimeLocalValue(detailQuery.data.publishedAt),
      thumbnail: null,
      galleryImages: [],
      removeGallery: false,
    });
    setCurrentThumbnailUrl(detailQuery.data.thumbnailFileUrl);
    setCurrentThumbnailName(detailQuery.data.thumbnailFileName);
    setCurrentGalleryImages(detailQuery.data.galleryImages);
  }, [detailQuery.data]);

  if (detailQuery.isError && isUnauthorizedError(detailQuery.error)) {
    clearAdminAccessToken();
    return <Navigate replace to={routePaths.adminLogin} />;
  }

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      thumbnail: event.target.files?.[0] ?? null,
    }));
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      galleryImages: Array.from(event.target.files ?? []),
      removeGallery: false,
    }));
  };

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
            {isEditMode ? '시공사례 수정' : '시공사례 등록'}
          </h2>
          <p className={styles['sectionDescription']}>
            대표 이미지, 상세 갤러리, 본문과 공개 상태를 함께 저장합니다.
          </p>
        </div>
        <Link className={styles['link']} to={routePaths.adminConstructionCases}>
          목록으로 돌아가기
        </Link>
      </div>

      {detailQuery.isLoading ? (
        <p className={styles['helper']}>시공사례를 불러오는 중입니다.</p>
      ) : null}

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
          <textarea
            className={styles['textareaSm']}
            id='summary'
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            required
            value={form.summary}
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
            <span className={styles['label']}>게시 상태</span>
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
              <label className={styles['checkboxLabel']}>
                <input
                  checked={form.removeGallery}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      removeGallery: event.target.checked,
                      galleryImages: event.target.checked ? [] : current.galleryImages,
                    }))
                  }
                  disabled={currentGalleryImages.length === 0 && form.galleryImages.length === 0}
                  type='checkbox'
                />
                기존 상세 이미지 비우기
              </label>
            </div>
          </div>
        </div>

        <div className={styles['formGrid']}>
          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='thumbnail'>
              대표 썸네일
            </label>
            <input
              accept='image/*'
              className={styles['fileInput']}
              id='thumbnail'
              onChange={handleThumbnailChange}
              required={!isEditMode}
              type='file'
            />
            <p className={styles['helper']}>
              {form.thumbnail
                ? `새 대표 이미지: ${form.thumbnail.name}`
                : currentThumbnailName
                  ? `현재 대표 이미지: ${currentThumbnailName}`
                  : '업로드할 대표 이미지를 선택해 주세요.'}
            </p>
            {currentThumbnailUrl ? (
              <img
                alt='현재 대표 이미지'
                className={styles['formImagePreview']}
                src={currentThumbnailUrl}
              />
            ) : null}
          </div>

          <div className={styles['field']}>
            <label className={styles['label']} htmlFor='galleryImages'>
              상세 갤러리
            </label>
            <input
              accept='image/*'
              className={styles['fileInput']}
              id='galleryImages'
              multiple
              onChange={handleGalleryChange}
              type='file'
            />
            <p className={styles['helper']}>
              새 이미지를 올리면 기존 상세 이미지 전체가 교체됩니다.
            </p>

            {form.galleryImages.length > 0 ? (
              <ul className={styles['fileNameList']}>
                {form.galleryImages.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            ) : null}

            {currentGalleryImages.length > 0 && !form.removeGallery ? (
              <div className={styles['galleryPreviewGrid']}>
                {currentGalleryImages.map((image) => (
                  <img
                    alt='현재 상세 이미지'
                    className={styles['galleryPreviewImage']}
                    key={image.id}
                    src={image.fileUrl}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles['field']}>
          <label className={styles['label']}>본문</label>
          <RichTextEditor
            onChange={(content) => setForm((current) => ({ ...current, content }))}
            placeholder='시공 범위, 적용 설비, 현장 특징 등을 정리해 주세요.'
            value={form.content}
          />
        </div>

        {errorMessage ? <div className={styles['error']}>{errorMessage}</div> : null}

        <div className={styles['formActions']}>
          <Link className={styles['link']} to={routePaths.adminConstructionCases}>
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

export default AdminConstructionCaseFormPage;
