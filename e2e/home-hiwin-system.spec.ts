import { expect, test, type Locator, type Page } from '@playwright/test';

const POPUP_STORAGE_KEY = 'haatz-home.notice-hidden-until';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const HIWIN_PIN_EXIT_MARGIN_PX = 12;
const HIWIN_SLIDES = [
  {
    id: 'mechanical-engineering',
    index: '0',
    title: '기계설비 종합 엔지니어링',
  },
  {
    id: 'hvac-system',
    index: '1',
    title: '공조설비 시스템 엔지니어링',
  },
  {
    id: 'energy-saving',
    index: '2',
    title: '에너지 최적화 솔루션',
  },
  {
    id: 'fire-prevention',
    index: '3',
    title: '화재예방 안전 솔루션',
  },
] as const;

const waitForHomeIntroComplete = async (page: Page) => {
  await expect(page.getByTestId('hero-tagline')).toBeVisible({ timeout: 10000 });
  await expect
    .poll(async () => {
      return (await page.locator('body').getAttribute('class')) ?? '';
    })
    .toContain('haatz-home-intro-complete');
};

const expectHiwinHeadingToBeVerticallyCentered = async (hiwinHeading: Locator) => {
  const [headingBox, eyebrowBox, titleBox] = await Promise.all([
    hiwinHeading.boundingBox(),
    hiwinHeading.getByText('Solution').boundingBox(),
    hiwinHeading
      .getByRole('heading', {
        level: 2,
        name: /국제티엔씨는 비용 절감과 운영 효율을 실현하는\s*차별화된 솔루션을 제안합니다/,
      })
      .boundingBox(),
  ]);

  expect(headingBox).not.toBeNull();
  expect(eyebrowBox).not.toBeNull();
  expect(titleBox).not.toBeNull();

  const headingCenterY = Math.round((headingBox?.y ?? 0) + (headingBox?.height ?? 0) / 2);
  const headingContentTop = Math.min(eyebrowBox?.y ?? 0, titleBox?.y ?? 0);
  const headingContentBottom = Math.max(
    (eyebrowBox?.y ?? 0) + (eyebrowBox?.height ?? 0),
    (titleBox?.y ?? 0) + (titleBox?.height ?? 0),
  );
  const headingContentCenterY = Math.round((headingContentTop + headingContentBottom) / 2);

  expect(Math.abs(headingContentCenterY - headingCenterY)).toBeLessThanOrEqual(4);
};

const expectActiveHiwinSlide = async (
  hiwinSection: Locator,
  expected: (typeof HIWIN_SLIDES)[number],
) => {
  await expect
    .poll(async () => {
      const activeLayer = hiwinSection.locator('[data-slide-state="current"]');

      return {
        activeCount: await activeLayer.count(),
        activeId: await activeLayer.first().getAttribute('data-slide-id'),
        activeIndex: await activeLayer.first().getAttribute('data-slide-index'),
        activeTitle:
          (await hiwinSection.locator('article[aria-hidden="false"] h3').textContent())?.trim() ??
          null,
      };
    })
    .toEqual({
      activeCount: 1,
      activeId: expected.id,
      activeIndex: expected.index,
      activeTitle: expected.title,
    });
};

const waitForHiwinWheelUnlock = async (page: Page) => {
  await page.waitForTimeout(220);
};

const getWindowScrollTop = async (page: Page) => {
  return page.evaluate(() => {
    const browser = globalThis as unknown as { scrollY: number };

    return Math.round(browser.scrollY);
  });
};

const getHiwinPinnedStartScrollTop = async (page: Page) => {
  return page.evaluate(() => {
    const browser = globalThis as unknown as {
      document: {
        querySelector: (
          selector: string,
        ) => { getBoundingClientRect: () => { height: number; top: number } } | null;
      };
      scrollY: number;
    };
    const track = browser.document.querySelector('[data-testid="hiwin-system-track"]');
    const header = browser.document.querySelector('header');

    if (!track || !header) {
      return null;
    }

    return Math.round(
      track.getBoundingClientRect().top + browser.scrollY - header.getBoundingClientRect().height,
    );
  });
};

const getHiwinPinnedExitScrollTop = async (page: Page) => {
  return page.evaluate((exitMargin) => {
    const browser = globalThis as unknown as {
      document: {
        querySelector: (
          selector: string,
        ) => { getBoundingClientRect: () => { height: number; top: number } } | null;
      };
      scrollY: number;
    };
    const track = browser.document.querySelector('[data-testid="hiwin-system-track"]');
    const header = browser.document.querySelector('header');

    if (!track || !header) {
      return null;
    }

    const pinnedStart =
      track.getBoundingClientRect().top + browser.scrollY - header.getBoundingClientRect().height;

    return Math.floor(pinnedStart) - exitMargin;
  }, HIWIN_PIN_EXIT_MARGIN_PX);
};

const scrollHiwinToPinnedStart = async (page: Page) => {
  const targetTop = await getHiwinPinnedStartScrollTop(page);

  await page.evaluate((top) => {
    const browser = globalThis as unknown as {
      scrollTo: (options: { behavior: 'instant'; top: number }) => void;
    };

    if (top === null) {
      return;
    }

    browser.scrollTo({ top, behavior: 'instant' });
  }, targetTop);

  await page.waitForTimeout(300);
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    ({ hiddenUntil, storageKey }) => {
      localStorage.setItem(storageKey, String(hiddenUntil));
    },
    { hiddenUntil: Date.now() + ONE_DAY_MS, storageKey: POPUP_STORAGE_KEY },
  );
});

test('HIWIN heading and viewport render in normal document flow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await waitForHomeIntroComplete(page);

  const hiwinHeading = page.getByTestId('hiwin-system-heading');
  const hiwinSection = page.getByTestId('hiwin-system-section');
  const hiwinViewport = page.getByTestId('hiwin-system-viewport');

  await hiwinHeading.scrollIntoViewIfNeeded();
  await expect(hiwinHeading.getByText('Solution')).toBeVisible();
  await expect(
    hiwinHeading.getByRole('heading', {
      level: 2,
      name: /국제티엔씨는 비용 절감과 운영 효율을 실현하는\s*차별화된 솔루션을 제안합니다/,
    }),
  ).toBeVisible();
  await expectHiwinHeadingToBeVerticallyCentered(hiwinHeading);

  const [headingBox, sectionBox] = await Promise.all([
    hiwinHeading.boundingBox(),
    hiwinSection.boundingBox(),
  ]);

  expect(headingBox).not.toBeNull();
  expect(sectionBox).not.toBeNull();
  expect((headingBox?.y ?? 0) + (headingBox?.height ?? 0)).toBeLessThanOrEqual(sectionBox?.y ?? 0);

  await hiwinViewport.scrollIntoViewIfNeeded();

  const [headerBox, viewportBox, viewportHeight] = await Promise.all([
    page.locator('header').boundingBox(),
    hiwinViewport.boundingBox(),
    page.evaluate(() => (globalThis as unknown as { innerHeight: number }).innerHeight),
  ]);

  expect(headerBox).not.toBeNull();
  expect(viewportBox).not.toBeNull();
  expect(
    Math.abs((viewportBox?.height ?? 0) - (viewportHeight - Math.round(headerBox?.height ?? 0))),
  ).toBeLessThanOrEqual(2);
});

test('desktop tab click switches HIWIN content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await waitForHomeIntroComplete(page);

  const hiwinSection = page.getByTestId('hiwin-system-section');

  await hiwinSection.scrollIntoViewIfNeeded();
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[0]);

  await hiwinSection.getByRole('button', { name: 'HVAC Engineering' }).first().click();

  await expect
    .poll(async () => {
      return hiwinSection.getAttribute('data-transition-phase');
    })
    .toMatch(/prepare|running/);
  await expect(hiwinSection.locator('[data-slide-state="incoming"]').first()).toHaveAttribute(
    'data-slide-id',
    'hvac-system',
  );
  await expect(hiwinSection.locator('[data-slide-state="outgoing"]').first()).toHaveAttribute(
    'data-slide-id',
    'mechanical-engineering',
  );
  await expect(hiwinSection.locator('article[aria-hidden="false"] h3')).toHaveText(
    '기계설비 종합 엔지니어링',
  );

  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[1]);
  await expect
    .poll(async () => {
      return hiwinSection.getByRole('button').allTextContents();
    })
    .toEqual(['Energy Optimization', 'Fire Safety System', 'Mechanical Engineering']);
});

test('mobile tap switches HIWIN content', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await waitForHomeIntroComplete(page);

  const hiwinSection = page.getByTestId('hiwin-system-section');

  await hiwinSection.scrollIntoViewIfNeeded();
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[0]);

  await hiwinSection.getByRole('button', { name: 'HVAC Engineering' }).first().click();

  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[1]);
});

test('re-entering HIWIN from below keeps the last slide instead of resetting to the first slide', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await waitForHomeIntroComplete(page);

  const hiwinSection = page.getByTestId('hiwin-system-section');

  await hiwinSection.scrollIntoViewIfNeeded();
  await hiwinSection.getByRole('button', { name: 'Fire Safety System' }).first().click();
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[3]);

  await page.evaluate(() => {
    const browser = globalThis as unknown as {
      document: { body: { scrollHeight: number } };
      scrollTo: (options: { behavior: 'instant'; top: number }) => void;
    };

    browser.scrollTo({ top: browser.document.body.scrollHeight, behavior: 'instant' });
  });

  await hiwinSection.scrollIntoViewIfNeeded();

  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[3]);
  await expect
    .poll(async () => {
      return hiwinSection.getAttribute('data-transition-phase');
    })
    .toBe('idle');
});

test('scrolling upward from the first HIWIN slide leaves the pinned range without jumping to the hero top', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await waitForHomeIntroComplete(page);

  const hiwinSection = page.getByTestId('hiwin-system-section');
  const pinnedExitScrollTop = await getHiwinPinnedExitScrollTop(page);

  expect(pinnedExitScrollTop).not.toBeNull();

  await hiwinSection.scrollIntoViewIfNeeded();
  await hiwinSection.getByRole('button', { name: 'Fire Safety System' }).first().click();
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[3]);

  await page.evaluate(() => {
    const browser = globalThis as unknown as {
      document: { body: { scrollHeight: number } };
      scrollTo: (options: { behavior: 'instant'; top: number }) => void;
    };

    browser.scrollTo({ top: browser.document.body.scrollHeight, behavior: 'instant' });
  });

  await page.waitForTimeout(300);
  await scrollHiwinToPinnedStart(page);
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[3]);
  await page.mouse.move(720, 450);
  await waitForHiwinWheelUnlock(page);

  await page.mouse.wheel(0, -300);
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[2]);
  await waitForHiwinWheelUnlock(page);

  await page.mouse.wheel(0, -300);
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[1]);
  await waitForHiwinWheelUnlock(page);

  await page.mouse.wheel(0, -300);
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[0]);
  await waitForHiwinWheelUnlock(page);

  await page.mouse.wheel(0, -300);

  await expect
    .poll(async () => {
      return getWindowScrollTop(page);
    })
    .toBeLessThanOrEqual((pinnedExitScrollTop ?? 0) + 1);

  const exitScrollTop = await getWindowScrollTop(page);

  expect(exitScrollTop).toBeGreaterThan(0);
  expect(exitScrollTop).toBeLessThanOrEqual((pinnedExitScrollTop ?? 0) + 1);

  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, -300);

  await expect
    .poll(async () => {
      return getWindowScrollTop(page);
    })
    .toBeLessThan(exitScrollTop);

  expect(await getWindowScrollTop(page)).toBeGreaterThan(0);
});

test('a fast upward wheel burst still lands on the mechanical slide before exiting HIWIN', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await waitForHomeIntroComplete(page);

  const hiwinSection = page.getByTestId('hiwin-system-section');
  const pinnedExitScrollTop = await getHiwinPinnedExitScrollTop(page);

  expect(pinnedExitScrollTop).not.toBeNull();

  await hiwinSection.scrollIntoViewIfNeeded();
  await hiwinSection.getByRole('button', { name: 'Fire Safety System' }).first().click();
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[3]);

  await page.evaluate(() => {
    const browser = globalThis as unknown as {
      document: { body: { scrollHeight: number } };
      scrollTo: (options: { behavior: 'instant'; top: number }) => void;
    };

    browser.scrollTo({ top: browser.document.body.scrollHeight, behavior: 'instant' });
  });

  await page.waitForTimeout(300);
  await scrollHiwinToPinnedStart(page);
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[3]);
  await page.mouse.move(720, 450);
  await waitForHiwinWheelUnlock(page);

  await page.mouse.wheel(0, -300);
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[2]);
  await waitForHiwinWheelUnlock(page);

  await page.mouse.wheel(0, -300);
  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[1]);
  await waitForHiwinWheelUnlock(page);

  await page.mouse.wheel(0, -300);
  await page.mouse.wheel(0, -300);

  await expectActiveHiwinSlide(hiwinSection, HIWIN_SLIDES[0]);

  const mechanicalScrollTop = await getWindowScrollTop(page);

  expect(mechanicalScrollTop).toBeGreaterThan((pinnedExitScrollTop ?? 0) + 1);

  await waitForHiwinWheelUnlock(page);
  await page.mouse.wheel(0, -300);

  await expect
    .poll(async () => {
      return getWindowScrollTop(page);
    })
    .toBeLessThanOrEqual((pinnedExitScrollTop ?? 0) + 1);
});
