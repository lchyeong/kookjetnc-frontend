export const ADMIN_ACCESS_TOKEN_STORAGE_KEY = 'kookjetnc.admin.accessToken';

export const getAdminAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return window.localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
};

export const setAdminAccessToken = (token: string) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, token);
};

export const clearAdminAccessToken = () => {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
};

export const hasAdminAccessToken = () => {
  return Boolean(getAdminAccessToken());
};
