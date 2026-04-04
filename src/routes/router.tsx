import type { RouteObject } from 'react-router-dom';
import { Navigate, createBrowserRouter } from 'react-router-dom';

import AdminRouteLayout from '@/features/board/AdminRouteLayout';
import AboutCertificationPage from '@/pages/AboutCertificationPage/AboutCertificationPage';
import AboutGreetingPage from '@/pages/AboutGreetingPage/AboutGreetingPage';
import AboutHistoryPage from '@/pages/AboutHistoryPage/AboutHistoryPage';
import AboutLocationPage from '@/pages/AboutLocationPage/AboutLocationPage';
import AboutOrganizationPage from '@/pages/AboutOrganizationPage/AboutOrganizationPage';
import AdminConstructionCaseFormPage from '@/pages/AdminConstructionCaseFormPage/AdminConstructionCaseFormPage';
import AdminConstructionCaseListPage from '@/pages/AdminConstructionCaseListPage/AdminConstructionCaseListPage';
import AdminLoginPage from '@/pages/AdminLoginPage/AdminLoginPage';
import AdminNoticeFormPage from '@/pages/AdminNoticeFormPage/AdminNoticeFormPage';
import AdminNoticeListPage from '@/pages/AdminNoticeListPage/AdminNoticeListPage';
import AdminProjectRecordFormPage from '@/pages/AdminProjectRecordFormPage/AdminProjectRecordFormPage';
import AdminProjectRecordListPage from '@/pages/AdminProjectRecordListPage/AdminProjectRecordListPage';
import AdminRootLayout from '@/pages/AdminRootLayout/AdminRootLayout';
import AdminResourceFormPage from '@/pages/AdminResourceFormPage/AdminResourceFormPage';
import AdminResourceListPage from '@/pages/AdminResourceListPage/AdminResourceListPage';
import AdminTechnicalDataFormPage from '@/pages/AdminTechnicalDataFormPage/AdminTechnicalDataFormPage';
import AdminTechnicalDataListPage from '@/pages/AdminTechnicalDataListPage/AdminTechnicalDataListPage';
import AdminWebCatalogFormPage from '@/pages/AdminWebCatalogFormPage/AdminWebCatalogFormPage';
import AdminWebCatalogListPage from '@/pages/AdminWebCatalogListPage/AdminWebCatalogListPage';
import CatalogCategoryPage from '@/pages/CatalogCategoryPage/CatalogCategoryPage';
import CatalogDetailPage from '@/pages/CatalogDetailPage/CatalogDetailPage';
import ConstructionCaseDetailPage from '@/pages/ConstructionCaseDetailPage/ConstructionCaseDetailPage';
import ConstructionCaseListPage from '@/pages/ConstructionCaseListPage/ConstructionCaseListPage';
import HomePage from '@/pages/HomePage/HomePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import NoticeDetailPage from '@/pages/NoticeDetailPage/NoticeDetailPage';
import NoticeListPage from '@/pages/NoticeListPage/NoticeListPage';
import ProjectRecordDetailPage from '@/pages/ProjectRecordDetailPage/ProjectRecordDetailPage';
import ProjectRecordListPage from '@/pages/ProjectRecordListPage/ProjectRecordListPage';
import ResourceDetailPage from '@/pages/ResourceDetailPage/ResourceDetailPage';
import ResourceListPage from '@/pages/ResourceListPage/ResourceListPage';
import RootLayout from '@/pages/RootLayout/RootLayout';
import RouteErrorPage from '@/pages/RouteErrorPage/RouteErrorPage';
import TechnicalDataDetailPage from '@/pages/TechnicalDataDetailPage/TechnicalDataDetailPage';
import TechnicalDataListPage from '@/pages/TechnicalDataListPage/TechnicalDataListPage';
import WebCatalogDetailPage from '@/pages/WebCatalogDetailPage/WebCatalogDetailPage';
import WebCatalogListPage from '@/pages/WebCatalogListPage/WebCatalogListPage';
import { routePaths } from '@/routes/routeRegistry';

export const appRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminRootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: 'login',
        element: <AdminLoginPage />,
      },
      {
        element: <AdminRouteLayout />,
        children: [
          {
            index: true,
            element: <Navigate replace to={routePaths.adminWebCatalogs} />,
          },
          {
            path: 'notices',
            element: <AdminNoticeListPage />,
          },
          {
            path: 'notices/new',
            element: <AdminNoticeFormPage />,
          },
          {
            path: 'notices/:noticeId/edit',
            element: <AdminNoticeFormPage />,
          },
          {
            path: 'resources',
            element: <AdminResourceListPage />,
          },
          {
            path: 'resources/new',
            element: <AdminResourceFormPage />,
          },
          {
            path: 'resources/:resourceId/edit',
            element: <AdminResourceFormPage />,
          },
          {
            path: 'construction-cases',
            element: <AdminConstructionCaseListPage />,
          },
          {
            path: 'construction-cases/new',
            element: <AdminConstructionCaseFormPage />,
          },
          {
            path: 'construction-cases/:constructionCaseId/edit',
            element: <AdminConstructionCaseFormPage />,
          },
          {
            path: 'project-records',
            element: <AdminProjectRecordListPage />,
          },
          {
            path: 'project-records/new',
            element: <AdminProjectRecordFormPage />,
          },
          {
            path: 'project-records/:projectRecordId/edit',
            element: <AdminProjectRecordFormPage />,
          },
          {
            path: 'technical-data',
            element: <AdminTechnicalDataListPage />,
          },
          {
            path: 'technical-data/new',
            element: <AdminTechnicalDataFormPage />,
          },
          {
            path: 'technical-data/:technicalDataId/edit',
            element: <AdminTechnicalDataFormPage />,
          },
          {
            path: 'web-catalogs',
            element: <AdminWebCatalogListPage />,
          },
          {
            path: 'web-catalogs/new',
            element: <AdminWebCatalogFormPage />,
          },
          {
            path: 'web-catalogs/:webCatalogId/edit',
            element: <AdminWebCatalogFormPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about/greeting',
        element: <AboutGreetingPage />,
      },
      {
        path: 'about/history',
        element: <AboutHistoryPage />,
      },
      {
        path: 'about/certification',
        element: <AboutCertificationPage />,
      },
      {
        path: 'about/organization',
        element: <AboutOrganizationPage />,
      },
      {
        path: 'about/location',
        element: <AboutLocationPage />,
      },
      {
        path: routePaths.energySolution.slice(1),
        element: <CatalogCategoryPage categorySlug='energy-solution' />,
      },
      {
        path: routePaths.mechanicalHvac.slice(1),
        element: <CatalogCategoryPage categorySlug='mechanical-hvac' />,
      },
      {
        path: routePaths.refrigerationSystem.slice(1),
        element: <CatalogCategoryPage categorySlug='refrigeration-system' />,
      },
      {
        path: 'notice',
        element: <NoticeListPage />,
      },
      {
        path: 'notice/:noticeId',
        element: <NoticeDetailPage />,
      },
      {
        path: 'resources',
        element: <ResourceListPage />,
      },
      {
        path: 'resources/:resourceId',
        element: <ResourceDetailPage />,
      },
      {
        path: routePaths.constructionCases.slice(1),
        element: <ConstructionCaseListPage />,
      },
      {
        path: `${routePaths.constructionCases.slice(1)}/:constructionCaseId`,
        element: <ConstructionCaseDetailPage />,
      },
      {
        path: routePaths.projectRecords.slice(1),
        element: <ProjectRecordListPage />,
      },
      {
        path: `${routePaths.projectRecords.slice(1)}/:projectRecordId`,
        element: <ProjectRecordDetailPage />,
      },
      {
        path: routePaths.technicalData.slice(1),
        element: <TechnicalDataListPage />,
      },
      {
        path: `${routePaths.technicalData.slice(1)}/:technicalDataId`,
        element: <TechnicalDataDetailPage />,
      },
      {
        path: routePaths.webCatalogs.slice(1),
        element: <WebCatalogListPage />,
      },
      {
        path: `${routePaths.webCatalogs.slice(1)}/:webCatalogId`,
        element: <WebCatalogDetailPage />,
      },
      {
        path: ':categorySlug/:itemSlug',
        element: <CatalogDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
