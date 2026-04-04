export const catalogCategorySlugs = [
  'energy-solution',
  'mechanical-hvac',
  'refrigeration-system',
] as const;

export type CatalogCategorySlug = (typeof catalogCategorySlugs)[number];

const createCatalogCategoryPath = (categorySlug: CatalogCategorySlug) => {
  return `/${categorySlug}`;
};

const stringifyRouteParam = (value: number | string) => {
  return String(value);
};

export const routePaths = {
  aboutGreeting: '/about/greeting',
  aboutHistory: '/about/history',
  aboutCertification: '/about/certification',
  aboutOrganization: '/about/organization',
  aboutLocation: '/about/location',
  home: '/',
  energySolution: createCatalogCategoryPath('energy-solution'),
  mechanicalHvac: createCatalogCategoryPath('mechanical-hvac'),
  refrigerationSystem: createCatalogCategoryPath('refrigeration-system'),
  catalogCategory: createCatalogCategoryPath,
  catalogDetail: (categorySlug: CatalogCategorySlug, itemSlug: string) => {
    return `/${categorySlug}/${itemSlug}`;
  },
  notices: '/notice',
  noticeDetail: (noticeId: number | string) => `/notice/${stringifyRouteParam(noticeId)}`,
  resources: '/resources',
  resourceDetail: (resourceId: number | string) => `/resources/${stringifyRouteParam(resourceId)}`,
  constructionCases: '/construction-cases',
  constructionCaseDetail: (constructionCaseId: number | string) =>
    `/construction-cases/${stringifyRouteParam(constructionCaseId)}`,
  projectRecords: '/project-records',
  projectRecordDetail: (projectRecordId: number | string) =>
    `/project-records/${stringifyRouteParam(projectRecordId)}`,
  technicalData: '/technical-data',
  technicalDataDetail: (technicalDataId: number | string) =>
    `/technical-data/${stringifyRouteParam(technicalDataId)}`,
  webCatalogs: '/web-catalogs',
  webCatalogDetail: (webCatalogId: number | string) =>
    `/web-catalogs/${stringifyRouteParam(webCatalogId)}`,
  admin: '/admin',
  adminLogin: '/admin/login',
  adminNotices: '/admin/notices',
  adminNoticeCreate: '/admin/notices/new',
  adminNoticeEdit: (noticeId: number | string) =>
    `/admin/notices/${stringifyRouteParam(noticeId)}/edit`,
  adminResources: '/admin/resources',
  adminResourceCreate: '/admin/resources/new',
  adminResourceEdit: (resourceId: number | string) =>
    `/admin/resources/${stringifyRouteParam(resourceId)}/edit`,
  adminConstructionCases: '/admin/construction-cases',
  adminConstructionCaseCreate: '/admin/construction-cases/new',
  adminConstructionCaseEdit: (constructionCaseId: number | string) =>
    `/admin/construction-cases/${stringifyRouteParam(constructionCaseId)}/edit`,
  adminProjectRecords: '/admin/project-records',
  adminProjectRecordCreate: '/admin/project-records/new',
  adminProjectRecordEdit: (projectRecordId: number | string) =>
    `/admin/project-records/${stringifyRouteParam(projectRecordId)}/edit`,
  adminTechnicalData: '/admin/technical-data',
  adminTechnicalDataCreate: '/admin/technical-data/new',
  adminTechnicalDataEdit: (technicalDataId: number | string) =>
    `/admin/technical-data/${stringifyRouteParam(technicalDataId)}/edit`,
  adminWebCatalogs: '/admin/web-catalogs',
  adminWebCatalogCreate: '/admin/web-catalogs/new',
  adminWebCatalogEdit: (webCatalogId: number | string) =>
    `/admin/web-catalogs/${stringifyRouteParam(webCatalogId)}/edit`,
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
