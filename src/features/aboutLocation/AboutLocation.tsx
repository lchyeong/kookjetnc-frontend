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
import { env } from '@/config/env';
import {
  locationHeroContent,
  locationInfoGroups,
  locationOfficeLocation,
  locationOverviewBackgroundSrc,
  locationSecondarySubNavLinks,
} from '@/features/aboutLocation/data';
import { loadKakaoMapSdk } from '@/features/aboutLocation/kakaoMapSdk';
import type { LocationSubNavLink } from '@/features/aboutLocation/types';
import { restoreDocumentScrollTop } from '@/pages/RootLayout/rootLayoutScrollLock';
import { routePaths } from '@/routes/routeRegistry';
import { classNames } from '@/utils/classNames';

import styles from './AboutLocation.module.scss';

gsap.registerPlugin(ScrollTrigger);

const HERO_COLOR_CHANGE_PROGRESS = 0.6;
const HERO_OVERLAY_MAX_OPACITY = 0.28;
const HERO_OVERLAY_START_PROGRESS = 0.45;
const HERO_REVEAL_DISTANCE = 20;
const REVEAL_DURATION_SECONDS = 1;
const SECTION_REVEAL_START = 'top 82%';
const SECONDARY_SUB_NAV_DRAWER_ID = 'about-location-subnav-drawer-secondary';

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
    '--about-location-hero-overlay-opacity',
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

const AboutLocation = () => {
  const kakaoMapApiKey = env.kakaoMapApiKey ?? '';
  const hasKakaoMapApiKey = kakaoMapApiKey.trim().length > 0;
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroInnerRef = useRef<HTMLDivElement | null>(null);
  const heroBackgroundRef = useRef<HTMLDivElement | null>(null);
  const secondaryDropdownRef = useRef<HTMLDivElement | null>(null);
  const heroEyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const mapSectionRef = useRef<HTMLElement | null>(null);
  const mapLeadRef = useRef<HTMLParagraphElement | null>(null);
  const mapFrameRef = useRef<HTMLDivElement | null>(null);
  const infoSectionRef = useRef<HTMLElement | null>(null);
  const infoPanelRefs = useRef<Array<HTMLElement | null>>([]);
  const mapCanvasRef = useRef<HTMLDivElement | null>(null);
  const navigationType = useNavigationType();
  const [isSecondaryDropdownOpen, setIsSecondaryDropdownOpen] = useState(false);
  const [mapStatus, setMapStatus] = useState<'error' | 'loading' | 'ready'>(
    hasKakaoMapApiKey ? 'loading' : 'error',
  );
  const [mapErrorMessage, setMapErrorMessage] = useState(
    hasKakaoMapApiKey ? null : '카카오 지도 API 키가 설정되지 않아 지도를 표시할 수 없습니다.',
  );

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

  useEffect(() => {
    const mapCanvas = mapCanvasRef.current;

    if (!mapCanvas) {
      return;
    }

    if (!hasKakaoMapApiKey) {
      return;
    }

    let isCancelled = false;

    void loadKakaoMapSdk(kakaoMapApiKey)
      .then((kakao) => {
        if (isCancelled) {
          return;
        }

        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(locationOfficeLocation.mapQuery, (result, status) => {
          if (isCancelled) {
            return;
          }

          if (status !== kakao.maps.services.Status.OK || !result[0]) {
            setMapStatus('error');
            setMapErrorMessage('주소를 좌표로 변환하지 못했습니다. 잠시 후 다시 확인해주세요.');
            return;
          }

          const position = new kakao.maps.LatLng(Number(result[0].y), Number(result[0].x));

          mapCanvas.innerHTML = '';

          const map = new kakao.maps.Map(mapCanvas, {
            center: position,
            level: 4,
          });

          new kakao.maps.Marker({
            map,
            position,
          });

          setMapStatus('ready');
          setMapErrorMessage(null);
        });
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        setMapStatus('error');
        setMapErrorMessage(
          '카카오 지도를 불러오지 못했습니다. 네트워크나 API 설정을 확인해주세요.',
        );
      });

    return () => {
      isCancelled = true;
      mapCanvas.innerHTML = '';
    };
  }, [hasKakaoMapApiKey, kakaoMapApiKey]);

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
      { delay: 0.08, opacity: 1, y: 0 },
    );
    animateReveal(
      mapLeadRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: SECTION_REVEAL_START,
          trigger: mapSectionRef.current,
        },
        y: 0,
      },
    );
    animateReveal(
      mapFrameRef.current,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        scrollTrigger: {
          once: true,
          start: SECTION_REVEAL_START,
          trigger: mapSectionRef.current,
        },
        y: 0,
      },
    );

    infoPanelRefs.current.forEach((panel, index) => {
      animateReveal(
        panel,
        { opacity: 0, y: 24 },
        {
          delay: index * 0.08,
          opacity: 1,
          scrollTrigger: {
            once: true,
            start: SECTION_REVEAL_START,
            trigger: infoSectionRef.current,
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

  const handleSecondaryDropdownToggle = () => {
    setIsSecondaryDropdownOpen((currentValue) => !currentValue);
  };

  const handleSecondaryLinkClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    link: LocationSubNavLink,
  ) => {
    handlePlaceholderLinkClick(event, link.isPlaceholder);
    setIsSecondaryDropdownOpen(false);
  };

  return (
    <div className={styles['page']} data-testid='about-location-page'>
      <section
        className={styles['hero']}
        data-hero-color-change='false'
        data-testid='about-location-hero'
        ref={heroSectionRef}
      >
        <div className={styles['heroInner']} ref={heroInnerRef}>
          <p className={styles['eyebrow']} ref={heroEyebrowRef}>
            {locationHeroContent.eyebrow}
          </p>
          <h1 className={styles['title']} ref={heroTitleRef}>
            {locationHeroContent.title}
          </h1>

          <div className={styles['subNav']} data-testid='about-location-subnav'>
            <div className={styles['secondaryDropdown']} ref={secondaryDropdownRef}>
              <button
                aria-controls={SECONDARY_SUB_NAV_DRAWER_ID}
                aria-expanded={isSecondaryDropdownOpen}
                aria-haspopup='menu'
                className={classNames(
                  styles['currentPagePill'],
                  isSecondaryDropdownOpen && styles['currentPagePillOpen'],
                )}
                data-testid='about-location-subnav-button-secondary'
                type='button'
                onClick={handleSecondaryDropdownToggle}
              >
                <span className={styles['currentPagePillLabel']}>
                  {locationHeroContent.eyebrow}
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
                  data-testid='about-location-subnav-drawer-secondary'
                  id={SECONDARY_SUB_NAV_DRAWER_ID}
                  role='menu'
                >
                  {locationSecondarySubNavLinks.map((link) => {
                    const isCurrentLink = link.to === routePaths.aboutLocation;

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
              data-testid='about-location-subnav-home'
              to={routePaths.home}
            >
              <img
                alt=''
                className={styles['homeLinkIcon']}
                data-testid='about-location-subnav-home-icon'
                src={homeIcon}
              />
            </Link>
          </div>
        </div>

        <div aria-hidden='true' className={styles['heroBackground']} ref={heroBackgroundRef}>
          <img alt={locationHeroContent.backgroundAlt} src={locationHeroContent.backgroundSrc} />
        </div>
      </section>

      <section className={styles['overviewSection']} data-testid='about-location-content-section'>
        <div aria-hidden='true' className={styles['overviewBackdrop']}>
          <img alt='' src={locationOverviewBackgroundSrc} />
        </div>

        <div className={styles['overviewInner']}>
          <article className={styles['mapSection']} ref={mapSectionRef}>
            <div className={styles['sectionHeader']}>
              <p className={styles['sectionEyebrow']}>사업장 위치</p>
              <h2 className={styles['sectionTitle']}>사업장 위치 안내</h2>
            </div>

            <p
              className={styles['mapLead']}
              data-testid='about-location-info-address'
              ref={mapLeadRef}
            >
              {locationOfficeLocation.addressLine1}
              <br />
              {locationOfficeLocation.addressLine2}
            </p>

            <div
              className={styles['mapFrame']}
              data-map-status={mapStatus}
              data-testid='about-location-map-frame'
              ref={mapFrameRef}
            >
              <div
                className={styles['mapCanvas']}
                data-testid='about-location-map-canvas'
                ref={mapCanvasRef}
              />
              {mapStatus !== 'ready' ? (
                <div className={styles['mapOverlay']}>
                  <strong className={styles['mapOverlayTitle']}>
                    {mapStatus === 'loading'
                      ? '지도를 불러오는 중입니다.'
                      : '지도를 표시할 수 없습니다.'}
                  </strong>
                  <p className={styles['mapOverlayDescription']}>
                    {mapErrorMessage ?? '카카오 지도 SDK와 주소 정보를 확인하고 있습니다.'}
                  </p>
                </div>
              ) : null}
            </div>
          </article>

          <article className={styles['infoSection']} ref={infoSectionRef}>
            <div className={styles['sectionHeader']}>
              <p className={styles['sectionEyebrow']}>교통 안내</p>
              <h2 className={styles['sectionTitle']}>주소와 대중교통 정보를 함께 확인하세요.</h2>
            </div>

            <div className={styles['infoGrid']}>
              <article
                className={styles['infoPanel']}
                ref={(node) => {
                  infoPanelRefs.current[0] = node;
                }}
              >
                <p className={styles['infoLabel']}>주소</p>
                <p className={styles['infoBody']}>
                  {locationOfficeLocation.addressLine1}
                  <br />
                  {locationOfficeLocation.addressLine2}
                </p>
              </article>

              {locationInfoGroups.map((group, index) => {
                return (
                  <article
                    className={styles['infoPanel']}
                    data-testid={`about-location-info-${group.id}`}
                    key={group.id}
                    ref={(node) => {
                      infoPanelRefs.current[index + 1] = node;
                    }}
                  >
                    <p className={styles['infoLabel']}>{group.label}</p>
                    <div className={styles['infoList']}>
                      {group.items.map((item) => {
                        return (
                          <p className={styles['infoBody']} key={item.id}>
                            {item.title} {item.description}
                          </p>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AboutLocation;
