import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, NavigationType, useNavigationType } from 'react-router-dom';

import homeIcon from '@/assets/icons/icon_home.svg';
import ChevronDownIcon from '@/components/ui/icons/ChevronDownIcon';
import {
  getHistoryDecadeMarker,
  historyDecadeMarkers,
  historyEntries,
  historyHeroContent,
  historyInitialYear,
  historySecondarySubNavLinks,
  historyTimelineBackgroundSrc,
} from '@/features/aboutHistory/data';
import type { HistorySubNavLink } from '@/features/aboutHistory/types';
import { restoreDocumentScrollTop } from '@/pages/RootLayout/rootLayoutScrollLock';
import { routePaths } from '@/routes/routeRegistry';
import { classNames } from '@/utils/classNames';

import styles from './AboutHistory.module.scss';

gsap.registerPlugin(ScrollTrigger);

const HERO_COLOR_CHANGE_PROGRESS = 0.6;
const HERO_OVERLAY_MAX_OPACITY = 0.28;
const HERO_OVERLAY_START_PROGRESS = 0.45;
const HERO_REVEAL_DISTANCE = 20;
const RAIL_REVEAL_DISTANCE_PERCENT = 100;
const REVEAL_DURATION_SECONDS = 1;
const RAIL_REVEAL_START = 'top 80%';
const TIMELINE_REVEAL_START = 'top 85%';
const HISTORY_INITIAL_DECADE_KEY = getHistoryDecadeMarker(historyInitialYear).key;
const SECONDARY_SUB_NAV_DRAWER_ID = 'about-history-subnav-drawer-secondary';

interface GsapAnimationHandle {
  kill?: () => void;
}

const clampNumber = (value: number) => {
  return Math.min(Math.max(value, 0), 1);
};

const getHeroOverlayOpacity = (progress: number) => {
  const normalizedProgress =
    (progress - HERO_OVERLAY_START_PROGRESS) / (1 - HERO_OVERLAY_START_PROGRESS);

  return clampNumber(normalizedProgress) * HERO_OVERLAY_MAX_OPACITY;
};

const setHeroOverlayOpacity = (element: HTMLElement | null, opacity: number) => {
  if (!element) {
    return;
  }

  element.style.setProperty(
    '--about-history-hero-overlay-opacity',
    clampNumber(opacity).toFixed(3),
  );
};

const toggleHeroColorState = (element: HTMLElement | null, isActive: boolean) => {
  if (!element) {
    return;
  }

  element.classList.toggle(styles['heroColorChange'], isActive);
  element.setAttribute('data-hero-color-change', isActive ? 'true' : 'false');
};

const handlePlaceholderLinkClick = (
  event: ReactMouseEvent<HTMLAnchorElement>,
  isPlaceholder?: boolean,
) => {
  if (!isPlaceholder) {
    return;
  }

  event.preventDefault();
};

const AboutHistory = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroInnerRef = useRef<HTMLDivElement | null>(null);
  const heroBackgroundRef = useRef<HTMLDivElement | null>(null);
  const secondaryDropdownRef = useRef<HTMLDivElement | null>(null);
  const heroEyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroDescriptionRef = useRef<HTMLParagraphElement | null>(null);
  const timelineSectionRef = useRef<HTMLElement | null>(null);
  const timelineInnerRef = useRef<HTMLDivElement | null>(null);
  const yearRailInnerRef = useRef<HTMLDivElement | null>(null);
  const yearValueRef = useRef<HTMLSpanElement | null>(null);
  const decadeRailInnerRef = useRef<HTMLDivElement | null>(null);
  const decadeItemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const entryRefs = useRef<Array<HTMLLIElement | null>>([]);
  const navigationType = useNavigationType();
  const [currentYear, setCurrentYear] = useState(historyInitialYear);
  const [activeDecadeKey, setActiveDecadeKey] = useState(HISTORY_INITIAL_DECADE_KEY);
  const [isSecondaryDropdownOpen, setIsSecondaryDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isSecondaryDropdownOpen) {
      return;
    }

    const handlePointerDown = (event: globalThis.MouseEvent | TouchEvent) => {
      const eventTarget = event.target;

      if (!(eventTarget instanceof Node)) {
        return;
      }

      if (secondaryDropdownRef.current?.contains(eventTarget)) {
        return;
      }

      setIsSecondaryDropdownOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSecondaryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSecondaryDropdownOpen]);

  useLayoutEffect(() => {
    const heroSectionElement = heroSectionRef.current;
    const animationHandles: GsapAnimationHandle[] = [];
    const media = gsap.matchMedia();
    const shouldResetScroll = navigationType !== NavigationType.Pop;
    let settleScrollFrame = 0;

    // ScrollTrigger keeps a global scroll cache that can outlive the previous route.
    ScrollTrigger.clearScrollMemory();
    if (shouldResetScroll) {
      restoreDocumentScrollTop(0);
    }

    toggleHeroColorState(heroSectionElement, false);
    setHeroOverlayOpacity(heroSectionElement, 0);

    const registerAnimation = (animation: GsapAnimationHandle | undefined) => {
      if (!animation) {
        return;
      }

      animationHandles.push(animation);
    };

    const animateReveal = (
      element: Element | null,
      fromVars: Record<string, number>,
      toVars: Record<string, unknown>,
    ) => {
      if (!element) {
        return;
      }

      registerAnimation(
        gsap.fromTo(element, fromVars, {
          duration: REVEAL_DURATION_SECONDS,
          ease: 'power2.out',
          ...toVars,
        }) as GsapAnimationHandle,
      );
    };

    animateReveal(
      heroEyebrowRef.current,
      { opacity: 0, y: HERO_REVEAL_DISTANCE },
      { delay: 0, opacity: 1, y: 0 },
    );
    animateReveal(
      heroTitleRef.current,
      { opacity: 0, y: HERO_REVEAL_DISTANCE },
      { delay: 0.1, opacity: 1, y: 0 },
    );
    animateReveal(
      heroDescriptionRef.current,
      { opacity: 0, y: HERO_REVEAL_DISTANCE },
      { delay: 0.2, opacity: 1, y: 0 },
    );
    animateReveal(
      yearRailInnerRef.current,
      { opacity: 0, xPercent: -RAIL_REVEAL_DISTANCE_PERCENT },
      {
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: RAIL_REVEAL_START,
          trigger: timelineInnerRef.current,
        },
        xPercent: 0,
      },
    );
    animateReveal(
      decadeRailInnerRef.current,
      { opacity: 0, xPercent: RAIL_REVEAL_DISTANCE_PERCENT },
      {
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: RAIL_REVEAL_START,
          trigger: timelineInnerRef.current,
        },
        xPercent: 0,
      },
    );

    entryRefs.current.forEach((entryElement) => {
      animateReveal(
        entryElement,
        { opacity: 0, y: HERO_REVEAL_DISTANCE },
        {
          opacity: 1,
          scrollTrigger: {
            once: true,
            start: TIMELINE_REVEAL_START,
            trigger: entryElement,
          },
          y: 0,
        },
      );
    });

    media.add('(min-width: 1025px)', () => {
      const heroBackgroundElement = heroBackgroundRef.current;
      const heroInnerElement = heroInnerRef.current;

      if (heroBackgroundElement && heroInnerElement) {
        registerAnimation(
          gsap.fromTo(
            heroBackgroundElement,
            {
              maxHeight: '35%',
              maxWidth: '72.9166%',
            },
            {
              ease: 'none',
              maxHeight: '100%',
              maxWidth: '100%',
              scrollTrigger: {
                end: '150% 0%',
                onUpdate: (self) => {
                  setHeroOverlayOpacity(heroSectionElement, getHeroOverlayOpacity(self.progress));
                  toggleHeroColorState(
                    heroSectionElement,
                    self.progress >= HERO_COLOR_CHANGE_PROGRESS,
                  );
                },
                scrub: true,
                start: '0px 0%',
                trigger: heroInnerElement,
              },
            },
          ) as GsapAnimationHandle,
        );
      }

      if (heroSectionElement) {
        registerAnimation(
          gsap.to(heroSectionElement, {
            scrollTrigger: {
              end: '180% 0%',
              pin: true,
              scrub: true,
              start: '0px 0%',
              trigger: heroSectionElement,
            },
          }) as GsapAnimationHandle,
        );
      }

      return () => {
        setHeroOverlayOpacity(heroSectionElement, 0);
        toggleHeroColorState(heroSectionElement, false);
      };
    });

    if (shouldResetScroll) {
      settleScrollFrame = window.requestAnimationFrame(() => {
        settleScrollFrame = 0;
        ScrollTrigger.clearScrollMemory();
        restoreDocumentScrollTop(0);
      });
    }

    return () => {
      if (settleScrollFrame !== 0) {
        window.cancelAnimationFrame(settleScrollFrame);
      }
      animationHandles.forEach((animation) => {
        animation.kill?.();
      });
      media.revert();
      setHeroOverlayOpacity(heroSectionElement, 0);
      toggleHeroColorState(heroSectionElement, false);
    };
  }, [navigationType]);

  useLayoutEffect(() => {
    const updateYear = (year: number) => {
      const nextDecade = getHistoryDecadeMarker(year);

      setCurrentYear(year);
      setActiveDecadeKey(nextDecade.key);

      if (yearValueRef.current) {
        yearValueRef.current.textContent = String(year);
      }

      decadeItemRefs.current.forEach((item, index) => {
        if (!item) {
          return;
        }

        const marker = historyDecadeMarkers[index];
        const isActive = marker.key === nextDecade.key;

        item.classList.toggle(styles['decadeItemActive'], isActive);
        item.setAttribute('data-active', isActive ? 'true' : 'false');
      });
    };

    updateYear(historyInitialYear);

    const triggers = entryRefs.current
      .map((entryElement, index) => {
        if (!entryElement) {
          return null;
        }

        const entryYear = historyEntries[index]?.year ?? historyInitialYear;

        return ScrollTrigger.create({
          end: 'bottom center',
          onEnter: () => {
            updateYear(entryYear);
          },
          onEnterBack: () => {
            updateYear(entryYear);
          },
          start: 'top center',
          trigger: entryElement,
        });
      })
      .filter((trigger): trigger is NonNullable<typeof trigger> => trigger !== null);

    return () => {
      triggers.forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  const handleSecondaryDropdownToggle = () => {
    setIsSecondaryDropdownOpen((currentValue) => !currentValue);
  };

  const handleSecondaryLinkClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    link: HistorySubNavLink,
  ) => {
    handlePlaceholderLinkClick(event, link.isPlaceholder);
    setIsSecondaryDropdownOpen(false);
  };

  return (
    <div className={styles['page']} data-testid='about-history-page'>
      <section
        className={styles['hero']}
        data-hero-color-change='false'
        data-testid='about-history-hero'
        ref={heroSectionRef}
      >
        <div
          className={styles['heroInner']}
          data-testid='about-history-hero-inner'
          ref={heroInnerRef}
        >
          <p className={styles['eyebrow']} ref={heroEyebrowRef}>
            {historyHeroContent.eyebrow}
          </p>
          <h1 className={styles['title']} ref={heroTitleRef}>
            {historyHeroContent.title}
          </h1>
          <p className={styles['description']} ref={heroDescriptionRef}>
            {historyHeroContent.description}
          </p>

          <div className={styles['subNav']} data-testid='about-history-subnav'>
            <div className={styles['secondaryDropdown']} ref={secondaryDropdownRef}>
              <button
                aria-controls={SECONDARY_SUB_NAV_DRAWER_ID}
                aria-expanded={isSecondaryDropdownOpen}
                aria-haspopup='menu'
                className={classNames(
                  styles['currentPagePill'],
                  isSecondaryDropdownOpen && styles['currentPagePillOpen'],
                )}
                data-testid='about-history-subnav-button-secondary'
                type='button'
                onClick={handleSecondaryDropdownToggle}
              >
                <span className={styles['currentPagePillLabel']}>{historyHeroContent.eyebrow}</span>
                <ChevronDownIcon
                  aria-hidden='true'
                  className={styles['currentPagePillIcon']}
                  focusable='false'
                />
              </button>

              {isSecondaryDropdownOpen ? (
                <div
                  className={styles['drawer']}
                  data-testid='about-history-subnav-drawer-secondary'
                  id={SECONDARY_SUB_NAV_DRAWER_ID}
                  role='menu'
                >
                  {historySecondarySubNavLinks.map((link) => {
                    const isCurrentLink = link.to === routePaths.aboutHistory;

                    if (link.to) {
                      return (
                        <Link
                          aria-current={isCurrentLink ? 'page' : undefined}
                          className={classNames(
                            styles['drawerLink'],
                            isCurrentLink && styles['drawerLinkActive'],
                          )}
                          key={link.label}
                          role='menuitem'
                          to={link.to}
                          onClick={(event) => {
                            handleSecondaryLinkClick(event, link);
                          }}
                        >
                          {link.label}
                        </Link>
                      );
                    }

                    return (
                      <a
                        aria-disabled={link.isPlaceholder || undefined}
                        className={classNames(
                          styles['drawerLink'],
                          styles['drawerLinkPlaceholder'],
                        )}
                        href={link.href}
                        key={link.label}
                        role='menuitem'
                        onClick={(event) => {
                          handleSecondaryLinkClick(event, link);
                        }}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <Link
              aria-label='홈으로 이동'
              className={styles['homeLink']}
              data-testid='about-history-subnav-home'
              to={routePaths.home}
            >
              <img
                alt=''
                className={styles['homeLinkIcon']}
                data-testid='about-history-subnav-home-icon'
                src={homeIcon}
              />
            </Link>
          </div>
        </div>

        <div aria-hidden='true' className={styles['heroBackground']} ref={heroBackgroundRef}>
          <img alt={historyHeroContent.backgroundAlt} src={historyHeroContent.backgroundSrc} />
        </div>
      </section>

      <section
        className={styles['timelineSection']}
        data-testid='about-history-timeline-section'
        ref={timelineSectionRef}
      >
        <div aria-hidden='true' className={styles['timelineBackdrop']}>
          <img alt='' src={historyTimelineBackgroundSrc} />
        </div>

        <div
          className={styles['timelineInner']}
          data-testid='about-history-timeline-inner'
          ref={timelineInnerRef}
        >
          <div className={styles['currentYearRail']}>
            <div
              className={styles['currentYearRailInner']}
              data-testid='about-history-current-year-rail-inner'
              ref={yearRailInnerRef}
            >
              <span
                className={styles['currentYearValue']}
                data-testid='about-history-current-year'
                ref={yearValueRef}
              >
                {String(currentYear)}
              </span>
            </div>
          </div>

          <div className={styles['timelineFlow']}>
            <ul className={styles['timelineList']}>
              {historyEntries.map((entry, index) => {
                const isEven = index % 2 === 1;

                return (
                  <li
                    className={classNames(
                      styles['timelineEntry'],
                      isEven && styles['timelineEntryEven'],
                    )}
                    data-testid={`about-history-entry-${String(index)}`}
                    data-year={String(entry.year)}
                    key={entry.id}
                    ref={(node) => {
                      entryRefs.current[index] = node;
                    }}
                  >
                    <div className={styles['entryText']}>
                      <p className={styles['entryYear']}>{String(entry.year)}</p>
                      <p className={styles['entrySubject']}>{entry.subject}</p>
                      <p className={styles['entryDescription']}>{entry.description}</p>
                    </div>

                    {entry.imageSrc ? (
                      <div className={styles['entryImageBox']}>
                        <img alt={entry.imageAlt} src={entry.imageSrc} />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles['decadeRail']}>
            <div
              className={styles['decadeRailInner']}
              data-testid='about-history-decade-rail-inner'
              ref={decadeRailInnerRef}
            >
              <ul className={styles['decadeList']}>
                {historyDecadeMarkers.map((marker, index) => {
                  const isActive = marker.key === activeDecadeKey;

                  return (
                    <li
                      className={classNames(
                        styles['decadeItem'],
                        isActive && styles['decadeItemActive'],
                      )}
                      data-active={isActive ? 'true' : 'false'}
                      data-year-range={`${String(marker.startYear)}_${String(marker.endYear)}`}
                      data-testid={`about-history-decade-${marker.label}`}
                      key={marker.key}
                      ref={(node) => {
                        decadeItemRefs.current[index] = node;
                      }}
                    >
                      <span>{marker.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutHistory;
