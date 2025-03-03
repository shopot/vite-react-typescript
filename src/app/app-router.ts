import { createBrowserRouter, type RouteObject } from 'react-router';

import { homeRoutes } from '@/modules/home';

const publicRoutes: RouteObject[] = [...homeRoutes];

export const appRouter = createBrowserRouter([
  {
    children: [
      {
        children: publicRoutes,
        path: '/',
      },
    ],
  },
]);
