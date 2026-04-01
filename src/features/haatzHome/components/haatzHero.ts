export const HERO_INTRO_TYPING_DURATION_MS = 2000;
export const HERO_INTRO_TYPING_LINE_PAUSE_MS = 60;
export const HERO_INTRO_TYPING_DOT_REVEAL_DELAY_MS = 140;
export const HERO_INTRO_DOT_CURSOR_BLINK_CYCLE_MS = 400;
export const HERO_INTRO_DOT_CURSOR_BLINK_COUNT = 5;
export const HERO_INTRO_DOT_CURSOR_BLINK_DURATION_MS =
  HERO_INTRO_DOT_CURSOR_BLINK_CYCLE_MS * HERO_INTRO_DOT_CURSOR_BLINK_COUNT;
export const HERO_INTRO_INITIAL_HOLD_MS =
  HERO_INTRO_TYPING_DURATION_MS + HERO_INTRO_DOT_CURSOR_BLINK_DURATION_MS;
export const HERO_INTRO_STEP_DELAY_MS = 600;
export const HERO_INTRO_VIDEO_PREVIEW_LEAD_MS = 180;
export const HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS =
  HERO_INTRO_INITIAL_HOLD_MS + HERO_INTRO_STEP_DELAY_MS;
export const HERO_INTRO_VIDEO_PREVIEW_START_DELAY_MS = Math.max(
  0,
  HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS - HERO_INTRO_VIDEO_PREVIEW_LEAD_MS,
);
export const HERO_INTRO_UNLOCK_DELAY_MS = HERO_INTRO_INITIAL_HOLD_MS + HERO_INTRO_STEP_DELAY_MS * 3;
export const HERO_LAST_CAPSULE_DELAY_MS = 450;
export const HERO_CAPSULE_TRANSITION_DURATION_MS = 600;
export const HERO_CAPSULE_TRANSITION_DURATION_MOBILE_MS = 1800;
export const HERO_CAPSULE_TRANSITION_MOBILE_BREAKPOINT_PX = 768;
export const POPUP_REVEAL_DELAY_MS = 180;

export const HEADER_HIDE_SCROLL_THRESHOLD_PX = 10;

export type HeroIntroPhase = 'on1' | 'on2' | 'on3';
export type IntroPhase = 'idle' | 'active' | 'settling' | 'complete';
export type PopupPhase = 'hidden' | 'revealing' | 'visible' | 'dismissed';

interface HeaderDownStateParams {
  currentScrollY: number;
  lastScrollY: number;
  viewportWidth: number;
}

interface IntroHeaderHiddenStateParams {
  fallbackDelayElapsed: boolean;
  introPhase: IntroPhase;
  popupEligible: boolean;
  popupPhase: PopupPhase;
}

export const getHeroIntroPhases = () => {
  return [
    { delay: HERO_INTRO_INITIAL_HOLD_MS, phase: 'on1' },
    { delay: HERO_INTRO_INITIAL_HOLD_MS + HERO_INTRO_STEP_DELAY_MS, phase: 'on2' },
    { delay: HERO_INTRO_INITIAL_HOLD_MS + HERO_INTRO_STEP_DELAY_MS * 2, phase: 'on3' },
  ] satisfies ReadonlyArray<{ delay: number; phase: HeroIntroPhase }>;
};

export const getHeroIntroVisualCompleteDelay = (viewportWidth: number) => {
  const capsuleTransitionDuration =
    viewportWidth <= HERO_CAPSULE_TRANSITION_MOBILE_BREAKPOINT_PX
      ? HERO_CAPSULE_TRANSITION_DURATION_MOBILE_MS
      : HERO_CAPSULE_TRANSITION_DURATION_MS;

  return (
    HERO_INTRO_INITIAL_HOLD_MS +
    HERO_INTRO_STEP_DELAY_MS * 2 +
    HERO_LAST_CAPSULE_DELAY_MS +
    capsuleTransitionDuration
  );
};

export const getHeaderDownState = ({
  currentScrollY,
  lastScrollY,
  viewportWidth,
}: HeaderDownStateParams) => {
  if (viewportWidth <= 1024 || currentScrollY < 0) {
    return {
      nextScrollY: currentScrollY,
      shouldHide: false,
    };
  }

  const scrollDifference = currentScrollY - lastScrollY;

  if (Math.abs(scrollDifference) < HEADER_HIDE_SCROLL_THRESHOLD_PX) {
    return {
      nextScrollY: currentScrollY,
      shouldHide: null,
    };
  }

  return {
    nextScrollY: currentScrollY,
    shouldHide: scrollDifference > 0,
  };
};

export const getIntroHeaderHiddenState = ({
  fallbackDelayElapsed,
  introPhase,
  popupEligible,
  popupPhase,
}: IntroHeaderHiddenStateParams) => {
  if (introPhase !== 'complete') {
    return true;
  }

  if (!popupEligible) {
    return !fallbackDelayElapsed;
  }

  return popupPhase === 'hidden';
};
