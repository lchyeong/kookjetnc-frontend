import { useCallback, useEffect, useRef } from 'react';

const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
const HANGUL_JUNGSEONG_COUNT = 21;
const HANGUL_JONGSEONG_COUNT = 28;
const DEFAULT_FRAME_MS = 48;
const DEFAULT_DURATION_MS = 960;
const DEFAULT_READABLE_HOLD_MS = 180;
const DEFAULT_REVEAL_MODE = 'sequential';
const DEFAULT_LEAD_IN_MS = 72;
const DEFAULT_IGNORE_CHARS = [' ', '·'] as const;
const DEFAULT_SCRAMBLE_JUNGSEONG_INDICES = [0, 4, 8, 13, 18, 20] as const;
const DEFAULT_SCRAMBLE_JONGSEONG_INDICES = [0, 4, 8, 21] as const;
const DEFAULT_REVEAL_START_RATIO = 0.1;
const DEFAULT_REVEAL_END_RATIO = 0.92;
const DEFAULT_SETTLE_FRAME_COUNT = 1;

export type HangulScrambleRevealMode = 'sequential' | 'simultaneous';

export interface HangulSyllableParts {
  choseongIndex: number;
  jungseongIndex: number;
  jongseongIndex: number;
}

interface HangulScrambleCharacterModel {
  finalChar: string;
  isFixed: boolean;
  lockAtMs: number;
  settleAtMs: number;
  settleVariant: string;
  refinedVariants: string[];
  scrambleVariants: string[];
}

interface HangulScrambleModel {
  characters: HangulScrambleCharacterModel[];
  durationMs: number;
  finalText: string;
  frameMs: number;
  readableHoldMs: number;
  seedKey: string;
}

interface CreateHangulScrambleModelOptions {
  durationMs: number;
  ignoreChars?: readonly string[];
  frameMs?: number;
  readableHoldMs: number;
  revealMode?: HangulScrambleRevealMode;
  seedKey: string;
  text: string;
}

interface UseHangulScrambleOptions {
  durationMs?: number;
  ignoreChars?: readonly string[];
  onAnimationEnd?: () => void;
  playOnMount?: boolean;
  frameMs?: number;
  readableHoldMs?: number;
  revealMode?: HangulScrambleRevealMode;
  seedKey?: string;
  text: string;
}

const hashString = (value: string) => {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

export const createSeededRandom = (seedKey: string) => {
  let state = hashString(seedKey) || 1;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;

    return state / 0x1_0000_0000;
  };
};

export const isHangulSyllable = (value: string) => {
  if (value.length === 0) {
    return false;
  }

  const codePoint = value.codePointAt(0);

  if (typeof codePoint !== 'number') {
    return false;
  }

  return codePoint >= HANGUL_SYLLABLE_START && codePoint <= HANGUL_SYLLABLE_END;
};

export const decomposeHangulSyllable = (value: string): HangulSyllableParts | null => {
  if (!isHangulSyllable(value)) {
    return null;
  }

  const codePoint = value.codePointAt(0);

  if (typeof codePoint !== 'number') {
    return null;
  }

  const syllableOffset = codePoint - HANGUL_SYLLABLE_START;
  const choseongIndex = Math.floor(
    syllableOffset / (HANGUL_JUNGSEONG_COUNT * HANGUL_JONGSEONG_COUNT),
  );
  const jungseongIndex = Math.floor(
    (syllableOffset % (HANGUL_JUNGSEONG_COUNT * HANGUL_JONGSEONG_COUNT)) / HANGUL_JONGSEONG_COUNT,
  );
  const jongseongIndex = syllableOffset % HANGUL_JONGSEONG_COUNT;

  return {
    choseongIndex,
    jungseongIndex,
    jongseongIndex,
  };
};

export const composeHangulSyllable = ({
  choseongIndex,
  jungseongIndex,
  jongseongIndex,
}: HangulSyllableParts) => {
  if (choseongIndex < 0 || choseongIndex >= 19) {
    throw new Error(`유효하지 않은 초성 인덱스입니다: ${String(choseongIndex)}`);
  }

  if (jungseongIndex < 0 || jungseongIndex >= HANGUL_JUNGSEONG_COUNT) {
    throw new Error(`유효하지 않은 중성 인덱스입니다: ${String(jungseongIndex)}`);
  }

  if (jongseongIndex < 0 || jongseongIndex >= HANGUL_JONGSEONG_COUNT) {
    throw new Error(`유효하지 않은 종성 인덱스입니다: ${String(jongseongIndex)}`);
  }

  const codePoint =
    HANGUL_SYLLABLE_START +
    choseongIndex * HANGUL_JUNGSEONG_COUNT * HANGUL_JONGSEONG_COUNT +
    jungseongIndex * HANGUL_JONGSEONG_COUNT +
    jongseongIndex;

  return String.fromCodePoint(codePoint);
};

export const buildSyllableVariants = (targetSyllable: string) => {
  const parts = decomposeHangulSyllable(targetSyllable);

  if (!parts) {
    return [targetSyllable];
  }

  const variants = new Set<string>();
  const jungseongIndices = new Set<number>([
    parts.jungseongIndex,
    ...DEFAULT_SCRAMBLE_JUNGSEONG_INDICES,
  ]);
  const jongseongIndices = new Set<number>([
    parts.jongseongIndex,
    ...DEFAULT_SCRAMBLE_JONGSEONG_INDICES,
  ]);

  for (const jungseongIndex of jungseongIndices) {
    variants.add(
      composeHangulSyllable({
        choseongIndex: parts.choseongIndex,
        jungseongIndex,
        jongseongIndex: 0,
      }),
    );
  }

  for (const jongseongIndex of jongseongIndices) {
    variants.add(
      composeHangulSyllable({
        choseongIndex: parts.choseongIndex,
        jungseongIndex: parts.jungseongIndex,
        jongseongIndex,
      }),
    );
  }

  for (const jungseongIndex of jungseongIndices) {
    if (jungseongIndex === parts.jungseongIndex) {
      continue;
    }

    variants.add(
      composeHangulSyllable({
        choseongIndex: parts.choseongIndex,
        jungseongIndex,
        jongseongIndex: parts.jongseongIndex,
      }),
    );
  }

  variants.delete(targetSyllable);

  return [...variants, targetSyllable];
};

const createScrambleVariants = (targetSyllable: string) => {
  return buildSyllableVariants(targetSyllable).filter((value) => value !== targetSyllable);
};

const createRefinedScrambleVariants = (targetSyllable: string) => {
  const parts = decomposeHangulSyllable(targetSyllable);

  if (!parts) {
    return createScrambleVariants(targetSyllable);
  }

  const variants = new Set<string>();
  const jongseongIndices = new Set<number>([
    parts.jongseongIndex,
    ...DEFAULT_SCRAMBLE_JONGSEONG_INDICES,
  ]);

  for (const jongseongIndex of jongseongIndices) {
    variants.add(
      composeHangulSyllable({
        choseongIndex: parts.choseongIndex,
        jungseongIndex: parts.jungseongIndex,
        jongseongIndex,
      }),
    );
  }

  variants.delete(targetSyllable);

  return variants.size > 0 ? [...variants] : createScrambleVariants(targetSyllable);
};

const easeOutQuad = (value: number) => {
  return 1 - (1 - value) ** 2;
};

const createSequentialLockTimeline = (scrambleCount: number, revealDurationMs: number) => {
  if (scrambleCount === 0) {
    return [];
  }

  const revealStartMs = Math.min(
    revealDurationMs,
    Math.max(DEFAULT_LEAD_IN_MS, Math.round(revealDurationMs * DEFAULT_REVEAL_START_RATIO)),
  );
  const revealEndMs = Math.min(
    revealDurationMs,
    Math.max(revealStartMs, Math.round(revealDurationMs * DEFAULT_REVEAL_END_RATIO)),
  );

  if (scrambleCount === 1) {
    return [revealEndMs];
  }

  const revealSpreadMs = Math.max(0, revealEndMs - revealStartMs);

  return Array.from({ length: scrambleCount }, (_, scrambleOrder) => {
    const progressRatio = scrambleOrder / Math.max(1, scrambleCount - 1);

    return Math.round(revealStartMs + revealSpreadMs * easeOutQuad(progressRatio));
  });
};

export const createHangulScrambleModel = ({
  durationMs,
  ignoreChars = DEFAULT_IGNORE_CHARS,
  frameMs = DEFAULT_FRAME_MS,
  readableHoldMs,
  revealMode = DEFAULT_REVEAL_MODE,
  seedKey,
  text,
}: CreateHangulScrambleModelOptions): HangulScrambleModel => {
  const characters = Array.from(text);
  const scrambleIndexes = characters.reduce<number[]>((result, character, index) => {
    if (ignoreChars.includes(character) || !isHangulSyllable(character)) {
      return result;
    }

    result.push(index);

    return result;
  }, []);
  const revealDurationMs = Math.max(0, durationMs - readableHoldMs);
  const useSequentialReveal = revealMode === 'sequential';
  const scrambleOrderLookup = useSequentialReveal
    ? new Map(
        scrambleIndexes.map((scrambleIndex, scrambleOrder) => {
          return [scrambleIndex, scrambleOrder] as const;
        }),
      )
    : null;
  const sequentialLockTimeline = useSequentialReveal
    ? createSequentialLockTimeline(scrambleIndexes.length, revealDurationMs)
    : null;
  const modelCharacters = characters.map((character, index) => {
    if (ignoreChars.includes(character) || !isHangulSyllable(character)) {
      return {
        finalChar: character,
        isFixed: true,
        lockAtMs: 0,
        settleAtMs: 0,
        settleVariant: character,
        refinedVariants: [character],
        scrambleVariants: [character],
      } satisfies HangulScrambleCharacterModel;
    }

    const scrambleVariants = createScrambleVariants(character);
    const refinedVariants = createRefinedScrambleVariants(character);
    const lockAtMs = useSequentialReveal
      ? (sequentialLockTimeline?.[scrambleOrderLookup?.get(index) ?? 0] ?? revealDurationMs)
      : revealDurationMs;
    const settleAtMs = Math.max(0, lockAtMs - frameMs * DEFAULT_SETTLE_FRAME_COUNT);
    const settleVariantPool = refinedVariants.length > 0 ? refinedVariants : scrambleVariants;
    const settleVariant =
      settleVariantPool[
        hashString(`${seedKey}:${String(index)}:settle`) % Math.max(1, settleVariantPool.length)
      ] ?? character;

    return {
      finalChar: character,
      isFixed: false,
      lockAtMs,
      settleAtMs,
      settleVariant,
      refinedVariants,
      scrambleVariants,
    } satisfies HangulScrambleCharacterModel;
  });

  return {
    characters: modelCharacters,
    durationMs,
    finalText: text,
    frameMs: Math.max(1, frameMs),
    readableHoldMs,
    seedKey,
  };
};

export const renderHangulScrambleFrame = (model: HangulScrambleModel, elapsedMs: number) => {
  const clampedElapsedMs = Math.max(0, elapsedMs);
  const readableThresholdMs = Math.max(0, model.durationMs - model.readableHoldMs);

  if (clampedElapsedMs >= model.durationMs || clampedElapsedMs >= readableThresholdMs) {
    return model.finalText;
  }

  const frameIndex = Math.floor(clampedElapsedMs / model.frameMs);

  return model.characters
    .map((characterModel, index) => {
      if (characterModel.isFixed || clampedElapsedMs >= characterModel.lockAtMs) {
        return characterModel.finalChar;
      }

      if (clampedElapsedMs >= characterModel.settleAtMs) {
        return characterModel.settleVariant;
      }

      if (characterModel.scrambleVariants.length === 0) {
        return characterModel.finalChar;
      }

      const variantIndex =
        hashString(`${model.seedKey}:${String(index)}:${String(frameIndex)}`) %
        characterModel.scrambleVariants.length;

      return characterModel.scrambleVariants[variantIndex];
    })
    .join('');
};

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const useHangulScramble = ({
  durationMs = DEFAULT_DURATION_MS,
  ignoreChars = DEFAULT_IGNORE_CHARS,
  onAnimationEnd,
  playOnMount = true,
  frameMs = DEFAULT_FRAME_MS,
  readableHoldMs = DEFAULT_READABLE_HOLD_MS,
  revealMode = DEFAULT_REVEAL_MODE,
  seedKey = 'hangul-scramble',
  text,
}: UseHangulScrambleOptions) => {
  const nodeRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeAnimationIdRef = useRef(0);
  const onAnimationEndRef = useRef(onAnimationEnd);

  useEffect(() => {
    onAnimationEndRef.current = onAnimationEnd;
  }, [onAnimationEnd]);

  const cancelAnimation = useCallback(() => {
    if (animationFrameRef.current === null) {
      return;
    }

    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }, []);

  const renderText = useCallback((value: string) => {
    const node = nodeRef.current;

    if (!node || node.textContent === value) {
      return;
    }

    node.textContent = value;
  }, []);

  const replay = useCallback(() => {
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    activeAnimationIdRef.current += 1;
    const animationId = activeAnimationIdRef.current;

    cancelAnimation();

    if (prefersReducedMotion()) {
      renderText(text);
      onAnimationEndRef.current?.();

      return;
    }

    const model = createHangulScrambleModel({
      durationMs,
      ignoreChars,
      frameMs,
      readableHoldMs,
      revealMode,
      seedKey,
      text,
    });
    const startTime = performance.now();

    renderText(renderHangulScrambleFrame(model, 0));

    const animate = (timestamp: number) => {
      if (activeAnimationIdRef.current !== animationId) {
        return;
      }

      const elapsedMs = timestamp - startTime;
      renderText(renderHangulScrambleFrame(model, elapsedMs));

      if (elapsedMs >= durationMs) {
        animationFrameRef.current = null;
        renderText(text);
        onAnimationEndRef.current?.();

        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
  }, [
    cancelAnimation,
    durationMs,
    frameMs,
    ignoreChars,
    readableHoldMs,
    revealMode,
    renderText,
    seedKey,
    text,
  ]);

  useEffect(() => {
    if (playOnMount) {
      replay();
    } else {
      renderText(text);
    }

    return () => {
      cancelAnimation();
      activeAnimationIdRef.current += 1;
    };
  }, [cancelAnimation, playOnMount, renderText, replay, text]);

  return {
    ref: nodeRef,
    replay,
  };
};
