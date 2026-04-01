import { useEffect, useState } from 'react';

import { POPUP_REVEAL_DELAY_MS } from '@/features/haatzHome/components/haatzHero';
import { noticePopup } from '@/features/haatzHome/data';
import { getTomorrowTimestamp, isHiddenUntilActive } from '@/features/haatzHome/utils';
import { useHaatzHomeUiStore } from '@/stores/useHaatzHomeUiStore';
import { classNames } from '@/utils/classNames';

import styles from './NoticePopup.module.scss';

const POPUP_FADE_REVEAL_DURATION_MS = 24;

const NoticePopup = () => {
  const [shouldHideToday, setShouldHideToday] = useState(false);
  const dismissPopup = useHaatzHomeUiStore((state) => state.dismissPopup);
  const finishPopupReveal = useHaatzHomeUiStore((state) => state.finishPopupReveal);
  const introPhase = useHaatzHomeUiStore((state) => state.introPhase);
  const popupEligible = useHaatzHomeUiStore((state) => state.popupEligible);
  const popupPhase = useHaatzHomeUiStore((state) => state.popupPhase);
  const setPopupEligible = useHaatzHomeUiStore((state) => state.setPopupEligible);
  const startPopupReveal = useHaatzHomeUiStore((state) => state.startPopupReveal);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setPopupEligible(false);
      return;
    }

    const hiddenUntil = window.localStorage.getItem(noticePopup.storageKey);
    setPopupEligible(!isHiddenUntilActive(hiddenUntil));
  }, [setPopupEligible]);

  useEffect(() => {
    if (!popupEligible || popupPhase !== 'hidden' || introPhase !== 'complete') {
      return;
    }

    const timerId = window.setTimeout(() => {
      startPopupReveal();
    }, POPUP_REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [introPhase, popupEligible, popupPhase, startPopupReveal]);

  useEffect(() => {
    if (popupPhase !== 'revealing') {
      return;
    }

    const timerId = window.setTimeout(() => {
      finishPopupReveal();
    }, POPUP_FADE_REVEAL_DURATION_MS);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [finishPopupReveal, popupPhase]);

  useEffect(() => {
    if (popupPhase === 'hidden' || popupPhase === 'dismissed') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (typeof window !== 'undefined' && shouldHideToday) {
          window.localStorage.setItem(noticePopup.storageKey, String(getTomorrowTimestamp()));
        }

        dismissPopup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismissPopup, popupPhase, shouldHideToday]);

  const handleClose = () => {
    if (typeof window !== 'undefined' && shouldHideToday) {
      window.localStorage.setItem(noticePopup.storageKey, String(getTomorrowTimestamp()));
    }

    dismissPopup();
  };

  if (!popupEligible || popupPhase === 'hidden' || popupPhase === 'dismissed') {
    return null;
  }

  return (
    <div
      aria-label={noticePopup.cta.label}
      aria-modal='true'
      className={classNames(
        styles['overlay'],
        popupPhase === 'visible' && styles['overlayInteractive'],
      )}
      role='dialog'
    >
      <div
        className={classNames(
          styles['panel'],
          popupPhase === 'revealing' && styles['panelRevealing'],
          popupPhase === 'visible' && styles['panelVisible'],
        )}
      >
        <div className={styles['body']}>
          <a
            className={styles['imageLink']}
            href={noticePopup.cta.href}
            target={noticePopup.cta.target}
          >
            <img alt={noticePopup.imageAlt} src={noticePopup.imageSrc} />
          </a>
        </div>

        <div className={styles['footer']}>
          <label className={styles['checkboxLabel']}>
            <input
              checked={shouldHideToday}
              onChange={(event) => {
                setShouldHideToday(event.currentTarget.checked);
              }}
              type='checkbox'
            />
            <span>오늘 열지 않기</span>
          </label>

          <button className={styles['closeButton']} onClick={handleClose} type='button'>
            <span>닫기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;
