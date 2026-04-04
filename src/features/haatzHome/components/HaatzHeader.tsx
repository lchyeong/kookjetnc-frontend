import {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type PropsWithChildren,
} from 'react';

import { Link, useLocation } from 'react-router-dom';

import ChevronDownIcon from '@/components/ui/icons/ChevronDownIcon';
import CloseIcon from '@/components/ui/icons/CloseIcon';
import {
  getIntroHeaderHiddenState,
  POPUP_REVEAL_DELAY_MS,
} from '@/features/haatzHome/components/haatzHero';
import { headerAssets, headerMenuGroups, languageLinks } from '@/features/haatzHome/data';
import type { HaatzLink, HeaderMenuGroup } from '@/features/haatzHome/types';
import { routePaths } from '@/routes/routeRegistry';
import { useHaatzHomeUiStore } from '@/stores/useHaatzHomeUiStore';
import { classNames } from '@/utils/classNames';

import styles from './HaatzHeader.module.scss';

interface HaatzHeaderProps {
  heroSectionSelector?: string | undefined;
  isHomeRoute?: boolean;
}

const DEFAULT_MOBILE_GROUP_ID = 'company';
const HOME_HERO_SELECTOR = '[data-testid="haatz-hero-section"]';

const renderDescription = (value: string) => {
  return value.split('\n').map((line, index) => {
    return (
      <span className={styles['line']} key={`${line}-${String(index)}`}>
        {line}
      </span>
    );
  });
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

interface HeaderNavigationLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  link: HaatzLink;
}

const HeaderNavigationLink = ({
  children,
  link,
  ...props
}: PropsWithChildren<HeaderNavigationLinkProps>) => {
  if (link.to) {
    return (
      <Link target={link.target} to={link.to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={link.href} target={link.target} {...props}>
      {children}
    </a>
  );
};

const getInternalPath = (link: HaatzLink) => {
  if (!link.to) {
    return null;
  }

  return link.to.split('?')[0] ?? null;
};

const HaatzHeader = ({ heroSectionSelector, isHomeRoute = false }: HaatzHeaderProps) => {
  const location = useLocation();
  const [activeDesktopIndex, setActiveDesktopIndex] = useState<number | null>(null);
  const [expandedMobileGroups, setExpandedMobileGroups] = useState<string[]>([
    DEFAULT_MOBILE_GROUP_ID,
  ]);
  const [fallbackRevealElapsed, setFallbackRevealElapsed] = useState(false);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);
  const [isHeroHeaderMode, setIsHeroHeaderMode] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const headerHidden = useHaatzHomeUiStore((state) => state.headerHidden);
  const introPhase = useHaatzHomeUiStore((state) => state.introPhase);
  const popupEligible = useHaatzHomeUiStore((state) => state.popupEligible);
  const popupPhase = useHaatzHomeUiStore((state) => state.popupPhase);
  const setHeaderHidden = useHaatzHomeUiStore((state) => state.setHeaderHidden);

  const activeDesktopMenu = useMemo(() => {
    return headerMenuGroups[activeDesktopIndex ?? 0] ?? headerMenuGroups[0];
  }, [activeDesktopIndex]);

  const getScrollTop = () => {
    return document.scrollingElement ? document.scrollingElement.scrollTop : window.pageYOffset;
  };

  const closeDesktopPanels = () => {
    setActiveDesktopIndex(null);
    setIsLanguageOpen(false);
  };

  const closeOverlays = () => {
    setIsAllMenuOpen(false);
    setIsMobileNavOpen(false);
  };

  const handleLogoClick = () => {
    closeDesktopPanels();
    closeOverlays();
    setExpandedMobileGroups([DEFAULT_MOBILE_GROUP_ID]);
  };

  const isCurrentGroupRoute = (group: HeaderMenuGroup) => {
    const groupPath = getInternalPath(group);

    if (
      groupPath &&
      (location.pathname === groupPath || location.pathname.startsWith(`${groupPath}/`))
    ) {
      return true;
    }

    return group.items.some((item) => {
      const itemPath = getInternalPath(item);

      return Boolean(
        itemPath &&
          (location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`)),
      );
    });
  };

  useEffect(() => {
    const shouldLockBody = isMobileNavOpen || isAllMenuOpen;
    document.body.classList.toggle('haatz-overlay-open', shouldLockBody);

    return () => {
      document.body.classList.remove('haatz-overlay-open');
    };
  }, [isAllMenuOpen, isMobileNavOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDesktopPanels();
        closeOverlays();
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileNavOpen(false);
        return;
      }

      setActiveDesktopIndex(null);
      setIsAllMenuOpen(false);
      setIsLanguageOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setHeaderHidden(false);

    return () => {
      setHeaderHidden(false);
    };
  }, [isHomeRoute, setHeaderHidden]);

  useEffect(() => {
    const resolvedHeroSectionSelector =
      heroSectionSelector ?? (isHomeRoute ? HOME_HERO_SELECTOR : '');

    if (!resolvedHeroSectionSelector) {
      return;
    }

    const updateHeroHeaderMode = () => {
      const heroSection = document.querySelector<HTMLElement>(resolvedHeroSectionSelector);

      if (!heroSection) {
        setIsHeroHeaderMode(false);
        return;
      }

      const heroRect = heroSection.getBoundingClientRect();
      const nextHeroHeaderMode =
        getScrollTop() <= 4 && heroRect.bottom > 0 && heroRect.top < window.innerHeight;

      setIsHeroHeaderMode(nextHeroHeaderMode);
    };

    updateHeroHeaderMode();

    window.addEventListener('scroll', updateHeroHeaderMode, { passive: true });
    window.addEventListener('resize', updateHeroHeaderMode);

    return () => {
      window.removeEventListener('scroll', updateHeroHeaderMode);
      window.removeEventListener('resize', updateHeroHeaderMode);
      setIsHeroHeaderMode(false);
    };
  }, [heroSectionSelector, isHomeRoute]);

  const handleNavigationLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    link: HaatzLink,
    afterNavigate?: () => void,
  ) => {
    handlePlaceholderLinkClick(event, link.isPlaceholder);

    if (event.defaultPrevented) {
      return;
    }

    afterNavigate?.();
  };

  useEffect(() => {
    let timerId: number | null = null;

    if (!isHomeRoute) {
      timerId = window.setTimeout(() => {
        setFallbackRevealElapsed(false);
      }, 0);

      return () => {
        if (timerId !== null) {
          window.clearTimeout(timerId);
        }
      };
    }

    if (introPhase !== 'complete' || popupEligible) {
      timerId = window.setTimeout(() => {
        setFallbackRevealElapsed(false);
      }, 0);

      return () => {
        if (timerId !== null) {
          window.clearTimeout(timerId);
        }
      };
    }

    timerId = window.setTimeout(() => {
      setFallbackRevealElapsed(true);
    }, POPUP_REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [introPhase, isHomeRoute, popupEligible]);

  const headerIntroHidden = isHomeRoute
    ? getIntroHeaderHiddenState({
        fallbackDelayElapsed: fallbackRevealElapsed,
        introPhase,
        popupEligible,
        popupPhase,
      })
    : false;
  const isDesktopSitemapOpen = activeDesktopIndex !== null;

  const toggleMobileGroup = (groupId: string) => {
    setExpandedMobileGroups((current) => {
      return current.includes(groupId)
        ? current.filter((item) => item !== groupId)
        : [...current, groupId];
    });
  };

  return (
    <>
      <div
        className={classNames(
          styles['desktopHoverRegion'],
          isDesktopSitemapOpen && styles['desktopHoverRegionOpen'],
        )}
        onMouseLeave={closeDesktopPanels}
      >
        <div
          className={classNames(
            styles['desktopNavSurface'],
            isDesktopSitemapOpen && styles['desktopNavSurfaceVisible'],
            isHeroHeaderMode && styles['desktopNavSurfaceOnHero'],
            headerHidden && styles['desktopNavSurfaceHidden'],
          )}
          data-testid='desktop-nav-surface'
        />
        <header
          className={classNames(
            styles['header'],
            headerHidden && styles['headerDown'],
            headerIntroHidden && styles['headerIntroHidden'],
            isHeroHeaderMode && styles['headerOnHero'],
          )}
        >
          <div className={styles['headerWrap']}>
            <Link
              className={styles['logoLink']}
              onClick={handleLogoClick}
              to={routePaths.home}
            >
              <img alt={headerAssets.logoAlt} className={styles['logo']} src={headerAssets.logo} />
            </Link>

            <div className={styles['navBackground']} />

            <div className={styles['desktopArea']}>
              <nav aria-label='Primary' className={styles['nav']}>
                <ul className={styles['navListDepth1']}>
                  {headerMenuGroups.map((group, index) => {
                    const isActive = activeDesktopIndex === index || isCurrentGroupRoute(group);

                    return (
                      <li
                        className={classNames(
                          styles['navItemDepth1'],
                          isActive && styles['navItemDepth1Active'],
                        )}
                        key={group.id}
                        onFocus={() => {
                          setActiveDesktopIndex(index);
                          setIsLanguageOpen(false);
                        }}
                        onMouseEnter={() => {
                          setActiveDesktopIndex(index);
                          setIsLanguageOpen(false);
                        }}
                      >
                        <HeaderNavigationLink
                          aria-disabled={group.isPlaceholder || undefined}
                          className={styles['navLinkDepth1']}
                          link={group}
                          onClick={(event) => {
                            handleNavigationLinkClick(event, group, closeDesktopPanels);
                          }}
                        >
                          {group.label}
                        </HeaderNavigationLink>

                        <ul aria-hidden='true' className={styles['navListDepth2']}>
                          {group.hoverItems.map((item) => {
                            return (
                              <li
                                className={styles['navItemDepth2']}
                                key={`${group.id}-${item.label}`}
                              >
                                <HeaderNavigationLink
                                  aria-disabled={item.isPlaceholder || undefined}
                                  className={styles['navLinkDepth2']}
                                  link={item}
                                  onClick={(event) => {
                                    handleNavigationLinkClick(event, item, closeDesktopPanels);
                                  }}
                                >
                                  {item.label}
                                </HeaderNavigationLink>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className={styles['right']}>
                <div className={styles['langBox']}>
                  <button
                    aria-expanded={isLanguageOpen}
                    className={styles['langButton']}
                    onClick={() => {
                      setActiveDesktopIndex(null);
                      setIsLanguageOpen((current) => !current);
                    }}
                    type='button'
                  >
                    <span>KOR</span>
                    <ChevronDownIcon
                      className={classNames(
                        styles['languageIcon'],
                        isLanguageOpen && styles['languageIconOpen'],
                      )}
                    />
                  </button>

                  <div
                    className={classNames(
                      styles['langList'],
                      isLanguageOpen ? styles['langListVisible'] : styles['langListHidden'],
                    )}
                  >
                    <div className={styles['langListInner']}>
                      {languageLinks.map((item) => {
                        return (
                          <HeaderNavigationLink
                            className={styles['langLink']}
                            link={item}
                            key={item.label}
                          >
                            {item.label}
                          </HeaderNavigationLink>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  aria-label='전체 메뉴 열기'
                  className={styles['sitemapOpenButton']}
                  onClick={() => {
                    setActiveDesktopIndex(null);
                    setIsLanguageOpen(false);
                    setIsAllMenuOpen(true);
                  }}
                  type='button'
                >
                  <img alt='' src={headerAssets.menu} />
                </button>
              </div>
            </div>

            <button
              aria-label='모바일 메뉴 열기'
              className={styles['mobileMenuButton']}
              onClick={() => {
                setIsLanguageOpen(false);
                setActiveDesktopIndex(null);
                setIsMobileNavOpen(true);
              }}
              type='button'
            >
              <img alt='' src={headerAssets.menu} />
            </button>
          </div>
        </header>

        <section
          className={classNames(
            styles['sitemap'],
            isDesktopSitemapOpen && styles['sitemapVisible'],
            headerHidden && styles['sitemapHidden'],
            isHeroHeaderMode && styles['sitemapOnHero'],
          )}
          data-testid='desktop-sitemap'
        >
          <div className={styles['sitemapInner']}>
            <div className={styles['sitemapLeft']}>
              <p className={styles['sitemapSubject']}>{activeDesktopMenu.descriptionTitle}</p>
              <p className={styles['sitemapText']}>
                {renderDescription(activeDesktopMenu.description)}
              </p>
            </div>

            <div className={styles['sitemapRight']}>
              {headerMenuGroups.map((group, index) => {
                return (
                  <div
                    aria-hidden={activeDesktopIndex !== index}
                    className={classNames(
                      styles['sitemapPanel'],
                      activeDesktopIndex === index && styles['sitemapPanelActive'],
                    )}
                    key={`sitemap-${group.id}`}
                  >
                    <ul className={styles['sitemapPanelList']}>
                      {group.hoverItems.map((item) => {
                        return (
                          <li
                            className={styles['sitemapPanelItem']}
                            key={`${group.id}-${item.label}`}
                          >
                            <HeaderNavigationLink
                              aria-disabled={item.isPlaceholder || undefined}
                              className={styles['sitemapTileLink']}
                              link={item}
                              onClick={(event) => {
                                handleNavigationLinkClick(event, item, closeDesktopPanels);
                              }}
                            >
                              <span>{item.label}</span>
                              <span aria-hidden='true' className={styles['sitemapTileArrow']}>
                                ›
                              </span>
                            </HeaderNavigationLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <section
        className={classNames(styles['allMenu'], isAllMenuOpen && styles['allMenuVisible'])}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsAllMenuOpen(false);
          }
        }}
      >
        <button
          aria-label='전체 메뉴 닫기'
          className={styles['allMenuClose']}
          onClick={() => {
            setIsAllMenuOpen(false);
          }}
          type='button'
        >
          <CloseIcon />
        </button>

        <div className={styles['allMenuInner']}>
          <ul className={styles['allMenuColumns']}>
            {headerMenuGroups.map((group) => {
              return (
                <li className={styles['allMenuColumn']} key={group.id}>
                  <HeaderNavigationLink
                    aria-disabled={group.isPlaceholder || undefined}
                    className={styles['allMenuTitle']}
                    link={group}
                    onClick={(event) => {
                      handleNavigationLinkClick(event, group, closeOverlays);
                    }}
                  >
                    {group.label}
                  </HeaderNavigationLink>

                  <ul className={styles['allMenuList']}>
                    {group.items.map((item) => {
                      return (
                        <li
                          className={classNames(
                            styles['allMenuItem'],
                            Boolean(item.children?.length) && styles['allMenuItemSplit'],
                          )}
                          key={`${group.id}-${item.label}`}
                        >
                          <HeaderNavigationLink
                            aria-disabled={item.isPlaceholder || undefined}
                            className={styles['allMenuItemLink']}
                            link={item}
                            onClick={(event) => {
                              handleNavigationLinkClick(event, item, closeOverlays);
                            }}
                          >
                            {item.label}
                          </HeaderNavigationLink>

                          {item.children?.length ? (
                            <ul className={styles['allMenuNestedList']}>
                              {item.children.map((child) => {
                                return (
                                  <li key={`${item.label}-${child.label}`}>
                                    <HeaderNavigationLink
                                      aria-disabled={child.isPlaceholder || undefined}
                                      link={child}
                                      onClick={(event) => {
                                        handleNavigationLinkClick(event, child, closeOverlays);
                                      }}
                                    >
                                      {child.label}
                                    </HeaderNavigationLink>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div
        className={classNames(
          styles['mobileBackdrop'],
          isMobileNavOpen && styles['mobileBackdropVisible'],
        )}
        onClick={closeOverlays}
      />

      <aside
        aria-hidden={!isMobileNavOpen}
        className={classNames(styles['mobileNav'], isMobileNavOpen && styles['mobileNavVisible'])}
      >
        <div className={styles['mobileNavHeader']}>
          <div className={styles['mobileLogoBox']}>
            <Link
              className={styles['mobileLogoLink']}
              onClick={handleLogoClick}
              to={routePaths.home}
            >
              <img alt={headerAssets.logoAlt} className={styles['logo']} src={headerAssets.logo} />
            </Link>

            <button
              aria-label='모바일 메뉴 닫기'
              className={styles['mobileClose']}
              onClick={() => {
                setIsMobileNavOpen(false);
              }}
              type='button'
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className={styles['mobileNavBody']}>
          <ul className={styles['mobileDepth1List']}>
            {headerMenuGroups.map((group) => {
              const isExpanded = expandedMobileGroups.includes(group.id);
              const hasExpandableChildren = group.hoverItems.length > 0 && !group.to;
              const isGroupActive = isExpanded || isCurrentGroupRoute(group);

              return (
                <li
                  className={classNames(
                    styles['mobileDepth1Item'],
                    hasExpandableChildren && styles['mobileDepth1ItemDown'],
                  )}
                  key={group.id}
                >
                  <HeaderNavigationLink
                    aria-expanded={hasExpandableChildren ? isExpanded : undefined}
                    className={classNames(
                      styles['mobileDepth1Link'],
                      isGroupActive && styles['mobileDepth1LinkActive'],
                    )}
                    link={group}
                    onClick={(event) => {
                      if (hasExpandableChildren) {
                        event.preventDefault();
                        toggleMobileGroup(group.id);
                        return;
                      }

                      handleNavigationLinkClick(event, group, closeOverlays);
                    }}
                  >
                    <span>{group.label}</span>
                    {hasExpandableChildren ? (
                      <ChevronDownIcon
                        className={classNames(
                          styles['mobileChevron'],
                          isExpanded && styles['mobileChevronOpen'],
                        )}
                      />
                    ) : null}
                  </HeaderNavigationLink>

                  {hasExpandableChildren ? (
                    <ul
                      className={classNames(
                        styles['mobileDepth2List'],
                        isExpanded && styles['mobileDepth2ListVisible'],
                      )}
                    >
                      {group.hoverItems.map((item) => {
                        return (
                          <li
                            className={styles['mobileDepth2Item']}
                            key={`${group.id}-${item.label}`}
                          >
                            <HeaderNavigationLink
                              aria-disabled={item.isPlaceholder || undefined}
                              className={styles['mobileDepth2Link']}
                              link={item}
                              onClick={(event) => {
                                handleNavigationLinkClick(event, item, closeOverlays);
                              }}
                            >
                              {item.label}
                            </HeaderNavigationLink>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default HaatzHeader;
