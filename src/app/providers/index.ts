import compose from 'compose-function';

import { withRouter } from './with-router.tsx';

export const withProviders = compose(withRouter);
