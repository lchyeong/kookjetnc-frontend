const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const getHiwinMaxSlideIndex = (slideCount: number) => {
  return Math.max(0, slideCount - 1);
};

const HIWIN_SCROLL_PER_TRANSITION = 1.1;

export const getHiwinScrollSegmentCount = (slideCount: number) => {
  if (slideCount <= 1) {
    return 1;
  }

  return 1 + (slideCount - 1) * HIWIN_SCROLL_PER_TRANSITION;
};

export const getHiwinActiveRailTranslateX = (
  slideIndex: number,
  itemWidth: number,
  slideCount: number,
) => {
  const clampedIndex = clamp(slideIndex, 0, getHiwinMaxSlideIndex(slideCount));

  if (slideCount <= 0 || itemWidth <= 0 || clampedIndex === 0) {
    return 0;
  }

  return -Math.round(itemWidth) * clampedIndex;
};

export const getHiwinSlideIndexFromScrollProgress = (progress: number, slideCount: number) => {
  const maxIndex = getHiwinMaxSlideIndex(slideCount);

  if (slideCount <= 1 || maxIndex === 0) {
    return 0;
  }

  if (progress >= 1) {
    return maxIndex;
  }

  const segmentCount = getHiwinScrollSegmentCount(slideCount);
  const clampedProgress = clamp(progress, 0, 0.999999);
  const nextIndex = Math.floor(clampedProgress * segmentCount);

  return clamp(nextIndex, 0, maxIndex);
};

export const getHiwinTabRailIndices = (slideCount: number) => {
  const visibleTabCount = Math.max(0, slideCount - 1);

  if (slideCount <= 1 || visibleTabCount === 0) {
    return [];
  }

  const orderedIndices = Array.from({ length: slideCount }, (_, offset) => {
    return (offset + 1) % slideCount;
  });

  return [...orderedIndices, ...orderedIndices.slice(0, Math.max(0, visibleTabCount - 1))];
};
