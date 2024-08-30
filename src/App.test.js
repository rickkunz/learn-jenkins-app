import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Kids Table link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Kids Table/i);
  expect(linkElement).toBeInTheDocument();
});
