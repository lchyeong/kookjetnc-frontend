import { describe, expect, it } from 'vitest';

import hiwinSystemImage01 from '@/assets/images/1번이미지.jpg';
import hiwinSystemImage02 from '@/assets/images/2번이미지.jpg';
import hiwinSystemImage03 from '@/assets/images/3번이미지.jpg';
import hiwinSystemImage04 from '@/assets/images/4번이미지.jpg';
import { hiwinSystemSlides } from '@/features/haatzHome/data';

describe('hiwinSystemSlides', () => {
  it('keeps the four requested service entries with local images and placeholder links', () => {
    const expectedImageSources = [
      hiwinSystemImage01,
      hiwinSystemImage02,
      hiwinSystemImage03,
      hiwinSystemImage04,
    ];

    expect(hiwinSystemSlides).toHaveLength(4);
    expect(hiwinSystemSlides.map((item) => item.activeLabel)).toEqual([
      'Mechanical Engineering',
      'HVAC Engineering',
      'Energy Optimization',
      'Fire Safety System',
    ]);
    expect(hiwinSystemSlides.map((item) => item.desktopImageSrc)).toEqual(expectedImageSources);
    expect(hiwinSystemSlides.map((item) => item.mobileImageSrc)).toEqual(expectedImageSources);

    for (const item of hiwinSystemSlides) {
      expect(item.href).toBe('#');
      expect(item.isPlaceholder).toBe(true);
      expect(item.target).toBeUndefined();
    }
  });
});
