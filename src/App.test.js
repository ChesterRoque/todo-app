import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

.thin-header {
  width: 100%;
  height: 4px; /* Thin line */
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  position: relative;
  top: 0;
  left: 0;
}
