import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OtonomoApi from './OtonomoApi';

describe('<OtonomoApi />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<OtonomoApi />);
    const otonomoApi = getByTestId('OtonomoApi');

    expect(otonomoApi).toBeInTheDocument();
  });
});