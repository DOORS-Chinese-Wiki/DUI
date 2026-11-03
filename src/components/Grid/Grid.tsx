import clsx from 'clsx';
import {
  createElement,
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from 'react';
import type { SpaceSize } from '../Space/Space';
import styles from './Grid.module.css';

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  columns?: number;
  minItemWidth?: number | string;
  gap?: SpaceSize;
  responsive?: boolean;
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  (
    {
      as = 'div',
      columns,
      minItemWidth = 208,
      gap = 'md',
      responsive = true,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const minimum =
      typeof minItemWidth === 'number'
        ? `${minItemWidth}px`
        : minItemWidth;

    return createElement(as, {
      ref,
      className: clsx(styles.grid, responsive && styles.responsive, className),
      style: {
        ...style,
        '--grid-gap': `var(--doors-space-${gap})`,
        '--grid-min': minimum,
        '--grid-template': columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : undefined,
      } as CSSProperties,
      ...rest,
    });
  },
);

Grid.displayName = 'Grid';
