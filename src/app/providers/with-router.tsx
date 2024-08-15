import { type ReactNode, type JSX, Suspense } from 'react';
import { HashRouter } from 'react-router-dom';

export const withRouter = (component: () => ReactNode) => (): JSX.Element => (
  <HashRouter>
    <Suspense fallback="Loading...">{component()}</Suspense>
  </HashRouter>
);
