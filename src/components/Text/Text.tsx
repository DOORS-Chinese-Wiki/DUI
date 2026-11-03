import clsx from 'clsx';
import {
  createElement,
  forwardRef,
  type ElementType,
  type HTMLAttributes,
} from 'react';
import styles from './Text.module.css';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'label'
  | 'body'
  | 'small'
  | 'caption'
  | 'code';
export type TextTone =
  | 'inherit'
  | 'default'
  | 'cream'
  | 'muted'
  | 'quiet'
  | 'accent'
  | 'danger';
export type TextAlign = 'start' | 'center' | 'end';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TextVariant;
  tone?: TextTone;
  align?: TextAlign;
  truncate?: boolean;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as = 'span',
      variant = 'body',
      tone = 'default',
      align = 'start',
      truncate = false,
      className,
      ...rest
    },
    ref,
  ) =>
    createElement(as, {
      ref,
      className: clsx(
        styles.text,
        styles[variant],
        styles[tone],
        styles[align],
        truncate && styles.truncate,
        className,
      ),
      ...rest,
    }),
);

Text.displayName = 'Text';
