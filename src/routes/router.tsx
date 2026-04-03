import type { RouteObject } from 'react-router-dom';
import { Navigate, createBrowserRouter } from 'react-router-dom';

import AdminRouteLayout from '@/features/board/AdminRouteLayout';
import AboutCertificationPage from '@/pages/AboutCertificationPage/AboutCertificationPage';
import AboutGreetingPage from '@/pages/AboutGreetingPage/AboutGreetingPage';
import AboutHistoryPage from '@/pages/AboutHistoryPage/AboutHistoryPage';
import AboutLocationPage from '@/pages/AboutLocationPage/AboutLocationPage';
import AboutOrganizationPage from '@/pages/AboutOrganizationPage/AboutOrganizationPage';
import AdminLoginPage from '@/pages/AdminLoginPage/AdminLoginPage';
import AdminNoticeFormPage from '@/pages/AdminNoticeFormPage/AdminNoticeFormPage';
import AdminNoticeListPage from '@/pages/AdminNoticeListPage/AdminNoticeListPage';
import AdminResourceFormPage from '@/pages/AdminResourceFormPage/AdminResourceFormPage';
import AdminResourceListPage from '@/pages/AdminResourceListPage/AdminResourceListPage';
import CatalogCategoryPage from '@/pages/CatalogCategoryPage/CatalogCategoryPage';
import CatalogDetailPage from '@/pages/CatalogDetailPage/CatalogDetailPage';
import HomePage from '@/pages/HomePage/HomePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import NoticeDetailPage from '@/pages/NoticeDetailPage/NoticeDetailPage';
import NoticeListPage from '@/pages/NoticeListPage/NoticeListPage';
import ResourceDetailPage from '@/pages/ResourceDetailPage/ResourceDetailPage';
import ResourceListPage from '@/pages/ResourceListPage/ResourceListPage';
import RootLayout from '@/pages/RootLayout/RootLayout';
import RouteErrorPage from '@/pages/RouteErrorPage/RouteErrorPage';
import { routePaths } from '@/routes/routeRegistry';

export const appRoutes: RouteObject[] = [
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
        path: 'admin/login',
        element: <AdminLoginPage />,
      },
      {
        path: 'admin',
        element: <AdminRouteLayout />,
        children: [
          {
            index: true,
            element: <Navigate replace to={routePaths.adminNotices} />,
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
        ],
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
