import './app.scss';
import { AppRouter } from './app-router';
import { withProviders } from './providers';

export const App = withProviders((): JSX.Element => <AppRouter />);
