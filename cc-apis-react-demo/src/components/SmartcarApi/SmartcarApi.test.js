import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Smartcar from './Smartcar';

describe('<Smartcar />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<Smartcar />);
    const smartcar = getByTestId('Smartcar');

    expect(smartcar).toBeInTheDocument();
  });
});