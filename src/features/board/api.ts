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

export const boardQueryKeys = {
  notices: ['board', 'notices'] as const,
  notice: (noticeId: number) => ['board', 'notices', noticeId] as const,
  resources: ['board', 'resources'] as const,
  resource: (resourceId: number) => ['board', 'resources', resourceId] as const,
  adminNotices: ['board', 'admin', 'notices'] as const,
  adminNotice: (noticeId: number) => ['board', 'admin', 'notices', noticeId] as const,
  adminResources: ['board', 'admin', 'resources'] as const,
  adminResource: (resourceId: number) => ['board', 'admin', 'resources', resourceId] as const,
};

export const loginAdmin = async (credentials: {
  username: string;
  password: string;
}): Promise<AdminLoginResponse> => {
  return http.post<AdminLoginResponse>('/api/v1/admin/auth/login', credentials);
};

export const fetchNotices = async (): Promise<NoticeSummary[]> => {
  return http.get<NoticeSummary[]>('/api/v1/notices');
};

export const fetchNotice = async (noticeId: number): Promise<NoticeDetail> => {
  return http.get<NoticeDetail>(`/api/v1/notices/${noticeId}`);
};

export const fetchResources = async (): Promise<ResourceSummary[]> => {
  return http.get<ResourceSummary[]>('/api/v1/resources');
};

export const fetchResource = async (resourceId: number): Promise<ResourceDetail> => {
  return http.get<ResourceDetail>(`/api/v1/resources/${resourceId}`);
};

export const fetchAdminNotices = async (): Promise<AdminNoticeSummary[]> => {
  return http.get<AdminNoticeSummary[]>('/api/v1/admin/notices');
};

export const fetchAdminNotice = async (noticeId: number): Promise<NoticeDetail> => {
  return http.get<NoticeDetail>(`/api/v1/admin/notices/${noticeId}`);
};

export const createNotice = async (input: NoticeMutationInput): Promise<NoticeDetail> => {
  return http.post<NoticeDetail>('/api/v1/admin/notices', input);
};

export const updateNotice = async (
  noticeId: number,
  input: NoticeMutationInput,
): Promise<NoticeDetail> => {
  return http.put<NoticeDetail>(`/api/v1/admin/notices/${noticeId}`, input);
};

export const deleteNotice = async (noticeId: number): Promise<void> => {
  return http.delete<void>(`/api/v1/admin/notices/${noticeId}`);
};

export const fetchAdminResources = async (): Promise<AdminResourceSummary[]> => {
  return http.get<AdminResourceSummary[]>('/api/v1/admin/resources');
};

export const fetchAdminResource = async (resourceId: number): Promise<ResourceDetail> => {
  return http.get<ResourceDetail>(`/api/v1/admin/resources/${resourceId}`);
};

export const createResource = async (
  input: ResourceMutationInput,
): Promise<ResourceDetail> => {
  return http.post<ResourceDetail>('/api/v1/admin/resources', toResourceFormData(input));
};

export const updateResource = async (
  resourceId: number,
  input: ResourceMutationInput,
): Promise<ResourceDetail> => {
  return http.put<ResourceDetail>(
    `/api/v1/admin/resources/${resourceId}`,
    toResourceFormData(input),
  );
};

export const deleteResource = async (resourceId: number): Promise<void> => {
  return http.delete<void>(`/api/v1/admin/resources/${resourceId}`);
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
