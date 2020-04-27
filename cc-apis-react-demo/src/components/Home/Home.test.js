import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from './Home';

describe('<Home />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<Home />);
    const home = getByTestId('Home');

    expect(home).toBeInTheDocument();
  });
});