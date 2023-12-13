import { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';

import { HomePage } from '@/pages';

export const AppRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="home" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
};
