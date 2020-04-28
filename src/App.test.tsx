import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders sudoku title', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/sudoku/i);
  expect(titleElement).toBeInTheDocument();
});
