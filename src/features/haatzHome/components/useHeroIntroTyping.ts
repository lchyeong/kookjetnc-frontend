import { useCallback, useEffect, useRef } from 'react';

import type { TypewriterClass } from 'typewriter-effect';
import TypewriterCore from 'typewriter-effect/dist/core';

import {
  HERO_INTRO_DOT_CURSOR_BLINK_COUNT,
  HERO_INTRO_DOT_CURSOR_BLINK_CYCLE_MS,
  HERO_INTRO_TYPING_DOT_REVEAL_DELAY_MS,
  HERO_INTRO_TYPING_DURATION_MS,
  HERO_INTRO_TYPING_LINE_PAUSE_MS,
} from '@/features/haatzHome/components/haatzHero';

export type HeroIntroCursorLine = 'top' | 'bottom' | 'dot' | 'hidden';

interface UseHeroIntroTypingOptions {
  bottomText: string;
  dotCursorBlinkCount?: number;
  dotCursorBlinkCycleMs?: number;
  dotRevealDelayMs?: number;
  linePauseMs?: number;
  onAnimationEnd?: () => void;
  onCursorLineChange?: (line: HeroIntroCursorLine) => void;
  onDotReveal?: () => void;
  onTypingStart?: () => void;
  playOnMount?: boolean;
  topText: string;
  totalDurationMs?: number;
}

const DEFAULT_LINE_PAUSE_MS = HERO_INTRO_TYPING_LINE_PAUSE_MS;
const DEFAULT_DOT_REVEAL_DELAY_MS = HERO_INTRO_TYPING_DOT_REVEAL_DELAY_MS;
const DEFAULT_DOT_CURSOR_BLINK_CYCLE_MS = HERO_INTRO_DOT_CURSOR_BLINK_CYCLE_MS;
const DEFAULT_DOT_CURSOR_BLINK_COUNT = HERO_INTRO_DOT_CURSOR_BLINK_COUNT;
const DEFAULT_TOTAL_DURATION_MS = HERO_INTRO_TYPING_DURATION_MS;

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useHeroIntroTyping = ({
  bottomText,
  dotCursorBlinkCount = DEFAULT_DOT_CURSOR_BLINK_COUNT,
  dotCursorBlinkCycleMs = DEFAULT_DOT_CURSOR_BLINK_CYCLE_MS,
  dotRevealDelayMs = DEFAULT_DOT_REVEAL_DELAY_MS,
  linePauseMs = DEFAULT_LINE_PAUSE_MS,
  onAnimationEnd,
  onCursorLineChange,
  onDotReveal,
  onTypingStart,
  playOnMount = true,
  topText,
  totalDurationMs = DEFAULT_TOTAL_DURATION_MS,
}: UseHeroIntroTypingOptions) => {
  const topTextRef = useRef<HTMLElement | null>(null);
  const bottomTextRef = useRef<HTMLElement | null>(null);
  const typewriterRef = useRef<TypewriterClass | null>(null);
  const animationIdRef = useRef(0);
  const onAnimationEndRef = useRef(onAnimationEnd);
  const onCursorLineChangeRef = useRef(onCursorLineChange);
  const onDotRevealRef = useRef(onDotReveal);
  const onTypingStartRef = useRef(onTypingStart);

  useEffect(() => {
    onAnimationEndRef.current = onAnimationEnd;
  }, [onAnimationEnd]);

  useEffect(() => {
    onCursorLineChangeRef.current = onCursorLineChange;
  }, [onCursorLineChange]);

  useEffect(() => {
    onDotRevealRef.current = onDotReveal;
  }, [onDotReveal]);

  useEffect(() => {
    onTypingStartRef.current = onTypingStart;
  }, [onTypingStart]);

  const stopTypewriter = useCallback(() => {
    const activeTypewriter = typewriterRef.current;

    typewriterRef.current = null;
    activeTypewriter?.stop();
  }, []);

  const renderText = useCallback((node: HTMLElement | null, value: string) => {
    if (!node || node.textContent === value) {
      return;
    }

    node.textContent = value;
  }, []);

  const clearRenderedText = useCallback(() => {
    renderText(topTextRef.current, '');
    renderText(bottomTextRef.current, '');
  }, [renderText]);

  const replay = useCallback(() => {
    const topNode = topTextRef.current;
    const bottomNode = bottomTextRef.current;

    if (!topNode || !bottomNode) {
      return;
    }

    animationIdRef.current += 1;
    const animationId = animationIdRef.current;

    stopTypewriter();
    clearRenderedText();
    onTypingStartRef.current?.();

    if (prefersReducedMotion()) {
      renderText(topNode, topText);
      renderText(bottomNode, bottomText);
      onDotRevealRef.current?.();
      onCursorLineChangeRef.current?.('hidden');
      onAnimationEndRef.current?.();

      return;
    }

    const totalCharacterCount = Array.from(`${topText}${bottomText}`).length;
    const availableTypingDurationMs = Math.max(
      totalCharacterCount,
      totalDurationMs - linePauseMs - dotRevealDelayMs,
    );
    const characterDelayMs = Math.max(
      1,
      Math.floor(availableTypingDurationMs / Math.max(1, totalCharacterCount)),
    );

    let activeNode = topNode;
    let topRenderedText = '';
    let bottomRenderedText = '';

    const typewriter = new TypewriterCore(null, {
      cursor: '',
      delay: characterDelayMs,
      skipAddStyles: true,
      stringSplitter: (value) => Array.from(value),
      onCreateTextNode: (character) => {
        if (animationIdRef.current !== animationId) {
          return null;
        }

        if (activeNode === topNode) {
          topRenderedText += character;
          renderText(topNode, topRenderedText);

          return null;
        }

        bottomRenderedText += character;
        renderText(bottomNode, bottomRenderedText);

        return null;
      },
    });

    typewriterRef.current = typewriter;
    onCursorLineChangeRef.current?.('top');

    typewriter
      .typeString(topText)
      .pauseFor(linePauseMs)
      .callFunction(() => {
        if (animationIdRef.current !== animationId) {
          return;
        }

        activeNode = bottomNode;
        onCursorLineChangeRef.current?.('bottom');
      })
      .typeString(bottomText)
      .pauseFor(dotRevealDelayMs)
      .callFunction(() => {
        if (animationIdRef.current !== animationId) {
          return;
        }

        onDotRevealRef.current?.();
        onCursorLineChangeRef.current?.('dot');
      })
      .pauseFor(dotCursorBlinkCount * dotCursorBlinkCycleMs)
      .callFunction(() => {
        if (animationIdRef.current !== animationId) {
          return;
        }

        onCursorLineChangeRef.current?.('hidden');
        onAnimationEndRef.current?.();
      })
      .start();
  }, [
    bottomText,
    clearRenderedText,
    dotCursorBlinkCount,
    dotCursorBlinkCycleMs,
    dotRevealDelayMs,
    linePauseMs,
    renderText,
    stopTypewriter,
    topText,
    totalDurationMs,
  ]);

  useEffect(() => {
    if (playOnMount) {
      replay();
    } else {
      clearRenderedText();
    }

    return () => {
      stopTypewriter();
      animationIdRef.current += 1;
    };
  }, [clearRenderedText, playOnMount, replay, stopTypewriter]);

  return {
    bottomTextRef,
    replay,
    topTextRef,
  };
};
