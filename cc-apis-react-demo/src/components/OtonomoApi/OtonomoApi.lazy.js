import React, { lazy, Suspense } from 'react';

const LazyOtonomoApi = lazy(() => import('./OtonomoApi'));

const OtonomoApi = props => (
  <Suspense fallback={null}>
    <LazyOtonomoApi {...props} />
  </Suspense>
);

export default OtonomoApi;
