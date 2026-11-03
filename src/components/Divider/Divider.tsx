import clsx from 'clsx';
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Divider.module.css';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'subtle' | 'accent';
  label?: ReactNode;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      tone = 'subtle',
      label,
      className,
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={clsx(
        styles.divider,
        styles[orientation],
        styles[tone],
        className,
      )}
      {...rest}
    >
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  ),
);

Divider.displayName = 'Divider';
