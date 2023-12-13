import { JSX } from 'react';

import './app.scss';

import { withProviders } from './providers';
import { AppRouter } from './app-router';

export const App = withProviders((): JSX.Element => <AppRouter />);
