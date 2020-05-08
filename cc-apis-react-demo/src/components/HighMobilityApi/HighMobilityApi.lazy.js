import React, { lazy, Suspense } from 'react';

const LazyHighMobilityApi = lazy(() => import('./HighMobilityApi'));

const HighMobilityApi = props => (
  <Suspense fallback={null}>
    <LazyHighMobilityApi {...props} />
  </Suspense>
);

export default HighMobilityApi;
