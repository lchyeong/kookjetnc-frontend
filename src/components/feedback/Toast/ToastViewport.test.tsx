import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ToastViewport } from '@/components/feedback/Toast/ToastViewport';
import { useToastStore } from '@/stores/useToastStore';

describe('ToastViewport', () => {
  afterEach(() => {
    useToastStore.getState().clearToasts();
  });

  it('renders and dismisses toasts from the shared store', () => {
    render(<ToastViewport />);

    act(() => {
      useToastStore.getState().showToast({
        message: 'Shared toast message',
        variant: 'success',
        durationMs: null,
      });
    });

    expect(screen.getByText('Shared toast message')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(screen.queryByText('Shared toast message')).not.toBeInTheDocument();
  });
});
