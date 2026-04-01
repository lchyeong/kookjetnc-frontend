import { useState } from 'react';

import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  useHeroIntroTyping,
  type HeroIntroCursorLine,
} from '@/features/haatzHome/components/useHeroIntroTyping';

const createMatchMedia = (reducedMotion: boolean) => {
  return (query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  });
};

vi.mock('typewriter-effect/dist/core', () => {
  class MockTypewriterCore {
    private readonly options: {
      delay?: number | 'natural';
      onCreateTextNode?: (character: string, textNode: Text) => Text | null;
      stringSplitter?: (text: string) => string[];
    };

    private readonly queue: Array<
      | { type: 'type'; value: string }
      | { type: 'pause'; value: number }
      | { type: 'callback'; value: () => void }
    > = [];

    private stopped = false;

    constructor(_container: string | HTMLElement | null, options: MockTypewriterCore['options']) {
      this.options = options;
    }

    typeString(value: string) {
      this.queue.push({ type: 'type', value });

      return this;
    }

    pauseFor(value: number) {
      this.queue.push({ type: 'pause', value });

      return this;
    }

    callFunction(callback: () => void) {
      this.queue.push({ type: 'callback', value: callback });

      return this;
    }

    start() {
      let offsetMs = 0;
      const delayMs = typeof this.options.delay === 'number' ? this.options.delay : 0;

      this.queue.forEach((event) => {
        if (event.type === 'type') {
          const characters = this.options.stringSplitter
            ? this.options.stringSplitter(event.value)
            : Array.from(event.value);

          characters.forEach((character) => {
            offsetMs += delayMs;

            window.setTimeout(() => {
              if (this.stopped) {
                return;
              }

              this.options.onCreateTextNode?.(character, document.createTextNode(character));
            }, offsetMs);
          });

          return;
        }

        if (event.type === 'pause') {
          offsetMs += event.value;

          return;
        }

        window.setTimeout(() => {
          if (this.stopped) {
            return;
          }

          event.value();
        }, offsetMs);
      });

      return this;
    }

    stop() {
      this.stopped = true;

      return this;
    }
  }

  return {
    default: MockTypewriterCore,
  };
});

interface TypingProbeProps {
  bottomText?: string;
  linePauseMs?: number;
  onAnimationEnd?: () => void;
  topText?: string;
  totalDurationMs?: number;
}

const TypingProbe = ({
  bottomText = '지속',
  linePauseMs = 20,
  onAnimationEnd,
  topText = '냉장',
  totalDurationMs = 260,
}: TypingProbeProps) => {
  const [cursorLine, setCursorLine] = useState<HeroIntroCursorLine>('hidden');
  const [dotState, setDotState] = useState<'hidden' | 'visible'>('hidden');
  const { bottomTextRef, topTextRef } = useHeroIntroTyping({
    bottomText,
    dotCursorBlinkCount: 5,
    dotCursorBlinkCycleMs: 40,
    dotRevealDelayMs: 40,
    linePauseMs,
    onCursorLineChange: setCursorLine,
    onDotReveal: () => {
      setDotState('visible');
    },
    topText,
    totalDurationMs,
    ...(onAnimationEnd ? { onAnimationEnd } : {}),
  });

  return (
    <div>
      <span data-testid='top-text' ref={topTextRef} />
      <span data-testid='bottom-text' ref={bottomTextRef} />
      <span data-testid='cursor-line'>{cursorLine}</span>
      <span data-testid='dot-state'>{dotState}</span>
    </div>
  );
};

describe('useHeroIntroTyping', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
    window.matchMedia = createMatchMedia(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
  });

  it('types the top line first, then the bottom line, and finishes after the dot cursor tail', () => {
    const onAnimationEnd = vi.fn();

    render(<TypingProbe onAnimationEnd={onAnimationEnd} />);

    expect(screen.getByTestId('cursor-line')).toHaveTextContent('top');
    expect(screen.getByTestId('dot-state')).toHaveTextContent('hidden');

    act(() => {
      vi.advanceTimersByTime(60);
    });

    expect(screen.getByTestId('top-text')).toHaveTextContent('냉');
    expect(screen.getByTestId('bottom-text')).toHaveTextContent('');
    expect(screen.getByTestId('cursor-line')).toHaveTextContent('top');
    expect(screen.getByTestId('dot-state')).toHaveTextContent('hidden');

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.getByTestId('top-text')).toHaveTextContent('냉장');
    expect(screen.getByTestId('bottom-text')).toHaveTextContent('지');
    expect(screen.getByTestId('cursor-line')).toHaveTextContent('bottom');
    expect(screen.getByTestId('dot-state')).toHaveTextContent('hidden');
    expect(onAnimationEnd).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('top-text')).toHaveTextContent('냉장');
    expect(screen.getByTestId('bottom-text')).toHaveTextContent('지속');
    expect(screen.getByTestId('dot-state')).toHaveTextContent('visible');
    expect(screen.getByTestId('cursor-line')).toHaveTextContent('dot');
    expect(onAnimationEnd).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('cursor-line')).toHaveTextContent('dot');
    expect(onAnimationEnd).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(screen.getByTestId('cursor-line')).toHaveTextContent('hidden');
    expect(onAnimationEnd).toHaveBeenCalledTimes(1);
  });

  it('renders the final text immediately when reduced motion is preferred', () => {
    const onAnimationEnd = vi.fn();

    window.matchMedia = createMatchMedia(true);

    render(<TypingProbe onAnimationEnd={onAnimationEnd} />);

    expect(screen.getByTestId('top-text')).toHaveTextContent('냉장');
    expect(screen.getByTestId('bottom-text')).toHaveTextContent('지속');
    expect(screen.getByTestId('cursor-line')).toHaveTextContent('hidden');
    expect(screen.getByTestId('dot-state')).toHaveTextContent('visible');
    expect(onAnimationEnd).toHaveBeenCalledTimes(1);
  });
});
