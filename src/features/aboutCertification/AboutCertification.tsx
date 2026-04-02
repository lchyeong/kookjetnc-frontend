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
  certificationArchiveBackgroundSrc,
  certificationCategoryMarkers,
  certificationEntries,
  certificationHeroContent,
  certificationInitialEntry,
  certificationSecondarySubNavLinks,
  getCertificationCategoryMarker,
} from '@/features/aboutCertification/data';
import type { CertificationSubNavLink } from '@/features/aboutCertification/types';
import { restoreDocumentScrollTop } from '@/pages/RootLayout/rootLayoutScrollLock';
import { routePaths } from '@/routes/routeRegistry';
import { classNames } from '@/utils/classNames';

import styles from './AboutCertification.module.scss';

gsap.registerPlugin(ScrollTrigger);

const HERO_COLOR_CHANGE_PROGRESS = 0.6;
const HERO_OVERLAY_MAX_OPACITY = 0.28;
const HERO_OVERLAY_START_PROGRESS = 0.45;
const HERO_REVEAL_DISTANCE = 20;
const RAIL_REVEAL_DISTANCE_PERCENT = 100;
const REVEAL_DURATION_SECONDS = 1;
const RAIL_REVEAL_START = 'top 80%';
const TIMELINE_REVEAL_START = 'top 85%';
const SECONDARY_SUB_NAV_DRAWER_ID = 'about-certification-subnav-drawer-secondary';

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
    '--about-certification-hero-overlay-opacity',
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

const AboutCertification = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroInnerRef = useRef<HTMLDivElement | null>(null);
  const heroBackgroundRef = useRef<HTMLDivElement | null>(null);
  const secondaryDropdownRef = useRef<HTMLDivElement | null>(null);
  const heroEyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroDescriptionRef = useRef<HTMLParagraphElement | null>(null);
  const archiveSectionRef = useRef<HTMLElement | null>(null);
  const archiveInnerRef = useRef<HTMLDivElement | null>(null);
  const categoryRailInnerRef = useRef<HTMLDivElement | null>(null);
  const categoryItemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const entryRefs = useRef<Array<HTMLLIElement | null>>([]);
  const navigationType = useNavigationType();
  const [activeCategoryId, setActiveCategoryId] = useState(certificationInitialEntry.categoryId);
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
      categoryRailInnerRef.current,
      { opacity: 0, xPercent: RAIL_REVEAL_DISTANCE_PERCENT },
      {
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: RAIL_REVEAL_START,
          trigger: archiveInnerRef.current,
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
    const updateEntry = (entryIndex: number) => {
      const nextCategory = getCertificationCategoryMarker(entryIndex);

      setActiveCategoryId(nextCategory.id);

      categoryItemRefs.current.forEach((item, index) => {
        if (!item) {
          return;
        }

        const marker = certificationCategoryMarkers[index];
        const isActive = marker.id === nextCategory.id;

        item.classList.toggle(styles['categoryItemActive'], isActive);
        item.setAttribute('data-active', isActive ? 'true' : 'false');
      });
    };

    updateEntry(certificationInitialEntry.sequence);

    const triggers = entryRefs.current
      .map((entryElement, index) => {
        if (!entryElement) {
          return null;
        }

        const entrySequence =
          certificationEntries[index]?.sequence ?? certificationInitialEntry.sequence;

        return ScrollTrigger.create({
          end: 'bottom center',
          onEnter: () => {
            updateEntry(entrySequence);
          },
          onEnterBack: () => {
            updateEntry(entrySequence);
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
    link: CertificationSubNavLink,
  ) => {
    handlePlaceholderLinkClick(event, link.isPlaceholder);
    setIsSecondaryDropdownOpen(false);
  };

  return (
    <div className={styles['page']} data-testid='about-certification-page'>
      <section
        className={styles['hero']}
        data-hero-color-change='false'
        data-testid='about-certification-hero'
        ref={heroSectionRef}
      >
        <div
          className={styles['heroInner']}
          data-testid='about-certification-hero-inner'
          ref={heroInnerRef}
        >
          <p className={styles['eyebrow']} ref={heroEyebrowRef}>
            {certificationHeroContent.eyebrow}
          </p>
          <h1 className={styles['title']} ref={heroTitleRef}>
            {certificationHeroContent.title}
          </h1>
          <p className={styles['description']} ref={heroDescriptionRef}>
            {certificationHeroContent.description}
          </p>

          <div className={styles['subNav']} data-testid='about-certification-subnav'>
            <div className={styles['secondaryDropdown']} ref={secondaryDropdownRef}>
              <button
                aria-controls={SECONDARY_SUB_NAV_DRAWER_ID}
                aria-expanded={isSecondaryDropdownOpen}
                aria-haspopup='menu'
                className={classNames(
                  styles['currentPagePill'],
                  isSecondaryDropdownOpen && styles['currentPagePillOpen'],
                )}
                data-testid='about-certification-subnav-button-secondary'
                type='button'
                onClick={handleSecondaryDropdownToggle}
              >
                <span className={styles['currentPagePillLabel']}>
                  {certificationHeroContent.eyebrow}
                </span>
                <ChevronDownIcon
                  aria-hidden='true'
                  className={styles['currentPagePillIcon']}
                  focusable='false'
                />
              </button>

              {isSecondaryDropdownOpen ? (
                <div
                  className={styles['drawer']}
                  data-testid='about-certification-subnav-drawer-secondary'
                  id={SECONDARY_SUB_NAV_DRAWER_ID}
                  role='menu'
                >
                  {certificationSecondarySubNavLinks.map((link) => {
                    const isCurrentLink = link.to === routePaths.aboutCertification;

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
              data-testid='about-certification-subnav-home'
              to={routePaths.home}
            >
              <img
                alt=''
                className={styles['homeLinkIcon']}
                data-testid='about-certification-subnav-home-icon'
                src={homeIcon}
              />
            </Link>
          </div>
        </div>

        <div aria-hidden='true' className={styles['heroBackground']} ref={heroBackgroundRef}>
          <img
            alt={certificationHeroContent.backgroundAlt}
            src={certificationHeroContent.backgroundSrc}
          />
        </div>
      </section>

      <section
        className={styles['archiveSection']}
        data-testid='about-certification-archive-section'
        ref={archiveSectionRef}
      >
        <div aria-hidden='true' className={styles['archiveBackdrop']}>
          <img alt='' src={certificationArchiveBackgroundSrc} />
        </div>

        <div
          className={styles['archiveInner']}
          data-testid='about-certification-archive-inner'
          ref={archiveInnerRef}
        >
          <div aria-hidden='true' className={styles['archiveSpacer']} />

          <div className={styles['archiveFlow']}>
            <ul className={styles['archiveList']}>
              {certificationEntries.map((entry, index) => {
                const isEven = index % 2 === 1;
                const stackItems = [0, 1, 2];

                return (
                  <li
                    className={classNames(
                      styles['archiveEntry'],
                      isEven && styles['archiveEntryEven'],
                    )}
                    data-category={entry.categoryId}
                    data-testid={`about-certification-entry-${String(index)}`}
                    data-sequence={String(entry.sequence)}
                    key={entry.id}
                    ref={(node) => {
                      entryRefs.current[index] = node;
                    }}
                  >
                    <div className={styles['entryText']}>
                      <p className={styles['entryCategory']}>{entry.categoryLabel}</p>
                      <p className={styles['entrySerial']}>{entry.serialLabel}</p>
                      <h2 className={styles['entryTitle']}>{entry.title}</h2>
                      <p className={styles['entryDescription']}>
                        {entry.categoryLabel} 아카이브 영역에 배치될 증빙 이미지 자리입니다.
                      </p>
                    </div>

                    <div className={styles['entryImageBox']}>
                      <div className={styles['entryImageStack']} data-category={entry.categoryId}>
                        {stackItems.map((stackIndex) => {
                          return (
                            <div
                              className={styles['entryImageLayer']}
                              data-stack-index={String(stackIndex)}
                              key={`${entry.id}-${String(stackIndex)}`}
                            >
                              <img alt={entry.imageAlt} src={entry.imageSrc} />
                            </div>
                          );
                        })}

                        <div className={styles['entryImageOverlay']}>
                          <span className={styles['entryImageOverlayBadge']}>
                            {entry.categoryLabel}
                          </span>
                          <span className={styles['entryImageOverlayTitle']}>{entry.title}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles['categoryRail']}>
            <div
              className={styles['categoryRailInner']}
              data-testid='about-certification-category-rail-inner'
              ref={categoryRailInnerRef}
            >
              <ul className={styles['categoryList']}>
                {certificationCategoryMarkers.map((marker, index) => {
                  const isActive = marker.id === activeCategoryId;

                  return (
                    <li
                      className={classNames(
                        styles['categoryItem'],
                        isActive && styles['categoryItemActive'],
                      )}
                      data-active={isActive ? 'true' : 'false'}
                      data-testid={`about-certification-category-${marker.id}`}
                      key={marker.id}
                      ref={(node) => {
                        categoryItemRefs.current[index] = node;
                      }}
                    >
                      <span className={styles['categoryItemLabel']}>{marker.label}</span>
                      <span className={styles['categoryItemCount']}>{String(marker.count)}건</span>
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

export default AboutCertification;
