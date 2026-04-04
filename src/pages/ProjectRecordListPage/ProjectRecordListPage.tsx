import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import { boardQueryKeys, fetchProjectRecords } from '@/features/board/api';
import {
  formatPublishedDate,
  getApiErrorMessage,
} from '@/features/board/utils';
import pageStyles from '@/pages/PageContent.module.scss';
import styles from '@/pages/ProjectRecordListPage/ProjectRecordListPage.module.scss';
import { routePaths } from '@/routes/routeRegistry';

const ITEMS_PER_PAGE = 10;

const ProjectRecordListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectRecordQuery = useQuery({
    queryKey: boardQueryKeys.projectRecords,
    queryFn: fetchProjectRecords,
  });

  const projectRecords = projectRecordQuery.data ?? [];
  const totalPages = Math.max(1, Math.ceil(projectRecords.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedProjectRecords = projectRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (projectRecordQuery.isLoading) {
    return (
      <PlaceholderPage
        description='공사실적 목록을 불러오는 중입니다.'
        title='잠시만 기다려 주세요.'
      />
    );
  }

  if (projectRecordQuery.isError) {
    return (
      <PlaceholderPage
        description={getApiErrorMessage(projectRecordQuery.error)}
        title='공사실적을 불러오지 못했습니다.'
      />
    );
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={pageStyles['page']}>
      <section className={pageStyles['hero']}>
        <h1 className={pageStyles['title']}>공사실적</h1>
      </section>

      <section className={styles['listShell']}>
        {projectRecords.length === 0 ? (
          <div className={styles['emptyState']}>등록된 공사실적이 없습니다.</div>
        ) : (
          <>
            {pagedProjectRecords.map((projectRecord) => (
              <article className={styles['row']} key={projectRecord.id}>
                <div className={styles['main']}>
                  <h2 className={styles['title']}>{projectRecord.title}</h2>
                  <p className={styles['summary']}>{projectRecord.summary}</p>
                </div>
                <span className={styles['date']}>
                  {formatPublishedDate(projectRecord.publishedAt)}
                </span>
                <Link className={styles['link']} to={routePaths.projectRecordDetail(projectRecord.id)}>
                  상세보기
                </Link>
              </article>
            ))}
          </>
        )}
      </section>

      {projectRecords.length > ITEMS_PER_PAGE ? (
        <nav aria-label='공사실적 페이지 이동' className={styles['pagination']}>
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

export default ProjectRecordListPage;
