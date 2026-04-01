import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { server } from '@/mocks/server';
import PlaygroundPage from '@/pages/PlaygroundPage/PlaygroundPage';

const renderPlaygroundPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <PlaygroundPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe('PlaygroundPage', () => {
  it('renders example items from the retained async layer', async () => {
    renderPlaygroundPage();

    expect(await screen.findByText('Foundation Ready')).toBeInTheDocument();
    expect(screen.getByText('MSW Example')).toBeInTheDocument();
  });

  it('renders the error state when the example request fails', async () => {
    server.use(
      http.get('/example-items', () => {
        return new HttpResponse('Example request failed.', { status: 500 });
      }),
    );

    renderPlaygroundPage();

    expect(
      await screen.findByText('The retained data layer is still test-ready.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Example request failed.')).toBeInTheDocument();
  });
});
