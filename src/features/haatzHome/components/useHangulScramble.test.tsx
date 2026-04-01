import { useEffect } from 'react';

import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildSyllableVariants,
  composeHangulSyllable,
  createHangulScrambleModel,
  createSeededRandom,
  decomposeHangulSyllable,
  isHangulSyllable,
  renderHangulScrambleFrame,
  useHangulScramble,
} from '@/features/haatzHome/components/useHangulScramble';

const SCRAMBLE_TEXT = '냉장·냉동을 넘어';
const STANDALONE_JAMO_REGEX = /[ㄱ-ㅎㅏ-ㅣ]/;

const createMatchMedia = (reducedMotion: boolean) => {
  return (query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? reducedMotion : query.includes('dark'),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  });
};

const ScrambleProbe = ({ onAnimationEnd }: { onAnimationEnd?: () => void }) => {
  const { ref, replay } = useHangulScramble({
    durationMs: 300,
    frameMs: 30,
    ignoreChars: [' ', '·'],
    playOnMount: false,
    readableHoldMs: 60,
    revealMode: 'sequential',
    seedKey: 'hero-intro-test',
    text: SCRAMBLE_TEXT,
    ...(onAnimationEnd ? { onAnimationEnd } : {}),
  });

  useEffect(() => {
    replay();
  }, [replay]);

  return (
    <span data-testid='scramble-text' ref={ref}>
      {SCRAMBLE_TEXT}
    </span>
  );
};

const getMutableRevealStates = (currentText: string, finalText: string) => {
  const currentCharacters = Array.from(currentText);
  const finalCharacters = Array.from(finalText);

  expect(currentCharacters).toHaveLength(finalCharacters.length);

  return finalCharacters.reduce<boolean[]>((result, finalCharacter, index) => {
    if (finalCharacter === ' ' || finalCharacter === '·') {
      expect(currentCharacters[index]).toBe(finalCharacter);
      return result;
    }

    result.push(currentCharacters[index] === finalCharacter);

    return result;
  }, []);
};

const expectAllMutableCharactersToStayScrambled = (currentText: string, finalText: string) => {
  getMutableRevealStates(currentText, finalText).forEach((isRevealed) => {
    expect(isRevealed).toBe(false);
  });
};

const expectSequentialRevealInProgress = (currentText: string, finalText: string) => {
  const mutableRevealStates = getMutableRevealStates(currentText, finalText);

  expect(mutableRevealStates.some(Boolean)).toBe(true);
  expect(mutableRevealStates.some((isRevealed) => !isRevealed)).toBe(true);

  let sawScrambledCharacter = false;
  mutableRevealStates.forEach((isRevealed) => {
    if (!isRevealed) {
      sawScrambledCharacter = true;
    }

    if (sawScrambledCharacter) {
      expect(isRevealed).toBe(false);
    }
  });
};

describe('useHangulScramble', () => {
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalMatchMedia = window.matchMedia;
  const originalRequestAnimationFrame = window.requestAnimationFrame;

  beforeEach(() => {
    vi.useFakeTimers();

    window.matchMedia = createMatchMedia(false);
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      return window.setTimeout(() => {
        callback(performance.now());
      }, 16);
    };
    window.cancelAnimationFrame = (handle: number) => {
      window.clearTimeout(handle);
    };
  });

  afterEach(() => {
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    vi.useRealTimers();
  });

  it('round-trips modern Hangul syllables through decomposition and composition', () => {
    const coldParts = decomposeHangulSyllable('냉');
    const freezeParts = decomposeHangulSyllable('동');
    const finalParts = decomposeHangulSyllable('로');

    if (!coldParts || !freezeParts || !finalParts) {
      throw new Error('현대 한글 음절 분해에 실패했습니다.');
    }

    expect(composeHangulSyllable(coldParts)).toBe('냉');
    expect(composeHangulSyllable(freezeParts)).toBe('동');
    expect(composeHangulSyllable(finalParts)).toBe('로');
  });

  it('builds only precomposed Hangul variants and keeps the target syllable last', () => {
    const variants = buildSyllableVariants('성');

    expect(variants.at(-1)).toBe('성');
    expect(variants.some((value) => value !== '성')).toBe(true);
    expect(variants.every((value) => isHangulSyllable(value))).toBe(true);
    expect(variants.join('')).not.toMatch(STANDALONE_JAMO_REGEX);
  });

  it('uses the same seeded random sequence for the same key', () => {
    const randomA = createSeededRandom('hero-seed');
    const randomB = createSeededRandom('hero-seed');

    expect([randomA(), randomA(), randomA()]).toEqual([randomB(), randomB(), randomB()]);
  });

  it('renders intermediate scramble frames with only complete Hangul syllables', () => {
    const model = createHangulScrambleModel({
      durationMs: 300,
      frameMs: 30,
      ignoreChars: [' ', '·'],
      readableHoldMs: 60,
      revealMode: 'sequential',
      seedKey: 'hero-frame-test',
      text: SCRAMBLE_TEXT,
    });
    const frame = renderHangulScrambleFrame(model, 150);

    expect(frame).toContain('·');
    expect(frame).not.toMatch(STANDALONE_JAMO_REGEX);
    expect(frame).not.toBe(SCRAMBLE_TEXT);
    expectSequentialRevealInProgress(frame, SCRAMBLE_TEXT);
  });

  it('reveals sequential lock times from left to right', () => {
    const model = createHangulScrambleModel({
      durationMs: 300,
      frameMs: 30,
      ignoreChars: [' ', '·'],
      readableHoldMs: 60,
      revealMode: 'sequential',
      seedKey: 'hero-sequential-order-test',
      text: SCRAMBLE_TEXT,
    });
    const mutableCharacters = model.characters.filter((character) => !character.isFixed);
    const lockTimeline = mutableCharacters.map((character) => character.lockAtMs);

    expect(lockTimeline).toEqual([...lockTimeline].sort((left, right) => left - right));
    expect(lockTimeline[0]).toBeGreaterThan(0);
    expect(lockTimeline.at(-1)).toBeLessThan(240);
  });

  it('stabilizes a refined syllable right before sequential lock', () => {
    const model = createHangulScrambleModel({
      durationMs: 300,
      frameMs: 30,
      ignoreChars: [' ', '·'],
      readableHoldMs: 60,
      revealMode: 'sequential',
      seedKey: 'hero-settle-test',
      text: SCRAMBLE_TEXT,
    });
    const targetIndex = model.characters.findIndex((character) => !character.isFixed);
    const targetCharacter = model.characters[targetIndex];

    expect(targetIndex).toBeGreaterThanOrEqual(0);
    expect(targetCharacter.settleAtMs).toBeLessThan(targetCharacter.lockAtMs);

    const firstNearLockFrame = renderHangulScrambleFrame(model, targetCharacter.settleAtMs + 1);
    const secondNearLockFrame = renderHangulScrambleFrame(model, targetCharacter.lockAtMs - 1);

    expect(firstNearLockFrame[targetIndex]).toBe(secondNearLockFrame[targetIndex]);
    expect(firstNearLockFrame[targetIndex]).not.toBe(SCRAMBLE_TEXT[targetIndex]);
  });

  it('keeps simultaneous mode available for shared-threshold reveal', () => {
    const model = createHangulScrambleModel({
      durationMs: 300,
      frameMs: 30,
      ignoreChars: [' ', '·'],
      readableHoldMs: 60,
      revealMode: 'simultaneous',
      seedKey: 'hero-threshold-test',
      text: SCRAMBLE_TEXT,
    });
    const mutableCharacters = model.characters.filter((character) => !character.isFixed);
    const beforeRevealFrame = renderHangulScrambleFrame(model, 239);
    const revealFrame = renderHangulScrambleFrame(model, 240);

    expect(new Set(mutableCharacters.map((character) => character.lockAtMs))).toEqual(
      new Set([240]),
    );
    expectAllMutableCharactersToStayScrambled(beforeRevealFrame, SCRAMBLE_TEXT);
    expect(revealFrame).toBe(SCRAMBLE_TEXT);
  });

  it('replays to the final text and never emits standalone jamo during the run', () => {
    const onAnimationEnd = vi.fn();

    render(<ScrambleProbe onAnimationEnd={onAnimationEnd} />);

    const scrambleText = screen.getByTestId('scramble-text');

    act(() => {
      vi.advanceTimersByTime(180);
    });

    expect(scrambleText.textContent).toContain('·');
    expect(scrambleText.textContent).not.toMatch(STANDALONE_JAMO_REGEX);
    expectSequentialRevealInProgress(scrambleText.textContent, SCRAMBLE_TEXT);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(scrambleText).toHaveTextContent(SCRAMBLE_TEXT);
    expect(onAnimationEnd).toHaveBeenCalledTimes(1);
  });

  it('respects prefers-reduced-motion by rendering the final text immediately', () => {
    const onAnimationEnd = vi.fn();

    window.matchMedia = createMatchMedia(true);

    render(<ScrambleProbe onAnimationEnd={onAnimationEnd} />);

    expect(screen.getByTestId('scramble-text')).toHaveTextContent(SCRAMBLE_TEXT);
    expect(onAnimationEnd).toHaveBeenCalledTimes(1);
  });
});
