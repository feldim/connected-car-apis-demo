import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HighMobilityApi from './HighMobilityApi';

describe('<HighMobilityApi />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<HighMobilityApi />);
    const highMobilityApi = getByTestId('HighMobilityApi');

    expect(highMobilityApi).toBeInTheDocument();
  });
});