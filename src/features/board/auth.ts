import {
  ADMIN_ACCESS_TOKEN_STORAGE_KEY,
  useAdminAuthStore,
} from '@/stores/useAdminAuthStore';

export { ADMIN_ACCESS_TOKEN_STORAGE_KEY };

export const MOCK_ADMIN_ACCESS_TOKEN = 'mock-admin-access-token';

export const isMockAdminEnabled = () => {
  return import.meta.env.VITE_ENABLE_MOCK === 'true';
};

export const getAdminAccessToken = (): string | null => {
  return useAdminAuthStore.getState().accessToken;
};

export const setAdminAccessToken = (token: string) => {
  useAdminAuthStore.getState().setAccessToken(token);
};

export const setMockAdminAccessToken = () => {
  setAdminAccessToken(MOCK_ADMIN_ACCESS_TOKEN);
};

export const clearAdminAccessToken = () => {
  useAdminAuthStore.getState().clearSession();
};

export const hasAdminAccessToken = () => {
  return useAdminAuthStore.getState().hasSession();
};

export const isMockAdminSession = () => {
  return getAdminAccessToken() === MOCK_ADMIN_ACCESS_TOKEN;
};
