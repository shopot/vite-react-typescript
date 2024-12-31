import type { JSX } from 'react';

import { RouterProvider } from 'react-router';

import './app.scss';

import { appRouter } from './app-router';

export const App = (): JSX.Element => <RouterProvider router={appRouter} />;
