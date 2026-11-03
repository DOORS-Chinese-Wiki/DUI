import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '.';

describe('Switch', () => {
  it('toggles an uncontrolled value', async () => {
    const user = userEvent.setup();
    render(<Switch label="减少动作幅度" />);
    const control = screen.getByRole('switch', { name: '减少动作幅度' });

    expect(control).not.toBeChecked();
    await user.click(control);
    expect(control).toBeChecked();
  });

  it('supports controlled state', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="切换蹲姿"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    await user.click(screen.getByRole('switch', { name: '切换蹲姿' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('does not toggle while disabled', async () => {
    const user = userEvent.setup();
    render(<Switch label="没有蜘蛛腿" disabled />);
    const control = screen.getByRole('switch', { name: '没有蜘蛛腿' });

    await user.click(control);
    expect(control).toBeDisabled();
    expect(control).not.toBeChecked();
  });
});
