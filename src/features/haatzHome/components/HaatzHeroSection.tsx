import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
  HERO_INTRO_DOT_CURSOR_BLINK_COUNT,
  HERO_INTRO_DOT_CURSOR_BLINK_CYCLE_MS,
  HERO_INTRO_TYPING_DOT_REVEAL_DELAY_MS,
  HERO_INTRO_TYPING_DURATION_MS,
  HERO_INTRO_TYPING_LINE_PAUSE_MS,
  HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS,
  HERO_INTRO_VIDEO_PREVIEW_START_DELAY_MS,
  getHeroIntroPhases,
  getHeroIntroVisualCompleteDelay,
  HERO_INTRO_UNLOCK_DELAY_MS,
} from '@/features/haatzHome/components/haatzHero';
import {
  useHeroIntroTyping,
  type HeroIntroCursorLine,
} from '@/features/haatzHome/components/useHeroIntroTyping';
import { heroVideoSequence } from '@/features/haatzHome/data';
import { useHaatzHomeUiStore } from '@/stores/useHaatzHomeUiStore';
import { classNames } from '@/utils/classNames';

import styles from './HaatzHeroSection.module.scss';

const INTRO_TOP_TEXT = '냉장·냉동을 넘어';
const INTRO_BOTTOM_TEXT_PREFIX = '지속 가능성으';
const INTRO_BOTTOM_TEXT_TERMINAL = '로';
const INTRO_BOTTOM_TEXT = `${INTRO_BOTTOM_TEXT_PREFIX}${INTRO_BOTTOM_TEXT_TERMINAL}`;
const INTRO_HEADING_LABEL = '냉장·냉동을 넘어 지속 가능성으로';
const HERO_TAGLINE_LINES = ['지속 가능한 엔지니어링으로', '더 시원한 내일을', '만듭니다.'] as const;

const syncHeroVideoPlayback = (
  heroVideo: HTMLVideoElement | null,
  isHeroVideoPlaybackUnlocked: boolean,
) => {
  if (!heroVideo) {
    return;
  }

  if (!isHeroVideoPlaybackUnlocked) {
    heroVideo.pause();

    try {
      heroVideo.currentTime = 0;
    } catch {
      // Some browsers reject currentTime writes before media is seekable.
    }

    return;
  }

  const playbackPromise = heroVideo.play();

  if (playbackPromise && typeof playbackPromise.catch === 'function') {
    void playbackPromise.catch(() => undefined);
  }
};

interface HaatzHeroSectionProps {
  className?: string;
}

const HaatzHeroSection = ({ className }: HaatzHeroSectionProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const introTitleRef = useRef<HTMLHeadingElement | null>(null);
  const introBottomDotAnchorRef = useRef<HTMLSpanElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const isIntroTypingRunningRef = useRef(true);
  const scheduleIntroCircleOriginSyncRef = useRef<() => void>(() => undefined);
  const setIntroPhase = useHaatzHomeUiStore((state) => state.setIntroPhase);
  const [currentHeroVideoIndex, setCurrentHeroVideoIndex] = useState(0);
  const [introCursorLine, setIntroCursorLine] = useState<HeroIntroCursorLine>('hidden');
  const [isIntroDotVisible, setIsIntroDotVisible] = useState(false);
  const [isHeroVideoPreviewVisible, setIsHeroVideoPreviewVisible] = useState(false);
  const [isHeroVideoPlaybackUnlocked, setIsHeroVideoPlaybackUnlocked] = useState(false);
  const currentHeroVideoSrc = heroVideoSequence[currentHeroVideoIndex] ?? heroVideoSequence[0];
  const introDotVisualState = !isIntroDotVisible
    ? 'hidden'
    : isHeroVideoPreviewVisible
      ? 'preview'
      : 'punctuation';

  const handleHeroVideoEnded = () => {
    setCurrentHeroVideoIndex((currentIndex) => {
      return (currentIndex + 1) % heroVideoSequence.length;
    });
  };

  const handleIntroDotReveal = () => {
    setIsIntroDotVisible(true);
  };

  const handleIntroTypingEnd = () => {
    if (!isIntroTypingRunningRef.current) {
      return;
    }

    isIntroTypingRunningRef.current = false;
    rootRef.current?.setAttribute('data-intro-scramble-state', 'complete');
    scheduleIntroCircleOriginSyncRef.current();
  };

  const {
    bottomTextRef: introBottomTextRef,
    replay: replayIntroTyping,
    topTextRef: introTopTextRef,
  } = useHeroIntroTyping({
    bottomText: INTRO_BOTTOM_TEXT,
    dotCursorBlinkCount: HERO_INTRO_DOT_CURSOR_BLINK_COUNT,
    dotCursorBlinkCycleMs: HERO_INTRO_DOT_CURSOR_BLINK_CYCLE_MS,
    dotRevealDelayMs: HERO_INTRO_TYPING_DOT_REVEAL_DELAY_MS,
    linePauseMs: HERO_INTRO_TYPING_LINE_PAUSE_MS,
    onAnimationEnd: handleIntroTypingEnd,
    onCursorLineChange: setIntroCursorLine,
    onDotReveal: handleIntroDotReveal,
    playOnMount: false,
    topText: INTRO_TOP_TEXT,
    totalDurationMs: HERO_INTRO_TYPING_DURATION_MS,
  });

  useEffect(() => {
    syncHeroVideoPlayback(heroVideoRef.current, isHeroVideoPlaybackUnlocked);
  }, [currentHeroVideoSrc, isHeroVideoPlaybackUnlocked]);

  useLayoutEffect(() => {
    const rootElement = rootRef.current;
    const introTitle = introTitleRef.current;
    const introBottomDotAnchor = introBottomDotAnchorRef.current;

    if (!rootElement) {
      return;
    }

    setIntroPhase('active');

    let introLayoutSyncFrame = 0;

    const syncIntroCircleOrigin = () => {
      if (!introBottomDotAnchor) {
        return;
      }

      const rootRect = rootElement.getBoundingClientRect();
      const anchorRect = introBottomDotAnchor.getBoundingClientRect();

      if (
        rootRect.width === 0 ||
        rootRect.height === 0 ||
        anchorRect.width === 0 ||
        anchorRect.height === 0
      ) {
        return;
      }

      const anchorCenterX = anchorRect.left - rootRect.left + anchorRect.width / 2;
      const anchorCenterY = anchorRect.top - rootRect.top + anchorRect.height / 2;

      rootElement.style.setProperty('--intro-circle-origin-left', `${String(anchorCenterX)}px`);
      rootElement.style.setProperty('--intro-circle-origin-top', `${String(anchorCenterY)}px`);
    };

    const syncIntroLayout = () => {
      syncIntroCircleOrigin();
    };

    const scheduleIntroCircleOriginSync = () => {
      if (introLayoutSyncFrame !== 0) {
        window.cancelAnimationFrame(introLayoutSyncFrame);
      }

      introLayoutSyncFrame = window.requestAnimationFrame(() => {
        introLayoutSyncFrame = 0;
        syncIntroLayout();
      });
    };
    scheduleIntroCircleOriginSyncRef.current = scheduleIntroCircleOriginSync;

    syncIntroLayout();
    scheduleIntroCircleOriginSync();

    let hasCompletedIntro = false;

    const completeIntro = () => {
      if (hasCompletedIntro) {
        return;
      }

      hasCompletedIntro = true;
      setIntroPhase('complete');
    };

    const phaseTimers = getHeroIntroPhases().map(({ delay, phase }) => {
      return window.setTimeout(() => {
        rootElement.classList.add(styles[phase]);
      }, delay);
    });

    const unlockTimer = window.setTimeout(() => {
      setIntroPhase('settling');
    }, HERO_INTRO_UNLOCK_DELAY_MS);
    const videoPreviewTimer = window.setTimeout(() => {
      setIsHeroVideoPreviewVisible(true);
    }, HERO_INTRO_VIDEO_PREVIEW_START_DELAY_MS);
    const videoPlaybackTimer = window.setTimeout(() => {
      setIsHeroVideoPlaybackUnlocked(true);
    }, HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS);
    const completeTimer = window.setTimeout(() => {
      completeIntro();
    }, getHeroIntroVisualCompleteDelay(window.innerWidth));

    const handleIntroResize = () => {
      scheduleIntroCircleOriginSync();
    };

    window.addEventListener('resize', handleIntroResize);

    let cleanupIntroTitleResizeObserver = () => undefined;
    if (introTitle && typeof window.ResizeObserver !== 'undefined') {
      const introTitleResizeObserver = new window.ResizeObserver(() => {
        scheduleIntroCircleOriginSync();
      });

      introTitleResizeObserver.observe(introTitle);

      cleanupIntroTitleResizeObserver = () => {
        introTitleResizeObserver.disconnect();
      };
    }

    let shouldSyncAfterFontsReady = true;
    if ('fonts' in document) {
      void document.fonts.ready.then(() => {
        if (!shouldSyncAfterFontsReady) {
          return;
        }

        scheduleIntroCircleOriginSync();
      });
    }

    return () => {
      phaseTimers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      window.removeEventListener('resize', handleIntroResize);
      cleanupIntroTitleResizeObserver();
      scheduleIntroCircleOriginSyncRef.current = () => undefined;
      shouldSyncAfterFontsReady = false;
      if (introLayoutSyncFrame !== 0) {
        window.cancelAnimationFrame(introLayoutSyncFrame);
      }
      window.clearTimeout(videoPreviewTimer);
      window.clearTimeout(videoPlaybackTimer);
      window.clearTimeout(unlockTimer);
      window.clearTimeout(completeTimer);
      rootElement.style.removeProperty('--intro-title-shift-y');
      rootElement.style.removeProperty('--intro-circle-origin-left');
      rootElement.style.removeProperty('--intro-circle-origin-top');
      setIntroPhase('idle');
    };
  }, [setIntroPhase]);

  useEffect(() => {
    const rootElement = rootRef.current;

    if (!rootElement) {
      return;
    }

    isIntroTypingRunningRef.current = true;
    setIntroCursorLine('hidden');
    setIsIntroDotVisible(false);
    setIsHeroVideoPreviewVisible(false);
    setIsHeroVideoPlaybackUnlocked(false);
    rootElement.setAttribute('data-intro-scramble-state', 'running');

    replayIntroTyping();

    return () => {
      isIntroTypingRunningRef.current = false;
      rootElement.removeAttribute('data-intro-scramble-state');
    };
  }, [replayIntroTyping]);

  return (
    <div className={classNames(styles['introCover'], className)}>
      <section
        className={styles['heroSection']}
        data-intro-cursor-line={introCursorLine}
        data-intro-dot-state={isIntroDotVisible ? 'visible' : 'hidden'}
        data-intro-dot-visual={introDotVisualState}
        data-testid='haatz-hero-section'
        ref={rootRef}
      >
        <div className={styles['bx1']} data-testid='intro-copy-screen'>
          <div className={styles['container']}>
            <h1 aria-label={INTRO_HEADING_LABEL} className={styles['bx1Title']} ref={introTitleRef}>
              <span className={styles['introTitleLine']} data-testid='intro-line-top'>
                <span
                  aria-hidden='true'
                  className={styles['introTitleText']}
                  data-cursor-visible={introCursorLine === 'top'}
                  ref={introTopTextRef}
                />
              </span>
              <span className={styles['introTitleLine']} data-testid='intro-line-bottom'>
                <span className={styles['introBottomTextFrame']}>
                  <span
                    aria-hidden='true'
                    className={styles['introTitleText']}
                    data-cursor-visible={introCursorLine === 'bottom'}
                    ref={introBottomTextRef}
                  />
                  <span aria-hidden='true' className={styles['introBottomMeasurement']}>
                    <span className={styles['introBottomPrefix']}>{INTRO_BOTTOM_TEXT_PREFIX}</span>
                    <span className={styles['introBottomTerminalCharacter']}>
                      {INTRO_BOTTOM_TEXT_TERMINAL}
                      <span
                        className={styles['introBottomDotAnchor']}
                        data-testid='intro-horizontal-dot-anchor'
                        ref={introBottomDotAnchorRef}
                      />
                    </span>
                  </span>
                </span>
              </span>
            </h1>
          </div>
        </div>

        <span
          aria-hidden='true'
          className={styles['introDotCursor']}
          data-testid='intro-dot-cursor'
        />

        <div className={styles['bx3']} data-testid='hero-transition-layer'>
          <div className={styles['heroVideoBox']} data-testid='hero-video-box'>
            <video
              className={styles['heroVideo']}
              key={currentHeroVideoSrc}
              muted
              preload='auto'
              playsInline
              ref={heroVideoRef}
              src={currentHeroVideoSrc}
              onLoadedData={() => {
                syncHeroVideoPlayback(heroVideoRef.current, isHeroVideoPlaybackUnlocked);
              }}
              onEnded={handleHeroVideoEnded}
            />
          </div>
        </div>

        <div className={styles['heroTaglineLayer']}>
          <div className={styles['container']}>
            <p className={styles['heroTagline']} data-testid='hero-tagline'>
              {HERO_TAGLINE_LINES.map((line) => {
                return (
                  <span className={styles['heroTaglineLine']} key={line}>
                    {line}
                  </span>
                );
              })}
            </p>
          </div>
        </div>

        <div
          aria-hidden='true'
          className={styles['heroScrollIndicator']}
          data-testid='hero-scroll-indicator'
        >
          <p className={styles['heroScrollLabel']}>Scroll</p>
          <span className={styles['heroScrollMouse']} />
        </div>
      </section>
    </div>
  );
};

export default HaatzHeroSection;
