import type { RouteObject } from 'react-router';

import { HomePage } from './home-page';

export const homeRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
];
