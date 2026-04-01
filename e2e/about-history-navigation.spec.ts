import { expect, test, type Page } from '@playwright/test';

const HOME_READY_TIMEOUT_MS = 7000;

const prepareHomeForNavigation = async (page: Page) => {
  const heroSection = page.getByTestId('haatz-hero-section');
  const popup = page.getByRole('dialog');

  await expect(heroSection).toHaveAttribute('data-intro-scramble-state', 'complete', {
    timeout: HOME_READY_TIMEOUT_MS,
  });
  await expect(popup).toBeVisible({ timeout: HOME_READY_TIMEOUT_MS });
  await popup.getByRole('button', { exact: true, name: '닫기' }).click();
  await expect(popup).toBeHidden();
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript('window.localStorage.clear();');
  await page.goto('/');
});

test('홈에서 about history로 이동하면 이전 스크롤 위치를 유지하지 않는다', async ({ page }) => {
  await prepareHomeForNavigation(page);

  await page.evaluate(() => {
    const browserWindow = globalThis as unknown as {
      scrollTo: (options: { behavior: 'instant'; top: number }) => void;
    };

    browserWindow.scrollTo({ top: 2500, behavior: 'instant' });
  });
  await page.waitForFunction(() => {
    const browserWindow = globalThis as unknown as { scrollY: number };

    return browserWindow.scrollY > 300;
  });

  const homeScrollY = await page.evaluate(() => {
    const browserWindow = globalThis as unknown as { scrollY: number };

    return browserWindow.scrollY;
  });
  expect(homeScrollY).toBeGreaterThan(300);

  await page.getByRole('button', { name: '전체 메뉴 열기' }).click();

  const historyLink = page.getByRole('link', { name: '경영이념·연혁' }).last();
  await expect(historyLink).toBeVisible();
  await historyLink.click();

  await expect(page).toHaveURL(/\/about\/history$/);
  await expect(
    page.getByRole('heading', { level: 1, name: '지속가능한 내일을 설계하는 국제티엔씨' }),
  ).toBeVisible();
  await page.waitForFunction(() => {
    const browserWindow = globalThis as unknown as { scrollY: number };

    return browserWindow.scrollY === 0;
  });
});

test('about history 히어로 서브드롭은 데스크톱에서 우측 정렬되고 홈 링크로 돌아갈 수 있다', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about/history');

  const heroInner = page.getByTestId('about-history-hero-inner');
  const subNav = page.getByTestId('about-history-subnav');
  const homeLink = page.getByTestId('about-history-subnav-home');
  const secondaryButton = page.getByTestId('about-history-subnav-button-secondary');

  await expect(heroInner).toBeVisible();
  await expect(subNav).toBeVisible();
  await expect(homeLink).toBeVisible();
  await expect(secondaryButton).toBeVisible();
  await expect(secondaryButton).toHaveText('경영이념·연혁');
  await expect(page.getByTestId('about-history-subnav-button-primary')).toHaveCount(0);

  const [heroInnerBox, subNavBox] = await Promise.all([
    heroInner.boundingBox(),
    subNav.boundingBox(),
  ]);

  expect(heroInnerBox).not.toBeNull();
  expect(subNavBox).not.toBeNull();
  expect((subNavBox?.x ?? 0) + (subNavBox?.width ?? 0)).toBeGreaterThanOrEqual(
    (heroInnerBox?.x ?? 0) + (heroInnerBox?.width ?? 0) - 48,
  );
  expect(subNavBox?.y ?? 0).toBeGreaterThanOrEqual((heroInnerBox?.y ?? 0) + 400);

  await secondaryButton.click();

  const secondaryDrawer = page.getByTestId('about-history-subnav-drawer-secondary');
  const historyMenuItem = page.getByRole('menuitem', { name: '경영이념·연혁' });

  await expect(secondaryDrawer).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'CEO인사말' })).toBeVisible();
  await expect(historyMenuItem).toBeVisible();
  await expect(page.getByRole('menuitem', { name: '사업장 위치' })).toBeVisible();
  await expect(historyMenuItem).toHaveAttribute('aria-current', 'page');

  await homeLink.click();
  await expect(page).toHaveURL(/\/$/);
});
