import { create } from 'zustand';

export const ADMIN_ACCESS_TOKEN_STORAGE_KEY = 'kookjetnc.admin.accessToken';

interface AdminAuthState {
  accessToken: string | null;
  clearSession: () => void;
  hasSession: () => boolean;
  setAccessToken: (accessToken: string) => void;
}

const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
};

const persistAccessToken = (accessToken: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (accessToken) {
    window.localStorage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, accessToken);
    return;
  }

  window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY);
};

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  accessToken: getStoredAccessToken(),
  clearSession: () => {
    persistAccessToken(null);
    set({ accessToken: null });
  },
  hasSession: () => {
    return Boolean(get().accessToken);
  },
  setAccessToken: (accessToken) => {
    persistAccessToken(accessToken);
    set({ accessToken });
  },
}));
