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
  greetingHeroContent,
  greetingMessageContent,
  greetingOverviewBackgroundSrc,
  greetingSecondarySubNavLinks,
} from '@/features/aboutGreeting/data';
import type { GreetingSubNavLink } from '@/features/aboutGreeting/types';
import { restoreDocumentScrollTop } from '@/pages/RootLayout/rootLayoutScrollLock';
import { routePaths } from '@/routes/routeRegistry';
import { classNames } from '@/utils/classNames';

import styles from './AboutGreeting.module.scss';

gsap.registerPlugin(ScrollTrigger);

const HERO_REVEAL_DISTANCE = 20;
const REVEAL_DURATION_SECONDS = 1;
const SECTION_REVEAL_START = 'top 82%';
const SECONDARY_SUB_NAV_DRAWER_ID = 'about-greeting-subnav-drawer-secondary';

interface GsapAnimationHandle {
  kill?: () => void;
}

const AboutGreeting = () => {
  const secondaryDropdownRef = useRef<HTMLDivElement | null>(null);
  const heroEyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const greetingSectionRef = useRef<HTMLElement | null>(null);
  const greetingMediaRef = useRef<HTMLDivElement | null>(null);
  const greetingContentRef = useRef<HTMLDivElement | null>(null);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const signatureRef = useRef<HTMLDivElement | null>(null);
  const navigationType = useNavigationType();
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
    const animationHandles: GsapAnimationHandle[] = [];
    const shouldResetScroll = navigationType !== NavigationType.Pop;
    let settleScrollFrame = 0;

    ScrollTrigger.clearScrollMemory();
    if (shouldResetScroll) {
      restoreDocumentScrollTop(0);
    }

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
      { delay: 0.08, opacity: 1, y: 0 },
    );
    animateReveal(
      greetingMediaRef.current,
      { opacity: 0, x: -32, y: 24 },
      {
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: SECTION_REVEAL_START,
          trigger: greetingSectionRef.current,
        },
        x: 0,
        y: 0,
      },
    );
    animateReveal(
      greetingContentRef.current,
      { opacity: 0, x: 32, y: 24 },
      {
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: SECTION_REVEAL_START,
          trigger: greetingSectionRef.current,
        },
        x: 0,
        y: 0,
      },
    );

    paragraphRefs.current.forEach((paragraphElement, index) => {
      animateReveal(
        paragraphElement,
        { opacity: 0, y: 24 },
        {
          delay: index * 0.08,
          opacity: 1,
          scrollTrigger: {
            once: true,
            start: SECTION_REVEAL_START,
            trigger: greetingSectionRef.current,
          },
          y: 0,
        },
      );
    });

    animateReveal(
      signatureRef.current,
      { opacity: 0, y: 20 },
      {
        delay: 0.18,
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: SECTION_REVEAL_START,
          trigger: greetingSectionRef.current,
        },
        y: 0,
      },
    );

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
    };
  }, [navigationType]);

  const handleSecondaryDropdownToggle = () => {
    setIsSecondaryDropdownOpen((currentValue) => !currentValue);
  };

  const handleSecondaryLinkClick = (
    _event: ReactMouseEvent<HTMLAnchorElement>,
    _link: GreetingSubNavLink,
  ) => {
    setIsSecondaryDropdownOpen(false);
  };

  return (
    <div className={styles['page']} data-testid='about-greeting-page'>
      <section className={styles['hero']} data-testid='about-greeting-hero'>
        <div className={styles['heroInner']}>
          <p className={styles['eyebrow']} ref={heroEyebrowRef}>
            {greetingHeroContent.eyebrow}
          </p>
          <h1 className={styles['title']} ref={heroTitleRef}>
            {greetingHeroContent.title}
          </h1>

          <div className={styles['subNav']} data-testid='about-greeting-subnav'>
            <div className={styles['secondaryDropdown']} ref={secondaryDropdownRef}>
              <button
                aria-controls={SECONDARY_SUB_NAV_DRAWER_ID}
                aria-expanded={isSecondaryDropdownOpen}
                aria-haspopup='menu'
                className={classNames(
                  styles['currentPagePill'],
                  isSecondaryDropdownOpen && styles['currentPagePillOpen'],
                )}
                data-testid='about-greeting-subnav-button-secondary'
                type='button'
                onClick={handleSecondaryDropdownToggle}
              >
                <span className={styles['currentPagePillLabel']}>
                  {greetingHeroContent.eyebrow}
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
                  data-testid='about-greeting-subnav-drawer-secondary'
                  id={SECONDARY_SUB_NAV_DRAWER_ID}
                  role='menu'
                >
                  {greetingSecondarySubNavLinks.map((link) => {
                    const isCurrentLink = link.to === routePaths.aboutGreeting;

                    return (
                      <Link
                        aria-current={isCurrentLink ? 'page' : undefined}
                        className={classNames(
                          styles['drawerLink'],
                          isCurrentLink && styles['drawerLinkActive'],
                        )}
                        key={link.label}
                        role='menuitem'
                        to={link.to ?? link.href}
                        onClick={(event) => {
                          handleSecondaryLinkClick(event, link);
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <Link
              aria-label='홈으로 이동'
              className={styles['homeLink']}
              data-testid='about-greeting-subnav-home'
              to={routePaths.home}
            >
              <img
                alt=''
                className={styles['homeLinkIcon']}
                data-testid='about-greeting-subnav-home-icon'
                src={homeIcon}
              />
            </Link>
          </div>
        </div>

        <div aria-hidden='true' className={styles['heroBackground']}>
          <img alt={greetingHeroContent.backgroundAlt} src={greetingHeroContent.backgroundSrc} />
        </div>
      </section>

      <section className={styles['overviewSection']} data-testid='about-greeting-content-section'>
        <div aria-hidden='true' className={styles['overviewBackdrop']}>
          <img alt='' src={greetingOverviewBackgroundSrc} />
        </div>

        <div className={styles['overviewInner']}>
          <article
            className={styles['greetingSection']}
            data-testid='about-greeting-message-section'
            ref={greetingSectionRef}
          >
            <div className={styles['mediaColumn']} ref={greetingMediaRef}>
              <div className={styles['portraitAccent']} />
              <div className={styles['portraitFrame']}>
                <img
                  alt={greetingMessageContent.portraitAlt}
                  className={styles['portraitImage']}
                  src={greetingMessageContent.portraitSrc}
                />
              </div>

              <div className={styles['signaturePanel']} ref={signatureRef}>
                <p className={styles['companyLabel']}>{greetingMessageContent.companyLabel}</p>
                <img
                  alt={greetingMessageContent.signatureAlt}
                  className={styles['signatureImage']}
                  src={greetingMessageContent.signatureSrc}
                />
              </div>
            </div>

            <div className={styles['contentColumn']} ref={greetingContentRef}>
              <p className={styles['sectionEyebrow']}>{greetingMessageContent.sectionEyebrow}</p>
              <h2 className={styles['sectionTitle']}>{greetingMessageContent.title}</h2>

              <div className={styles['copyGroup']} data-testid='about-greeting-message-copy'>
                {greetingMessageContent.paragraphs.map((paragraph, index) => {
                  return (
                    <p
                      className={styles['paragraph']}
                      data-testid={`about-greeting-message-paragraph-${String(index)}`}
                      key={paragraph}
                      ref={(element) => {
                        paragraphRefs.current[index] = element;
                      }}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AboutGreeting;
