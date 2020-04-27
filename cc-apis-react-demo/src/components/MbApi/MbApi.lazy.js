import React, { lazy, Suspense } from 'react';

const LazyMbApi = lazy(() => import('./MbApi'));

const MbApi = props => (
  <Suspense fallback={null}>
    <LazyMbApi {...props} />
  </Suspense>
);

export default MbApi;
