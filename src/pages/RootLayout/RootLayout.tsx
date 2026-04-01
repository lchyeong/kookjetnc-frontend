import { useLayoutEffect, useRef } from 'react';

import { NavigationType, Outlet, useLocation, useNavigationType } from 'react-router-dom';

import HaatzFooter from '@/features/haatzHome/components/HaatzFooter';
import HaatzHeader from '@/features/haatzHome/components/HaatzHeader';
import NoticePopup from '@/features/haatzHome/components/NoticePopup';
import QuickMenu from '@/features/haatzHome/components/QuickMenu';
import { isCatalogRoute, routePaths } from '@/routes/routeRegistry';
import { useHaatzHomeUiStore } from '@/stores/useHaatzHomeUiStore';
import { classNames } from '@/utils/classNames';

import styles from './RootLayout.module.scss';
import {
  getDocumentScrollTop,
  isScrollLockKey,
  restoreDocumentScrollTop,
} from './rootLayoutScrollLock';

const RootLayout = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isAboutHistoryRoute = location.pathname === routePaths.aboutHistory;
  const isHomeRoute = location.pathname === routePaths.home;
  const isCatalogPageRoute = isCatalogRoute(location.pathname);
  const isFullBleedRoute = isHomeRoute || isAboutHistoryRoute;
  const shouldClipMainX = isHomeRoute;
  const shouldShowQuickMenu = isHomeRoute || isCatalogPageRoute;
  const introPhase = useHaatzHomeUiStore((state) => state.introPhase);
  const resetHomeUi = useHaatzHomeUiStore((state) => state.resetHomeUi);
  const heroSectionSelector = isHomeRoute ? '[data-testid="haatz-hero-section"]' : undefined;
  const scrollPositionsRef = useRef(new Map<string, number>());
  const previousLocationKeyRef = useRef(location.key);

  useLayoutEffect(() => {
    const previousLocationKey = previousLocationKeyRef.current;

    if (previousLocationKey !== location.key) {
      scrollPositionsRef.current.set(previousLocationKey, getDocumentScrollTop());
    }

    const nextScrollTop =
      isHomeRoute || navigationType !== NavigationType.Pop
        ? 0
        : (scrollPositionsRef.current.get(location.key) ?? 0);

    restoreDocumentScrollTop(nextScrollTop);
    previousLocationKeyRef.current = location.key;
  }, [isHomeRoute, location.key, navigationType]);

  useLayoutEffect(() => {
    document.body.classList.toggle('haatz-home-route', isHomeRoute);

    if (!isHomeRoute) {
      document.body.classList.remove('haatz-home-intro-active');
      document.body.classList.remove('haatz-home-intro-complete');
      resetHomeUi();
    }

    return () => {
      document.body.classList.remove('haatz-home-route');
      document.body.classList.remove('haatz-home-intro-active');
      document.body.classList.remove('haatz-home-intro-complete');
    };
  }, [isHomeRoute, resetHomeUi]);

  useLayoutEffect(() => {
    if (!isHomeRoute) return;

    const isIntroActive = introPhase === 'active';
    const isIntroComplete = introPhase === 'complete';

    document.body.classList.toggle('haatz-home-intro-active', isIntroActive);
    document.body.classList.toggle('haatz-home-intro-complete', isIntroComplete);
  }, [introPhase, isHomeRoute]);

  useLayoutEffect(() => {
    if (!isHomeRoute || introPhase !== 'active') {
      return;
    }

    const lockedScrollTop = getDocumentScrollTop();

    const keepScrollPosition = () => {
      if (getDocumentScrollTop() === lockedScrollTop) {
        return;
      }

      restoreDocumentScrollTop(lockedScrollTop);
    };

    const preventScrollInput = (event: Event) => {
      event.preventDefault();
      keepScrollPosition();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isScrollLockKey(event.key)) {
        return;
      }

      preventScrollInput(event);
    };

    keepScrollPosition();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', keepScrollPosition, { passive: true });
    window.addEventListener('touchmove', preventScrollInput, { passive: false });
    window.addEventListener('wheel', preventScrollInput, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', keepScrollPosition);
      window.removeEventListener('touchmove', preventScrollInput);
      window.removeEventListener('wheel', preventScrollInput);
    };
  }, [introPhase, isHomeRoute]);

  return (
    <div className={styles['shell']}>
      {isHomeRoute ? <NoticePopup /> : null}
      <HaatzHeader
        heroSectionSelector={heroSectionSelector}
        isHomeRoute={isHomeRoute}
        key={`${location.pathname}${location.search}`}
      />

      <main
        className={classNames(
          styles['main'],
          isFullBleedRoute && styles['mainFullBleed'],
          shouldClipMainX && styles['mainClipX'],
          isHomeRoute && styles['mainHome'],
        )}
      >
        <Outlet />
      </main>

      <HaatzFooter />
      {shouldShowQuickMenu ? <QuickMenu /> : null}
    </div>
  );
};

export default RootLayout;
