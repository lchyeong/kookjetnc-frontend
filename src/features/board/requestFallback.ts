interface ReadFallbackOptions<T> {
  apiRequest: () => Promise<T>;
  fallbackRequest: () => Promise<T>;
  label: string;
  useMock: boolean;
}

export const withBoardReadFallback = async <T>({
  apiRequest,
  fallbackRequest,
  label,
  useMock,
}: ReadFallbackOptions<T>): Promise<T> => {
  if (useMock) {
    return fallbackRequest();
  }

  try {
    return await apiRequest();
  } catch (error) {
    if (__DEV__) {
      console.warn(`[board] ${label} request failed. Falling back to mock data.`, error);
    }

    return fallbackRequest();
  }
};
