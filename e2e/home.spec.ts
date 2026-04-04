import { expect, test, type Locator, type Page } from '@playwright/test';

const POPUP_HREF =
  'https://www.haatz.com/kor/about/investor__7.html?bmain=view&uid=11&search=%26page%3D';
const INTRO_TYPING_TOP_ASSERTION_DELAY_MS = 500;
const INTRO_TYPING_BOTTOM_ASSERTION_DELAY_MS = 1300;
const INTRO_DOT_CURSOR_ASSERTION_DELAY_MS = 3200;
const INTRO_TYPING_COMPLETE_TIMEOUT_MS = 5000;
const INTRO_VIDEO_PREVIEW_ASSERTION_DELAY_MS = 320;
const INTRO_TOP_TEXT = '냉장·냉동을 넘어';
const INTRO_BOTTOM_TEXT = '지속 가능성으로';
const INTRO_DOT_TOLERANCE_PX = 18;
const INTRO_HORIZONTAL_LINE_CENTER_TOLERANCE_PX = 18;
const INTRO_CENTER_TOLERANCE_PX = 18;
const INTRO_VIDEO_PREVIEW_CURRENT_TIME_TOLERANCE_S = 0.05;
const INTRO_VIDEO_PLAYBACK_PROGRESS_TIMEOUT_MS = 2000;
const INTRO_DESKTOP_MIN_FONT_SIZE_PX = 100;
const INTRO_MOBILE_MIN_FONT_SIZE_PX = 48;
const HERO_FULLSCREEN_TOLERANCE_PX = 24;
const POPUP_VISIBLE_TIMEOUT_MS = 7000;
const POPUP_TOP_ALIGNMENT_TOLERANCE_PX = 1;
const SWIPER_EDGE_TOLERANCE_PX = 1;
const PARTIAL_CARD_VISIBILITY_THRESHOLD_PX = 40;
const HEADER_RESTORE_SCROLL_Y_PX = 32;
const HERO_GLASS_PANEL_BACKGROUND = 'rgba(10, 16, 24, 0.22)';
const LIGHT_HEADER_BACKGROUND = 'rgb(255, 255, 255)';
const LIGHT_HEADER_BORDER = 'rgb(221, 221, 221)';
const LIGHT_HEADER_TEXT = 'rgb(69, 69, 69)';
const PR_CENTER_EYEBROW_BRAND_TEXT = 'rgb(140, 202, 214)';
const PR_CENTER_BRAND = 'rgb(140, 202, 214)';
const PR_CENTER_BRAND_SURFACE = 'rgba(255, 255, 255, 0.06)';
const PR_CENTER_BRAND_BORDER = 'rgba(255, 255, 255, 0.18)';
const PR_CENTER_BRAND_TRACK = 'rgba(140, 202, 214, 0.26)';
const HERO_TAGLINE_LINES = ['지속 가능한 엔지니어링으로', '더 시원한 내일을', '만듭니다.'] as const;
const HERO_TAGLINE_CENTER_TOLERANCE_PX = 36;
const HERO_TAGLINE_MOBILE_CENTER_TOLERANCE_PX = 56;
const PRIMARY_MENU_LABELS = [
  '회사소개',
  '에너지솔루션',
  '기계·공조설비',
  '냉장·냉동시스템',
  '실적·정보지원',
] as const;
const COMPANY_SUBMENU_LABELS = [
  'CEO인사말',
  '경영이념·연혁',
  '인증·특허',
  '조직도',
  '사업장 위치',
] as const;
const REFRIGERATION_SUBMENU_LABELS = [
  '기술설계 · 전문시공',
  '수산물 콜드체인시스템',
  '유지보수 서비스',
  '내치형 냉동 쇼케이스',
  '프리미엄 와인셀러',
] as const;
const PERFORMANCE_SUPPORT_SUBMENU_LABELS = [
  '시공사례',
  '공사실적',
  '기술자료',
  '웹카탈로그',
  '홍보영상',
] as const;
const MEDIA_COVERAGE_TITLES = [
  '[쇼케이스 선도기업] 국제티엔씨',
  '㈜국제티엔씨, 냉동·공조 토털 솔루션·친환경 에너지 절감 앞장 [경기도 혁신의 중심, 유망중소기업]',
  '냉동·냉장 시스템의 진화, 지속가능한 미래를 열다 - 국제티엔씨 김기백 대표',
  '[인터뷰] 냉동·냉장 시스템의 진화, 지속가능한 미래를 열다 - 국제티엔씨 김기백 대표',
  '[日 HVAC&R에서 만난 사람들] 김연수 국제티엔씨 상무',
] as const;

const getCenterPoint = async (locator: Locator, name: string) => {
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error(`${name}의 레이아웃 박스를 찾을 수 없습니다.`);
  }

  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
};

const expectIntroLineToTypeFromLeft = (currentText: string, finalText: string) => {
  const currentCharacters = Array.from(currentText);
  const finalCharacters = Array.from(finalText);

  expect(currentCharacters.length).toBeGreaterThan(0);
  expect(currentCharacters.length).toBeLessThan(finalCharacters.length);
  expect(finalCharacters.slice(0, currentCharacters.length).join('')).toBe(currentText);
};

const getVideoPlaybackState = async (locator: Locator) => {
  return locator.evaluate((element) => {
    const video = element as unknown as {
      currentTime: number;
      paused: boolean;
    };

    return {
      currentTime: video.currentTime,
      paused: video.paused,
    };
  });
};

const expectIntroLayout = async (page: Page, tolerance: number, minFontSizePx: number) => {
  const introHeading = page.getByRole('heading', {
    level: 1,
    name: /냉장·냉동을 넘어\s*지속 가능성으로/,
  });
  const header = page.locator('header').first();
  const heroSection = page.getByTestId('haatz-hero-section');
  const introCopyScreen = page.getByTestId('intro-copy-screen');
  const introTransitionLayer = page.getByTestId('hero-transition-layer');
  const introDotCursor = page.getByTestId('intro-dot-cursor');
  const introLineTop = page.getByTestId('intro-line-top');
  const introLineBottom = page.getByTestId('intro-line-bottom');
  const introTopAnimatedText = introLineTop.locator('[aria-hidden="true"]').first();
  const introBottomAnimatedText = introLineBottom.locator('[aria-hidden="true"]').first();
  const introBottomDotAnchor = page.getByTestId('intro-horizontal-dot-anchor');
  const heroTagline = page.getByTestId('hero-tagline');
  const heroScrollIndicator = page.getByTestId('hero-scroll-indicator');
  const introHeroVideo = page.getByTestId('hero-video-box').locator('video');

  await expect(introHeading).toBeVisible();
  await expect(heroTagline).toBeHidden();
  await expect(heroScrollIndicator).toBeHidden();
  await expect(introCopyScreen).toHaveCSS('opacity', '1');
  await expect(header).toHaveCSS('opacity', '0');
  await expect(introTransitionLayer).toBeHidden();
  await expect(introDotCursor).toBeHidden();
  await page.waitForTimeout(INTRO_TYPING_TOP_ASSERTION_DELAY_MS);
  await expect(heroSection).toHaveAttribute('data-intro-scramble-state', 'running');
  await expect(heroSection).toHaveAttribute('data-intro-cursor-line', 'top');
  await expect(heroSection).toHaveAttribute('data-intro-dot-state', 'hidden');
  await expect(heroSection).toHaveAttribute('data-intro-dot-visual', 'hidden');

  const introTopTypingText = (await introTopAnimatedText.textContent()) ?? '';
  const introBottomTypingText = (await introBottomAnimatedText.textContent()) ?? '';

  expectIntroLineToTypeFromLeft(introTopTypingText, INTRO_TOP_TEXT);
  expect(introBottomTypingText).toBe('');
  await expect(introTransitionLayer).toBeHidden();
  await expect(introDotCursor).toBeHidden();

  await page.waitForTimeout(
    INTRO_TYPING_BOTTOM_ASSERTION_DELAY_MS - INTRO_TYPING_TOP_ASSERTION_DELAY_MS,
  );
  await expect(heroSection).toHaveAttribute('data-intro-cursor-line', 'bottom');
  await expect(heroSection).toHaveAttribute('data-intro-dot-state', 'hidden');
  await expect(heroSection).toHaveAttribute('data-intro-dot-visual', 'hidden');

  const introTopBottomPhaseText = (await introTopAnimatedText.textContent()) ?? '';
  const introBottomBottomPhaseText = (await introBottomAnimatedText.textContent()) ?? '';

  expect(introTopBottomPhaseText).toBe(INTRO_TOP_TEXT);
  expectIntroLineToTypeFromLeft(introBottomBottomPhaseText, INTRO_BOTTOM_TEXT);
  await expect(introTransitionLayer).toBeHidden();
  await expect(introDotCursor).toBeHidden();

  await page.waitForTimeout(
    INTRO_DOT_CURSOR_ASSERTION_DELAY_MS - INTRO_TYPING_BOTTOM_ASSERTION_DELAY_MS,
  );
  await expect(heroSection).toHaveAttribute('data-intro-scramble-state', 'running');
  await expect(heroSection).toHaveAttribute('data-intro-cursor-line', 'dot');
  await expect(heroSection).toHaveAttribute('data-intro-dot-state', 'visible');
  await expect(heroSection).toHaveAttribute('data-intro-dot-visual', 'punctuation');
  await expect(introTopAnimatedText).toHaveText(INTRO_TOP_TEXT);
  await expect(introBottomAnimatedText).toHaveText(INTRO_BOTTOM_TEXT);
  await expect(introCopyScreen).toHaveCSS('opacity', '1');
  await expect(introTransitionLayer).toBeVisible();
  await expect(introDotCursor).toBeVisible();

  const dotPreviewState = await getVideoPlaybackState(introHeroVideo);

  expect(dotPreviewState.paused).toBe(true);
  expect(dotPreviewState.currentTime).toBeLessThanOrEqual(
    INTRO_VIDEO_PREVIEW_CURRENT_TIME_TOLERANCE_S,
  );

  await expect(heroSection).toHaveAttribute('data-intro-scramble-state', 'complete', {
    timeout: INTRO_TYPING_COMPLETE_TIMEOUT_MS,
  });
  await expect(heroSection).toHaveAttribute('data-intro-cursor-line', 'hidden');
  await expect(heroSection).toHaveAttribute('data-intro-dot-state', 'visible');
  await expect(heroSection).toHaveAttribute('data-intro-dot-visual', 'punctuation');
  await expect(introTopAnimatedText).toHaveText(INTRO_TOP_TEXT);
  await expect(introBottomAnimatedText).toHaveText(INTRO_BOTTOM_TEXT);
  await expect(introTransitionLayer).toBeVisible();
  await expect(introDotCursor).toBeHidden();
  await expect(introHeading).not.toContainText(',');
  await expect(introHeading).not.toContainText('.');

  const preExpandCompleteState = await getVideoPlaybackState(introHeroVideo);

  expect(preExpandCompleteState.paused).toBe(true);
  expect(preExpandCompleteState.currentTime).toBeLessThanOrEqual(
    INTRO_VIDEO_PREVIEW_CURRENT_TIME_TOLERANCE_S,
  );

  await page.waitForTimeout(INTRO_VIDEO_PREVIEW_ASSERTION_DELAY_MS);
  await expect(heroSection).toHaveAttribute('data-intro-dot-visual', 'preview');

  const previewState = await getVideoPlaybackState(introHeroVideo);

  expect(previewState.paused).toBe(true);
  expect(previewState.currentTime).toBeLessThanOrEqual(
    INTRO_VIDEO_PREVIEW_CURRENT_TIME_TOLERANCE_S,
  );

  await expect
    .poll(
      async () => {
        const { currentTime, paused } = await getVideoPlaybackState(introHeroVideo);

        return !paused && currentTime > INTRO_VIDEO_PREVIEW_CURRENT_TIME_TOLERANCE_S;
      },
      {
        timeout: INTRO_VIDEO_PLAYBACK_PROGRESS_TIMEOUT_MS,
      },
    )
    .toBe(true);

  const introHeadingBox = await introHeading.boundingBox();
  const heroSectionBox = await heroSection.boundingBox();

  if (!introHeadingBox || !heroSectionBox) {
    throw new Error('인트로 헤딩 또는 히어로 섹션의 레이아웃 박스를 찾을 수 없습니다.');
  }

  const introHeadingCenterX = introHeadingBox.x + introHeadingBox.width / 2;
  const introHeadingCenterY = introHeadingBox.y + introHeadingBox.height / 2;
  const heroSectionCenterX = heroSectionBox.x + heroSectionBox.width / 2;
  const heroSectionCenterY = heroSectionBox.y + heroSectionBox.height / 2;
  const introHeadingFontSize = await introHeading.evaluate((element) => {
    const headingElement = element as unknown as {
      ownerDocument: {
        defaultView: {
          getComputedStyle: (target: unknown) => {
            fontSize: string;
          };
        } | null;
      };
    };

    return Number.parseFloat(
      headingElement.ownerDocument.defaultView?.getComputedStyle(headingElement).fontSize ?? '0',
    );
  });

  const introTopCenter = await getCenterPoint(introLineTop, '상단 인트로 줄');
  const introBottomCenter = await getCenterPoint(introLineBottom, '하단 인트로 줄');
  const bottomDotAnchorCenter = await getCenterPoint(introBottomDotAnchor, '하단 인트로 점 기준점');
  const introDotCenter = await getCenterPoint(introTransitionLayer, '인트로 점');

  expect(Math.abs(introHeadingCenterX - heroSectionCenterX)).toBeLessThanOrEqual(
    INTRO_CENTER_TOLERANCE_PX,
  );
  expect(Math.abs(introHeadingCenterY - heroSectionCenterY)).toBeLessThanOrEqual(
    INTRO_CENTER_TOLERANCE_PX,
  );
  expect(introHeadingFontSize).toBeGreaterThanOrEqual(minFontSizePx);
  expect(introTopCenter.y).toBeLessThan(introBottomCenter.y);
  expect(Math.abs(introTopCenter.x - introBottomCenter.x)).toBeLessThanOrEqual(
    INTRO_HORIZONTAL_LINE_CENTER_TOLERANCE_PX,
  );
  expect(Math.abs(introDotCenter.x - bottomDotAnchorCenter.x)).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(introDotCenter.y - bottomDotAnchorCenter.y)).toBeLessThanOrEqual(tolerance);
};

const expectHeroTagline = async (page: Page, isMobile: boolean) => {
  const heroSection = page.getByTestId('haatz-hero-section');
  const heroTagline = page.getByTestId('hero-tagline');
  const heroTaglineFirstLine = heroTagline.locator('span').first();
  const heroScrollIndicator = page.getByTestId('hero-scroll-indicator');
  const heroScrollLabel = heroScrollIndicator.locator('p');
  const heroScrollMouse = heroScrollIndicator.locator('span');

  await expect(heroTagline).toBeVisible();
  await expect(heroScrollIndicator).toBeVisible();
  await expect(heroScrollLabel).toHaveText('Scroll');
  await expect(heroScrollMouse).toBeVisible();
  await expect(heroTagline).toHaveCSS('text-align', 'left');
  await expect(heroTaglineFirstLine).toHaveCSS('white-space', 'nowrap');

  for (const line of HERO_TAGLINE_LINES) {
    await expect(heroTagline).toContainText(line);
  }

  const heroSectionRect = await heroSection.boundingBox();
  const heroTaglineRect = await heroTagline.boundingBox();

  if (!heroSectionRect || !heroTaglineRect) {
    throw new Error('히어로 섹션 또는 태그라인의 레이아웃 박스를 찾을 수 없습니다.');
  }

  const heroCenterX = heroSectionRect.x + heroSectionRect.width / 2;
  const heroCenterY = heroSectionRect.y + heroSectionRect.height / 2;
  const heroTaglineCenterX = heroTaglineRect.x + heroTaglineRect.width / 2;
  const heroTaglineCenterY = heroTaglineRect.y + heroTaglineRect.height / 2;

  if (isMobile) {
    expect(heroTaglineRect.x - heroSectionRect.x).toBeLessThanOrEqual(20);
  } else {
    expect(heroTaglineCenterX).toBeLessThan(heroCenterX);
  }
  expect(Math.abs(heroTaglineCenterY - heroCenterY)).toBeLessThanOrEqual(
    isMobile ? HERO_TAGLINE_MOBILE_CENTER_TOLERANCE_PX : HERO_TAGLINE_CENTER_TOLERANCE_PX,
  );
};

const expectPopupHeaderVisible = async (page: Page) => {
  const popup = page.getByRole('dialog');
  const header = page.locator('header').first();

  await expect(popup).toBeVisible({ timeout: POPUP_VISIBLE_TIMEOUT_MS });
  await expect(header).toHaveCSS('opacity', '1');
};

const expectPopupImageFillsPanel = async (page: Page) => {
  const popupPanel = page.locator('[role="dialog"] > div').first();
  const popupImageLink = page.getByRole('link', {
    name: '제 38기 주주총회 소집공고 팝업 이미지',
  });

  const popupPanelBox = await popupPanel.boundingBox();
  const popupImageLinkBox = await popupImageLink.boundingBox();

  if (!popupPanelBox || !popupImageLinkBox) {
    throw new Error('팝업 패널 또는 이미지 링크의 레이아웃 박스를 찾을 수 없습니다.');
  }

  expect(Math.abs(popupPanelBox.y - popupImageLinkBox.y)).toBeLessThanOrEqual(
    POPUP_TOP_ALIGNMENT_TOLERANCE_PX,
  );
};

const expectHeroHeaderChrome = async (page: Page, isMobile: boolean) => {
  const header = page.locator('header').first();

  await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(header).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');

  if (isMobile) {
    return;
  }

  await expect(
    page.getByRole('link', { exact: true, name: PRIMARY_MENU_LABELS[0] }).first(),
  ).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(
    page.getByRole('link', { exact: true, name: PRIMARY_MENU_LABELS[4] }).first(),
  ).toHaveCSS('color', 'rgb(255, 255, 255)');
};

const expectHeroGlassSitemap = async (page: Page) => {
  const header = page.locator('header').first();
  const desktopNavSurface = page.getByTestId('desktop-nav-surface');
  const sitemap = page.getByTestId('desktop-sitemap');
  const sitemapCatalogTile = sitemap
    .getByRole('link', { name: PERFORMANCE_SUPPORT_SUBMENU_LABELS[3] })
    .first();

  await expect(desktopNavSurface).toHaveCSS('background-color', HERO_GLASS_PANEL_BACKGROUND);
  await expect(desktopNavSurface).toHaveCSS('height', '330px');
  await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(sitemap).toBeVisible();
  await expect(sitemap).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(sitemapCatalogTile).toHaveCSS('color', 'rgb(255, 255, 255)');
};

const expectScrolledHeaderChrome = async (page: Page, isMobile: boolean) => {
  const header = page.locator('header').first();

  await page.evaluate((scrollY) => {
    (globalThis as unknown as { scrollTo: (x: number, y: number) => void }).scrollTo(0, scrollY);
  }, HEADER_RESTORE_SCROLL_Y_PX);

  await expect(header).toHaveCSS('background-color', LIGHT_HEADER_BACKGROUND);
  await expect(header).toHaveCSS('border-bottom-color', LIGHT_HEADER_BORDER);
  await expect(header).toHaveCSS('opacity', '1');

  const headerBox = await header.boundingBox();

  if (!headerBox) {
    throw new Error('스크롤 후 헤더의 레이아웃 박스를 찾을 수 없습니다.');
  }

  expect(Math.abs(headerBox.y)).toBeLessThanOrEqual(POPUP_TOP_ALIGNMENT_TOLERANCE_PX);

  if (isMobile) {
    return;
  }

  await expect(
    page.getByRole('link', { exact: true, name: PRIMARY_MENU_LABELS[0] }).first(),
  ).toHaveCSS('color', LIGHT_HEADER_TEXT);
  await expect(
    page.getByRole('link', { exact: true, name: PRIMARY_MENU_LABELS[4] }).first(),
  ).toHaveCSS('color', LIGHT_HEADER_TEXT);
};

const expectFullscreenHeroVideo = async (page: Page) => {
  const heroSection = page.getByTestId('haatz-hero-section');
  const heroTransitionLayer = page.getByTestId('hero-transition-layer');
  const heroVideoBox = page.getByTestId('hero-video-box');

  await expect(page.locator('[data-testid^="intro-word-line-"]')).toHaveCount(0);
  await expect(page.locator('[data-testid^="intro-capsule-slot-"]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '이전 슬라이드' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '다음 슬라이드' })).toHaveCount(0);
  await expect(heroVideoBox).toBeVisible();

  const heroSectionRect = await heroSection.boundingBox();
  const transitionRect = await heroTransitionLayer.boundingBox();
  const heroVideoRect = await heroVideoBox.boundingBox();

  if (!heroSectionRect || !transitionRect || !heroVideoRect) {
    throw new Error('hero fullscreen video 레이아웃 박스를 찾을 수 없습니다.');
  }

  for (const rect of [transitionRect, heroVideoRect]) {
    expect(Math.abs(rect.x - heroSectionRect.x)).toBeLessThanOrEqual(HERO_FULLSCREEN_TOLERANCE_PX);
    expect(Math.abs(rect.y - heroSectionRect.y)).toBeLessThanOrEqual(HERO_FULLSCREEN_TOLERANCE_PX);
    expect(Math.abs(rect.width - heroSectionRect.width)).toBeLessThanOrEqual(
      HERO_FULLSCREEN_TOLERANCE_PX,
    );
    expect(Math.abs(rect.height - heroSectionRect.height)).toBeLessThanOrEqual(
      HERO_FULLSCREEN_TOLERANCE_PX,
    );
  }
};

const expectDirectHeroExit = async (page: Page) => {
  const header = page.locator('header').first();
  const nextSectionEyebrow = page.getByText('What We Do').first();
  const topButton = page.getByRole('button', { name: '페이지 상단으로 이동' });
  const viewportHeight = page.viewportSize()?.height ?? 1080;

  await page.evaluate((scrollY) => {
    (globalThis as unknown as { scrollTo: (x: number, y: number) => void }).scrollTo(0, scrollY);
  }, viewportHeight + 80);

  await expect(nextSectionEyebrow).toBeVisible();
  await expect(header).toHaveCSS('background-color', LIGHT_HEADER_BACKGROUND);
  await expect(header).toHaveCSS('opacity', '1');
  await expect(topButton).toBeVisible();

  const headerBox = await header.boundingBox();

  if (!headerBox) {
    throw new Error('히어로 이탈 후 헤더의 레이아웃 박스를 찾을 수 없습니다.');
  }

  expect(Math.abs(headerBox.y)).toBeLessThanOrEqual(POPUP_TOP_ALIGNMENT_TOLERANCE_PX);
};

const expectMobileHeroNoHorizontalOverflow = async (page: Page) => {
  const heroSection = page.getByTestId('haatz-hero-section');
  const overflowAmount = await heroSection.evaluate((element) => {
    const sectionElement = element as unknown as {
      scrollWidth: number;
      clientWidth: number;
    };

    return sectionElement.scrollWidth - sectionElement.clientWidth;
  });

  expect(overflowAmount).toBeLessThanOrEqual(1);
};

const expectNewsProgressbarHidden = async (page: Page) => {
  await expect(page.locator('.swiper-pagination-progressbar')).toHaveCount(0);
  await expect(page.locator('.swiper-pagination-progressbar-fill')).toHaveCount(0);
};

const expectProductSectionSpacing = async (page: Page) => {
  const hiwinViewport = page.getByTestId('hiwin-system-viewport');
  const productEyebrow = page.getByText('The Best of Haatz');
  const productHeading = productEyebrow.locator('xpath=..');

  await productHeading.scrollIntoViewIfNeeded();
  await expect(productEyebrow).toBeVisible();
  await expect(hiwinViewport).toBeVisible();

  const [viewportBox, headingBox] = await Promise.all([
    hiwinViewport.boundingBox(),
    productHeading.boundingBox(),
  ]);

  if (!viewportBox || !headingBox) {
    throw new Error('HIWIN 뷰포트 또는 제품 섹션 heading의 레이아웃 박스를 찾을 수 없습니다.');
  }

  const viewportBottom = Math.round(viewportBox.y + viewportBox.height);
  const productHeadingTop = Math.round(headingBox.y);

  expect(productHeadingTop).toBeGreaterThanOrEqual(viewportBottom - 2);
};

const expectWideDesktopPrNewsShowsFourFullCards = async (page: Page) => {
  const prSectionTitle = page.getByText('국제티엔씨의 언론보도');
  const prSection = prSectionTitle.locator('xpath=ancestor::section[1]');
  const newsSwiper = prSection.locator('.swiper').first();
  const newsCards = prSection.locator('a[class*="newsCard"]');

  await prSectionTitle.scrollIntoViewIfNeeded();
  await expect(newsSwiper).toBeVisible();

  const swiperBox = await newsSwiper.boundingBox();

  if (!swiperBox) {
    throw new Error('PR Center swiper의 레이아웃 박스를 찾을 수 없습니다.');
  }

  const swiperLeft = swiperBox.x;
  const swiperRight = swiperBox.x + swiperBox.width;
  const cardCount = await newsCards.count();
  let overlappingCards = 0;
  let fullyVisibleCards = 0;

  for (let index = 0; index < cardCount; index += 1) {
    const cardBox = await newsCards.nth(index).boundingBox();

    if (!cardBox) {
      continue;
    }

    const cardLeft = cardBox.x;
    const cardRight = cardBox.x + cardBox.width;
    const visibleWidth = Math.min(cardRight, swiperRight) - Math.max(cardLeft, swiperLeft);
    const overlapsSwiper = visibleWidth > PARTIAL_CARD_VISIBILITY_THRESHOLD_PX;
    const isFullyVisible =
      cardLeft >= swiperLeft - SWIPER_EDGE_TOLERANCE_PX &&
      cardRight <= swiperRight + SWIPER_EDGE_TOLERANCE_PX;

    if (overlapsSwiper) {
      overlappingCards += 1;
    }

    if (isFullyVisible) {
      fullyVisibleCards += 1;
    }
  }

  expect(fullyVisibleCards).toBe(4);
  expect(overlappingCards).toBe(4);
};

const expectPrNewsControlsLinkedToSwiper = async (page: Page) => {
  const prEyebrow = page.getByText('Media Coverage');
  const prSectionTitle = page.getByText('국제티엔씨의 언론보도');
  const prSection = prSectionTitle.locator('xpath=ancestor::section[1]');
  const controls = page.getByTestId('pr-news-controls');
  const progressTrack = page.getByTestId('pr-news-progress-track');
  const progressFill = page.getByTestId('pr-news-progress-fill');
  const prevButton = page.getByTestId('pr-news-prev-button');
  const nextButton = page.getByTestId('pr-news-next-button');
  const activeTitle = prSection.locator('.swiper-slide-active [class*="newsTitle"]').first();

  await expect(prEyebrow).toHaveCSS('color', PR_CENTER_EYEBROW_BRAND_TEXT);
  await prSectionTitle.scrollIntoViewIfNeeded();
  await expect(controls).toBeVisible();
  await expect(progressTrack).toHaveAttribute('aria-label', 'Media Coverage 자동 재생 진행률');
  await expect(progressTrack).toBeVisible();
  await expect(progressTrack).toHaveCSS('background-color', PR_CENTER_BRAND_TRACK);
  await expect(progressFill).toHaveCSS('background-color', PR_CENTER_BRAND);
  await expect(prevButton).toBeVisible();
  await expect(nextButton).toBeVisible();
  await expect(prevButton).toHaveCSS('background-color', PR_CENTER_BRAND_SURFACE);
  await expect(prevButton).toHaveCSS('border-top-color', PR_CENTER_BRAND_BORDER);
  await expect(nextButton).toHaveCSS('background-color', PR_CENTER_BRAND_SURFACE);
  await expect(nextButton).toHaveCSS('border-top-color', PR_CENTER_BRAND_BORDER);

  const initialTitle = (await activeTitle.textContent())?.trim();

  if (!initialTitle) {
    throw new Error('PR Center 활성 카드 제목을 찾을 수 없습니다.');
  }

  await nextButton.click();
  await page.waitForTimeout(150);

  const resetProgress = Number(await progressFill.getAttribute('data-progress'));

  expect(resetProgress).toBeLessThanOrEqual(12);
  await expect(activeTitle).not.toHaveText(initialTitle);

  await page.waitForTimeout(700);

  const resumedProgress = Number(await progressFill.getAttribute('data-progress'));

  expect(resumedProgress).toBeGreaterThan(resetProgress);
  await prevButton.click();
};

const expectPrNewsSequentialLooping = async (page: Page) => {
  const prSectionTitle = page.getByText('국제티엔씨의 언론보도');
  const prSection = prSectionTitle.locator('xpath=ancestor::section[1]');
  const newsSwiper = prSection.locator('.swiper').first();
  const nextButton = page.getByTestId('pr-news-next-button');
  const activeTitle = prSection.locator('.swiper-slide-active [class*="newsTitle"]').first();
  const activeIndex = prSection.locator('.swiper-slide-active [class*="newsIndex"]').first();

  await prSectionTitle.scrollIntoViewIfNeeded();
  await expect(newsSwiper).toBeVisible();
  await expect(nextButton).toBeVisible();

  await newsSwiper.evaluate((element) => {
    const swiperHost = element as unknown as {
      swiper?: {
        autoplay?: { stop?: () => void };
        slideToLoop: (index: number, speed?: number) => void;
      };
    };
    const swiper = swiperHost.swiper;

    if (!swiper) {
      throw new Error('PR Center swiper 인스턴스를 찾을 수 없습니다.');
    }

    swiper.autoplay?.stop?.();
    swiper.slideToLoop(0, 0);
  });

  await page.waitForTimeout(150);

  for (let index = 0; index < MEDIA_COVERAGE_TITLES.length; index += 1) {
    await expect(activeTitle).toHaveText(MEDIA_COVERAGE_TITLES[index]);
    await expect(activeIndex).toHaveText(String(index + 1).padStart(2, '0'));

    await nextButton.click();
    await page.waitForTimeout(150);
  }

  await expect(activeTitle).toHaveText(MEDIA_COVERAGE_TITLES[0]);
  await expect(activeIndex).toHaveText('01');
};

const expectBusinessInquirySection = async (page: Page) => {
  const inquirySection = page.getByTestId('business-inquiry-section');

  await inquirySection.scrollIntoViewIfNeeded();
  await expect(inquirySection).toBeVisible();
  await expect(inquirySection.getByText('Business Inquiry')).toBeVisible();
  await expect(inquirySection.getByText('국제티엔씨 사업 문의')).toBeVisible();

  await inquirySection.getByLabel(/문의 분야/).selectOption('mechanical-hvac');
  await inquirySection.getByLabel(/회사명/).fill('국제티엔씨');
  await inquirySection.getByLabel(/담당자명/).fill('홍길동');
  await inquirySection.getByLabel(/연락처/).fill('010-1234-5678');
  await inquirySection.getByLabel(/이메일/).fill('contact@example.com');
  await inquirySection
    .getByLabel(/문의 내용/)
    .fill('기계·공조설비 시스템 엔지니어링 관련 상담을 요청드립니다.');
  await inquirySection.getByLabel(/\[필수\] 개인정보 수집·이용 동의/).check();
  await inquirySection.getByRole('button', { name: '문의 접수하기' }).click();

  await expect(inquirySection.getByTestId('business-inquiry-success')).toBeVisible();
  await expect(inquirySection.getByText('문의가 접수되었습니다')).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript('window.localStorage.clear();');
  await page.goto('/');
});

test('desktop home mirrors the main HAATZ chrome and key links', async ({ page }) => {
  await expectIntroLayout(page, INTRO_DOT_TOLERANCE_PX, INTRO_DESKTOP_MIN_FONT_SIZE_PX);
  await expectNewsProgressbarHidden(page);
  await expectPopupHeaderVisible(page);
  await expectHeroHeaderChrome(page, false);
  await expectFullscreenHeroVideo(page);
  await expectHeroTagline(page, false);
  const header = page.locator('header').first();
  const desktopNavSurface = page.getByTestId('desktop-nav-surface');

  const popup = page.getByRole('dialog');
  await expect(popup.locator(`a[href="${POPUP_HREF}"]`).first()).toBeVisible();
  await expectPopupImageFillsPanel(page);
  await popup.getByRole('button', { exact: true, name: '닫기' }).click();
  await expect(popup).toBeHidden();

  await expect(desktopNavSurface).toHaveCSS('opacity', '0');
  await header.hover({ position: { x: 24, y: 24 } });
  await expect(header).toHaveCSS('background-color', HERO_GLASS_PANEL_BACKGROUND);

  const primaryNav = page.getByRole('navigation', { name: 'Primary' });
  await primaryNav.getByRole('link', { name: '실적·정보지원' }).hover();
  await expect(page.getByText('실적 자료와 정보지원 메뉴를')).toBeVisible();
  await expect(
    page.getByRole('link', { name: PERFORMANCE_SUPPORT_SUBMENU_LABELS[3] }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: PERFORMANCE_SUPPORT_SUBMENU_LABELS[4] }).first(),
  ).toBeVisible();
  await expectHeroGlassSitemap(page);

  await page.mouse.move(24, 420);
  await expectHeroHeaderChrome(page, false);
  await expect(desktopNavSurface).toHaveCSS('opacity', '0');

  const headerBox = await header.boundingBox();
  const navBox = await primaryNav.locator('ul').first().boundingBox();

  if (!headerBox || !navBox) {
    throw new Error('헤더 또는 네비게이션의 레이아웃 박스를 찾을 수 없습니다.');
  }

  const headerCenterX = headerBox.x + headerBox.width / 2;
  const navCenterX = navBox.x + navBox.width / 2;
  expect(Math.abs(headerCenterX - navCenterX)).toBeLessThanOrEqual(2);

  for (const label of PRIMARY_MENU_LABELS) {
    await expect(primaryNav.getByRole('link', { exact: true, name: label })).toHaveCSS(
      'white-space',
      'nowrap',
    );
  }

  const headerLogo = page.locator('header img[alt="Kookje"]').first();
  await expect(headerLogo).toHaveAttribute('src', /\/logo_kookje\.png$/);

  await expect(primaryNav.getByRole('link', { name: '에너지솔루션' })).toHaveAttribute('href', '#');
  await expect(page.getByRole('button', { name: '전체 메뉴 열기' })).toBeVisible();
  await page.getByRole('button', { name: '전체 메뉴 열기' }).click();
  await expect(page.getByRole('link', { name: '회사소개' }).last()).toBeVisible();
  await expect(page.getByRole('link', { name: COMPANY_SUBMENU_LABELS[0] }).last()).toBeVisible();
  await expect(
    page.getByRole('link', { name: PERFORMANCE_SUPPORT_SUBMENU_LABELS[3] }).last(),
  ).toBeVisible();
  await page.getByRole('button', { name: '전체 메뉴 닫기' }).click();

  await expectDirectHeroExit(page);
  await expectScrolledHeaderChrome(page, false);
  await primaryNav.getByRole('link', { name: '냉장·냉동시스템' }).hover();
  await expect(page.getByTestId('desktop-nav-surface')).toHaveCSS(
    'background-color',
    LIGHT_HEADER_BACKGROUND,
  );
  await expect(page.getByRole('link', { name: REFRIGERATION_SUBMENU_LABELS[0] }).first()).toHaveCSS(
    'color',
    LIGHT_HEADER_TEXT,
  );
  await expect(
    page.getByRole('link', { name: REFRIGERATION_SUBMENU_LABELS[4] }).first(),
  ).toBeVisible();

  const prSectionTitle = page.getByText('국제티엔씨의 언론보도');
  await prSectionTitle.scrollIntoViewIfNeeded();
  await expect(prSectionTitle).toBeVisible();
  await expect(page.getByText('Media Coverage')).toHaveCSS('color', PR_CENTER_EYEBROW_BRAND_TEXT);
  await expect(page.getByText('국제티엔씨의 최신 소식과 미디어 정보를 확인하세요.')).toBeVisible();
  await expect(page.getByText('Haatz SNS')).toHaveCount(0);
  await expect(page.getByText('우리 생활 속 가까운 이야기')).toHaveCount(0);
});

test('desktop product section starts after HIWIN without overlap', async ({ page }) => {
  await expectIntroLayout(page, INTRO_DOT_TOLERANCE_PX, INTRO_DESKTOP_MIN_FONT_SIZE_PX);
  await expectPopupHeaderVisible(page);

  const popup = page.getByRole('dialog');
  await popup.getByRole('button', { exact: true, name: '닫기' }).click();

  await expectProductSectionSpacing(page);
});

test('desktop PR Center controls drive the slider and autoplay progress', async ({ page }) => {
  await expectIntroLayout(page, INTRO_DOT_TOLERANCE_PX, INTRO_DESKTOP_MIN_FONT_SIZE_PX);
  await expectPopupHeaderVisible(page);

  const popup = page.getByRole('dialog');
  await popup.getByRole('button', { exact: true, name: '닫기' }).click();

  await expectPrNewsControlsLinkedToSwiper(page);
});

test('desktop PR Center repeats the five media coverage cards in order', async ({ page }) => {
  await expectIntroLayout(page, INTRO_DOT_TOLERANCE_PX, INTRO_DESKTOP_MIN_FONT_SIZE_PX);
  await expectPopupHeaderVisible(page);

  const popup = page.getByRole('dialog');
  await popup.getByRole('button', { exact: true, name: '닫기' }).click();

  await expectPrNewsSequentialLooping(page);
});

test('desktop business inquiry section renders below Media Coverage and completes the local form flow', async ({
  page,
}) => {
  await expectIntroLayout(page, INTRO_DOT_TOLERANCE_PX, INTRO_DESKTOP_MIN_FONT_SIZE_PX);
  await expectPopupHeaderVisible(page);

  const popup = page.getByRole('dialog');
  await popup.getByRole('button', { exact: true, name: '닫기' }).click();

  await expectBusinessInquirySection(page);
});

test.describe('wide desktop', () => {
  test.use({
    viewport: { width: 1720, height: 1080 },
  });

  test('PR Center shows four full cards without clipping on wide desktop', async ({ page }) => {
    await expectPopupHeaderVisible(page);

    const popup = page.getByRole('dialog');
    await popup.getByRole('button', { exact: true, name: '닫기' }).click();

    await expectWideDesktopPrNewsShowsFourFullCards(page);
  });
});

test.describe('mobile', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test('mobile popup, menu, and top button follow the HAATZ layout', async ({ page }) => {
    await expectIntroLayout(page, 14, INTRO_MOBILE_MIN_FONT_SIZE_PX);
    await expectNewsProgressbarHidden(page);
    await expectPopupHeaderVisible(page);
    await expectHeroHeaderChrome(page, true);
    await expectFullscreenHeroVideo(page);
    await expectHeroTagline(page, true);
    await expectMobileHeroNoHorizontalOverflow(page);

    const popup = page.getByRole('dialog');
    await expect(popup.locator(`a[href="${POPUP_HREF}"]`).first()).toBeVisible();
    await expectPopupImageFillsPanel(page);
    await popup.getByRole('button', { exact: true, name: '닫기' }).click();
    await expectDirectHeroExit(page);
    await expectScrolledHeaderChrome(page, true);

    const mobileLogo = page.locator('header img[alt="Kookje"]').first();
    await expect(mobileLogo).toHaveAttribute('src', /\/logo_kookje\.png$/);

    const mobileMenuButton = page.getByRole('button', { name: '모바일 메뉴 열기' });
    await expect(mobileMenuButton).toBeVisible();
    await mobileMenuButton.click();

    const currentUrl = page.url();
    const companyGroupLink = page.getByRole('link', { name: '회사소개' }).last();
    await expect(companyGroupLink).toBeVisible();
    await expect(companyGroupLink).toHaveAttribute('aria-expanded', 'true');
    const ceoLink = page.getByRole('link', { name: COMPANY_SUBMENU_LABELS[0] }).first();
    await expect(ceoLink).toHaveAttribute('aria-disabled', 'true');
    await expect(ceoLink).toHaveAttribute('href', '#');
    await expect(page.getByRole('link', { name: COMPANY_SUBMENU_LABELS[3] }).first()).toBeVisible();
    await ceoLink.evaluate((element) => {
      (element as unknown as { click: () => void }).click();
    });
    await expect(page).toHaveURL(currentUrl);
    expect(
      await page.evaluate(() => {
        return (globalThis as unknown as { location: { hash: string } }).location.hash;
      }),
    ).toBe('');

    await page.getByRole('button', { name: '모바일 메뉴 닫기' }).click();

    await page.evaluate('window.scrollTo(0, document.body.scrollHeight);');

    const topButton = page.getByRole('button', { name: '페이지 상단으로 이동' });
    await expect(topButton).toBeVisible();
    await topButton.click();
    await page.waitForFunction('window.scrollY < 50');
  });

  test('mobile product section starts after HIWIN without overlap', async ({ page }) => {
    await expectIntroLayout(page, 14, INTRO_MOBILE_MIN_FONT_SIZE_PX);
    await expectPopupHeaderVisible(page);

    const popup = page.getByRole('dialog');
    await popup.getByRole('button', { exact: true, name: '닫기' }).click();

    await expectProductSectionSpacing(page);
  });
});
