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
import { fetchAdminWebCatalog, fetchWebCatalogs } from '@/features/board/webCatalogApi';

describe('web catalog api fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns mock web catalogs when list api fails', async () => {
    vi.mocked(http.get).mockRejectedValueOnce(new Error('network error'));

    const webCatalogs = await fetchWebCatalogs();

    expect(http.get).toHaveBeenCalledWith('/api/v1/web-catalogs');
    expect(webCatalogs).toHaveLength(3);
    expect(webCatalogs[0]).toMatchObject({
      id: 1,
      title: '회사 종합 카탈로그',
    });
  });

  it('returns mock admin web catalog detail when detail api fails', async () => {
    vi.mocked(http.get).mockRejectedValueOnce(new Error('network error'));

    const webCatalog = await fetchAdminWebCatalog(1);

    expect(http.get).toHaveBeenCalledWith('/api/v1/admin/web-catalogs/1');
    expect(webCatalog).toMatchObject({
      id: 1,
      isPublished: true,
      title: '회사 종합 카탈로그',
    });
    expect(webCatalog.previewPages.length).toBeGreaterThan(0);
  });
});
