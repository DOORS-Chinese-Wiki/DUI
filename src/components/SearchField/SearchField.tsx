import clsx from 'clsx';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../Icon';
import { Kbd } from '../Kbd';
import { Space } from '../Space';
import styles from './SearchField.module.css';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: 'sm' | 'md';
  shortcut?: ReactNode;
  inputClassName?: string;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ size = 'md', shortcut = '/', className, inputClassName, disabled,
    'aria-label': label = '搜索', ...rest }, ref) => (
    <Space as="label" size="md" align="center" className={clsx(styles.field, styles[size], className)}
      data-disabled={disabled || undefined}>
      <Icon name="search" size={20} className={styles.icon} />
      <input ref={ref} type="search" className={clsx(styles.input, inputClassName)}
        disabled={disabled} aria-label={label} {...rest} />
      {shortcut ? <Kbd size={size} aria-hidden="true">{shortcut}</Kbd> : null}
    </Space>
  ),
);

SearchField.displayName = 'SearchField';
