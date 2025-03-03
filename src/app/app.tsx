import type { JSX } from 'react';
import { RouterProvider } from 'react-router';

import { appRouter } from './app-router';

import './app.scss';

export const App = (): JSX.Element => <RouterProvider router={appRouter} />;
