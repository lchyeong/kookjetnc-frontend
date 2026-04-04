import axios from 'axios';

import { env } from '@/config/env';
import {
  clearAdminAccessToken,
  getAdminAccessToken,
  isMockAdminEnabled,
  isMockAdminSession,
  setAdminAccessToken,
} from '@/features/board/auth';

const baseURL = env.apiBaseUrl;
const AUTH_ENDPOINTS = [
  '/api/v1/admin/auth/login',
  '/api/v1/admin/auth/refresh',
  '/api/v1/admin/auth/logout',
] as const;

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface RefreshResponse {
  accessToken: string;
}

interface RetryableRequestConfig {
  _retry?: boolean;
  headers?: Record<string, string>;
  url?: string;
}

let refreshPromise: Promise<string | null> | null = null;

const axiosInstance = axios.create({
  ...(baseURL ? { baseURL } : {}),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAdminAccessToken();
  const requestUrl = config.url ?? '';
  const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => requestUrl.includes(endpoint));

  if (token && !isAuthEndpoint) {
    const headers = config.headers ?? {};
    if (typeof (headers as { set?: (name: string, value: string) => void }).set === 'function') {
      (headers as { set: (name: string, value: string) => void }).set(
        'Authorization',
        `Bearer ${token}`,
      );
    } else {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    config.headers = headers;
  }

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    const headers = config.headers ?? {};
    if (
      typeof (headers as { setContentType?: (value?: string) => void }).setContentType === 'function'
    ) {
      (headers as { setContentType: (value?: string) => void }).setContentType(undefined);
    } else {
      delete (headers as Record<string, string>)['Content-Type'];
    }
    config.headers = headers;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      const originalRequest = error.config as typeof error.config & RetryableRequestConfig;
      const requestUrl = originalRequest?.url ?? '';
      const shouldTryRefresh =
        error.response?.status === 401 &&
        originalRequest != null &&
        !originalRequest._retry &&
        requestUrl.includes('/api/v1/admin/') &&
        !AUTH_ENDPOINTS.some((endpoint) => requestUrl.includes(endpoint));

      if (shouldTryRefresh) {
        originalRequest._retry = true;

        try {
          refreshPromise ??= refreshAdminAccessToken();
          const accessToken = await refreshPromise;
          refreshPromise = null;

          if (accessToken) {
            const headers = originalRequest.headers ?? {};
            headers['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers = headers;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          refreshPromise = null;
          clearAdminAccessToken();
          const normalizedRefreshError =
            refreshError instanceof Error
              ? refreshError
              : new Error('Request failed', { cause: refreshError });
          return Promise.reject(normalizedRefreshError);
        }
      }
    }

    const normalizedError =
      error instanceof Error ? error : new Error('Request failed', { cause: error });
    return Promise.reject(normalizedError);
  },
);

const refreshAdminAccessToken = async (): Promise<string | null> => {
  if (isMockAdminEnabled() && isMockAdminSession()) {
    const accessToken = getAdminAccessToken();
    return accessToken;
  }

  const response = await axios.post<ApiEnvelope<RefreshResponse>>(
    '/api/v1/admin/auth/refresh',
    undefined,
    {
      ...(baseURL ? { baseURL } : {}),
      timeout: 10000,
      withCredentials: true,
    },
  );

  const accessToken = response.data.data.accessToken;
  setAdminAccessToken(accessToken);
  return accessToken;
};

export default axiosInstance;
