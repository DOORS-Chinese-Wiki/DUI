import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from '.';

describe('Icon', () => {
  it('renders a semantic built-in icon', () => {
    render(<Icon name="settings" alt="设置" />);
    expect(screen.getByRole('img', { name: '设置' })).toBeInTheDocument();
  });

  it('hides decorative icons from assistive technology', () => {
    const { container } = render(<Icon name="items" />);
    const icon = container.firstElementChild;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toHaveAttribute('role');
  });

  it('supports custom image sources', () => {
    render(<Icon src="/custom-item.png" alt="自定义物品" />);
    expect(screen.getByRole('img', { name: '自定义物品' })).toBeInTheDocument();
  });
});
