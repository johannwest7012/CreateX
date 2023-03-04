import React from 'react';
import { render } from '@testing-library/react';

import Creator from '../components/Creator'
import Loader from '../components/Loader'
import Message from '../components/Message'

describe('Creator', () => {
  test('renders without crashing', () => {
    const { getByTestId } = render(<Creator/>);
    const component = getByTestId('my-component');
    expect(component).toBeInTheDocument();
  });
});
