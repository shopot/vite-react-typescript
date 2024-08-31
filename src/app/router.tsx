import { createBrowserRouter } from 'react-router-dom';

import { homeRoutes } from 'features/home';

const publicRoutes = [...homeRoutes];

export const router = createBrowserRouter([
  {
    children: [
      {
        path: '/',
        children: publicRoutes,
      },
    ],
  },
]);
