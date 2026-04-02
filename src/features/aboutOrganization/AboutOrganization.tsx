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
  organizationCapabilityLead,
  organizationCapabilityNodes,
  organizationGroups,
  organizationHeroContent,
  organizationOverviewBackgroundSrc,
  organizationSecondarySubNavLinks,
} from '@/features/aboutOrganization/data';
import type { OrganizationSubNavLink } from '@/features/aboutOrganization/types';
import { restoreDocumentScrollTop } from '@/pages/RootLayout/rootLayoutScrollLock';
import { routePaths } from '@/routes/routeRegistry';
import { classNames } from '@/utils/classNames';

import styles from './AboutOrganization.module.scss';

gsap.registerPlugin(ScrollTrigger);

const HERO_COLOR_CHANGE_PROGRESS = 0.6;
const HERO_OVERLAY_MAX_OPACITY = 0.28;
const HERO_OVERLAY_START_PROGRESS = 0.45;
const HERO_REVEAL_DISTANCE = 20;
const RAIL_REVEAL_DISTANCE_PERCENT = 100;
const REVEAL_DURATION_SECONDS = 1;
const SECTION_REVEAL_START = 'top 82%';
const SECONDARY_SUB_NAV_DRAWER_ID = 'about-organization-subnav-drawer-secondary';
const organizationSections = [
  { id: 'structure', label: '조직 구조' },
  { id: 'capability', label: '운영 역량' },
] as const;
const treeLineSegments = [
  { d: 'M640 0 V74', id: 'main-down', pulseCx: 640, pulseCy: 74 },
  { d: 'M640 74 H213', id: 'left-spread', pulseCx: 213, pulseCy: 74 },
  { d: 'M640 74 H1067', id: 'right-spread', pulseCx: 1067, pulseCy: 74 },
  { d: 'M213 74 V142', id: 'left-down', pulseCx: 213, pulseCy: 142 },
  { d: 'M640 74 V142', id: 'center-down', pulseCx: 640, pulseCy: 142 },
  { d: 'M1067 74 V142', id: 'right-down', pulseCx: 1067, pulseCy: 142 },
] as const;

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
    '--about-organization-hero-overlay-opacity',
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

const primePathForDrawing = (path: SVGPathElement) => {
  const pathLength = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 1000;

  path.style.strokeDasharray = String(pathLength);
  path.style.strokeDashoffset = String(pathLength);
};

const AboutOrganization = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroInnerRef = useRef<HTMLDivElement | null>(null);
  const heroBackgroundRef = useRef<HTMLDivElement | null>(null);
  const secondaryDropdownRef = useRef<HTMLDivElement | null>(null);
  const heroEyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroDescriptionRef = useRef<HTMLParagraphElement | null>(null);
  const overviewInnerRef = useRef<HTMLDivElement | null>(null);
  const sectionRailInnerRef = useRef<HTMLDivElement | null>(null);
  const treeSectionRef = useRef<HTMLElement | null>(null);
  const treeBaseLineRefs = useRef<Array<SVGPathElement | null>>([]);
  const treeGlowLineRefs = useRef<Array<SVGPathElement | null>>([]);
  const treePulseRefs = useRef<Array<SVGCircleElement | null>>([]);
  const treeCardRefs = useRef<Array<HTMLElement | null>>([]);
  const capabilitySectionRef = useRef<HTMLElement | null>(null);
  const capabilityLeadBoxRef = useRef<HTMLDivElement | null>(null);
  const capabilityFlowRef = useRef<HTMLDivElement | null>(null);
  const capabilityLineRef = useRef<HTMLDivElement | null>(null);
  const capabilityNodeRefs = useRef<Array<HTMLElement | null>>([]);
  const navigationType = useNavigationType();
  const [activeSectionId, setActiveSectionId] =
    useState<(typeof organizationSections)[number]['id']>('structure');
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

    const animatePath = (
      path: SVGPathElement | null,
      trigger: Element | null,
      delay = 0,
      once = true,
      duration = 1.2,
    ) => {
      if (!path) {
        return;
      }

      primePathForDrawing(path);

      const tweenVars: Record<string, unknown> = {
        delay,
        duration,
        ease: 'power2.out',
        strokeDashoffset: 0,
      };

      if (trigger) {
        tweenVars['scrollTrigger'] = {
          once,
          start: 'top 80%',
          trigger,
        };
      }

      registerAnimation(gsap.to(path, tweenVars) as GsapAnimationHandle);
    };

    const animatePulse = (node: SVGCircleElement | null, trigger: Element | null, delay = 0) => {
      if (!node) {
        return;
      }

      const tweenVars: Record<string, unknown> = {
        delay,
        duration: 0.34,
        ease: 'power2.out',
        opacity: 1,
        repeat: 1,
        scale: 1.7,
        yoyo: true,
      };

      if (trigger) {
        tweenVars['scrollTrigger'] = {
          once: true,
          start: 'top 80%',
          trigger,
        };
      }

      registerAnimation(
        gsap.fromTo(
          node,
          { opacity: 0, scale: 0.3, transformOrigin: 'center center' },
          tweenVars,
        ) as GsapAnimationHandle,
      );
    };

    const createCapabilityTimeline = () => {
      if (!capabilitySectionRef.current) {
        return null;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          once: true,
          start: SECTION_REVEAL_START,
          trigger: capabilitySectionRef.current,
        },
      }) as GsapAnimationHandle & {
        fromTo: (
          target: gsap.TweenTarget,
          fromVars: Record<string, unknown>,
          toVars: Record<string, unknown>,
          position?: string | number,
        ) => unknown;
        to: (
          target: gsap.TweenTarget,
          vars: Record<string, unknown>,
          position?: string | number,
        ) => unknown;
      };

      registerAnimation(timeline);

      timeline.fromTo(
        capabilityLeadBoxRef.current,
        { opacity: 0, y: 24 },
        {
          duration: 0.72,
          ease: 'power2.out',
          opacity: 1,
          y: 0,
        },
      );

      timeline.fromTo(
        capabilityFlowRef.current,
        { opacity: 0, y: 28 },
        {
          duration: 0.72,
          ease: 'power2.out',
          opacity: 1,
          y: 0,
        },
        '-=0.34',
      );

      timeline.fromTo(
        capabilityLineRef.current,
        { opacity: 0, scaleX: 0.1, transformOrigin: 'left center' },
        {
          duration: 0.6,
          ease: 'power2.out',
          opacity: 1,
          scaleX: 1,
        },
        '-=0.34',
      );

      capabilityNodeRefs.current.forEach((node, index) => {
        if (!node) {
          return;
        }

        timeline.fromTo(
          node,
          { opacity: 0, x: -28, y: 12 },
          {
            duration: 0.62,
            ease: 'power2.out',
            opacity: 1,
            x: 0,
            y: 0,
          },
          index === 0 ? '-=0.18' : '-=0.34',
        );
      });

      return timeline;
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
      sectionRailInnerRef.current,
      { opacity: 0, xPercent: RAIL_REVEAL_DISTANCE_PERCENT },
      {
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: 'top 80%',
          trigger: overviewInnerRef.current,
        },
        xPercent: 0,
      },
    );

    const treeTrigger = treeSectionRef.current;

    animateReveal(
      treeCardRefs.current[0],
      { opacity: 0, scale: 0.92, y: 34 },
      {
        delay: 0.05,
        opacity: 1,
        scale: 1,
        scrollTrigger: {
          once: true,
          start: SECTION_REVEAL_START,
          trigger: treeTrigger,
        },
        y: 0,
      },
    );

    const trunkStartDelay = 0.28;
    const trunkDuration = 0.68;
    const spreadStartDelay = trunkStartDelay + trunkDuration + 0.08;
    const spreadDuration = 0.72;
    const verticalStartDelay = spreadStartDelay + spreadDuration + 0.12;
    const verticalDuration = 0.56;
    const groupRevealDelay = verticalStartDelay + verticalDuration - 0.08;
    const teamRevealDelay = groupRevealDelay + 0.34;
    animatePath(treeBaseLineRefs.current[0], treeTrigger, trunkStartDelay, true, trunkDuration);
    animatePath(treeGlowLineRefs.current[0], treeTrigger, trunkStartDelay, true, trunkDuration);
    animatePulse(treePulseRefs.current[0], treeTrigger, trunkStartDelay + trunkDuration - 0.04);

    [1, 2].forEach((lineIndex) => {
      animatePath(
        treeBaseLineRefs.current[lineIndex],
        treeTrigger,
        spreadStartDelay,
        true,
        spreadDuration,
      );
      animatePath(
        treeGlowLineRefs.current[lineIndex],
        treeTrigger,
        spreadStartDelay,
        true,
        spreadDuration,
      );
    });

    animatePulse(treePulseRefs.current[1], treeTrigger, spreadStartDelay + spreadDuration - 0.02);
    animatePulse(treePulseRefs.current[2], treeTrigger, spreadStartDelay + spreadDuration - 0.02);

    [3, 4, 5].forEach((lineIndex) => {
      animatePath(
        treeBaseLineRefs.current[lineIndex],
        treeTrigger,
        verticalStartDelay,
        true,
        verticalDuration,
      );
      animatePath(
        treeGlowLineRefs.current[lineIndex],
        treeTrigger,
        verticalStartDelay,
        true,
        verticalDuration,
      );
    });

    [3, 4, 5].forEach((pulseIndex) => {
      animatePulse(
        treePulseRefs.current[pulseIndex],
        treeTrigger,
        verticalStartDelay + verticalDuration - 0.02,
      );
    });

    [1, 2, 3].forEach((cardIndex) => {
      animateReveal(
        treeCardRefs.current[cardIndex],
        {
          opacity: 0,
          scale: 0.96,
          y: 22,
        },
        {
          delay: groupRevealDelay,
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            once: true,
            start: SECTION_REVEAL_START,
            trigger: treeTrigger,
          },
          y: 0,
        },
      );
    });

    const structureCells = Array.from(
      treeSectionRef.current?.querySelectorAll<HTMLElement>(
        '[data-organization-structure-cell="true"]',
      ) ?? [],
    );

    const structureRows = structureCells.reduce<Array<HTMLElement[]>>((rows, cell) => {
      const currentTop = Math.round(cell.getBoundingClientRect().top);
      const matchedRow = rows.find((row) => {
        const rowTop = Math.round(row[0]?.getBoundingClientRect().top ?? 0);

        return Math.abs(rowTop - currentTop) <= 4;
      });

      if (matchedRow) {
        matchedRow.push(cell);
        return rows;
      }

      rows.push([cell]);
      return rows;
    }, []);

    structureRows
      .sort((leftRow, rightRow) => {
        const leftTop = leftRow[0]?.getBoundingClientRect().top ?? 0;
        const rightTop = rightRow[0]?.getBoundingClientRect().top ?? 0;

        return leftTop - rightTop;
      })
      .forEach((row, rowIndex) => {
        row
          .sort((leftCell, rightCell) => {
            return leftCell.getBoundingClientRect().left - rightCell.getBoundingClientRect().left;
          })
          .forEach((cell) => {
            const baseDelay = teamRevealDelay + rowIndex * 0.14;
            const isHeader = cell.dataset['organizationStructureType'] === 'header';

            animateReveal(
              cell,
              { opacity: 0, y: isHeader ? 18 : 12 },
              {
                delay: baseDelay,
                duration: isHeader ? 0.7 : 0.5,
                opacity: 1,
                scrollTrigger: {
                  once: true,
                  start: SECTION_REVEAL_START,
                  trigger: treeTrigger,
                },
                y: 0,
              },
            );
          });
      });

    createCapabilityTimeline();

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
    const triggers = organizationSections
      .map((section) => {
        const triggerElement =
          section.id === 'structure' ? treeSectionRef.current : capabilitySectionRef.current;

        if (!triggerElement) {
          return null;
        }

        return ScrollTrigger.create({
          end: 'bottom center',
          onEnter: () => {
            setActiveSectionId(section.id);
          },
          onEnterBack: () => {
            setActiveSectionId(section.id);
          },
          start: 'top center',
          trigger: triggerElement,
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
    link: OrganizationSubNavLink,
  ) => {
    handlePlaceholderLinkClick(event, link.isPlaceholder);
    setIsSecondaryDropdownOpen(false);
  };

  return (
    <div className={styles['page']} data-testid='about-organization-page'>
      <section
        className={styles['hero']}
        data-hero-color-change='false'
        data-testid='about-organization-hero'
        ref={heroSectionRef}
      >
        <div
          className={styles['heroInner']}
          data-testid='about-organization-hero-inner'
          ref={heroInnerRef}
        >
          <p className={styles['eyebrow']} ref={heroEyebrowRef}>
            {organizationHeroContent.eyebrow}
          </p>
          <h1 className={styles['title']} ref={heroTitleRef}>
            {organizationHeroContent.title}
          </h1>
          <p className={styles['description']} ref={heroDescriptionRef}>
            {organizationHeroContent.description}
          </p>

          <div className={styles['subNav']} data-testid='about-organization-subnav'>
            <div className={styles['secondaryDropdown']} ref={secondaryDropdownRef}>
              <button
                aria-controls={SECONDARY_SUB_NAV_DRAWER_ID}
                aria-expanded={isSecondaryDropdownOpen}
                aria-haspopup='menu'
                className={classNames(
                  styles['currentPagePill'],
                  isSecondaryDropdownOpen && styles['currentPagePillOpen'],
                )}
                data-testid='about-organization-subnav-button-secondary'
                type='button'
                onClick={handleSecondaryDropdownToggle}
              >
                <span className={styles['currentPagePillLabel']}>
                  {organizationHeroContent.eyebrow}
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
                  data-testid='about-organization-subnav-drawer-secondary'
                  id={SECONDARY_SUB_NAV_DRAWER_ID}
                  role='menu'
                >
                  {organizationSecondarySubNavLinks.map((link) => {
                    const isCurrentLink = link.to === routePaths.aboutOrganization;

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
              data-testid='about-organization-subnav-home'
              to={routePaths.home}
            >
              <img
                alt=''
                className={styles['homeLinkIcon']}
                data-testid='about-organization-subnav-home-icon'
                src={homeIcon}
              />
            </Link>
          </div>
        </div>

        <div aria-hidden='true' className={styles['heroBackground']} ref={heroBackgroundRef}>
          <img
            alt={organizationHeroContent.backgroundAlt}
            src={organizationHeroContent.backgroundSrc}
          />
        </div>
      </section>

      <section
        className={styles['overviewSection']}
        data-testid='about-organization-overview-section'
      >
        <div aria-hidden='true' className={styles['overviewBackdrop']}>
          <img alt='' src={organizationOverviewBackgroundSrc} />
        </div>

        <div
          className={styles['overviewInner']}
          data-testid='about-organization-overview-inner'
          ref={overviewInnerRef}
        >
          <div aria-hidden='true' className={styles['overviewSpacer']} />

          <div className={styles['overviewFlow']}>
            <article className={styles['treeSection']} ref={treeSectionRef}>
              <div className={styles['sectionHeader']}>
                <p className={styles['sectionEyebrow']}>조직 구조</p>
                <h2 className={styles['sectionTitle']}>
                  대표이사를 중심으로 사업 부문이 유기적으로 연결된 운영 체계
                </h2>
                <p className={styles['sectionDescription']}>
                  기계설비, 냉동냉장설비, 경영지원 조직이 한 축으로 이어지며 영업부터
                  설계·시공·유지보수까지 하나의 흐름으로 대응합니다.
                </p>
              </div>

              <div className={styles['treeSurface']}>
                <div
                  className={styles['directorCard']}
                  ref={(node) => {
                    treeCardRefs.current[0] = node;
                  }}
                >
                  <span>대표이사</span>
                </div>

                <svg
                  aria-hidden='true'
                  className={styles['treeLines']}
                  viewBox='0 0 1280 260'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  {treeLineSegments.map((segment, index) => {
                    return (
                      <g key={segment.id}>
                        <path
                          className={styles['treeLineBase']}
                          d={segment.d}
                          ref={(node) => {
                            treeBaseLineRefs.current[index] = node;
                          }}
                        />
                        <path
                          className={styles['treeLineGlow']}
                          d={segment.d}
                          ref={(node) => {
                            treeGlowLineRefs.current[index] = node;
                          }}
                        />
                        <circle
                          className={styles['treePulse']}
                          cx={String(segment.pulseCx)}
                          cy={String(segment.pulseCy)}
                          r='8'
                          ref={(node) => {
                            treePulseRefs.current[index] = node;
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className={styles['groupGrid']}>
                  {organizationGroups.map((group, groupIndex) => {
                    return (
                      <article
                        className={styles['groupCard']}
                        data-testid={`about-organization-group-${group.id}`}
                        key={group.id}
                        ref={(node) => {
                          treeCardRefs.current[groupIndex + 1] = node;
                        }}
                      >
                        <div className={styles['groupHeader']}>{group.label}</div>
                        <div
                          className={classNames(
                            styles['teamGrid'],
                            group.teams.length === 1 && styles['teamGridSingle'],
                            group.teams.length === 3 && styles['teamGridTriple'],
                          )}
                        >
                          {group.teams.map((team) => {
                            return (
                              <section
                                className={styles['teamBlock']}
                                data-organization-team-block='true'
                                key={team.id}
                              >
                                <div
                                  className={styles['teamHeader']}
                                  data-organization-structure-cell='true'
                                  data-organization-structure-type='header'
                                >
                                  {team.title}
                                </div>
                                <ul
                                  className={classNames(
                                    styles['teamItemGrid'],
                                    team.items.length > 3 && styles['teamItemGridTwoColumn'],
                                  )}
                                >
                                  {team.items.map((item) => {
                                    return (
                                      <li
                                        data-organization-structure-cell='true'
                                        data-organization-structure-type='item'
                                        data-organization-team-item='true'
                                        key={item}
                                      >
                                        {item}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </section>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </article>

            <article className={styles['capabilitySection']} ref={capabilitySectionRef}>
              <div className={styles['sectionHeader']}>
                <p className={styles['sectionEyebrow']}>운영 역량</p>
                <h2 className={styles['sectionTitle']}>
                  전문 인력과 파트너 네트워크가 한 흐름으로 이어지는 운영 체계
                </h2>
                <p className={styles['sectionDescription']}>
                  핵심 역할과 협업 단계를 좌측에서 우측으로 자연스럽게 읽을 수 있도록 카드형 구조로
                  정리했습니다.
                </p>
              </div>

              <div className={styles['capabilitySurface']}>
                <div className={styles['capabilityLeadBox']} ref={capabilityLeadBoxRef}>
                  <p className={styles['capabilityLeadText']}>{organizationCapabilityLead}</p>
                </div>

                <div className={styles['capabilityFlow']} ref={capabilityFlowRef}>
                  <div
                    aria-hidden='true'
                    className={styles['capabilityFlowLine']}
                    ref={capabilityLineRef}
                  />
                  <div className={styles['capabilityCardRow']}>
                    {organizationCapabilityNodes.map((node, index) => {
                      const isPartnerNode = node.id === 'partners';

                      return (
                        <article
                          className={classNames(
                            styles['capabilityCard'],
                            isPartnerNode && styles['capabilityCardPartner'],
                          )}
                          data-testid={`about-organization-capability-${node.id}`}
                          key={node.id}
                          ref={(element) => {
                            capabilityNodeRefs.current[index] = element;
                          }}
                        >
                          <span aria-hidden='true' className={styles['capabilityCardConnector']} />
                          <div className={styles['capabilityCardHeader']}>{node.label}</div>
                          <div className={styles['capabilityCardBody']}>
                            <strong className={styles['capabilityCardValue']}>{node.value}</strong>
                            <ul className={styles['capabilityCardDescriptionList']}>
                              {node.descriptions.map((description) => {
                                return <li key={description}>{description}</li>;
                              })}
                            </ul>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className={styles['sectionRail']}>
            <div
              className={styles['sectionRailInner']}
              data-testid='about-organization-section-rail-inner'
              ref={sectionRailInnerRef}
            >
              <ul className={styles['sectionList']}>
                {organizationSections.map((section) => {
                  const isActive = section.id === activeSectionId;

                  return (
                    <li
                      className={classNames(
                        styles['sectionItem'],
                        isActive && styles['sectionItemActive'],
                      )}
                      data-active={isActive ? 'true' : 'false'}
                      data-testid={`about-organization-section-${section.id}`}
                      key={section.id}
                    >
                      <span className={styles['sectionItemLabel']}>{section.label}</span>
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

export default AboutOrganization;
