import { energyImages } from '@/assets/images/energy';
import { mechanicalHvacImages } from '@/assets/images/mechanical-hvac';
import { refrigerationSystemImages } from '@/assets/images/refrigeration-system';
import { http } from '@/api/http';

export interface WebCatalogPreviewPage {
  id: number;
  imageUrl: string;
  pageNumber: number;
}

export interface WebCatalogSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileUrl: string;
  pageCount: number;
  coverImageUrl: string | null;
  publishedAt: string;
}

export interface WebCatalogDetail extends WebCatalogSummary {
  contentType: string;
  fileSize: number;
  displayOrder: number;
  isPublished: boolean;
  previewPages: WebCatalogPreviewPage[];
}

export interface AdminWebCatalogSummary extends WebCatalogSummary {
  displayOrder: number;
  isPublished: boolean;
}

export interface WebCatalogMutationInput {
  title: string;
  description: string;
  category: string;
  pageCount: number;
  displayOrder: number;
  isPublished: boolean;
  publishedAt: string;
  file: File | null;
}

interface BackendWebCatalogSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileUrl: string;
  pageCount: number;
  publishedAt: string;
}

interface BackendWebCatalogDetail extends BackendWebCatalogSummary {
  contentType: string;
  fileSize: number;
  displayOrder: number;
  isPublished: boolean;
}

interface BackendAdminWebCatalogSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  fileName: string;
  pageCount: number;
  displayOrder: number;
  isPublished: boolean;
  publishedAt: string;
}

interface MockWebCatalog extends WebCatalogDetail {}

const shouldUseBoardMocks = import.meta.env.VITE_ENABLE_MOCK === 'true';
const companyCatalogPdfUrl = encodeURI('/kookje-tnc-catalog-v2-25-08-05.pdf');
const mechanicalBrochurePdfUrl = encodeURI('/mechanical-facilities-brochure.pdf');
const renewalGuidePdfUrl = encodeURI('/website-renewal-guide-260202.pdf');
const defaultCoverImageUrl = mechanicalHvacImages.overview.guidePage21;

const createPreviewPages = (pageNumbers: number[], imageUrls: string[]): WebCatalogPreviewPage[] => {
  return imageUrls.map((imageUrl, index) => ({
    id: index + 1,
    imageUrl,
    pageNumber: pageNumbers[index] ?? index + 1,
  }));
};

let mockWebCatalogs: MockWebCatalog[] = [
  {
    id: 1,
    title: '회사 종합 카탈로그',
    description: '회사 소개, 사업 영역, 엔지니어링 역량을 잡지처럼 훑어볼 수 있는 종합 카탈로그입니다.',
    category: '회사소개',
    fileName: 'kookje-tnc-catalog-v2-25-08-05.pdf',
    fileUrl: companyCatalogPdfUrl,
    pageCount: 36,
    coverImageUrl: mechanicalHvacImages.overview.brochurePage09BusinessArea,
    publishedAt: '2026-04-02T09:00:00',
    contentType: 'application/pdf',
    fileSize: 9_800_000,
    displayOrder: 1,
    isPublished: true,
    previewPages: createPreviewPages(
      [9, 17, 21, 23],
      [
        mechanicalHvacImages.overview.brochurePage09BusinessArea,
        mechanicalHvacImages.overview.brochurePage17OperatingConsulting,
        mechanicalHvacImages.overview.guidePage21,
        mechanicalHvacImages.hvac.guidePage23,
      ],
    ),
  },
  {
    id: 2,
    title: '기계설비 브로슈어',
    description: '난방·냉방, 공조, 위생배관, 자동제어 등 주요 기계설비 라인업을 정리한 브로슈어입니다.',
    category: '브로슈어',
    fileName: 'mechanical-facilities-brochure.pdf',
    fileUrl: mechanicalBrochurePdfUrl,
    pageCount: 28,
    coverImageUrl: mechanicalHvacImages.heatingCooling.brochurePage10,
    publishedAt: '2026-04-01T13:20:00',
    contentType: 'application/pdf',
    fileSize: 3_200_000,
    displayOrder: 2,
    isPublished: true,
    previewPages: createPreviewPages(
      [10, 11, 12, 13, 14],
      [
        mechanicalHvacImages.heatingCooling.brochurePage10,
        mechanicalHvacImages.heatingCooling.brochurePage11,
        mechanicalHvacImages.hvac.brochurePage12,
        mechanicalHvacImages.plumbing.brochurePage13,
        mechanicalHvacImages.automaticControl.brochurePage14,
      ],
    ),
  },
  {
    id: 3,
    title: '군트너 제품 카탈로그',
    description: '군트너 응축기 및 공랭식 시스템 관련 주요 페이지를 웹카탈로그 형태로 전시한 샘플입니다.',
    category: '브랜드 카탈로그',
    fileName: 'kookje-tnc-catalog-v2-25-08-05.pdf',
    fileUrl: companyCatalogPdfUrl,
    pageCount: 24,
    coverImageUrl: energyImages.guntner.catalogPages.common,
    publishedAt: '2026-03-31T15:40:00',
    contentType: 'application/pdf',
    fileSize: 9_800_000,
    displayOrder: 3,
    isPublished: true,
    previewPages: createPreviewPages(
      [110, 111, 112, 113],
      [
        energyImages.guntner.catalogPages.common,
        energyImages.guntner.catalogPages.gacc,
        energyImages.guntner.catalogPages.gasc,
        energyImages.guntner.catalogPages.gadc,
      ],
    ),
  },
  {
    id: 4,
    title: '냉동 쇼케이스 라인업',
    description: '쇼케이스, 와인셀러, 유지보수 관련 페이지를 묶어 전시형으로 정리한 샘플입니다.',
    category: '제품 라인업',
    fileName: 'website-renewal-guide-260202.pdf',
    fileUrl: renewalGuidePdfUrl,
    pageCount: 18,
    coverImageUrl: refrigerationSystemImages.builtInFrozenShowcase.catalogPage086,
    publishedAt: '2026-03-30T10:10:00',
    contentType: 'application/pdf',
    fileSize: 1_200_000,
    displayOrder: 4,
    isPublished: false,
    previewPages: createPreviewPages(
      [86, 87, 88, 89, 94, 95],
      [
        refrigerationSystemImages.builtInFrozenShowcase.catalogPage086,
        refrigerationSystemImages.builtInFrozenShowcase.catalogPage087,
        refrigerationSystemImages.builtInFrozenShowcase.catalogPage088,
        refrigerationSystemImages.builtInFrozenShowcase.catalogPage089,
        refrigerationSystemImages.premiumWineCellar.catalogPage094,
        refrigerationSystemImages.premiumWineCellar.catalogPage095,
      ],
    ),
  },
];

const sortWebCatalogs = <T extends { displayOrder: number; publishedAt: string }>(items: T[]): T[] => {
  return [...items].sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder;
    }

    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
};

const cloneWebCatalogDetail = (webCatalog: MockWebCatalog): WebCatalogDetail => {
  return {
    ...webCatalog,
    previewPages: webCatalog.previewPages.map((page) => ({ ...page })),
  };
};

const toWebCatalogSummary = (webCatalog: MockWebCatalog): WebCatalogSummary => {
  return {
    id: webCatalog.id,
    title: webCatalog.title,
    description: webCatalog.description,
    category: webCatalog.category,
    fileName: webCatalog.fileName,
    fileUrl: webCatalog.fileUrl,
    pageCount: webCatalog.pageCount,
    coverImageUrl: webCatalog.coverImageUrl,
    publishedAt: webCatalog.publishedAt,
  };
};

const toAdminWebCatalogSummary = (webCatalog: MockWebCatalog): AdminWebCatalogSummary => {
  return {
    ...toWebCatalogSummary(webCatalog),
    displayOrder: webCatalog.displayOrder,
    isPublished: webCatalog.isPublished,
  };
};

const mapBackendSummary = (webCatalog: BackendWebCatalogSummary): WebCatalogSummary => {
  return {
    ...webCatalog,
    coverImageUrl: null,
  };
};

const mapBackendDetail = (webCatalog: BackendWebCatalogDetail): WebCatalogDetail => {
  return {
    ...webCatalog,
    coverImageUrl: null,
    previewPages: [],
  };
};

const mapBackendAdminSummary = (
  webCatalog: BackendAdminWebCatalogSummary,
): AdminWebCatalogSummary => {
  return {
    ...webCatalog,
    fileUrl: '',
    coverImageUrl: null,
  };
};

const getNextMockId = (items: Array<{ id: number }>) => {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
};

const revokeMockFileUrl = (fileUrl: string) => {
  if (!fileUrl.startsWith('blob:')) {
    return;
  }

  URL.revokeObjectURL(fileUrl);
};

const createMockPdfData = (file: File | null, current?: MockWebCatalog) => {
  if (!file && current) {
    return {
      contentType: current.contentType,
      fileName: current.fileName,
      fileSize: current.fileSize,
      fileUrl: current.fileUrl,
    };
  }

  if (!file) {
    throw new Error('웹카탈로그 PDF 파일이 필요합니다.');
  }

  return {
    contentType: file.type || 'application/pdf',
    fileName: file.name,
    fileSize: file.size,
    fileUrl: URL.createObjectURL(file),
  };
};

const mockFetchWebCatalogs = async (): Promise<WebCatalogSummary[]> => {
  return sortWebCatalogs(mockWebCatalogs)
    .filter((webCatalog) => webCatalog.isPublished)
    .map(toWebCatalogSummary);
};

const mockFetchWebCatalog = async (webCatalogId: number): Promise<WebCatalogDetail> => {
  const webCatalog = mockWebCatalogs.find((item) => item.id === webCatalogId && item.isPublished);

  if (!webCatalog) {
    throw new Error('웹카탈로그를 찾지 못했습니다.');
  }

  return cloneWebCatalogDetail(webCatalog);
};

const mockFetchAdminWebCatalogs = async (): Promise<AdminWebCatalogSummary[]> => {
  return sortWebCatalogs(mockWebCatalogs).map(toAdminWebCatalogSummary);
};

const mockFetchAdminWebCatalog = async (webCatalogId: number): Promise<WebCatalogDetail> => {
  const webCatalog = mockWebCatalogs.find((item) => item.id === webCatalogId);

  if (!webCatalog) {
    throw new Error('웹카탈로그를 찾지 못했습니다.');
  }

  return cloneWebCatalogDetail(webCatalog);
};

const mockCreateWebCatalog = async (input: WebCatalogMutationInput): Promise<WebCatalogDetail> => {
  const pdfData = createMockPdfData(input.file);
  const webCatalog: MockWebCatalog = {
    id: getNextMockId(mockWebCatalogs),
    title: input.title,
    description: input.description,
    category: input.category,
    pageCount: input.pageCount,
    displayOrder: input.displayOrder,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    coverImageUrl: defaultCoverImageUrl,
    previewPages: [],
    ...pdfData,
  };

  mockWebCatalogs = [...mockWebCatalogs, webCatalog];

  return cloneWebCatalogDetail(webCatalog);
};

const mockUpdateWebCatalog = async (
  webCatalogId: number,
  input: WebCatalogMutationInput,
): Promise<WebCatalogDetail> => {
  const currentWebCatalog = mockWebCatalogs.find((item) => item.id === webCatalogId);

  if (!currentWebCatalog) {
    throw new Error('웹카탈로그를 찾지 못했습니다.');
  }

  const nextPdfData = createMockPdfData(input.file, currentWebCatalog);

  if (input.file && nextPdfData.fileUrl !== currentWebCatalog.fileUrl) {
    revokeMockFileUrl(currentWebCatalog.fileUrl);
  }

  const updatedWebCatalog: MockWebCatalog = {
    ...currentWebCatalog,
    title: input.title,
    description: input.description,
    category: input.category,
    pageCount: input.pageCount,
    displayOrder: input.displayOrder,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    ...nextPdfData,
  };

  mockWebCatalogs = mockWebCatalogs.map((item) => {
    return item.id === webCatalogId ? updatedWebCatalog : item;
  });

  return cloneWebCatalogDetail(updatedWebCatalog);
};

const mockDeleteWebCatalog = async (webCatalogId: number): Promise<void> => {
  const currentWebCatalog = mockWebCatalogs.find((item) => item.id === webCatalogId);

  if (currentWebCatalog) {
    revokeMockFileUrl(currentWebCatalog.fileUrl);
  }

  mockWebCatalogs = mockWebCatalogs.filter((item) => item.id !== webCatalogId);
};

export const webCatalogQueryKeys = {
  webCatalogs: ['board', 'web-catalogs'] as const,
  webCatalog: (webCatalogId: number) => ['board', 'web-catalogs', webCatalogId] as const,
  adminWebCatalogs: ['board', 'admin', 'web-catalogs'] as const,
  adminWebCatalog: (webCatalogId: number) =>
    ['board', 'admin', 'web-catalogs', webCatalogId] as const,
};

export const fetchWebCatalogs = async (): Promise<WebCatalogSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchWebCatalogs();
  }

  const response = await http.get<BackendWebCatalogSummary[]>('/api/v1/web-catalogs');
  return response.map(mapBackendSummary);
};

export const fetchWebCatalog = async (webCatalogId: number): Promise<WebCatalogDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchWebCatalog(webCatalogId);
  }

  const response = await http.get<BackendWebCatalogDetail>(`/api/v1/web-catalogs/${webCatalogId}`);
  return mapBackendDetail(response);
};

export const fetchAdminWebCatalogs = async (): Promise<AdminWebCatalogSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminWebCatalogs();
  }

  const response = await http.get<BackendAdminWebCatalogSummary[]>('/api/v1/admin/web-catalogs');
  return response.map(mapBackendAdminSummary);
};

export const fetchAdminWebCatalog = async (webCatalogId: number): Promise<WebCatalogDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminWebCatalog(webCatalogId);
  }

  const response = await http.get<BackendWebCatalogDetail>(
    `/api/v1/admin/web-catalogs/${webCatalogId}`,
  );
  return mapBackendDetail(response);
};

export const createWebCatalog = async (
  input: WebCatalogMutationInput,
): Promise<WebCatalogDetail> => {
  if (shouldUseBoardMocks) {
    return mockCreateWebCatalog(input);
  }

  return mapBackendDetail(
    await http.post<BackendWebCatalogDetail>('/api/v1/admin/web-catalogs', toWebCatalogFormData(input)),
  );
};

export const updateWebCatalog = async (
  webCatalogId: number,
  input: WebCatalogMutationInput,
): Promise<WebCatalogDetail> => {
  if (shouldUseBoardMocks) {
    return mockUpdateWebCatalog(webCatalogId, input);
  }

  return mapBackendDetail(
    await http.put<BackendWebCatalogDetail>(
      `/api/v1/admin/web-catalogs/${webCatalogId}`,
      toWebCatalogFormData(input),
    ),
  );
};

export const deleteWebCatalog = async (webCatalogId: number): Promise<void> => {
  if (shouldUseBoardMocks) {
    return mockDeleteWebCatalog(webCatalogId);
  }

  return http.delete<void>(`/api/v1/admin/web-catalogs/${webCatalogId}`);
};

const toWebCatalogFormData = (input: WebCatalogMutationInput): FormData => {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('description', input.description);
  formData.append('category', input.category);
  formData.append('pageCount', String(input.pageCount));
  formData.append('displayOrder', String(input.displayOrder));
  formData.append('isPublished', String(input.isPublished));
  formData.append('publishedAt', input.publishedAt);

  if (input.file) {
    formData.append('file', input.file);
  }

  return formData;
};
