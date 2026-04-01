import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const HIWIN_FRAME_STEP_MS = 16;
const HIWIN_TRANSITION_DURATION_MS = 720;
const HIWIN_WHEEL_GESTURE_RELEASE_MS = 180;

const {
  gsapRegisterPluginMock,
  scrollTriggerCreateMock,
  scrollTriggerKillMock,
  scrollTriggerObserveMock,
} = vi.hoisted(() => {
  const stKillMock = vi.fn();

  return {
    gsapRegisterPluginMock: vi.fn(),
    scrollTriggerCreateMock: vi.fn().mockReturnValue({
      end: 4300,
      isActive: false,
      kill: stKillMock,
      start: 0,
    }),
    scrollTriggerKillMock: stKillMock,
    scrollTriggerObserveMock: vi.fn(),
  };
});

vi.mock('gsap', () => {
  return {
    gsap: {
      registerPlugin: gsapRegisterPluginMock,
    },
  };
});

vi.mock('gsap/ScrollTrigger', () => {
  return {
    ScrollTrigger: {
      create: scrollTriggerCreateMock,
      observe: scrollTriggerObserveMock,
      refresh: vi.fn(),
    },
  };
});

import {
  getHiwinActiveRailTranslateX,
  getHiwinSlideIndexFromScrollProgress,
} from '@/features/haatzHome/components/hiwinSystem.helpers';
import HiwinSystemSection, {
  HiwinSystemHeadingSection,
} from '@/features/haatzHome/components/HiwinSystemSection';

const advanceTransitionToRunning = () => {
  act(() => {
    vi.advanceTimersByTime(HIWIN_FRAME_STEP_MS * 2 + 1);
  });
};

const completeIncomingImageTransition = () => {
  act(() => {
    fireEvent.transitionEnd(screen.getByTestId('hiwin-system-incoming-image-media'), {
      propertyName: 'transform',
    });
  });
};

const completeIncomingTextTransition = () => {
  act(() => {
    fireEvent.transitionEnd(screen.getByTestId('hiwin-system-incoming-text-slot'), {
      propertyName: 'transform',
    });
  });
};

const completeMotionTransitions = () => {
  completeIncomingImageTransition();
  completeIncomingTextTransition();
};

const advanceTransitionToIdle = () => {
  advanceTransitionToRunning();
  completeMotionTransitions();
};

const getScrollTriggerConfig = () => {
  return scrollTriggerCreateMock.mock.calls[0]?.[0] as
    | {
        onEnter?: () => void;
        onEnterBack?: () => void;
        onToggle?: (self: { isActive: boolean }) => void;
      }
    | undefined;
};

const activatePinnedSection = (entry: 'top' | 'bottom' = 'top') => {
  const scrollTriggerConfig = getScrollTriggerConfig();

  act(() => {
    scrollTriggerConfig?.onToggle?.({ isActive: true });

    if (entry === 'bottom') {
      scrollTriggerConfig?.onEnterBack?.();
      return;
    }

    scrollTriggerConfig?.onEnter?.();
  });

  return scrollTriggerConfig;
};

describe('HiwinSystemSection', () => {
  beforeEach(() => {
    gsapRegisterPluginMock.mockClear();
    scrollTriggerCreateMock.mockClear();
    scrollTriggerKillMock.mockClear();
    scrollTriggerObserveMock.mockReset();
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
      writable: true,
    });
    window.scrollTo = vi.fn() as typeof window.scrollTo;
    window.requestAnimationFrame = vi.fn().mockImplementation((callback: FrameRequestCallback) => {
      return window.setTimeout(() => {
        callback(Date.now());
      }, HIWIN_FRAME_STEP_MS);
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = vi.fn().mockImplementation((handle: number) => {
      window.clearTimeout(handle);
    }) as typeof window.cancelAnimationFrame;
    window.matchMedia = vi.fn().mockImplementation(() => {
      return {
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        matches: false,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      };
    });
    scrollTriggerObserveMock.mockImplementation(
      (vars: {
        onDown?: () => void;
        onStop?: () => void;
        onStopDelay?: number;
        onUp?: () => void;
        preventDefault?: boolean;
        target?: Window;
      }) => {
        let enabled = true;
        let stopTimer = 0;
        const target = vars.target ?? window;
        const clearStopTimer = () => {
          window.clearTimeout(stopTimer);
          stopTimer = 0;
        };

        const scheduleStop = () => {
          if (!vars.onStop) {
            return;
          }

          clearStopTimer();
          stopTimer = window.setTimeout(
            () => {
              vars.onStop?.();
            },
            Math.round((vars.onStopDelay ?? 0.25) * 1000),
          );
        };

        const handleWheel = (event: WheelEvent) => {
          if (!enabled) {
            return;
          }

          if (vars.preventDefault && event.cancelable) {
            event.preventDefault();
          }

          if (event.deltaY === 0) {
            return;
          }

          if (event.deltaY > 0) {
            vars.onDown?.();
          } else {
            vars.onUp?.();
          }

          scheduleStop();
        };

        const enable = () => {
          if (enabled) {
            return;
          }

          target.addEventListener('wheel', handleWheel as EventListener, { passive: false });
          enabled = true;
        };

        const disable = () => {
          if (!enabled) {
            clearStopTimer();
            return;
          }

          target.removeEventListener('wheel', handleWheel as EventListener);
          enabled = false;
          clearStopTimer();
        };

        target.addEventListener('wheel', handleWheel as EventListener, { passive: false });

        const observer = {
          disable: vi.fn(() => {
            disable();
          }),
          enable: vi.fn(() => {
            enable();
            return observer;
          }),
          kill: vi.fn(() => {
            disable();
          }),
        };

        return observer;
      },
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the initial active slide content and visible next labels', () => {
    render(<HiwinSystemSection />);

    expect(
      screen.getByRole('heading', { level: 3, name: '기계설비 종합 엔지니어링' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'HVAC Engineering',
      'Energy Optimization',
      'Fire Safety System',
    ]);
    expect(
      screen.getByTestId('hiwin-system-image-list').querySelector('[data-slide-state="current"]'),
    ).toHaveAttribute('data-slide-id', 'mechanical-engineering');
    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'idle',
    );
    expect(screen.getByTestId('hiwin-system-text-static')).toHaveAttribute(
      'data-text-visual-state',
      'static',
    );
    expect(screen.queryByTestId('hiwin-system-text-motion')).not.toBeInTheDocument();
  });

  it('mounts the transition in prepare first and then runs the forward motion', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    fireEvent.click(screen.getByRole('button', { name: 'HVAC Engineering' }));

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'prepare',
    );
    expect(
      screen.getByTestId('hiwin-system-image-list').querySelector('[data-slide-state="incoming"]'),
    ).toHaveAttribute('data-slide-id', 'hvac-system');
    expect(screen.getByTestId('hiwin-system-text-motion')).toHaveAttribute(
      'data-slide-to',
      'hvac-system',
    );

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'instant', top: 1000 });

    advanceTransitionToRunning();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'running',
    );
    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-motion-direction',
      'forward',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '기계설비 종합 엔지니어링' }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('hiwin-system-image-list').querySelector('[data-slide-state="outgoing"]'),
    ).toHaveAttribute('data-slide-id', 'mechanical-engineering');
    expect(screen.queryByTestId('hiwin-system-text-static')).not.toBeInTheDocument();
    expect(screen.getByTestId('hiwin-system-text-motion')).toHaveAttribute(
      'data-text-visual-state',
      'motion',
    );

    completeIncomingImageTransition();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'running',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '기계설비 종합 엔지니어링' }),
    ).toBeInTheDocument();

    completeIncomingTextTransition();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'idle',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '공조설비 시스템 엔지니어링' }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('hiwin-system-image-list').querySelector('[data-slide-state="current"]'),
    ).toHaveAttribute('data-slide-id', 'hvac-system');
    expect(screen.getByTestId('hiwin-system-text-static')).toHaveAttribute(
      'data-slide-id',
      'hvac-system',
    );
  });

  it('queues the latest target while the current transition is in progress', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    fireEvent.click(screen.getByRole('button', { name: 'HVAC Engineering' }));
    fireEvent.click(screen.getByRole('button', { name: 'Energy Optimization' }));

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'instant', top: 2000 });

    advanceTransitionToRunning();
    expect(screen.getByTestId('hiwin-system-text-motion')).toHaveAttribute(
      'data-slide-to',
      'hvac-system',
    );

    completeMotionTransitions();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'prepare',
    );
    expect(screen.getByTestId('hiwin-system-text-motion')).toHaveAttribute(
      'data-slide-to',
      'energy-saving',
    );

    advanceTransitionToRunning();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'running',
    );
    expect(screen.getByTestId('hiwin-system-text-motion')).toHaveAttribute(
      'data-slide-to',
      'energy-saving',
    );

    completeMotionTransitions();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'idle',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '에너지 최적화 솔루션' }),
    ).toBeInTheDocument();
  });

  it('runs the backward-direction motion when moving back to a previous slide', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    fireEvent.click(screen.getByRole('button', { name: 'HVAC Engineering' }));
    advanceTransitionToIdle();

    fireEvent.click(screen.getByRole('button', { name: 'Mechanical Engineering' }));

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'prepare',
    );
    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-motion-direction',
      'backward',
    );

    advanceTransitionToRunning();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'running',
    );
    expect(
      screen.getByTestId('hiwin-system-image-list').querySelector('[data-slide-state="incoming"]'),
    ).toHaveAttribute('data-slide-id', 'mechanical-engineering');

    completeMotionTransitions();

    expect(
      screen.getByRole('heading', { level: 3, name: '기계설비 종합 엔지니어링' }),
    ).toBeInTheDocument();
  });

  it('advances one slide at a time from wheel input while the section is pinned', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    activatePinnedSection();
    fireEvent.wheel(window, { deltaY: 120 });

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'prepare',
    );
    expect(screen.getByTestId('hiwin-system-text-motion')).toHaveAttribute(
      'data-slide-to',
      'hvac-system',
    );
    expect(window.scrollTo).not.toHaveBeenCalledWith({ behavior: 'instant', top: 1000 });

    advanceTransitionToRunning();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'running',
    );

    completeMotionTransitions();

    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 1000 });

    expect(
      screen.getByRole('heading', { level: 3, name: '공조설비 시스템 엔지니어링' }),
    ).toBeInTheDocument();
  });

  it('ignores wheel input until the current slide animation is fully finished', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    activatePinnedSection();
    fireEvent.wheel(window, { deltaY: 120 });
    advanceTransitionToRunning();

    fireEvent.wheel(window, { deltaY: 120 });
    fireEvent.wheel(window, { deltaY: 120 });

    completeMotionTransitions();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'idle',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '공조설비 시스템 엔지니어링' }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    fireEvent.wheel(window, { deltaY: 120 });

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'prepare',
    );
    expect(screen.getByTestId('hiwin-system-text-motion')).toHaveAttribute(
      'data-slide-to',
      'energy-saving',
    );
  });

  it('does not queue wheel input that arrives after the gesture timeout while animation is still running', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    activatePinnedSection();
    fireEvent.wheel(window, { deltaY: 120 });
    advanceTransitionToRunning();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    fireEvent.wheel(window, { deltaY: 120 });

    completeMotionTransitions();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'idle',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '공조설비 시스템 엔지니어링' }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('hiwin-system-text-motion')).not.toBeInTheDocument();
  });

  it('exits the pinned range after the last slide receives a new downward wheel gesture', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    activatePinnedSection('bottom');

    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'instant', top: 3000 });
    fireEvent.wheel(window, { deltaY: 120 });

    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 4302 });
  });

  it('exits the pinned range after the first slide receives a new upward wheel gesture', () => {
    scrollTriggerCreateMock.mockReturnValueOnce({
      end: 5429,
      isActive: false,
      kill: scrollTriggerKillMock,
      start: 1129.75,
    });

    render(<HiwinSystemSection />);

    activatePinnedSection();

    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'instant', top: 1130 });

    fireEvent.wheel(window, { deltaY: -120 });

    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 1117 });
  });

  it('does not keep intercepting upward wheel input after the first slide exits the pinned range', () => {
    scrollTriggerCreateMock.mockReturnValueOnce({
      end: 5429,
      isActive: false,
      kill: scrollTriggerKillMock,
      start: 1129.75,
    });

    render(<HiwinSystemSection />);

    activatePinnedSection();
    fireEvent.wheel(window, { deltaY: -120 });

    const scrollToCallCount = vi.mocked(window.scrollTo).mock.calls.length;

    fireEvent.wheel(window, { deltaY: -120 });

    expect(window.scrollTo).toHaveBeenCalledTimes(scrollToCallCount);
  });

  it('falls back to duration-based commit if transitionend does not fire', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    fireEvent.click(screen.getByRole('button', { name: 'HVAC Engineering' }));
    advanceTransitionToRunning();

    act(() => {
      vi.advanceTimersByTime(HIWIN_TRANSITION_DURATION_MS + 1);
    });

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'idle',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '공조설비 시스템 엔지니어링' }),
    ).toBeInTheDocument();
  });

  it('keeps the live text visible until the text slot motion also completes', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    fireEvent.click(screen.getByRole('button', { name: 'HVAC Engineering' }));
    advanceTransitionToRunning();

    completeIncomingImageTransition();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'running',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '기계설비 종합 엔지니어링' }),
    ).toBeInTheDocument();

    completeIncomingTextTransition();

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'idle',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '공조설비 시스템 엔지니어링' }),
    ).toBeInTheDocument();
  });

  it('keeps the last slide when re-entering the pinned section from below', () => {
    vi.useFakeTimers();
    render(<HiwinSystemSection />);

    fireEvent.click(screen.getByRole('button', { name: 'Fire Safety System' }));
    advanceTransitionToIdle();

    const scrollTriggerConfig = scrollTriggerCreateMock.mock.calls[0]?.[0] as
      | {
          onEnterBack?: () => void;
        }
      | undefined;

    act(() => {
      scrollTriggerConfig?.onEnterBack?.();
    });

    expect(screen.getByTestId('hiwin-system-section')).toHaveAttribute(
      'data-transition-phase',
      'idle',
    );
    expect(
      screen.getByRole('heading', { level: 3, name: '화재예방 안전 솔루션' }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('hiwin-system-image-list').querySelector('[data-slide-state="current"]'),
    ).toHaveAttribute('data-slide-id', 'fire-prevention');
  });

  it('reaches the mechanical slide before exiting upward after re-entering from below', () => {
    vi.useFakeTimers();
    scrollTriggerCreateMock.mockReturnValueOnce({
      end: 5429,
      isActive: false,
      kill: scrollTriggerKillMock,
      start: 1129.75,
    });

    render(<HiwinSystemSection />);

    activatePinnedSection('bottom');
    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 4130 });

    fireEvent.wheel(window, { deltaY: -120 });
    advanceTransitionToIdle();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 3130 });
    expect(
      screen.getByRole('heading', { level: 3, name: '에너지 최적화 솔루션' }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    fireEvent.wheel(window, { deltaY: -120 });
    advanceTransitionToIdle();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 2130 });
    expect(
      screen.getByRole('heading', { level: 3, name: '공조설비 시스템 엔지니어링' }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    fireEvent.wheel(window, { deltaY: -120 });
    advanceTransitionToIdle();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 1130 });
    expect(
      screen.getByRole('heading', { level: 3, name: '기계설비 종합 엔지니어링' }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    fireEvent.wheel(window, { deltaY: -120 });
    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 1117 });
  });

  it('does not exit upward immediately when a fast wheel burst reaches the mechanical slide', () => {
    vi.useFakeTimers();
    scrollTriggerCreateMock.mockReturnValueOnce({
      end: 5429,
      isActive: false,
      kill: scrollTriggerKillMock,
      start: 1129.75,
    });

    render(<HiwinSystemSection />);

    activatePinnedSection('bottom');

    fireEvent.wheel(window, { deltaY: -120 });
    advanceTransitionToIdle();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    fireEvent.wheel(window, { deltaY: -120 });
    advanceTransitionToIdle();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    fireEvent.wheel(window, { deltaY: -120 });
    advanceTransitionToRunning();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    completeMotionTransitions();

    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 1130 });
    expect(
      screen.getByRole('heading', { level: 3, name: '기계설비 종합 엔지니어링' }),
    ).toBeInTheDocument();

    const scrollToCallCount = vi.mocked(window.scrollTo).mock.calls.length;

    fireEvent.wheel(window, { deltaY: -120 });

    expect(window.scrollTo).toHaveBeenCalledTimes(scrollToCallCount);
    expect(
      screen.getByRole('heading', { level: 3, name: '기계설비 종합 엔지니어링' }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(HIWIN_WHEEL_GESTURE_RELEASE_MS + 1);
    });

    fireEvent.wheel(window, { deltaY: -120 });

    expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'instant', top: 1117 });
  });

  it('does not rely on a body class toggle while the section is pinned', () => {
    render(<HiwinSystemSection />);

    activatePinnedSection();
    expect(document.body).not.toHaveClass('haatz-hiwin-pinned');

    act(() => {
      getScrollTriggerConfig()?.onToggle?.({ isActive: false });
    });

    expect(document.body).not.toHaveClass('haatz-hiwin-pinned');
  });

  it('keeps the active rail aligned to exact item widths', () => {
    expect(getHiwinActiveRailTranslateX(0, 25, 4)).toBe(0);
    expect(getHiwinActiveRailTranslateX(1, 25, 4)).toBe(-25);
    expect(getHiwinActiveRailTranslateX(2, 25, 4)).toBe(-50);
    expect(getHiwinActiveRailTranslateX(3, 25, 4)).toBe(-75);
  });

  it('maps scroll progress to slide segments like the source site', () => {
    expect(getHiwinSlideIndexFromScrollProgress(0, 4)).toBe(0);
    expect(getHiwinSlideIndexFromScrollProgress(0.22, 4)).toBe(0);
    expect(getHiwinSlideIndexFromScrollProgress(0.24, 4)).toBe(1);
    expect(getHiwinSlideIndexFromScrollProgress(0.47, 4)).toBe(2);
    expect(getHiwinSlideIndexFromScrollProgress(0.7, 4)).toBe(3);
    expect(getHiwinSlideIndexFromScrollProgress(1, 4)).toBe(3);
  });

  it('registers a ScrollTrigger instance with step-based pinning on mount', () => {
    render(<HiwinSystemSection />);
    const scrollTriggerConfig = scrollTriggerCreateMock.mock.calls[0]?.[0] as
      | {
          pin?: boolean;
          snap?: unknown;
        }
      | undefined;

    expect(scrollTriggerConfig).toMatchObject({
      pin: true,
    });
    expect(scrollTriggerConfig?.snap).toBeUndefined();
  });

  it('cleans up ScrollTrigger and timers on unmount', () => {
    const { unmount } = render(<HiwinSystemSection />);

    unmount();
    expect(scrollTriggerKillMock).toHaveBeenCalled();
  });
});

describe('HiwinSystemHeadingSection', () => {
  it('renders the two-line solution heading', () => {
    render(<HiwinSystemHeadingSection />);

    expect(screen.getByText('Solution')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /국제티엔씨는 비용 절감과 운영 효율을 실현하는\s*차별화된 솔루션을 제안합니다/,
      }),
    ).toBeInTheDocument();
  });
});
