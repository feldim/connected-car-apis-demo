import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MbApi from './MbApi';

describe('<MbApi />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<MbApi />);
    const mbApi = getByTestId('MbApi');

    expect(mbApi).toBeInTheDocument();
  });
});