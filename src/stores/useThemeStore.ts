import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'agency-starter-theme';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === 'light' || value === 'dark';
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeMode(storedTheme)) {
    return storedTheme;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const persistTheme = (theme: ThemeMode): void => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    persistTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      persistTheme(nextTheme);

      return {
        theme: nextTheme,
      };
    });
  },
}));
