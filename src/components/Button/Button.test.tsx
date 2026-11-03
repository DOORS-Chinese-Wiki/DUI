import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '.';

describe('Button', () => {
  it('renders the primary variant by default', () => {
    render(<Button>Host game</Button>);

    const button = screen.getByRole('button', { name: 'Host game' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeEnabled();
  });

  it('exposes loading and disabled states', () => {
    const { rerender } = render(
      <Button loading loadingLabel="Opening the door">
        Continue
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Opening the door/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    rerender(<Button disabled>Continue</Button>);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('keeps asChild links keyboard accessible', async () => {
    const user = userEvent.setup();
    render(
      <Button asChild variant="secondary">
        <a href="#archive">Open archive</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Open archive' });
    expect(link).not.toHaveAttribute('type');
    await user.tab();
    expect(link).toHaveFocus();
  });

  it('requires an accessible name when icon-only', async () => {
    const { container } = render(
      <Button iconOnly aria-label="Open settings">
        <span aria-hidden="true">⚙</span>
      </Button>,
    );

    expect(screen.getByRole('button', { name: 'Open settings' })).toBeVisible();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not invoke onClick while unavailable', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Blocked
      </Button>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Blocked' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
