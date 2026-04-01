import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import AppErrorBoundary from '@/app/AppErrorBoundary';

const ThrowingComponent = () => {
  throw new Error('Boundary test failure');
};

describe('AppErrorBoundary', () => {
  it('renders the fallback page when a child throws', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <MemoryRouter>
        <AppErrorBoundary>
          <ThrowingComponent />
        </AppErrorBoundary>
      </MemoryRouter>,
    );

    expect(
      screen.getByText('The starter shell caught an unexpected render error.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Boundary test failure')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
