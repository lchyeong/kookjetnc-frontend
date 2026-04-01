const SCROLL_LOCK_KEYS = new Set([
  ' ',
  'ArrowDown',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
  'Spacebar',
]);

export const isScrollLockKey = (key: string) => {
  return SCROLL_LOCK_KEYS.has(key);
};

export const getDocumentScrollTop = () => {
  if (typeof document === 'undefined') return 0;

  const scrollingElement = document.scrollingElement;
  return scrollingElement ? scrollingElement.scrollTop : window.scrollY;
};

export const restoreDocumentScrollTop = (scrollTop: number) => {
  if (typeof document === 'undefined') return;

  const scrollingElement = document.scrollingElement;

  if (scrollingElement) {
    scrollingElement.scrollTop = scrollTop;
  }

  window.scrollTo(0, scrollTop);
};
