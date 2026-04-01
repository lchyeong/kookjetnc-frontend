import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type TransitionEvent as ReactTransitionEvent,
} from 'react';

import {
  getHiwinActiveRailTranslateX,
  getHiwinMaxSlideIndex,
  getHiwinTabRailIndices,
} from '@/features/haatzHome/components/hiwinSystem.helpers';
import {
  useHiwinScrollPin,
  type HiwinScrollChangeMode,
} from '@/features/haatzHome/components/useHiwinScrollPin';
import { hiwinSystemSlides } from '@/features/haatzHome/data';
import { classNames } from '@/utils/classNames';

import styles from './HiwinSystemSection.module.scss';

const HIWIN_HEADING_LINES = [
  '국제티엔씨는 비용 절감과 운영 효율을 실현하는',
  '차별화된 솔루션을 제안합니다',
] as const;
const HIWIN_ACTIVE_RAIL_ITEM_WIDTH = 25;
const HIWIN_TRANSITION_DURATION_MS = 720;

type HiwinMotionDirection = 'forward' | 'backward';
type HiwinTransitionPhase = 'prepare' | 'running';
type HiwinSlideChangeSource = 'direct' | 'scroll';

interface HiwinTransitionState {
  direction: HiwinMotionDirection;
  fromIndex: number;
  phase: HiwinTransitionPhase;
  source: HiwinSlideChangeSource;
  toIndex: number;
}

interface HiwinTransitionCompletionState {
  image: boolean;
  text: boolean;
}

const HIWIN_DESCRIPTION_LINE_COUNT_PROPERTY = '--hiwin-description-line-count' as const;

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const splitLines = (value: string) => {
  return value.split('\n');
};

const getHiwinMotionDirection = (fromIndex: number, toIndex: number): HiwinMotionDirection => {
  return toIndex >= fromIndex ? 'forward' : 'backward';
};

const getHiwinDescriptionWindowStyle = (
  currentLineCount: number,
  incomingLineCount: number,
): CSSProperties => {
  return {
    [HIWIN_DESCRIPTION_LINE_COUNT_PROPERTY]: String(
      Math.max(currentLineCount, incomingLineCount, 1),
    ),
  } as CSSProperties;
};

const getHiwinMotionDuration = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return HIWIN_TRANSITION_DURATION_MS;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : HIWIN_TRANSITION_DURATION_MS;
};

const handlePlaceholderLinkClick = (
  event: MouseEvent<HTMLAnchorElement>,
  isPlaceholder?: boolean,
) => {
  if (!isPlaceholder) {
    return;
  }

  event.preventDefault();
};

const ViewMoreArrowIcon = () => {
  return (
    <svg
      aria-hidden='true'
      fill='none'
      height='21'
      viewBox='0 0 29 21'
      width='29'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M28 10.4141H2' stroke='currentColor' strokeLinecap='round' strokeWidth='2' />
      <path
        d='M19 1.41406L28 10.4141L19 19.4141'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </svg>
  );
};

const renderDescriptionLines = (lines: string[], lineClassName: string) => {
  return lines.map((line, index) => {
    return (
      <span className={lineClassName} key={`${line}-${String(index)}`}>
        {line}
      </span>
    );
  });
};

const HiwinMotionTitleSlot = ({
  currentValue,
  incomingValue,
}: {
  currentValue: string;
  incomingValue: string;
}) => {
  return (
    <span className={styles['motionTitleWindow']}>
      <span
        className={classNames(
          styles['motionSlotValue'],
          styles['motionSlotCurrent'],
          styles['motionTitleValue'],
        )}
      >
        {currentValue}
      </span>
      <span
        className={classNames(
          styles['motionSlotValue'],
          styles['motionSlotIncoming'],
          styles['motionTitleValue'],
        )}
      >
        {incomingValue}
      </span>
    </span>
  );
};

const HiwinMotionDescriptionSlot = ({
  currentLines,
  incomingLines,
  onIncomingTransitionEnd,
}: {
  currentLines: string[];
  incomingLines: string[];
  onIncomingTransitionEnd?: (event: ReactTransitionEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className={styles['motionDescriptionWindow']}
      style={getHiwinDescriptionWindowStyle(currentLines.length, incomingLines.length)}
    >
      <div
        className={classNames(
          styles['motionSlotValue'],
          styles['motionSlotCurrent'],
          styles['motionDescriptionBlock'],
        )}
      >
        {renderDescriptionLines(currentLines, styles['motionDescriptionLine'])}
      </div>
      <div
        className={classNames(
          styles['motionSlotValue'],
          styles['motionSlotIncoming'],
          styles['motionDescriptionBlock'],
        )}
        data-testid='hiwin-system-incoming-text-slot'
        onTransitionEnd={onIncomingTransitionEnd}
      >
        {renderDescriptionLines(incomingLines, styles['motionDescriptionLine'])}
      </div>
    </div>
  );
};

const HiwinSlideImage = ({
  desktopImageSrc,
  mobileImageSrc,
  mediaTestId,
  onMediaTransitionEnd,
}: {
  desktopImageSrc: string;
  mobileImageSrc: string;
  mediaTestId?: string;
  onMediaTransitionEnd?: (event: ReactTransitionEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className={styles['imageMedia']}
      data-testid={mediaTestId}
      onTransitionEnd={onMediaTransitionEnd}
    >
      <img alt='' className={styles['desktopImage']} draggable='false' src={desktopImageSrc} />
      <img alt='' className={styles['mobileImage']} draggable='false' src={mobileImageSrc} />
    </div>
  );
};

const HiwinCtaSlides = () => {
  return (
    <ul className={styles['ctaSlides']}>
      <li className={classNames(styles['ctaSlide'], styles['ctaSlidePrimary'])}>
        <span className={styles['ctaIcon']}>
          <ViewMoreArrowIcon />
        </span>
      </li>
      <li className={classNames(styles['ctaSlide'], styles['ctaSlideSecondary'])}>
        <span className={styles['ctaLabel']}>VIEW MORE</span>
      </li>
    </ul>
  );
};

const HiwinTextCardDescription = ({
  lines,
  lineClassName,
}: {
  lines: string[];
  lineClassName: string;
}) => {
  return <>{renderDescriptionLines(lines, lineClassName)}</>;
};

const HiwinTextCopy = ({
  descriptionClassName,
  descriptionLines,
  descriptionLineClassName,
  title,
  titleClassName,
}: {
  descriptionClassName: string;
  descriptionLineClassName: string;
  descriptionLines: string[];
  title: string;
  titleClassName: string;
}) => {
  return (
    <>
      <h3 className={titleClassName}>{title}</h3>
      <p className={descriptionClassName}>
        <HiwinTextCardDescription
          lineClassName={descriptionLineClassName}
          lines={descriptionLines}
        />
      </p>
    </>
  );
};

export const HiwinSystemHeadingSection = () => {
  return (
    <div className={styles['heading']} data-testid='hiwin-system-heading'>
      <p className={styles['eyebrow']}>Solution</p>
      <h2 className={styles['title']}>
        {HIWIN_HEADING_LINES.map((line) => {
          return (
            <span className={styles['titleLine']} key={line}>
              {line}
            </span>
          );
        })}
      </h2>
    </div>
  );
};

const HiwinSystemSection = () => {
  const [committedIndex, setCommittedIndex] = useState(0);
  const [transition, setTransition] = useState<HiwinTransitionState | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const committedIndexRef = useRef(0);
  const queuedIndexRef = useRef<number | null>(null);
  const scrollSyncTimerRef = useRef(0);
  const scrollToSlideRef = useRef<(index: number) => void>(() => undefined);
  const transitionTimerRef = useRef(0);
  const prepareFrameRef = useRef(0);
  const runningFrameRef = useRef(0);
  const transitionRef = useRef<HiwinTransitionState | null>(null);
  const transitionCompletionRef = useRef<HiwinTransitionCompletionState>({
    image: false,
    text: false,
  });
  const finishTransitionRef = useRef<(resolvedTransition: HiwinTransitionState) => void>(
    () => undefined,
  );
  const slideCount = hiwinSystemSlides.length;
  const visibleTabCount = Math.max(0, slideCount - 1);
  const maxSlideIndex = getHiwinMaxSlideIndex(slideCount);
  const tabRailIndices = getHiwinTabRailIndices(slideCount);

  const updateCommittedIndex = useCallback((nextIndex: number) => {
    committedIndexRef.current = nextIndex;
    setCommittedIndex(nextIndex);
  }, []);

  const updateTransitionState = useCallback((nextTransition: HiwinTransitionState | null) => {
    transitionRef.current = nextTransition;
    setTransition(nextTransition);
  }, []);

  const clearTransitionFrames = useCallback(() => {
    if (prepareFrameRef.current !== 0) {
      window.cancelAnimationFrame(prepareFrameRef.current);
      prepareFrameRef.current = 0;
    }

    if (runningFrameRef.current !== 0) {
      window.cancelAnimationFrame(runningFrameRef.current);
      runningFrameRef.current = 0;
    }
  }, []);

  const clearTransitionTimer = useCallback(() => {
    window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = 0;
  }, []);

  const resetTransitionCompletion = useCallback(() => {
    transitionCompletionRef.current = {
      image: false,
      text: false,
    };
  }, []);

  const startTransition = useCallback(
    (nextIndex: number, source: HiwinSlideChangeSource = 'direct') => {
      const fromIndex = committedIndexRef.current;
      const transitionDuration = getHiwinMotionDuration();

      if (transitionDuration === 0) {
        updateCommittedIndex(nextIndex);
        updateTransitionState(null);

        if (source === 'scroll') {
          scrollToSlideRef.current(nextIndex);
        }

        return;
      }

      clearTransitionFrames();
      clearTransitionTimer();
      resetTransitionCompletion();

      updateTransitionState({
        direction: getHiwinMotionDirection(fromIndex, nextIndex),
        fromIndex,
        phase: 'prepare',
        source,
        toIndex: nextIndex,
      });
    },
    [
      clearTransitionFrames,
      clearTransitionTimer,
      resetTransitionCompletion,
      updateCommittedIndex,
      updateTransitionState,
    ],
  );

  const finishTransition = useCallback(
    (resolvedTransition: HiwinTransitionState) => {
      const activeTransition = transitionRef.current;
      if (
        !activeTransition ||
        activeTransition.phase !== 'running' ||
        activeTransition.fromIndex !== resolvedTransition.fromIndex ||
        activeTransition.toIndex !== resolvedTransition.toIndex
      ) {
        return;
      }

      clearTransitionFrames();
      clearTransitionTimer();
      resetTransitionCompletion();
      updateCommittedIndex(resolvedTransition.toIndex);
      updateTransitionState(null);

      if (resolvedTransition.source === 'scroll') {
        scrollToSlideRef.current(resolvedTransition.toIndex);
      }

      const queuedIndex = queuedIndexRef.current;
      queuedIndexRef.current = null;

      if (queuedIndex === null || queuedIndex === resolvedTransition.toIndex) {
        return;
      }

      clearTransitionFrames();
      clearTransitionTimer();
      startTransition(queuedIndex, 'direct');
    },
    [
      clearTransitionFrames,
      clearTransitionTimer,
      startTransition,
      updateCommittedIndex,
      updateTransitionState,
      resetTransitionCompletion,
    ],
  );

  const markTransitionSignalComplete = useCallback(
    (key: keyof HiwinTransitionCompletionState) => {
      const activeTransition = transitionRef.current;
      if (!activeTransition || activeTransition.phase !== 'running') {
        return;
      }

      const nextCompletion = {
        ...transitionCompletionRef.current,
        [key]: true,
      };
      transitionCompletionRef.current = nextCompletion;

      if (nextCompletion.image && nextCompletion.text) {
        finishTransition(activeTransition);
      }
    },
    [finishTransition],
  );

  const handleIncomingImageTransitionEnd = useCallback(
    (event: ReactTransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget || event.propertyName !== 'transform') {
        return;
      }

      const activeTransition = transitionRef.current;
      if (!activeTransition || activeTransition.phase !== 'running') {
        return;
      }

      markTransitionSignalComplete('image');
    },
    [markTransitionSignalComplete],
  );

  const handleIncomingTextTransitionEnd = useCallback(
    (event: ReactTransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget || event.propertyName !== 'transform') {
        return;
      }

      const activeTransition = transitionRef.current;
      if (!activeTransition || activeTransition.phase !== 'running') {
        return;
      }

      markTransitionSignalComplete('text');
    },
    [markTransitionSignalComplete],
  );

  const requestSlideChange = useCallback(
    (nextIndex: number, source: HiwinSlideChangeSource = 'direct') => {
      const clampedIndex = clamp(nextIndex, 0, maxSlideIndex);
      const activeTransition = transitionRef.current;

      if (activeTransition) {
        if (clampedIndex === activeTransition.toIndex) {
          return;
        }

        if (source === 'scroll') {
          return;
        }

        queuedIndexRef.current = clampedIndex;
        return;
      }

      if (clampedIndex === committedIndexRef.current) {
        return;
      }

      startTransition(clampedIndex, source);
    },
    [maxSlideIndex, startTransition],
  );

  const syncToSlide = useCallback(
    (nextIndex: number) => {
      const clampedIndex = clamp(nextIndex, 0, maxSlideIndex);

      clearTransitionFrames();
      clearTransitionTimer();
      queuedIndexRef.current = null;
      resetTransitionCompletion();
      updateTransitionState(null);
      updateCommittedIndex(clampedIndex);
    },
    [
      clearTransitionFrames,
      clearTransitionTimer,
      maxSlideIndex,
      resetTransitionCompletion,
      updateCommittedIndex,
      updateTransitionState,
    ],
  );

  const handleScrollSlideChange = useCallback(
    (index: number, mode: HiwinScrollChangeMode) => {
      if (mode === 'sync') {
        syncToSlide(index);
        return;
      }

      requestSlideChange(index, 'scroll');
    },
    [requestSlideChange, syncToSlide],
  );

  const isTransitioning = transition !== null;

  const { scrollToSlide } = useHiwinScrollPin({
    currentIndex: committedIndex,
    isTransitioning,
    onSlideChange: handleScrollSlideChange,
    slideCount,
    trackRef,
  });

  useEffect(() => {
    scrollToSlideRef.current = scrollToSlide;
  }, [scrollToSlide]);

  useEffect(() => {
    return () => {
      window.clearTimeout(scrollSyncTimerRef.current);
      clearTransitionFrames();
      clearTransitionTimer();
      resetTransitionCompletion();
    };
  }, [clearTransitionFrames, clearTransitionTimer, resetTransitionCompletion]);

  useEffect(() => {
    if (!transition || transition.phase !== 'prepare') {
      return;
    }

    prepareFrameRef.current = window.requestAnimationFrame(() => {
      prepareFrameRef.current = 0;
      runningFrameRef.current = window.requestAnimationFrame(() => {
        runningFrameRef.current = 0;

        const activeTransition = transitionRef.current;
        if (
          !activeTransition ||
          activeTransition.phase !== 'prepare' ||
          activeTransition.fromIndex !== transition.fromIndex ||
          activeTransition.toIndex !== transition.toIndex
        ) {
          return;
        }

        updateTransitionState({
          ...activeTransition,
          phase: 'running',
        });
      });
    });

    return () => {
      clearTransitionFrames();
    };
  }, [clearTransitionFrames, transition, updateTransitionState]);

  useEffect(() => {
    if (!transition || transition.phase !== 'running') {
      return;
    }

    clearTransitionTimer();
    transitionTimerRef.current = window.setTimeout(() => {
      finishTransitionRef.current(transition);
    }, getHiwinMotionDuration());

    return () => {
      clearTransitionTimer();
    };
  }, [clearTransitionTimer, transition]);

  const phase = transition?.phase ?? 'idle';
  const visualIndex = transition?.phase === 'running' ? transition.toIndex : committedIndex;
  const currentSlide = hiwinSystemSlides[committedIndex];
  const currentDescriptionLines = splitLines(currentSlide.description);
  const nextSlideIndex = transition?.toIndex ?? committedIndex;
  const nextSlide = transition ? hiwinSystemSlides[transition.toIndex] : null;
  const nextDescriptionLines = nextSlide ? splitLines(nextSlide.description) : [];
  const motionDirection = transition?.direction ?? 'forward';

  const rootStyle = {
    '--hiwin-active-rail-offset': `${String(
      getHiwinActiveRailTranslateX(visualIndex, HIWIN_ACTIVE_RAIL_ITEM_WIDTH, slideCount),
    )}px`,
    '--hiwin-slide-count': String(slideCount),
    '--hiwin-tab-track-shift': String(visualIndex),
    '--hiwin-visible-tab-count': String(visibleTabCount),
  } as CSSProperties;

  const handleTabSelect = (index: number) => {
    const clampedIndex = clamp(index, 0, maxSlideIndex);

    requestSlideChange(clampedIndex, 'direct');
    window.clearTimeout(scrollSyncTimerRef.current);
    scrollSyncTimerRef.current = window.setTimeout(() => {
      scrollToSlide(clampedIndex);
    }, 0);
  };

  useEffect(() => {
    finishTransitionRef.current = finishTransition;
  }, [finishTransition]);

  return (
    <div
      className={styles['root']}
      data-motion-direction={motionDirection}
      data-transition-phase={phase}
      style={rootStyle}
    >
      <div className={styles['track']} data-testid='hiwin-system-track' ref={trackRef}>
        <div className={styles['viewport']} data-testid='hiwin-system-viewport'>
          <div
            className={styles['stage']}
            data-motion-direction={motionDirection}
            data-testid='hiwin-system-section'
            data-transition-phase={phase}
          >
            <div aria-hidden='true' className={styles['imageWrap']}>
              <ul className={styles['imageList']} data-testid='hiwin-system-image-list'>
                <li
                  className={classNames(styles['imageItem'], styles['imageItemCurrent'])}
                  data-slide-id={currentSlide.id}
                  data-slide-index={committedIndex}
                  data-slide-state={isTransitioning ? 'outgoing' : 'current'}
                >
                  <HiwinSlideImage
                    desktopImageSrc={currentSlide.desktopImageSrc}
                    mobileImageSrc={currentSlide.mobileImageSrc}
                  />
                </li>
                {nextSlide ? (
                  <li
                    className={classNames(styles['imageItem'], styles['imageItemIncoming'])}
                    data-slide-id={nextSlide.id}
                    data-slide-index={nextSlideIndex}
                    data-slide-state='incoming'
                  >
                    <HiwinSlideImage
                      desktopImageSrc={nextSlide.desktopImageSrc}
                      mediaTestId='hiwin-system-incoming-image-media'
                      mobileImageSrc={nextSlide.mobileImageSrc}
                      onMediaTransitionEnd={handleIncomingImageTransitionEnd}
                    />
                  </li>
                ) : null}
              </ul>
            </div>

            <div
              aria-hidden='true'
              className={styles['activeRail']}
              data-testid='hiwin-system-active-rail'
            >
              <div className={styles['activeRailWindow']}>
                <ul
                  className={styles['activeRailTrack']}
                  data-testid='hiwin-system-active-rail-track'
                >
                  {hiwinSystemSlides.map((item) => {
                    return (
                      <li className={styles['activeRailItem']} key={`${item.id}-active-label`}>
                        {item.activeLabel}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className={styles['tabRail']} data-testid='hiwin-system-tab-rail'>
              <div className={styles['tabRailWindow']}>
                <ul className={styles['tabRailTrack']} data-testid='hiwin-system-tab-rail-track'>
                  {tabRailIndices.map((slideIndex, trackIndex) => {
                    const slide = hiwinSystemSlides[slideIndex];
                    const isVisible =
                      trackIndex >= visualIndex && trackIndex < visualIndex + visibleTabCount;

                    return (
                      <li
                        aria-hidden={!isVisible}
                        className={styles['tabRailItem']}
                        data-tab-state={isVisible ? 'visible' : 'hidden'}
                        key={`${slide.id}-${String(trackIndex)}`}
                      >
                        <button
                          className={styles['tabButton']}
                          data-slide-index={slideIndex}
                          onClick={() => {
                            handleTabSelect(slideIndex);
                          }}
                          tabIndex={isVisible ? 0 : -1}
                          type='button'
                        >
                          {slide.tabLabel}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className={styles['textWrap']} data-testid='hiwin-system-text-wrap'>
              <div className={styles['textList']}>
                <div className={styles['textContentLayer']}>
                  <article
                    aria-hidden='false'
                    className={classNames(styles['textCard'], styles['textCardAccessible'])}
                    data-slide-id={currentSlide.id}
                    data-text-state='accessible'
                  >
                    <HiwinTextCopy
                      descriptionClassName={styles['textDescription']}
                      descriptionLineClassName={styles['descriptionLine']}
                      descriptionLines={currentDescriptionLines}
                      title={currentSlide.title}
                      titleClassName={styles['textTitle']}
                    />
                  </article>

                  {!transition ? (
                    <article
                      aria-hidden='true'
                      className={classNames(styles['textCard'], styles['textCardVisual'])}
                      data-slide-id={currentSlide.id}
                      data-testid='hiwin-system-text-static'
                      data-text-state='static'
                      data-text-visual-state='static'
                    >
                      <HiwinTextCopy
                        descriptionClassName={styles['textDescription']}
                        descriptionLineClassName={styles['descriptionLine']}
                        descriptionLines={currentDescriptionLines}
                        title={currentSlide.title}
                        titleClassName={styles['textTitle']}
                      />
                    </article>
                  ) : null}

                  {transition && nextSlide ? (
                    <article
                      aria-hidden='true'
                      className={classNames(styles['textCard'], styles['textCardVisual'])}
                      data-slide-from={currentSlide.id}
                      data-slide-to={nextSlide.id}
                      data-testid='hiwin-system-text-motion'
                      data-text-state='motion'
                      data-text-visual-state='motion'
                    >
                      <h3 className={styles['textMotionTitle']} aria-hidden='true'>
                        <HiwinMotionTitleSlot
                          currentValue={currentSlide.title}
                          incomingValue={nextSlide.title}
                        />
                      </h3>
                      <div className={styles['textMotionDescription']} aria-hidden='true'>
                        <HiwinMotionDescriptionSlot
                          currentLines={currentDescriptionLines}
                          incomingLines={nextDescriptionLines}
                          onIncomingTransitionEnd={handleIncomingTextTransitionEnd}
                        />
                      </div>
                    </article>
                  ) : null}
                </div>

                <div className={classNames(styles['cta'], isTransitioning && styles['ctaPending'])}>
                  <a
                    aria-disabled={currentSlide.isPlaceholder || undefined}
                    className={styles['ctaLink']}
                    href={currentSlide.href}
                    onClick={(event) => {
                      handlePlaceholderLinkClick(event, currentSlide.isPlaceholder);
                    }}
                    rel={currentSlide.target === '_blank' ? 'noreferrer' : undefined}
                    tabIndex={isTransitioning ? -1 : undefined}
                    target={currentSlide.target}
                  >
                    <HiwinCtaSlides />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiwinSystemSection;
