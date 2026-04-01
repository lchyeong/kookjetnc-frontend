import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  getHiwinMaxSlideIndex,
  getHiwinScrollSegmentCount,
} from '@/features/haatzHome/components/hiwinSystem.helpers';
import { getDocumentScrollTop, isScrollLockKey } from '@/pages/RootLayout/rootLayoutScrollLock';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_PIN_ANTICIPATE = 1;
const RESIZE_DEBOUNCE_MS = 200;
const DEFAULT_HEADER_HEIGHT = 90;
const WHEEL_GESTURE_RELEASE_MS = 180;
const SCROLL_PIN_EXIT_MARGIN_PX = 12;
const OBSERVER_TOLERANCE_PX = 16;
const OBSERVER_DRAG_MINIMUM_PX = 36;

type HiwinScrollStepDirection = -1 | 1;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const SCROLL_PIN_RANGE_TOLERANCE_PX = 1;

const getHeaderHeight = (element: HTMLElement | null): number => {
  if (!element) {
    return DEFAULT_HEADER_HEIGHT;
  }

  const value = getComputedStyle(element).getPropertyValue('--hiwin-header-height');

  return parseInt(value, 10) || DEFAULT_HEADER_HEIGHT;
};

interface UseHiwinScrollPinOptions {
  currentIndex: number;
  isTransitioning: boolean;
  onSlideChange: (index: number, mode: HiwinScrollChangeMode) => void;
  slideCount: number;
  trackRef: RefObject<HTMLDivElement | null>;
}

interface UseHiwinScrollPinResult {
  scrollToSlide: (index: number) => void;
}

export type HiwinScrollChangeMode = 'animate' | 'sync';

export const useHiwinScrollPin = ({
  currentIndex,
  isTransitioning,
  onSlideChange,
  slideCount,
  trackRef,
}: UseHiwinScrollPinOptions): UseHiwinScrollPinResult => {
  const currentIndexRef = useRef(currentIndex);
  const isTransitioningRef = useRef(isTransitioning);
  const onSlideChangeRef = useRef(onSlideChange);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const observerRef = useRef<ReturnType<typeof ScrollTrigger.observe> | null>(null);
  const isScrollPinActiveRef = useRef(false);
  const isGestureLockedRef = useRef(false);
  const pendingUnlockAfterTransitionRef = useRef(false);
  const lastRequestedScrollDirectionRef = useRef<HiwinScrollStepDirection | null>(null);
  const lastRequestedScrollIndexRef = useRef<number | null>(null);
  const boundaryExitBlockDirectionRef = useRef<HiwinScrollStepDirection | null>(null);
  const boundaryExitReadyRef = useRef(false);
  const maxIndex = getHiwinMaxSlideIndex(slideCount);
  const segmentCount = getHiwinScrollSegmentCount(slideCount);

  useLayoutEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useLayoutEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  useLayoutEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  const clearBoundaryExitGate = useCallback(() => {
    boundaryExitBlockDirectionRef.current = null;
    boundaryExitReadyRef.current = false;
  }, []);

  const setWindowScrollTop = useCallback((top: number) => {
    const normalizedTop = Math.max(0, Math.round(top));
    const scrollingElement = document.scrollingElement;

    if (scrollingElement) {
      scrollingElement.scrollTop = normalizedTop;
    }

    window.scrollTo({ top: normalizedTop, behavior: 'instant' });
  }, []);

  const getSlideScrollTop = useCallback(
    (index: number) => {
      const st = scrollTriggerRef.current;

      if (!st) {
        return null;
      }

      return st.start + clamp(index, 0, maxIndex) * window.innerHeight;
    },
    [maxIndex],
  );

  const scrollToSlide = useCallback(
    (index: number) => {
      const targetTop = getSlideScrollTop(index);

      if (targetTop === null) {
        return;
      }

      setWindowScrollTop(targetTop);
    },
    [getSlideScrollTop, setWindowScrollTop],
  );

  const clearGestureLock = useCallback(() => {
    pendingUnlockAfterTransitionRef.current = false;
    isGestureLockedRef.current = false;
  }, []);

  const requestGestureUnlock = useCallback(() => {
    if (!isGestureLockedRef.current) {
      return;
    }

    if (isTransitioningRef.current) {
      pendingUnlockAfterTransitionRef.current = true;
      return;
    }

    if (boundaryExitBlockDirectionRef.current !== null) {
      boundaryExitReadyRef.current = true;
    }

    clearGestureLock();
  }, [clearGestureLock]);

  const syncActiveSlide = useCallback(
    (index: number) => {
      currentIndexRef.current = index;
      lastRequestedScrollDirectionRef.current = null;
      lastRequestedScrollIndexRef.current = null;
      clearBoundaryExitGate();
      onSlideChangeRef.current(index, 'sync');
      scrollToSlide(index);
    },
    [clearBoundaryExitGate, scrollToSlide],
  );

  const getPinnedRangeState = useCallback(() => {
    const st = scrollTriggerRef.current;

    if (!st) {
      isScrollPinActiveRef.current = false;

      return {
        currentScrollTop: 0,
        isPinnedRangeActive: false,
        scrollTrigger: null,
      };
    }

    const currentScrollTop = getDocumentScrollTop();
    const isWithinPinnedRange =
      currentScrollTop >= st.start - SCROLL_PIN_RANGE_TOLERANCE_PX &&
      currentScrollTop <= st.end + SCROLL_PIN_RANGE_TOLERANCE_PX;

    if (isWithinPinnedRange) {
      isScrollPinActiveRef.current = true;
    }

    return {
      currentScrollTop,
      isPinnedRangeActive: isScrollPinActiveRef.current || isWithinPinnedRange,
      isWithinPinnedRange,
      scrollTrigger: st,
    };
  }, []);

  const scrollPastPinnedBoundary = useCallback(
    (direction: HiwinScrollStepDirection) => {
      const st = scrollTriggerRef.current;

      if (!st) {
        return;
      }

      const boundaryTop =
        direction > 0 ? st.end + 2 : Math.floor(st.start) - SCROLL_PIN_EXIT_MARGIN_PX;

      lastRequestedScrollDirectionRef.current = null;
      lastRequestedScrollIndexRef.current = null;
      clearBoundaryExitGate();
      isScrollPinActiveRef.current = false;
      observerRef.current?.disable();
      clearGestureLock();

      setWindowScrollTop(boundaryTop);
    },
    [clearBoundaryExitGate, clearGestureLock, setWindowScrollTop],
  );

  const isBoundaryExitBlocked = useCallback(
    (direction: HiwinScrollStepDirection, activeIndex: number) => {
      const blockDirection = boundaryExitBlockDirectionRef.current;

      if (blockDirection !== direction || boundaryExitReadyRef.current) {
        return false;
      }

      if (direction < 0) {
        return activeIndex <= 0;
      }

      return activeIndex >= maxIndex;
    },
    [maxIndex],
  );

  const requestStepChange = useCallback(
    (direction: HiwinScrollStepDirection) => {
      const { isPinnedRangeActive, scrollTrigger: st } = getPinnedRangeState();

      if (!st) {
        return false;
      }

      if (!isPinnedRangeActive) {
        return false;
      }

      if (isTransitioningRef.current) {
        return false;
      }

      const activeIndex = currentIndexRef.current;

      if (direction > 0) {
        if (activeIndex >= maxIndex) {
          if (isBoundaryExitBlocked(1, activeIndex)) {
            return true;
          }

          scrollPastPinnedBoundary(1);
          return true;
        }

        const nextIndex = activeIndex + 1;
        lastRequestedScrollDirectionRef.current = 1;
        lastRequestedScrollIndexRef.current = nextIndex;
        clearBoundaryExitGate();
        onSlideChangeRef.current(nextIndex, 'animate');
        return true;
      }

      if (activeIndex <= 0) {
        if (isBoundaryExitBlocked(-1, activeIndex)) {
          return true;
        }

        scrollPastPinnedBoundary(-1);
        return true;
      }

      const nextIndex = activeIndex - 1;
      lastRequestedScrollDirectionRef.current = -1;
      lastRequestedScrollIndexRef.current = nextIndex;
      clearBoundaryExitGate();
      onSlideChangeRef.current(nextIndex, 'animate');
      return true;
    },
    [
      clearBoundaryExitGate,
      getPinnedRangeState,
      isBoundaryExitBlocked,
      maxIndex,
      scrollPastPinnedBoundary,
    ],
  );

  const isPinnedInputActive = useCallback(() => {
    const { isPinnedRangeActive } = getPinnedRangeState();

    return isPinnedRangeActive;
  }, [getPinnedRangeState]);

  const handleObservedStep = useCallback(
    (direction: HiwinScrollStepDirection) => {
      if (isGestureLockedRef.current) {
        return;
      }

      const handled = requestStepChange(direction);

      if (!handled) {
        return;
      }

      isGestureLockedRef.current = true;
    },
    [requestStepChange],
  );

  useLayoutEffect(() => {
    if (isTransitioning) {
      return;
    }

    const requestedIndex = lastRequestedScrollIndexRef.current;
    const requestedDirection = lastRequestedScrollDirectionRef.current;

    if (requestedIndex === null || requestedDirection === null) {
      return;
    }

    const reachedBoundary =
      (requestedDirection < 0 && currentIndex === 0 && requestedIndex === 0) ||
      (requestedDirection > 0 && currentIndex === maxIndex && requestedIndex === maxIndex);

    if (reachedBoundary) {
      boundaryExitBlockDirectionRef.current = requestedDirection;
      boundaryExitReadyRef.current = false;
    } else {
      clearBoundaryExitGate();
    }

    lastRequestedScrollDirectionRef.current = null;
    lastRequestedScrollIndexRef.current = null;
  }, [clearBoundaryExitGate, currentIndex, isTransitioning, maxIndex]);

  useLayoutEffect(() => {
    if (!isTransitioning && pendingUnlockAfterTransitionRef.current) {
      clearGestureLock();
    }
  }, [clearGestureLock, isTransitioning]);

  useLayoutEffect(() => {
    const track = trackRef.current;

    if (!track || maxIndex === 0) {
      return;
    }

    const headerHeight = getHeaderHeight(track.closest('[class*="root"]') as HTMLElement);

    const st = ScrollTrigger.create({
      anticipatePin: SCROLL_PIN_ANTICIPATE,
      end: `+=${String(segmentCount * window.innerHeight)}`,
      invalidateOnRefresh: true,
      onEnter: () => {
        syncActiveSlide(0);
      },
      onEnterBack: () => {
        syncActiveSlide(maxIndex);
      },
      onToggle: (self) => {
        isScrollPinActiveRef.current = self.isActive;

        if (self.isActive) {
          clearGestureLock();
          observerRef.current?.enable();
          return;
        }

        observerRef.current?.disable();
        clearBoundaryExitGate();
        clearGestureLock();
      },
      pin: true,
      start: `top ${String(headerHeight)}`,
      trigger: track,
    });

    scrollTriggerRef.current = st;

    const observer = ScrollTrigger.observe({
      dragMinimum: OBSERVER_DRAG_MINIMUM_PX,
      lockAxis: true,
      onDown: () => {
        handleObservedStep(1);
      },
      onStop: () => {
        requestGestureUnlock();
      },
      onStopDelay: WHEEL_GESTURE_RELEASE_MS / 1000,
      onUp: () => {
        handleObservedStep(-1);
      },
      preventDefault: true,
      target: window,
      tolerance: OBSERVER_TOLERANCE_PX,
      type: 'wheel,touch,pointer',
    });

    observer.disable();
    observerRef.current = observer;

    let resizeTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();

        if (isScrollPinActiveRef.current) {
          scrollToSlide(currentIndexRef.current);
        }
      }, RESIZE_DEBOUNCE_MS);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPinnedInputActive() || !isScrollLockKey(event.key)) {
        return;
      }

      event.preventDefault();

      if (isTransitioningRef.current) {
        return;
      }

      if (event.key === 'Home') {
        syncActiveSlide(0);
        return;
      }

      if (event.key === 'End') {
        syncActiveSlide(maxIndex);
        return;
      }

      requestStepChange(event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      clearGestureLock();
      clearTimeout(resizeTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      clearBoundaryExitGate();
      isScrollPinActiveRef.current = false;
      observer.kill();
      observerRef.current = null;
      st.kill();
      scrollTriggerRef.current = null;
    };
  }, [
    clearGestureLock,
    clearBoundaryExitGate,
    handleObservedStep,
    maxIndex,
    requestStepChange,
    requestGestureUnlock,
    scrollToSlide,
    segmentCount,
    syncActiveSlide,
    trackRef,
    isPinnedInputActive,
  ]);

  return { scrollToSlide };
};
