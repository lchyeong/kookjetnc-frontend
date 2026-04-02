import type { AxiosRequestConfig } from 'axios';

import axiosInstance from '@/api/axiosInstance';
import { ApiError, toApiError } from '@/api/errors';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  } | null;
}

const isApiEnvelope = <T>(value: unknown): value is ApiEnvelope<T> => {
  if (!value || typeof value !== 'object') return false;

  return 'success' in value && 'data' in value;
};

const unwrapApiEnvelope = <T>(value: T | ApiEnvelope<T>): T => {
  if (!isApiEnvelope<T>(value)) return value;

  if (!value.success) {
    throw new ApiError({
      userMessage: value.error?.message ?? '요청에 실패했습니다.',
      status: null,
      cause: value,
    });
  }

  return value.data;
};

export const http = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.get<T | ApiEnvelope<T>>(url, config);
      return unwrapApiEnvelope(response.data);
    } catch (error: unknown) {
      throw toApiError(error);
    }
  },
  post: async <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.post<T | ApiEnvelope<T>>(url, body, config);
      return unwrapApiEnvelope(response.data);
    } catch (error: unknown) {
      throw toApiError(error);
    }
  },
  put: async <T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.put<T | ApiEnvelope<T>>(url, body, config);
      return unwrapApiEnvelope(response.data);
    } catch (error: unknown) {
      throw toApiError(error);
    }
  },
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = await axiosInstance.delete<T | ApiEnvelope<T>>(url, config);
      return unwrapApiEnvelope(response.data);
    } catch (error: unknown) {
      throw toApiError(error);
    }
  },
};
