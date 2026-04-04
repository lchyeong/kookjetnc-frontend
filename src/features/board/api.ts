import { http } from '@/api/http';

export interface NoticeSummary {
  id: number;
  title: string;
  summary: string;
  isPinned: boolean;
  publishedAt: string;
}

export interface NoticeDetail extends NoticeSummary {
  content: string;
  isPublished: boolean;
}

export interface AdminNoticeSummary extends NoticeSummary {
  isPublished: boolean;
}

export interface ResourceSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  publishedAt: string;
}

export interface ResourceDetail extends ResourceSummary {
  content: string;
  contentType: string;
  isPublished: boolean;
}

export interface AdminResourceSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  fileName: string;
  isPublished: boolean;
  publishedAt: string;
}

export interface ConstructionCaseGalleryImage {
  id: number;
  displayOrder: number;
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
}

export interface ConstructionCaseSummary {
  id: number;
  title: string;
  summary: string;
  thumbnailFileUrl: string;
  publishedAt: string;
}

export interface ConstructionCaseDetail extends ConstructionCaseSummary {
  thumbnailFileName: string;
  thumbnailContentType: string;
  thumbnailFileSize: number;
  content: string;
  viewCount: number;
  isPublished: boolean;
  galleryImages: ConstructionCaseGalleryImage[];
}

export interface AdminConstructionCaseSummary extends ConstructionCaseSummary {
  viewCount: number;
  isPublished: boolean;
}

export interface ProjectRecordSummary {
  id: number;
  title: string;
  summary: string;
  viewCount: number;
  publishedAt: string;
}

export interface ProjectRecordDetail extends ProjectRecordSummary {
  content: string;
  isPublished: boolean;
}

export interface AdminProjectRecordSummary extends ProjectRecordSummary {
  isPublished: boolean;
}

export interface TechnicalDataSummary {
  id: number;
  title: string;
  description: string;
  category: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  viewCount: number;
  publishedAt: string;
}

export interface TechnicalDataDetail extends TechnicalDataSummary {
  content: string;
  contentType: string;
  isPublished: boolean;
}

export interface AdminTechnicalDataSummary extends TechnicalDataSummary {
  isPublished: boolean;
}

export interface AdminLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
}

export interface NoticeMutationInput {
  title: string;
  summary: string;
  content: string;
  isPinned: boolean;
  isPublished: boolean;
  publishedAt: string;
}

export interface ResourceMutationInput {
  title: string;
  description: string;
  content: string;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  file: File | null;
}

export interface ConstructionCaseMutationInput {
  title: string;
  summary: string;
  content: string;
  isPublished: boolean;
  publishedAt: string;
  thumbnail: File | null;
  galleryImages: File[];
  removeGallery: boolean;
}

export interface ProjectRecordMutationInput {
  title: string;
  summary: string;
  content: string;
  isPublished: boolean;
  publishedAt: string;
}

export interface TechnicalDataMutationInput {
  title: string;
  description: string;
  content: string;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  file: File | null;
}

interface MockNotice extends NoticeDetail {}

interface MockResource extends ResourceDetail {}

interface MockConstructionCase extends ConstructionCaseDetail {}

interface MockProjectRecord extends ProjectRecordDetail {}

interface MockTechnicalData extends TechnicalDataDetail {}

const shouldUseBoardMocks = import.meta.env.VITE_ENABLE_MOCK === 'true';
const mockAdminAccessToken = 'mock-admin-access-token';
const technicalGuidePdfUrl = encodeURI('/website-renewal-guide-260202.pdf');
const technicalCatalogPdfUrl = encodeURI('/kookje-tnc-catalog-v2-25-08-05.pdf');
const technicalBrochurePdfUrl = encodeURI('/mechanical-facilities-brochure.pdf');
const constructionCaseThumb01 = '/reference/hiwin-home/2026-03-25/img/main/con02_img01.jpg';
const constructionCaseThumb02 = '/reference/hiwin-home/2026-03-25/img/main/con02_img02.jpg';
const constructionCaseThumb03 = '/reference/hiwin-home/2026-03-25/img/main/con02_img03.jpg';
const constructionCaseGallery04 = '/reference/hiwin-home/2026-03-25/img/main/con02_img04.jpg';
const constructionCaseGallery05 = '/reference/hiwin-home/2026-03-25/img/main/con02_img05.jpg';
const constructionCaseGallery06 = '/reference/hiwin-home/2026-03-25/img/main/con02_img06.jpg';

let mockNotices: MockNotice[] = [
  {
    id: 1,
    title: '국제티엔씨 홈페이지 리뉴얼 1차 오픈 안내',
    summary: '시공사례, 공사실적, 기술자료 메뉴가 먼저 오픈되었습니다.',
    isPinned: true,
    publishedAt: '2026-04-03T09:00:00',
    content:
      '국제티엔씨 홈페이지 리뉴얼 1차 오픈 안내입니다.\n\n이번 배포에서는 실적·정보지원 영역의 주요 게시판이 우선 반영되었습니다.\n- 시공사례\n- 공사실적\n- 기술자료\n- 웹카탈로그\n\n세부 기능은 단계적으로 확장 예정입니다.',
    isPublished: true,
  },
  {
    id: 2,
    title: '기계설비 브로슈어 최신본 업데이트',
    summary: '자료실과 기술자료 게시판에서 최신 PDF를 확인할 수 있습니다.',
    isPinned: false,
    publishedAt: '2026-04-01T14:30:00',
    content:
      '기계설비 브로슈어 최신본이 반영되었습니다.\n\n영업 제안 및 현장 설명 자료로 활용할 수 있으며, 관련 PDF는 자료실과 기술자료 게시판에서 내려받을 수 있습니다.',
    isPublished: true,
  },
  {
    id: 3,
    title: '관리자 게시판 시안 검토용 임시 공지',
    summary: '관리자 화면 확인을 위한 비공개 샘플 공지입니다.',
    isPinned: false,
    publishedAt: '2026-04-04T10:00:00',
    content:
      '이 공지는 관리자 화면 검토용으로만 등록된 샘플입니다.\n\n공개 상태를 끄면 일반 사용자 목록에서는 노출되지 않습니다.',
    isPublished: false,
  },
];

let mockResources: MockResource[] = [
  {
    id: 1,
    title: '회사 종합 카탈로그 PDF',
    description: '회사 소개와 사업 영역이 정리된 종합 카탈로그입니다.',
    category: '카탈로그',
    fileName: 'kookje-tnc-catalog-v2-25-08-05.pdf',
    fileUrl: technicalCatalogPdfUrl,
    fileSize: 9_800_000,
    publishedAt: '2026-03-31T16:20:00',
    content:
      '회사 소개용 종합 카탈로그입니다.\n\n영업 소개, 제안서 첨부, 회사 소개 자료로 활용 가능합니다.',
    contentType: 'application/pdf',
    isPublished: true,
  },
  {
    id: 2,
    title: '기계설비 브로슈어',
    description: '기계설비 라인업과 적용 범위를 정리한 브로슈어입니다.',
    category: '브로슈어',
    fileName: 'mechanical-facilities-brochure.pdf',
    fileUrl: technicalBrochurePdfUrl,
    fileSize: 3_200_000,
    publishedAt: '2026-03-24T10:15:00',
    content:
      '기계설비 브로슈어 샘플입니다.\n\n주요 설비군과 적용 현장을 한 번에 확인할 수 있도록 구성했습니다.',
    contentType: 'application/pdf',
    isPublished: true,
  },
  {
    id: 3,
    title: '내부 검토용 홈페이지 리뉴얼 가이드',
    description: '관리자용 검토 문서입니다.',
    category: '가이드',
    fileName: 'website-renewal-guide-260202.pdf',
    fileUrl: technicalGuidePdfUrl,
    fileSize: 1_200_000,
    publishedAt: '2026-04-01T11:45:00',
    content:
      '내부 검토용 가이드 문서입니다.\n\n비공개 샘플로 유지해 관리자 화면에서만 우선 확인할 수 있습니다.',
    contentType: 'application/pdf',
    isPublished: false,
  },
];

let mockConstructionCases: MockConstructionCase[] = [
  {
    id: 1,
    title: '하남 복합물류센터 냉동·냉장 설비 시공',
    summary: '저온 물류 구역과 상온 구역을 분리한 복합물류센터 시공사례입니다.',
    thumbnailFileUrl: constructionCaseThumb01,
    viewCount: 246,
    publishedAt: '2026-03-27T10:00:00',
    thumbnailFileName: 'con02_img01.jpg',
    thumbnailContentType: 'image/jpeg',
    thumbnailFileSize: 120_000,
    content:
      '<p>하남 복합물류센터 현장의 냉동·냉장 설비 시공 사례입니다.</p><p>저온 구역별 부하를 반영한 설비 배치와 유지보수 동선을 함께 고려했습니다.</p><ul><li>냉동·냉장 구역 분리 설계</li><li>중앙 제어반 연동</li><li>시운전 및 운전 매뉴얼 제공</li></ul>',
    isPublished: true,
    galleryImages: [
      {
        id: 11,
        displayOrder: 1,
        fileName: 'con02_img04.jpg',
        fileUrl: constructionCaseGallery04,
        contentType: 'image/jpeg',
        fileSize: 120_000,
      },
      {
        id: 12,
        displayOrder: 2,
        fileName: 'con02_img05.jpg',
        fileUrl: constructionCaseGallery05,
        contentType: 'image/jpeg',
        fileSize: 120_000,
      },
    ],
  },
  {
    id: 2,
    title: '수원 식품공장 공조기 교체 및 덕트 재구성',
    summary: '생산동 환기 효율을 개선하기 위한 기계·공조설비 시공입니다.',
    thumbnailFileUrl: constructionCaseThumb02,
    viewCount: 133,
    publishedAt: '2026-03-18T13:20:00',
    thumbnailFileName: 'con02_img02.jpg',
    thumbnailContentType: 'image/jpeg',
    thumbnailFileSize: 120_000,
    content:
      '<p>생산 공정 열부하를 반영해 공조기와 덕트 라인을 재구성한 사례입니다.</p><p>공정 중단 시간을 최소화하기 위해 야간 시공과 단계별 전환 작업을 병행했습니다.</p>',
    isPublished: true,
    galleryImages: [
      {
        id: 21,
        displayOrder: 1,
        fileName: 'con02_img06.jpg',
        fileUrl: constructionCaseGallery06,
        contentType: 'image/jpeg',
        fileSize: 120_000,
      },
    ],
  },
  {
    id: 3,
    title: '평택 지원시설 유틸리티 배관 시공',
    summary: '관리자 검토용 비공개 시공사례 샘플입니다.',
    thumbnailFileUrl: constructionCaseThumb03,
    viewCount: 48,
    publishedAt: '2026-04-02T09:10:00',
    thumbnailFileName: 'con02_img03.jpg',
    thumbnailContentType: 'image/jpeg',
    thumbnailFileSize: 120_000,
    content:
      '<p>지원시설 유틸리티 배관과 제어 연동을 중심으로 한 비공개 샘플 사례입니다.</p>',
    isPublished: false,
    galleryImages: [],
  },
];


let mockProjectRecords: MockProjectRecord[] = [
  {
    id: 1,
    title: '하남 복합물류센터 공조 설비 구축',
    summary: '냉동·냉장 구역과 상온 구역을 분리한 공조 시스템 공사 실적입니다.',
    content:
      '하남 복합물류센터 현장에 공조 설비를 구축한 공사 실적입니다.\n\n주요 범위\n- 냉동·냉장 구역 공조 배관 시공\n- 상온 창고용 환기 설비 및 제어반 연동\n- 시운전 및 인수인계 문서 정리',
    isPublished: true,
    publishedAt: '2026-03-28T09:30:00',
    viewCount: 184,
  },
  {
    id: 2,
    title: '수원 식품공장 기계설비 개선 공사',
    summary: '노후 설비 교체와 생산동 환기 효율 개선을 함께 진행한 프로젝트입니다.',
    content:
      '수원 식품공장의 생산동 및 포장동을 대상으로 한 기계설비 개선 공사입니다.\n\n적용 내용\n- 공조기 교체 및 덕트 라인 재배치\n- 생산 라인 열부하 대응 환기 성능 개선\n- 유지보수 동선 확보를 위한 설비 재구성',
    isPublished: true,
    publishedAt: '2026-03-19T14:10:00',
    viewCount: 129,
  },
  {
    id: 3,
    title: '평택 반도체 지원시설 유틸리티 배관 공사',
    summary: '지원동 유틸리티 배관과 제어 연동을 중심으로 수행한 사례입니다.',
    content:
      '평택 반도체 지원시설 프로젝트 실적입니다.\n\n현장 특징\n- 고정밀 운전 조건을 반영한 유틸리티 배관 시공\n- 설비실 배관 동선 최적화\n- 공정 중단 최소화를 위한 단계별 전환 작업 수행',
    isPublished: false,
    publishedAt: '2026-04-02T08:00:00',
    viewCount: 42,
  },
];

let mockTechnicalDataList: MockTechnicalData[] = [
  {
    id: 1,
    title: '기계설비 브로셔',
    description: '주요 기계설비 라인업과 적용 분야를 정리한 브로셔입니다.',
    category: '브로셔',
    fileName: 'mechanical-facilities-brochure.pdf',
    fileUrl: technicalBrochurePdfUrl,
    fileSize: 3_200_000,
    viewCount: 228,
    publishedAt: '2026-03-24T10:15:00',
    content:
      '기계설비 브로셔 샘플입니다.\n\nPDF 원본을 첨부해 두었고, 상세 페이지에서는 자료 요약과 다운로드 링크를 함께 제공합니다.',
    contentType: 'application/pdf',
    isPublished: true,
  },
  {
    id: 2,
    title: '국제티엔씨 카달로그',
    description: '주요 제품군과 시스템 구성을 한 번에 볼 수 있는 카달로그입니다.',
    category: '카달로그',
    fileName: 'kookje-tnc-catalog-v2-25-08-05.pdf',
    fileUrl: technicalCatalogPdfUrl,
    fileSize: 9_800_000,
    viewCount: 311,
    publishedAt: '2026-03-31T16:20:00',
    content:
      '영업 및 제안 단계에서 바로 사용할 수 있는 카달로그 샘플입니다.\n\n향후 서버 저장소 연결 시에는 실제 업로드 파일 경로만 교체하면 됩니다.',
    contentType: 'application/pdf',
    isPublished: true,
  },
  {
    id: 3,
    title: '홈페이지 리뉴얼 가이드',
    description: '메뉴 구조와 자료 구성 기준을 정리한 내부 참고 문서입니다.',
    category: '가이드',
    fileName: 'website-renewal-guide-260202.pdf',
    fileUrl: technicalGuidePdfUrl,
    fileSize: 1_200_000,
    viewCount: 77,
    publishedAt: '2026-04-01T11:45:00',
    content:
      '내부 참고용 기술자료 샘플입니다.\n\n기술자료 게시판은 PDF뿐 아니라 각종 첨부 문서를 함께 관리하는 구조를 전제로 작성했습니다.',
    contentType: 'application/pdf',
    isPublished: false,
  },
];

const sortByPublishedAtDesc = <T extends { publishedAt: string }>(items: T[]): T[] => {
  return [...items].sort((left, right) => {
    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
};

const toProjectRecordSummary = (
  projectRecord: MockProjectRecord,
): ProjectRecordSummary => {
  return {
    id: projectRecord.id,
    title: projectRecord.title,
    summary: projectRecord.summary,
    viewCount: projectRecord.viewCount,
    publishedAt: projectRecord.publishedAt,
  };
};

const toAdminProjectRecordSummary = (
  projectRecord: MockProjectRecord,
): AdminProjectRecordSummary => {
  return {
    ...toProjectRecordSummary(projectRecord),
    isPublished: projectRecord.isPublished,
  };
};

const toTechnicalDataSummary = (
  technicalData: MockTechnicalData,
): TechnicalDataSummary => {
  return {
    id: technicalData.id,
    title: technicalData.title,
    description: technicalData.description,
    category: technicalData.category,
    fileName: technicalData.fileName,
    fileUrl: technicalData.fileUrl,
    fileSize: technicalData.fileSize,
    viewCount: technicalData.viewCount,
    publishedAt: technicalData.publishedAt,
  };
};

const toAdminTechnicalDataSummary = (
  technicalData: MockTechnicalData,
): AdminTechnicalDataSummary => {
  return {
    ...toTechnicalDataSummary(technicalData),
    isPublished: technicalData.isPublished,
  };
};

const toNoticeSummary = (notice: MockNotice): NoticeSummary => {
  return {
    id: notice.id,
    title: notice.title,
    summary: notice.summary,
    isPinned: notice.isPinned,
    publishedAt: notice.publishedAt,
  };
};

const toAdminNoticeSummary = (notice: MockNotice): AdminNoticeSummary => {
  return {
    ...toNoticeSummary(notice),
    isPublished: notice.isPublished,
  };
};

const toResourceSummary = (resource: MockResource): ResourceSummary => {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    category: resource.category,
    fileName: resource.fileName,
    fileUrl: resource.fileUrl,
    fileSize: resource.fileSize,
    publishedAt: resource.publishedAt,
  };
};

const toAdminResourceSummary = (resource: MockResource): AdminResourceSummary => {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    category: resource.category,
    fileName: resource.fileName,
    isPublished: resource.isPublished,
    publishedAt: resource.publishedAt,
  };
};

const toConstructionCaseSummary = (
  constructionCase: MockConstructionCase,
): ConstructionCaseSummary => {
  return {
    id: constructionCase.id,
    title: constructionCase.title,
    summary: constructionCase.summary,
    thumbnailFileUrl: constructionCase.thumbnailFileUrl,
    publishedAt: constructionCase.publishedAt,
  };
};

const toAdminConstructionCaseSummary = (
  constructionCase: MockConstructionCase,
): AdminConstructionCaseSummary => {
  return {
    ...toConstructionCaseSummary(constructionCase),
    viewCount: constructionCase.viewCount,
    isPublished: constructionCase.isPublished,
  };
};

const cloneProjectRecordDetail = (projectRecord: MockProjectRecord): ProjectRecordDetail => {
  return { ...projectRecord };
};

const cloneTechnicalDataDetail = (technicalData: MockTechnicalData): TechnicalDataDetail => {
  return { ...technicalData };
};

const cloneNoticeDetail = (notice: MockNotice): NoticeDetail => {
  return { ...notice };
};

const cloneResourceDetail = (resource: MockResource): ResourceDetail => {
  return { ...resource };
};

const cloneConstructionCaseDetail = (
  constructionCase: MockConstructionCase,
): ConstructionCaseDetail => {
  return {
    ...constructionCase,
    galleryImages: constructionCase.galleryImages.map((image) => ({ ...image })),
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

const createMockTechnicalFile = (file: File | null, current?: MockTechnicalData) => {
  if (!file && current) {
    return {
      contentType: current.contentType,
      fileName: current.fileName,
      fileSize: current.fileSize,
      fileUrl: current.fileUrl,
    };
  }

  if (!file) {
    throw new Error('기술자료 파일이 필요합니다.');
  }

  return {
    contentType: file.type || 'application/octet-stream',
    fileName: file.name,
    fileSize: file.size,
    fileUrl: URL.createObjectURL(file),
  };
};

const createMockResourceFile = (file: File | null, current?: MockResource) => {
  if (!file && current) {
    return {
      contentType: current.contentType,
      fileName: current.fileName,
      fileSize: current.fileSize,
      fileUrl: current.fileUrl,
    };
  }

  if (!file) {
    throw new Error('자료 파일이 필요합니다.');
  }

  return {
    contentType: file.type || 'application/octet-stream',
    fileName: file.name,
    fileSize: file.size,
    fileUrl: URL.createObjectURL(file),
  };
};

const revokeConstructionCaseImages = (constructionCase: MockConstructionCase) => {
  revokeMockFileUrl(constructionCase.thumbnailFileUrl);
  constructionCase.galleryImages.forEach((image) => revokeMockFileUrl(image.fileUrl));
};

const createMockConstructionCaseFiles = (
  input: ConstructionCaseMutationInput,
  current?: MockConstructionCase,
) => {
  const thumbnail = input.thumbnail
    ? {
        thumbnailFileName: input.thumbnail.name,
        thumbnailFileUrl: URL.createObjectURL(input.thumbnail),
        thumbnailContentType: input.thumbnail.type || 'image/jpeg',
        thumbnailFileSize: input.thumbnail.size,
      }
    : current
      ? {
          thumbnailFileName: current.thumbnailFileName,
          thumbnailFileUrl: current.thumbnailFileUrl,
          thumbnailContentType: current.thumbnailContentType,
          thumbnailFileSize: current.thumbnailFileSize,
        }
      : null;

  if (!thumbnail) {
    throw new Error('대표 썸네일이 필요합니다.');
  }

  const galleryImages =
    input.galleryImages.length > 0
      ? input.galleryImages.map((file, index) => ({
          id: Date.now() + index,
          displayOrder: index + 1,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          contentType: file.type || 'image/jpeg',
          fileSize: file.size,
        }))
      : input.removeGallery
        ? []
        : current
          ? current.galleryImages.map((image) => ({ ...image }))
          : [];

  return {
    ...thumbnail,
    galleryImages,
  };
};

const mockFetchNotices = async (): Promise<NoticeSummary[]> => {
  return sortByPublishedAtDesc(mockNotices)
    .filter((notice) => notice.isPublished)
    .map(toNoticeSummary);
};

const mockFetchNotice = async (noticeId: number): Promise<NoticeDetail> => {
  const notice = mockNotices.find((item) => item.id === noticeId && item.isPublished);

  if (!notice) {
    throw new Error('공지사항을 찾지 못했습니다.');
  }

  return cloneNoticeDetail(notice);
};

const mockFetchAdminNotices = async (): Promise<AdminNoticeSummary[]> => {
  return sortByPublishedAtDesc(mockNotices).map(toAdminNoticeSummary);
};

const mockFetchAdminNotice = async (noticeId: number): Promise<NoticeDetail> => {
  const notice = mockNotices.find((item) => item.id === noticeId);

  if (!notice) {
    throw new Error('공지사항을 찾지 못했습니다.');
  }

  return cloneNoticeDetail(notice);
};

const mockCreateNotice = async (input: NoticeMutationInput): Promise<NoticeDetail> => {
  const notice: MockNotice = {
    id: getNextMockId(mockNotices),
    title: input.title,
    summary: input.summary,
    content: input.content,
    isPinned: input.isPinned,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
  };

  mockNotices = [notice, ...mockNotices];

  return cloneNoticeDetail(notice);
};

const mockUpdateNotice = async (
  noticeId: number,
  input: NoticeMutationInput,
): Promise<NoticeDetail> => {
  const currentNotice = mockNotices.find((item) => item.id === noticeId);

  if (!currentNotice) {
    throw new Error('공지사항을 찾지 못했습니다.');
  }

  const updatedNotice: MockNotice = {
    ...currentNotice,
    title: input.title,
    summary: input.summary,
    content: input.content,
    isPinned: input.isPinned,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
  };

  mockNotices = mockNotices.map((item) => (item.id === noticeId ? updatedNotice : item));

  return cloneNoticeDetail(updatedNotice);
};

const mockDeleteNotice = async (noticeId: number): Promise<void> => {
  mockNotices = mockNotices.filter((item) => item.id !== noticeId);
};

const mockFetchResources = async (): Promise<ResourceSummary[]> => {
  return sortByPublishedAtDesc(mockResources)
    .filter((resource) => resource.isPublished)
    .map(toResourceSummary);
};

const mockFetchResource = async (resourceId: number): Promise<ResourceDetail> => {
  const resource = mockResources.find((item) => item.id === resourceId && item.isPublished);

  if (!resource) {
    throw new Error('자료를 찾지 못했습니다.');
  }

  return cloneResourceDetail(resource);
};

const mockFetchAdminResources = async (): Promise<AdminResourceSummary[]> => {
  return sortByPublishedAtDesc(mockResources).map(toAdminResourceSummary);
};

const mockFetchAdminResource = async (resourceId: number): Promise<ResourceDetail> => {
  const resource = mockResources.find((item) => item.id === resourceId);

  if (!resource) {
    throw new Error('자료를 찾지 못했습니다.');
  }

  return cloneResourceDetail(resource);
};

const mockCreateResource = async (input: ResourceMutationInput): Promise<ResourceDetail> => {
  const file = createMockResourceFile(input.file);
  const resource: MockResource = {
    id: getNextMockId(mockResources),
    title: input.title,
    description: input.description,
    content: input.content,
    category: input.category,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    ...file,
  };

  mockResources = [resource, ...mockResources];

  return cloneResourceDetail(resource);
};

const mockUpdateResource = async (
  resourceId: number,
  input: ResourceMutationInput,
): Promise<ResourceDetail> => {
  const currentResource = mockResources.find((item) => item.id === resourceId);

  if (!currentResource) {
    throw new Error('자료를 찾지 못했습니다.');
  }

  const nextFile = createMockResourceFile(input.file, currentResource);

  if (input.file && nextFile.fileUrl !== currentResource.fileUrl) {
    revokeMockFileUrl(currentResource.fileUrl);
  }

  const updatedResource: MockResource = {
    ...currentResource,
    title: input.title,
    description: input.description,
    content: input.content,
    category: input.category,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    ...nextFile,
  };

  mockResources = mockResources.map((item) => (item.id === resourceId ? updatedResource : item));

  return cloneResourceDetail(updatedResource);
};

const mockDeleteResource = async (resourceId: number): Promise<void> => {
  const currentResource = mockResources.find((item) => item.id === resourceId);

  if (currentResource) {
    revokeMockFileUrl(currentResource.fileUrl);
  }

  mockResources = mockResources.filter((item) => item.id !== resourceId);
};

const mockFetchConstructionCases = async (): Promise<ConstructionCaseSummary[]> => {
  return sortByPublishedAtDesc(mockConstructionCases)
    .filter((constructionCase) => constructionCase.isPublished)
    .map(toConstructionCaseSummary);
};

const mockFetchConstructionCase = async (
  constructionCaseId: number,
): Promise<ConstructionCaseDetail> => {
  const constructionCase = mockConstructionCases.find(
    (item) => item.id === constructionCaseId && item.isPublished,
  );

  if (!constructionCase) {
    throw new Error('시공사례를 찾지 못했습니다.');
  }

  constructionCase.viewCount += 1;

  return cloneConstructionCaseDetail(constructionCase);
};

const mockFetchAdminConstructionCases = async (): Promise<AdminConstructionCaseSummary[]> => {
  return sortByPublishedAtDesc(mockConstructionCases).map(toAdminConstructionCaseSummary);
};

const mockFetchAdminConstructionCase = async (
  constructionCaseId: number,
): Promise<ConstructionCaseDetail> => {
  const constructionCase = mockConstructionCases.find((item) => item.id === constructionCaseId);

  if (!constructionCase) {
    throw new Error('시공사례를 찾지 못했습니다.');
  }

  return cloneConstructionCaseDetail(constructionCase);
};

const mockCreateConstructionCase = async (
  input: ConstructionCaseMutationInput,
): Promise<ConstructionCaseDetail> => {
  const files = createMockConstructionCaseFiles(input);
  const constructionCase: MockConstructionCase = {
    id: getNextMockId(mockConstructionCases),
    title: input.title,
    summary: input.summary,
    content: input.content,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    viewCount: 0,
    ...files,
  };

  mockConstructionCases = [constructionCase, ...mockConstructionCases];

  return cloneConstructionCaseDetail(constructionCase);
};

const mockUpdateConstructionCase = async (
  constructionCaseId: number,
  input: ConstructionCaseMutationInput,
): Promise<ConstructionCaseDetail> => {
  const currentConstructionCase = mockConstructionCases.find((item) => item.id === constructionCaseId);

  if (!currentConstructionCase) {
    throw new Error('시공사례를 찾지 못했습니다.');
  }

  const nextFiles = createMockConstructionCaseFiles(input, currentConstructionCase);

  if (input.thumbnail && nextFiles.thumbnailFileUrl !== currentConstructionCase.thumbnailFileUrl) {
    revokeMockFileUrl(currentConstructionCase.thumbnailFileUrl);
  }

  if (input.galleryImages.length > 0 || input.removeGallery) {
    currentConstructionCase.galleryImages.forEach((image) => revokeMockFileUrl(image.fileUrl));
  }

  const updatedConstructionCase: MockConstructionCase = {
    ...currentConstructionCase,
    title: input.title,
    summary: input.summary,
    content: input.content,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    ...nextFiles,
  };

  mockConstructionCases = mockConstructionCases.map((item) => {
    return item.id === constructionCaseId ? updatedConstructionCase : item;
  });

  return cloneConstructionCaseDetail(updatedConstructionCase);
};

const mockDeleteConstructionCase = async (constructionCaseId: number): Promise<void> => {
  const currentConstructionCase = mockConstructionCases.find((item) => item.id === constructionCaseId);

  if (currentConstructionCase) {
    revokeConstructionCaseImages(currentConstructionCase);
  }

  mockConstructionCases = mockConstructionCases.filter((item) => item.id !== constructionCaseId);
};

const mockFetchProjectRecords = async (): Promise<ProjectRecordSummary[]> => {
  return sortByPublishedAtDesc(mockProjectRecords)
    .filter((projectRecord) => projectRecord.isPublished)
    .map(toProjectRecordSummary);
};

const mockFetchProjectRecord = async (
  projectRecordId: number,
): Promise<ProjectRecordDetail> => {
  const projectRecord = mockProjectRecords.find((item) => item.id === projectRecordId && item.isPublished);

  if (!projectRecord) {
    throw new Error('공사실적을 찾지 못했습니다.');
  }

  projectRecord.viewCount += 1;

  return cloneProjectRecordDetail(projectRecord);
};

const mockFetchAdminProjectRecords = async (): Promise<AdminProjectRecordSummary[]> => {
  return sortByPublishedAtDesc(mockProjectRecords).map(toAdminProjectRecordSummary);
};

const mockFetchAdminProjectRecord = async (
  projectRecordId: number,
): Promise<ProjectRecordDetail> => {
  const projectRecord = mockProjectRecords.find((item) => item.id === projectRecordId);

  if (!projectRecord) {
    throw new Error('공사실적을 찾지 못했습니다.');
  }

  return cloneProjectRecordDetail(projectRecord);
};

const mockCreateProjectRecord = async (
  input: ProjectRecordMutationInput,
): Promise<ProjectRecordDetail> => {
  const projectRecord: MockProjectRecord = {
    id: getNextMockId(mockProjectRecords),
    title: input.title,
    summary: input.summary,
    content: input.content,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    viewCount: 0,
  };

  mockProjectRecords = [projectRecord, ...mockProjectRecords];

  return cloneProjectRecordDetail(projectRecord);
};

const mockUpdateProjectRecord = async (
  projectRecordId: number,
  input: ProjectRecordMutationInput,
): Promise<ProjectRecordDetail> => {
  const currentProjectRecord = mockProjectRecords.find((item) => item.id === projectRecordId);

  if (!currentProjectRecord) {
    throw new Error('공사실적을 찾지 못했습니다.');
  }

  const updatedProjectRecord: MockProjectRecord = {
    ...currentProjectRecord,
    title: input.title,
    summary: input.summary,
    content: input.content,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
  };

  mockProjectRecords = mockProjectRecords.map((item) => {
    return item.id === projectRecordId ? updatedProjectRecord : item;
  });

  return cloneProjectRecordDetail(updatedProjectRecord);
};

const mockDeleteProjectRecord = async (projectRecordId: number): Promise<void> => {
  mockProjectRecords = mockProjectRecords.filter((item) => item.id !== projectRecordId);
};

const mockFetchTechnicalDataList = async (): Promise<TechnicalDataSummary[]> => {
  return sortByPublishedAtDesc(mockTechnicalDataList)
    .filter((technicalData) => technicalData.isPublished)
    .map(toTechnicalDataSummary);
};

const mockFetchTechnicalData = async (
  technicalDataId: number,
): Promise<TechnicalDataDetail> => {
  const technicalData = mockTechnicalDataList.find(
    (item) => item.id === technicalDataId && item.isPublished,
  );

  if (!technicalData) {
    throw new Error('기술자료를 찾지 못했습니다.');
  }

  technicalData.viewCount += 1;

  return cloneTechnicalDataDetail(technicalData);
};

const mockFetchAdminTechnicalDataList = async (): Promise<AdminTechnicalDataSummary[]> => {
  return sortByPublishedAtDesc(mockTechnicalDataList).map(toAdminTechnicalDataSummary);
};

const mockFetchAdminTechnicalData = async (
  technicalDataId: number,
): Promise<TechnicalDataDetail> => {
  const technicalData = mockTechnicalDataList.find((item) => item.id === technicalDataId);

  if (!technicalData) {
    throw new Error('기술자료를 찾지 못했습니다.');
  }

  return cloneTechnicalDataDetail(technicalData);
};

const mockCreateTechnicalData = async (
  input: TechnicalDataMutationInput,
): Promise<TechnicalDataDetail> => {
  const file = createMockTechnicalFile(input.file);
  const technicalData: MockTechnicalData = {
    id: getNextMockId(mockTechnicalDataList),
    title: input.title,
    description: input.description,
    category: input.category,
    content: input.content,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    viewCount: 0,
    ...file,
  };

  mockTechnicalDataList = [technicalData, ...mockTechnicalDataList];

  return cloneTechnicalDataDetail(technicalData);
};

const mockUpdateTechnicalData = async (
  technicalDataId: number,
  input: TechnicalDataMutationInput,
): Promise<TechnicalDataDetail> => {
  const currentTechnicalData = mockTechnicalDataList.find((item) => item.id === technicalDataId);

  if (!currentTechnicalData) {
    throw new Error('기술자료를 찾지 못했습니다.');
  }

  const nextFile = createMockTechnicalFile(input.file, currentTechnicalData);

  if (input.file && nextFile.fileUrl !== currentTechnicalData.fileUrl) {
    revokeMockFileUrl(currentTechnicalData.fileUrl);
  }

  const updatedTechnicalData: MockTechnicalData = {
    ...currentTechnicalData,
    title: input.title,
    description: input.description,
    category: input.category,
    content: input.content,
    isPublished: input.isPublished,
    publishedAt: input.publishedAt,
    ...nextFile,
  };

  mockTechnicalDataList = mockTechnicalDataList.map((item) => {
    return item.id === technicalDataId ? updatedTechnicalData : item;
  });

  return cloneTechnicalDataDetail(updatedTechnicalData);
};

const mockDeleteTechnicalData = async (technicalDataId: number): Promise<void> => {
  const currentTechnicalData = mockTechnicalDataList.find((item) => item.id === technicalDataId);

  if (currentTechnicalData) {
    revokeMockFileUrl(currentTechnicalData.fileUrl);
  }

  mockTechnicalDataList = mockTechnicalDataList.filter((item) => item.id !== technicalDataId);
};

export const boardQueryKeys = {
  notices: ['board', 'notices'] as const,
  notice: (noticeId: number) => ['board', 'notices', noticeId] as const,
  resources: ['board', 'resources'] as const,
  resource: (resourceId: number) => ['board', 'resources', resourceId] as const,
  constructionCases: ['board', 'construction-cases'] as const,
  constructionCase: (constructionCaseId: number) =>
    ['board', 'construction-cases', constructionCaseId] as const,
  projectRecords: ['board', 'project-records'] as const,
  projectRecord: (projectRecordId: number) =>
    ['board', 'project-records', projectRecordId] as const,
  technicalData: ['board', 'technical-data'] as const,
  technicalDatum: (technicalDataId: number) =>
    ['board', 'technical-data', technicalDataId] as const,
  adminNotices: ['board', 'admin', 'notices'] as const,
  adminNotice: (noticeId: number) => ['board', 'admin', 'notices', noticeId] as const,
  adminResources: ['board', 'admin', 'resources'] as const,
  adminResource: (resourceId: number) => ['board', 'admin', 'resources', resourceId] as const,
  adminConstructionCases: ['board', 'admin', 'construction-cases'] as const,
  adminConstructionCase: (constructionCaseId: number) =>
    ['board', 'admin', 'construction-cases', constructionCaseId] as const,
  adminProjectRecords: ['board', 'admin', 'project-records'] as const,
  adminProjectRecord: (projectRecordId: number) =>
    ['board', 'admin', 'project-records', projectRecordId] as const,
  adminTechnicalData: ['board', 'admin', 'technical-data'] as const,
  adminTechnicalDatum: (technicalDataId: number) =>
    ['board', 'admin', 'technical-data', technicalDataId] as const,
};

export const loginAdmin = async (credentials: {
  username: string;
  password: string;
}): Promise<AdminLoginResponse> => {
  if (shouldUseBoardMocks) {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      throw new Error('아이디와 비밀번호를 입력해 주세요.');
    }

    return {
      accessToken: mockAdminAccessToken,
      tokenType: 'Bearer',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    };
  }

  return http.post<AdminLoginResponse>('/api/v1/admin/auth/login', credentials);
};

export const refreshAdminSession = async (): Promise<AdminLoginResponse> => {
  if (shouldUseBoardMocks) {
    return {
      accessToken: mockAdminAccessToken,
      tokenType: 'Bearer',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    };
  }

  return http.post<AdminLoginResponse>('/api/v1/admin/auth/refresh');
};

export const logoutAdminSession = async (): Promise<void> => {
  if (shouldUseBoardMocks) {
    return;
  }

  return http.post<void>('/api/v1/admin/auth/logout');
};

export const fetchNotices = async (): Promise<NoticeSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchNotices();
  }

  return http.get<NoticeSummary[]>('/api/v1/notices');
};

export const fetchNotice = async (noticeId: number): Promise<NoticeDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchNotice(noticeId);
  }

  return http.get<NoticeDetail>(`/api/v1/notices/${noticeId}`);
};

export const fetchResources = async (): Promise<ResourceSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchResources();
  }

  return http.get<ResourceSummary[]>('/api/v1/resources');
};

export const fetchResource = async (resourceId: number): Promise<ResourceDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchResource(resourceId);
  }

  return http.get<ResourceDetail>(`/api/v1/resources/${resourceId}`);
};

export const fetchConstructionCases = async (): Promise<ConstructionCaseSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchConstructionCases();
  }

  return http.get<ConstructionCaseSummary[]>('/api/v1/construction-cases');
};

export const fetchConstructionCase = async (
  constructionCaseId: number,
): Promise<ConstructionCaseDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchConstructionCase(constructionCaseId);
  }

  return http.get<ConstructionCaseDetail>(`/api/v1/construction-cases/${constructionCaseId}`);
};

export const fetchProjectRecords = async (): Promise<ProjectRecordSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchProjectRecords();
  }

  return http.get<ProjectRecordSummary[]>('/api/v1/project-records');
};

export const fetchProjectRecord = async (
  projectRecordId: number,
): Promise<ProjectRecordDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchProjectRecord(projectRecordId);
  }

  return http.get<ProjectRecordDetail>(`/api/v1/project-records/${projectRecordId}`);
};

export const fetchTechnicalDataList = async (): Promise<TechnicalDataSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchTechnicalDataList();
  }

  return http.get<TechnicalDataSummary[]>('/api/v1/technical-data');
};

export const fetchTechnicalData = async (
  technicalDataId: number,
): Promise<TechnicalDataDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchTechnicalData(technicalDataId);
  }

  return http.get<TechnicalDataDetail>(`/api/v1/technical-data/${technicalDataId}`);
};

export const fetchAdminNotices = async (): Promise<AdminNoticeSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminNotices();
  }

  return http.get<AdminNoticeSummary[]>('/api/v1/admin/notices');
};

export const fetchAdminNotice = async (noticeId: number): Promise<NoticeDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminNotice(noticeId);
  }

  return http.get<NoticeDetail>(`/api/v1/admin/notices/${noticeId}`);
};

export const createNotice = async (input: NoticeMutationInput): Promise<NoticeDetail> => {
  if (shouldUseBoardMocks) {
    return mockCreateNotice(input);
  }

  return http.post<NoticeDetail>('/api/v1/admin/notices', input);
};

export const updateNotice = async (
  noticeId: number,
  input: NoticeMutationInput,
): Promise<NoticeDetail> => {
  if (shouldUseBoardMocks) {
    return mockUpdateNotice(noticeId, input);
  }

  return http.put<NoticeDetail>(`/api/v1/admin/notices/${noticeId}`, input);
};

export const deleteNotice = async (noticeId: number): Promise<void> => {
  if (shouldUseBoardMocks) {
    return mockDeleteNotice(noticeId);
  }

  return http.delete<void>(`/api/v1/admin/notices/${noticeId}`);
};

export const fetchAdminResources = async (): Promise<AdminResourceSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminResources();
  }

  return http.get<AdminResourceSummary[]>('/api/v1/admin/resources');
};

export const fetchAdminResource = async (resourceId: number): Promise<ResourceDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminResource(resourceId);
  }

  return http.get<ResourceDetail>(`/api/v1/admin/resources/${resourceId}`);
};

export const createResource = async (
  input: ResourceMutationInput,
): Promise<ResourceDetail> => {
  if (shouldUseBoardMocks) {
    return mockCreateResource(input);
  }

  return http.post<ResourceDetail>('/api/v1/admin/resources', toResourceFormData(input));
};

export const updateResource = async (
  resourceId: number,
  input: ResourceMutationInput,
): Promise<ResourceDetail> => {
  if (shouldUseBoardMocks) {
    return mockUpdateResource(resourceId, input);
  }

  return http.put<ResourceDetail>(
    `/api/v1/admin/resources/${resourceId}`,
    toResourceFormData(input),
  );
};

export const deleteResource = async (resourceId: number): Promise<void> => {
  if (shouldUseBoardMocks) {
    return mockDeleteResource(resourceId);
  }

  return http.delete<void>(`/api/v1/admin/resources/${resourceId}`);
};

export const fetchAdminConstructionCases = async (): Promise<AdminConstructionCaseSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminConstructionCases();
  }

  return http.get<AdminConstructionCaseSummary[]>('/api/v1/admin/construction-cases');
};

export const fetchAdminConstructionCase = async (
  constructionCaseId: number,
): Promise<ConstructionCaseDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminConstructionCase(constructionCaseId);
  }

  return http.get<ConstructionCaseDetail>(
    `/api/v1/admin/construction-cases/${constructionCaseId}`,
  );
};

export const fetchAdminProjectRecords = async (): Promise<AdminProjectRecordSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminProjectRecords();
  }

  return http.get<AdminProjectRecordSummary[]>('/api/v1/admin/project-records');
};

export const fetchAdminProjectRecord = async (
  projectRecordId: number,
): Promise<ProjectRecordDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminProjectRecord(projectRecordId);
  }

  return http.get<ProjectRecordDetail>(`/api/v1/admin/project-records/${projectRecordId}`);
};

export const createProjectRecord = async (
  input: ProjectRecordMutationInput,
): Promise<ProjectRecordDetail> => {
  if (shouldUseBoardMocks) {
    return mockCreateProjectRecord(input);
  }

  return http.post<ProjectRecordDetail>('/api/v1/admin/project-records', input);
};

export const updateProjectRecord = async (
  projectRecordId: number,
  input: ProjectRecordMutationInput,
): Promise<ProjectRecordDetail> => {
  if (shouldUseBoardMocks) {
    return mockUpdateProjectRecord(projectRecordId, input);
  }

  return http.put<ProjectRecordDetail>(`/api/v1/admin/project-records/${projectRecordId}`, input);
};

export const deleteProjectRecord = async (projectRecordId: number): Promise<void> => {
  if (shouldUseBoardMocks) {
    return mockDeleteProjectRecord(projectRecordId);
  }

  return http.delete<void>(`/api/v1/admin/project-records/${projectRecordId}`);
};

export const fetchAdminTechnicalDataList = async (): Promise<AdminTechnicalDataSummary[]> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminTechnicalDataList();
  }

  return http.get<AdminTechnicalDataSummary[]>('/api/v1/admin/technical-data');
};

export const fetchAdminTechnicalData = async (
  technicalDataId: number,
): Promise<TechnicalDataDetail> => {
  if (shouldUseBoardMocks) {
    return mockFetchAdminTechnicalData(technicalDataId);
  }

  return http.get<TechnicalDataDetail>(`/api/v1/admin/technical-data/${technicalDataId}`);
};

export const createTechnicalData = async (
  input: TechnicalDataMutationInput,
): Promise<TechnicalDataDetail> => {
  if (shouldUseBoardMocks) {
    return mockCreateTechnicalData(input);
  }

  return http.post<TechnicalDataDetail>(
    '/api/v1/admin/technical-data',
    toTechnicalDataFormData(input),
  );
};

export const updateTechnicalData = async (
  technicalDataId: number,
  input: TechnicalDataMutationInput,
): Promise<TechnicalDataDetail> => {
  if (shouldUseBoardMocks) {
    return mockUpdateTechnicalData(technicalDataId, input);
  }

  return http.put<TechnicalDataDetail>(
    `/api/v1/admin/technical-data/${technicalDataId}`,
    toTechnicalDataFormData(input),
  );
};

export const deleteTechnicalData = async (technicalDataId: number): Promise<void> => {
  if (shouldUseBoardMocks) {
    return mockDeleteTechnicalData(technicalDataId);
  }

  return http.delete<void>(`/api/v1/admin/technical-data/${technicalDataId}`);
};

export const createConstructionCase = async (
  input: ConstructionCaseMutationInput,
): Promise<ConstructionCaseDetail> => {
  if (shouldUseBoardMocks) {
    return mockCreateConstructionCase(input);
  }

  return http.post<ConstructionCaseDetail>(
    '/api/v1/admin/construction-cases',
    toConstructionCaseFormData(input),
  );
};

export const updateConstructionCase = async (
  constructionCaseId: number,
  input: ConstructionCaseMutationInput,
): Promise<ConstructionCaseDetail> => {
  if (shouldUseBoardMocks) {
    return mockUpdateConstructionCase(constructionCaseId, input);
  }

  return http.put<ConstructionCaseDetail>(
    `/api/v1/admin/construction-cases/${constructionCaseId}`,
    toConstructionCaseFormData(input),
  );
};

export const deleteConstructionCase = async (constructionCaseId: number): Promise<void> => {
  if (shouldUseBoardMocks) {
    return mockDeleteConstructionCase(constructionCaseId);
  }

  return http.delete<void>(`/api/v1/admin/construction-cases/${constructionCaseId}`);
};

const toResourceFormData = (input: ResourceMutationInput): FormData => {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('description', input.description);
  formData.append('content', input.content);
  formData.append('category', input.category);
  formData.append('isPublished', String(input.isPublished));
  formData.append('publishedAt', input.publishedAt);

  if (input.file) {
    formData.append('file', input.file);
  }

  return formData;
};

const toConstructionCaseFormData = (input: ConstructionCaseMutationInput): FormData => {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('summary', input.summary);
  formData.append('content', input.content);
  formData.append('isPublished', String(input.isPublished));
  formData.append('publishedAt', input.publishedAt);
  formData.append('removeGallery', String(input.removeGallery));

  if (input.thumbnail) {
    formData.append('thumbnail', input.thumbnail);
  }

  input.galleryImages.forEach((file) => {
    formData.append('galleryImages', file);
  });

  return formData;
};

const toTechnicalDataFormData = (input: TechnicalDataMutationInput): FormData => {
  const formData = new FormData();
  formData.append('title', input.title);
  formData.append('description', input.description);
  formData.append('content', input.content);
  formData.append('category', input.category);
  formData.append('isPublished', String(input.isPublished));
  formData.append('publishedAt', input.publishedAt);

  if (input.file) {
    formData.append('file', input.file);
  }

  return formData;
};
