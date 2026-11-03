import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LobbyIconButton, LobbyMenu } from '.';

describe('LobbyMenu', () => {
  it('exposes named native buttons and dispatches the selected action', async () => {
    const onAction = vi.fn();
    render(<LobbyMenu onAction={onAction} />);
    expect(screen.getByRole('group', { name: '大厅菜单' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(7);
    await userEvent.click(screen.getByRole('button', { name: '物品' }));
    expect(onAction).toHaveBeenLastCalledWith('items');
    await userEvent.click(screen.getByRole('button', { name: '商店' }));
    expect(onAction).toHaveBeenLastCalledWith('store');
    await userEvent.click(screen.getByRole('button', { name: '兑换码' }));
    expect(onAction).toHaveBeenLastCalledWith('codes');
  });

  it('supports an icons-only instance with custom assets', () => {
    render(<LobbyMenu showStore={false} items={['backpack', 'journal']} aria-label="自定义菜单" />);
    expect(screen.getByRole('group', { name: '自定义菜单' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '背包' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '日志' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '商店' })).not.toBeInTheDocument();
  });

  it('keeps a disabled icon button inert', async () => {
    const onClick = vi.fn();
    render(<LobbyIconButton icon="settings" disabled onClick={onClick} aria-label="禁用设置" />);
    const button = screen.getByRole('button', { name: '禁用设置' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
