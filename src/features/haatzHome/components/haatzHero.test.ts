import { describe, expect, it } from 'vitest';

import {
  getHeaderDownState,
  getIntroHeaderHiddenState,
  getHeroIntroPhases,
  getHeroIntroVisualCompleteDelay,
  HEADER_HIDE_SCROLL_THRESHOLD_PX,
  HERO_INTRO_DOT_CURSOR_BLINK_DURATION_MS,
  HERO_INTRO_INITIAL_HOLD_MS,
  HERO_INTRO_TYPING_DURATION_MS,
  HERO_INTRO_UNLOCK_DELAY_MS,
  HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS,
  HERO_INTRO_VIDEO_PREVIEW_LEAD_MS,
  HERO_INTRO_VIDEO_PREVIEW_START_DELAY_MS,
} from '@/features/haatzHome/components/haatzHero';

describe('haatzHero helpers', () => {
  it('returns the same intro timing sequence as the reference hero', () => {
    expect(HERO_INTRO_TYPING_DURATION_MS).toBe(2000);
    expect(HERO_INTRO_DOT_CURSOR_BLINK_DURATION_MS).toBe(2000);
    expect(HERO_INTRO_INITIAL_HOLD_MS).toBe(4000);
    expect(getHeroIntroPhases()).toEqual([
      { delay: 4000, phase: 'on1' },
      { delay: 4600, phase: 'on2' },
      { delay: 5200, phase: 'on3' },
    ]);
    expect(HERO_INTRO_VIDEO_PREVIEW_LEAD_MS).toBe(180);
    expect(HERO_INTRO_VIDEO_PREVIEW_START_DELAY_MS).toBe(4420);
    expect(HERO_INTRO_VIDEO_PLAYBACK_START_DELAY_MS).toBe(4600);
    expect(HERO_INTRO_UNLOCK_DELAY_MS).toBe(5800);
    expect(getHeroIntroVisualCompleteDelay(1600)).toBe(6250);
    expect(getHeroIntroVisualCompleteDelay(768)).toBe(7450);
  });

  it('matches the reference header hide threshold on desktop scroll', () => {
    expect(HEADER_HIDE_SCROLL_THRESHOLD_PX).toBe(10);
    expect(
      getHeaderDownState({
        currentScrollY: 120,
        lastScrollY: 100,
        viewportWidth: 1440,
      }),
    ).toEqual({
      nextScrollY: 120,
      shouldHide: true,
    });
    expect(
      getHeaderDownState({
        currentScrollY: 105,
        lastScrollY: 100,
        viewportWidth: 1440,
      }),
    ).toEqual({
      nextScrollY: 105,
      shouldHide: null,
    });
    expect(
      getHeaderDownState({
        currentScrollY: 80,
        lastScrollY: 120,
        viewportWidth: 1440,
      }),
    ).toEqual({
      nextScrollY: 80,
      shouldHide: false,
    });
    expect(
      getHeaderDownState({
        currentScrollY: 120,
        lastScrollY: 100,
        viewportWidth: 1024,
      }),
    ).toEqual({
      nextScrollY: 120,
      shouldHide: false,
    });
  });

  it('keeps the header hidden until the popup reveal timing is satisfied', () => {
    expect(
      getIntroHeaderHiddenState({
        fallbackDelayElapsed: false,
        introPhase: 'active',
        popupEligible: true,
        popupPhase: 'hidden',
      }),
    ).toBe(true);

    expect(
      getIntroHeaderHiddenState({
        fallbackDelayElapsed: false,
        introPhase: 'complete',
        popupEligible: true,
        popupPhase: 'hidden',
      }),
    ).toBe(true);

    expect(
      getIntroHeaderHiddenState({
        fallbackDelayElapsed: false,
        introPhase: 'complete',
        popupEligible: true,
        popupPhase: 'revealing',
      }),
    ).toBe(false);

    expect(
      getIntroHeaderHiddenState({
        fallbackDelayElapsed: false,
        introPhase: 'complete',
        popupEligible: true,
        popupPhase: 'visible',
      }),
    ).toBe(false);

    expect(
      getIntroHeaderHiddenState({
        fallbackDelayElapsed: false,
        introPhase: 'complete',
        popupEligible: false,
        popupPhase: 'hidden',
      }),
    ).toBe(true);

    expect(
      getIntroHeaderHiddenState({
        fallbackDelayElapsed: true,
        introPhase: 'complete',
        popupEligible: false,
        popupPhase: 'hidden',
      }),
    ).toBe(false);
  });
});
