import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';

import AboutHistoryPage from '@/pages/AboutHistoryPage/AboutHistoryPage';
import CatalogCategoryPage from '@/pages/CatalogCategoryPage/CatalogCategoryPage';
import CatalogDetailPage from '@/pages/CatalogDetailPage/CatalogDetailPage';
import HomePage from '@/pages/HomePage/HomePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
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
        path: 'about/history',
        element: <AboutHistoryPage />,
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
