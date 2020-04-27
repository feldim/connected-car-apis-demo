import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Nav from './Nav';

describe('<Nav />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<Nav />);
    const nav = getByTestId('Nav');

    expect(nav).toBeInTheDocument();
  });
});