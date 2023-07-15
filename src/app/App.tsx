import { ReactElement } from 'react';

import './App.scss';

import { withProviders } from './providers';
import { AppRouter } from './AppRouter';

export const App = withProviders((): ReactElement => <AppRouter />);
