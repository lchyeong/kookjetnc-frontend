import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Modal from '@/components/overlay/Modal/Modal';

describe('Modal', () => {
  it('calls onClose when escape is pressed', () => {
    const onClose = vi.fn();

    render(
      <Modal onClose={onClose} title='Starter Modal'>
        <button type='button'>Focusable Action</button>
      </Modal>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
