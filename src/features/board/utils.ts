import { ApiError } from '@/api/errors';

export const formatPublishedDate = (value: string): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const formatFileSize = (value: number): string => {
  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (value >= 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${value} B`;
};

export const toDatetimeLocalValue = (value: string): string => {
  if (!value) return '';

  return value.slice(0, 16);
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = '요청을 처리하지 못했습니다.',
): string => {
  if (error instanceof ApiError) return error.userMessage;
  if (error instanceof Error) return error.message;

  return fallback;
};

export const isUnauthorizedError = (error: unknown): boolean => {
  return error instanceof ApiError && error.status === 401;
};
