import clsx from 'clsx';
import {
  createElement,
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from 'react';
import styles from './Space.module.css';

export type SpaceSize =
  | 'none'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl';

export interface SpaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  direction?: 'horizontal' | 'vertical';
  size?: SpaceSize;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
}

export const Space = forwardRef<HTMLElement, SpaceProps>(
  (
    {
      as = 'div',
      direction = 'horizontal',
      size = 'md',
      align,
      justify,
      wrap = false,
      className,
      style,
      ...rest
    },
    ref,
  ) =>
    createElement(as, {
      ref,
      className: clsx(
        styles.space,
        styles[direction],
        wrap && styles.wrap,
        className,
      ),
      style: {
        ...style,
        '--space-gap': `var(--doors-space-${size})`,
        '--space-align': align,
        '--space-justify': justify,
      } as CSSProperties,
      ...rest,
    }),
);

Space.displayName = 'Space';
