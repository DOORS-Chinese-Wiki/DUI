import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AchievementCard, CurrencyDisplay, CurrencyGroup, InventoryBar, ItemSlot, Panel, PanelSection, ShopItemCard, Switch, Tabs } from '.';

describe('expanded component library', () => {
  it('keeps inactive tab content mounted and skips disabled tabs', async () => {
    render(<Tabs label="示例分类" items={[
      { value: 'a', label: '第一页', content: <Switch label="保留状态" defaultChecked /> },
      { value: 'locked', label: '不可选', disabled: true, content: null },
      { value: 'b', label: '第二页', content: '第二页内容' },
    ]} />);
    await userEvent.click(screen.getByRole('switch', { name: '保留状态' }));
    const first = screen.getByRole('tab', { name: '第一页' });
    await userEvent.click(first);
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '第二页' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('第二页内容');
    await userEvent.click(first);
    expect(screen.getByRole('switch', { name: '保留状态' })).not.toBeChecked();
  });

  it('requests a controlled tab change without overriding the parent value', async () => {
    const onValueChange = vi.fn();
    render(<Tabs label="受控分类" value="a" onValueChange={onValueChange} items={[
      { value: 'a', label: '第一页', content: '一' }, { value: 'b', label: '第二页', content: '二' },
    ]} />);
    await userEvent.click(screen.getByRole('tab', { name: '第二页' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tab', { name: '第一页' })).toHaveAttribute('aria-selected', 'true');
  });

  it('selects inventory items with arrows and local number keys, skipping disabled slots', async () => {
    render(<InventoryBar items={[
      { id: 'lighter', icon: 'lighter' }, { id: 'locked', icon: 'skeletonKey', disabled: true },
      { id: 'vitamins', icon: 'vitamins', count: 3 },
    ]} />);
    const lighter = screen.getByRole('button', { name: '打火机' });
    await userEvent.click(lighter);
    await userEvent.keyboard('{ArrowRight}');
    const vitamins = screen.getByRole('button', { name: '维生素，数量 3' });
    expect(vitamins).toHaveFocus();
    expect(vitamins).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('1');
    expect(lighter).toHaveFocus();
    expect(lighter).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows inventory corner numbers and explicit single-item quantities', () => {
    render(<ItemSlot icon="skeletonKey" count={1} shortcut={8} size="sm" shape="circle" />);
    const slot = screen.getByRole('button', { name: '骷髅钥匙，数量 1' });
    expect(slot.querySelector('kbd')).toHaveTextContent('8');
    expect(slot).toHaveTextContent('x1');
    expect(slot).toHaveAttribute('aria-pressed', 'false');
  });

  it('clamps inventory charge and announces the remaining percentage', () => {
    const { rerender } = render(<ItemSlot icon="lighter" charge={2} />);
    expect(screen.getByRole('button', { name: '打火机，剩余 100%' }).querySelector('progress')).toHaveAttribute('value', '1');
    rerender(<ItemSlot icon="lighter" charge={-1} />);
    expect(screen.getByRole('button', { name: '打火机，剩余 0%' }).querySelector('progress')).toHaveAttribute('value', '0');
    rerender(<ItemSlot icon="lighter" charge={NaN} />);
    expect(screen.getByRole('button', { name: '打火机，剩余 0%' }).querySelector('progress')).toHaveAttribute('value', '0');
    rerender(<ItemSlot icon="lighter" />);
    expect(screen.getByRole('button', { name: '打火机' }).querySelector('progress')).toBeNull();
  });

  it('formats counts and normalizes invalid or negative currency amounts', () => {
    render(<CurrencyGroup><CurrencyDisplay kind="knobs" value={1250} /><CurrencyDisplay kind="gold" value={-4} /><CurrencyDisplay kind="revive" value={NaN} /></CurrencyGroup>);
    expect(screen.getByRole('img', { name: '旋钮：1,250' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '金币：0' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '复活次数：0' })).toBeInTheDocument();
  });

  it('dispatches purchases only while the item is available and not owned', async () => {
    const onPurchase = vi.fn();
    const { rerender } = render(<ShopItemCard item="lighter" price={25} onPurchase={onPurchase} />);
    await userEvent.click(screen.getByRole('button', { name: '打火机：购买' }));
    expect(onPurchase).toHaveBeenCalledTimes(1);
    rerender(<ShopItemCard item="lighter" price={25} owned onPurchase={onPurchase} />);
    const owned = screen.getByRole('button', { name: '打火机：已拥有' });
    expect(owned).toBeDisabled();
    await userEvent.click(owned);
    rerender(<ShopItemCard item="lighter" price={25} available={false} onPurchase={onPurchase} />);
    expect(screen.getByRole('button', { name: '打火机：售罄' })).toBeDisabled();
    expect(onPurchase).toHaveBeenCalledTimes(1);
  });

  it('clamps achievement progress and exposes native progress semantics', () => {
    const { rerender } = render(<AchievementCard achievement="outOfMyWay" progress={12} max={5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '5');
    expect(screen.getByRole('progressbar')).toHaveAttribute('max', '5');
    rerender(<AchievementCard achievement="outOfMyWay" progress={NaN} max={0} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0');
    expect(screen.getByRole('progressbar')).toHaveAttribute('max', '1');
  });

  it('uses a named panel and calls its close action', async () => {
    const onClose = vi.fn();
    render(<Panel title="测试面板" onClose={onClose}><PanelSection title="测试分组">内容</PanelSection></Panel>);
    expect(screen.getByRole('region', { name: '测试面板' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '测试分组' })).toHaveTextContent('内容');
    await userEvent.click(screen.getByRole('button', { name: '关闭面板' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
