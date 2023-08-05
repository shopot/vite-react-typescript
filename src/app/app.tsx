import { ReactElement } from 'react';

import './app.scss';

import { withProviders } from './providers';
import { AppRouter } from './app-router.tsx';

export const App = withProviders((): ReactElement => <AppRouter />);
