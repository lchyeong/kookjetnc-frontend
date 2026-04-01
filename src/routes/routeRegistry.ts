export const catalogCategorySlugs = [
  'energy-solution',
  'mechanical-hvac',
  'refrigeration-system',
] as const;

export type CatalogCategorySlug = (typeof catalogCategorySlugs)[number];

const createCatalogCategoryPath = (categorySlug: CatalogCategorySlug) => {
  return `/${categorySlug}`;
};

export const routePaths = {
  aboutHistory: '/about/history',
  home: '/',
  energySolution: createCatalogCategoryPath('energy-solution'),
  mechanicalHvac: createCatalogCategoryPath('mechanical-hvac'),
  refrigerationSystem: createCatalogCategoryPath('refrigeration-system'),
  catalogCategory: createCatalogCategoryPath,
  catalogDetail: (categorySlug: CatalogCategorySlug, itemSlug: string) => {
    return `/${categorySlug}/${itemSlug}`;
  },
} as const;

export const catalogCategoryPaths = [
  routePaths.energySolution,
  routePaths.mechanicalHvac,
  routePaths.refrigerationSystem,
] as const;

export const isCatalogCategoryPath = (pathname: string) => {
  return catalogCategoryPaths.some((path) => path === pathname);
};

export const isCatalogDetailPath = (pathname: string) => {
  return catalogCategorySlugs.some((slug) => {
    return new RegExp(`^/${slug}/[^/]+$`).test(pathname);
  });
};

export const isCatalogRoute = (pathname: string) => {
  return isCatalogCategoryPath(pathname) || isCatalogDetailPath(pathname);
};
