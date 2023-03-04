import React from 'react';
import { render } from '@testing-library/react';

import Creator from '..src/components/Creator'
import Loader from '..src/components/Loader'
import Message from '..src/components/Message'

describe('Creator', () => {
  test('renders without crashing', () => {
    const { getByTestId } = render(<Creator/>);
    const component = getByTestId('my-component');
    expect(component).toBeInTheDocument();
  });
});
