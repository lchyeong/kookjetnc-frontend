import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import {
  boardQueryKeys,
  fetchTechnicalDataList,
} from '@/features/board/api';
import {
  formatPublishedDate,
  getApiErrorMessage,
} from '@/features/board/utils';
import pageStyles from '@/pages/PageContent.module.scss';
import styles from '@/pages/TechnicalDataListPage/TechnicalDataListPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const ITEMS_PER_PAGE = 8;
const getFileTypeLabel = (fileName: string) => {
  const extension = fileName.split('.').pop()?.trim().toUpperCase();

  if (!extension) {
    return 'FILE';
  }

  return extension.length <= 4 ? extension : 'FILE';
};

const TechnicalDataListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const technicalDataQuery = useQuery({
    queryKey: boardQueryKeys.technicalData,
    queryFn: fetchTechnicalDataList,
  });

  const technicalDataList = technicalDataQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(technicalDataList.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedTechnicalDataList = technicalDataList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (technicalDataQuery.isLoading) {
    return (
      <PlaceholderPage
        description='기술자료 목록을 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (technicalDataQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(technicalDataQuery.error)}
        title='기술자료를 불러오지 못했습니다.'
      />
    );
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={pageStyles['page']}>
      <section className={pageStyles['hero']}>
        <h1 className={pageStyles['title']}>기술자료</h1>
      </section>

      <section className={styles['listShell']}>
        {technicalDataList.length === 0 ? (
          <div className={styles['emptyState']}>등록된 기술자료가 없습니다.</div>
        ) : (
          <>
            {pagedTechnicalDataList.map((technicalData) => (
              <article className={styles['row']} key={technicalData.id}>
                <div className={styles['main']}>
                  <div className={styles['titleRow']}>
                    <h2 className={styles['title']}>{technicalData.title}</h2>
                    <span className={styles['category']}>{technicalData.category}</span>
                  </div>
                  <p className={styles['description']}>{technicalData.description}</p>
                </div>

                <div className={styles['meta']}>
                  <p className={styles['metaLine']}>
                    <span className={styles['metaLabel']}>등록일</span>
                    {formatPublishedDate(technicalData.publishedAt)}
                  </p>
                </div>

                <div className={styles['actions']}>
                  <Link
                    className={styles['link']}
                    to={routePaths.technicalDataDetail(technicalData.id)}
                  >
                    상세보기
                  </Link>
                  <div className={styles['fileIcons']}>
                    <a
                      aria-label={`${technicalData.fileName} 다운로드`}
                      className={styles['fileIconLink']}
                      href={technicalData.fileUrl}
                      rel='noreferrer'
                      target='_blank'
                      title={technicalData.fileName}
                    >
                      {getFileTypeLabel(technicalData.fileName)}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </>
        )}
      </section>

      {technicalDataList.length > ITEMS_PER_PAGE ? (
        <nav aria-label='기술자료 페이지 이동' className={styles['pagination']}>
          <button
            className={styles['pageButton']}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            type='button'
          >
            이전
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              className={styles['pageButton']}
              data-active={pageNumber === currentPage}
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              type='button'
            >
              {pageNumber}
            </button>
          ))}
          <button
            className={styles['pageButton']}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            type='button'
          >
            다음
          </button>
        </nav>
      ) : null}
    </div>
  );
};

export default TechnicalDataListPage;
