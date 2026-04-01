import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TextAreaField, TextField } from '@/components/ui/TextField/TextField';

describe('TextField', () => {
  it('renders input and exposes the error message accessibly', () => {
    render(<TextField errorMessage='Required field.' label='Client Name' name='clientName' />);

    const input = screen.getByLabelText('Client Name');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Required field.');
  });

  it('renders textarea fields', () => {
    render(<TextAreaField label='Project Notes' name='projectNotes' />);

    expect(screen.getByLabelText('Project Notes').tagName).toBe('TEXTAREA');
  });
});
