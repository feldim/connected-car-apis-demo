import React, { lazy, Suspense } from 'react';

const LazySmartcar = lazy(() => import('./Smartcar'));

const Smartcar = props => (
  <Suspense fallback={null}>
    <LazySmartcar {...props} />
  </Suspense>
);

export default Smartcar;
