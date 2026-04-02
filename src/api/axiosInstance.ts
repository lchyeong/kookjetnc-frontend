import axios from 'axios';

import { env } from '@/config/env';
import { ADMIN_ACCESS_TOKEN_STORAGE_KEY } from '@/features/board/auth';

const baseURL = env.apiBaseUrl;

const axiosInstance = axios.create({
  ...(baseURL ? { baseURL } : {}),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
    if (token) {
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
  (error) => {
    const normalizedError =
      error instanceof Error ? error : new Error('Request failed', { cause: error });
    return Promise.reject(normalizedError);
  },
);

export default axiosInstance;
