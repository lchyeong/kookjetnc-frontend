import { describe, expect, it } from 'vitest';

import { getDocumentScrollTop, isScrollLockKey } from '@/pages/RootLayout/rootLayoutScrollLock';

describe('rootLayout helpers', () => {
  it('matches the intro scroll lock keys used by the home route', () => {
    expect(isScrollLockKey(' ')).toBe(true);
    expect(isScrollLockKey('ArrowDown')).toBe(true);
    expect(isScrollLockKey('ArrowUp')).toBe(true);
    expect(isScrollLockKey('End')).toBe(true);
    expect(isScrollLockKey('Home')).toBe(true);
    expect(isScrollLockKey('PageDown')).toBe(true);
    expect(isScrollLockKey('PageUp')).toBe(true);
    expect(isScrollLockKey('Spacebar')).toBe(true);
    expect(isScrollLockKey('Enter')).toBe(false);
    expect(isScrollLockKey('Tab')).toBe(false);
  });

  it('reads the active document scroll top from the scrolling element', () => {
    Object.defineProperty(document, 'scrollingElement', {
      configurable: true,
      value: {
        scrollTop: 128,
      },
    });

    expect(getDocumentScrollTop()).toBe(128);
  });
});
