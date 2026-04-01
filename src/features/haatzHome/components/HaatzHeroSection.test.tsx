import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import HaatzHeroSection from '@/features/haatzHome/components/HaatzHeroSection';
import {
  HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS,
  HERO_INTRO_VIDEO_PREVIEW_START_DELAY_MS,
} from '@/features/haatzHome/components/haatzHero';
import { heroVideoSequence } from '@/features/haatzHome/data';

const { latestHeroIntroTypingOptionsRef, replayMock, setIntroPhaseMock } = vi.hoisted(() => {
  return {
    latestHeroIntroTypingOptionsRef: { current: null as null | Record<string, unknown> },
    replayMock: vi.fn(),
    setIntroPhaseMock: vi.fn(),
  };
});

vi.mock('@/features/haatzHome/components/useHeroIntroTyping', () => {
  return {
    useHeroIntroTyping: (options: Record<string, unknown>) => {
      latestHeroIntroTypingOptionsRef.current = options;

      return {
        bottomTextRef: { current: null },
        replay: replayMock,
        topTextRef: { current: null },
      };
    },
  };
});

vi.mock('@/stores/useHaatzHomeUiStore', () => {
  return {
    useHaatzHomeUiStore: (
      selector: (state: { setIntroPhase: typeof setIntroPhaseMock }) => unknown,
    ) => {
      return selector({
        setIntroPhase: setIntroPhaseMock,
      });
    },
  };
});

const getHeroVideo = () => {
  const video = screen.getByTestId('hero-video-box').querySelector('video');

  expect(video).not.toBeNull();

  return video as HTMLVideoElement;
};

const triggerIntroDotReveal = () => {
  const onDotReveal = latestHeroIntroTypingOptionsRef.current?.['onDotReveal'];

  if (typeof onDotReveal !== 'function') {
    throw new Error('onDotReveal 콜백을 찾을 수 없습니다.');
  }

  onDotReveal();
};

describe('HaatzHeroSection', () => {
  const playMock = vi.fn(() => Promise.resolve());
  const pauseMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    replayMock.mockClear();
    setIntroPhaseMock.mockClear();
    playMock.mockClear();
    pauseMock.mockClear();
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(playMock);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pauseMock);

    class ResizeObserverMock {
      disconnect() {}
      observe() {}
      unobserve() {}
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('plays the three hero videos in sequence and restarts from the first clip', () => {
    render(<HaatzHeroSection />);

    expect(getHeroVideo().getAttribute('src')).toBe(heroVideoSequence[0]);

    fireEvent.ended(getHeroVideo());
    expect(getHeroVideo().getAttribute('src')).toBe(heroVideoSequence[1]);

    fireEvent.ended(getHeroVideo());
    expect(getHeroVideo().getAttribute('src')).toBe(heroVideoSequence[2]);

    fireEvent.ended(getHeroVideo());
    expect(getHeroVideo().getAttribute('src')).toBe(heroVideoSequence[0]);
  });

  it('keeps the dot as a white punctuation mark, then reveals the first frame shortly before the expand phase', async () => {
    render(<HaatzHeroSection />);

    const video = getHeroVideo();
    const heroSection = screen.getByTestId('haatz-hero-section');

    expect(video.autoplay).toBe(false);
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('preload', 'auto');
    expect(video).not.toHaveAttribute('loop');
    expect(heroSection).toHaveAttribute('data-intro-dot-visual', 'hidden');
    expect(playMock).not.toHaveBeenCalled();
    expect(pauseMock).toHaveBeenCalled();

    act(() => {
      triggerIntroDotReveal();
    });

    expect(heroSection).toHaveAttribute('data-intro-dot-state', 'visible');
    expect(heroSection).toHaveAttribute('data-intro-dot-visual', 'punctuation');

    await act(async () => {
      vi.advanceTimersByTime(HERO_INTRO_VIDEO_PREVIEW_START_DELAY_MS);
      await Promise.resolve();
    });

    expect(heroSection).toHaveAttribute('data-intro-dot-visual', 'preview');
    expect(playMock).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(
        HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS - HERO_INTRO_VIDEO_PREVIEW_START_DELAY_MS,
      );
      await Promise.resolve();
    });

    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it('restarts playback when the next hero clip mounts after the intro expand phase', async () => {
    render(<HaatzHeroSection />);

    await act(async () => {
      vi.advanceTimersByTime(HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS);
      await Promise.resolve();
    });

    playMock.mockClear();

    await act(async () => {
      fireEvent.ended(getHeroVideo());
      await Promise.resolve();
    });

    expect(getHeroVideo().getAttribute('src')).toBe(heroVideoSequence[1]);
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it('starts with the intro cursor hidden and the transition dot invisible', () => {
    render(<HaatzHeroSection />);

    expect(screen.getByTestId('haatz-hero-section')).toHaveAttribute(
      'data-intro-cursor-line',
      'hidden',
    );
    expect(screen.getByTestId('haatz-hero-section')).toHaveAttribute(
      'data-intro-dot-state',
      'hidden',
    );
    expect(screen.getByTestId('haatz-hero-section')).toHaveAttribute(
      'data-intro-dot-visual',
      'hidden',
    );
    expect(replayMock).toHaveBeenCalledTimes(1);
  });
});
