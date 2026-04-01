import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Button from '@/components/ui/Button/Button';

describe('Button', () => {
  it('renders children and disabled state', () => {
    render(
      <Button disabled variant='danger'>
        Remove
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Remove' });

    expect(button).toBeDisabled();
  });
});
