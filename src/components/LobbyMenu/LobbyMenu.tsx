import clsx from 'clsx';
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { doorsIconAssets, type DoorsIconName } from '../Icon/assets';
import { Space } from '../Space';
import gameStyles from '../Button/GameButton.module.css';
import styles from './LobbyMenu.module.css';

export type LobbyIconName = DoorsIconName | 'codes';
export type LobbyMenuAction = LobbyIconName | 'store';

export const lobbyMenuIcons = ['items', 'gallery', 'achievements', 'settings', 'player', 'codes'] as const;

function CartGlyph() {
  return <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M3 8h14l3 7h40l-7 28H25l1 5h28v6H24l-9-39H3z" fill="currentColor" />
    <circle cx="27" cy="55" r="5" fill="currentColor" />
    <circle cx="51" cy="55" r="5" fill="currentColor" />
  </svg>;
}

function CodesGlyph() {
  return <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M3 17h58v33H3z" fill="currentColor" />
    <g fill="none" stroke="var(--lobby-code-cutout, var(--doors-color-ink))" strokeWidth="3.5" strokeLinecap="square">
      {[17, 32, 47].map(x => <path key={x} d={`M${x} 27v13m-5.6-9.75 11.2 6.5m-11.2 0 11.2-6.5`} />)}
    </g>
  </svg>;
}

export interface LobbyIconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LobbyIconName;
}

export const LobbyIconButton = forwardRef<HTMLButtonElement, LobbyIconButtonProps>(
  ({ icon, className, 'aria-label': label, ...rest }, ref) => (
    <Button {...rest} ref={ref} variant="plain" iconOnly
      aria-label={label ?? (icon === 'codes' ? '兑换码' : doorsIconAssets[icon].label)}
      className={clsx(gameStyles.button, styles.iconButton, className)}>
      {icon === 'codes' ? <CodesGlyph /> : <Icon name={icon} size={64} />}
    </Button>
  ),
);

LobbyIconButton.displayName = 'LobbyIconButton';

export interface LobbyMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  showStore?: boolean;
  items?: readonly LobbyIconName[];
  onAction?: (action: LobbyMenuAction) => void;
}

export const LobbyMenu = forwardRef<HTMLDivElement, LobbyMenuProps>(
  ({ showStore = true, items = lobbyMenuIcons, onAction, className,
    'aria-label': label = '大厅菜单', ...rest }, ref) => (
    <Space {...rest} ref={ref} size="xxs" align="end" justify="center" role="group"
      aria-label={label} className={clsx(styles.menu, className)}>
      {showStore ? <Button variant="secondary" className={clsx(gameStyles.button, styles.storeButton)}
        leadingIcon={<CartGlyph />} onClick={() => onAction?.('store')}>商店</Button> : null}
      <Space size="xxs" align="end" className={styles.iconRow}>
        {items.map(icon => <LobbyIconButton key={icon} icon={icon} onClick={() => onAction?.(icon)} />)}
      </Space>
    </Space>
  ),
);

LobbyMenu.displayName = 'LobbyMenu';
