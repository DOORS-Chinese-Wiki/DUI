import clsx from 'clsx';
import {
  createElement,
  forwardRef,
  type ElementType,
  type HTMLAttributes,
} from 'react';
import styles from './Layout.module.css';

export type LayoutWidth = 'prose' | 'content' | 'wide' | 'full';
export type LayoutPadding = 'none' | 'compact' | 'default' | 'spacious';

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  maxWidth?: LayoutWidth;
  padding?: LayoutPadding;
}

export const Layout = forwardRef<HTMLElement, LayoutProps>(
  (
    {
      as = 'div',
      maxWidth = 'content',
      padding = 'default',
      className,
      ...rest
    },
    ref,
  ) =>
    createElement(as, {
      ref,
      className: clsx(
        styles.layout,
        styles[maxWidth],
        styles[padding],
        className,
      ),
      ...rest,
    }),
);

Layout.displayName = 'Layout';
