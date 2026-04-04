import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/api/http', () => ({
  http: {
    delete: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

import { http } from '@/api/http';
import { fetchAdminNotice, fetchNotices } from '@/features/board/api';

describe('board api fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mock notices when notices api fails', async () => {
    vi.mocked(http.get).mockRejectedValueOnce(new Error('network error'));

    const notices = await fetchNotices();

    expect(http.get).toHaveBeenCalledWith('/api/v1/notices');
    expect(notices).toHaveLength(2);
    expect(notices[0]).toMatchObject({
      id: 1,
      isPinned: true,
      title: '국제티엔씨 홈페이지 리뉴얼 1차 오픈 안내',
    });
  });

  it('returns mock admin notice detail when admin api fails', async () => {
    vi.mocked(http.get).mockRejectedValueOnce(new Error('network error'));

    const notice = await fetchAdminNotice(3);

    expect(http.get).toHaveBeenCalledWith('/api/v1/admin/notices/3');
    expect(notice).toMatchObject({
      id: 3,
      isPublished: false,
      title: '관리자 게시판 시안 검토용 임시 공지',
    });
  });
});
