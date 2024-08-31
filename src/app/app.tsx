import type { JSX } from 'react';
import { RouterProvider } from 'react-router-dom';

import './app.scss';

import { router } from 'app/router';

export const App = (): JSX.Element => <RouterProvider router={router} />;
