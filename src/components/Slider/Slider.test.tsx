import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from '.';

describe('Slider', () => {
  it('updates continuously with single-percent steps', () => {
    render(<Slider label="大厅音乐" defaultValue={20} />);
    const slider = screen.getByRole('slider', { name: '大厅音乐' });

    expect(slider).toHaveAttribute('step', '1');
    fireEvent.change(slider, { target: { value: '63' } });
    expect(slider).toHaveValue('63');
  });

  it('supports controlled values', () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        label="游戏音乐"
        value={30}
        step={10}
        onValueChange={onValueChange}
      />,
    );

    const slider = screen.getByRole('slider', { name: '游戏音乐' });
    fireEvent.change(slider, { target: { value: '70' } });
    expect(onValueChange).toHaveBeenCalledWith(70);
    expect(slider).toHaveValue('30');
  });

  it('respects the disabled state', () => {
    render(<Slider label="大厅音乐" disabled />);
    expect(screen.getByRole('slider', { name: '大厅音乐' })).toBeDisabled();
  });
});
