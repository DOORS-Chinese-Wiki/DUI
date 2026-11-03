import clsx from 'clsx';
import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Kbd.module.css';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md';
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ size = 'md', className, ...rest }, ref) => (
    <kbd ref={ref} className={clsx(styles.key, styles[size], className)} {...rest} />
  ),
);

Kbd.displayName = 'Kbd';
