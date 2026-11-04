import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type ReactElement,
} from 'react';
import { useInteractionSound } from '../../sound/SoundProvider';
import styles from './Button.module.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'plain'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
  iconOnly?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leadingIcon,
      trailingIcon,
      loading = false,
      loadingLabel = 'Loading',
      fullWidth = false,
      iconOnly = false,
      asChild = false,
      className,
      children,
      disabled = false,
      type,
      onClick,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'button';
    const isUnavailable = disabled || loading;
    const [touchPressed, setTouchPressed] = useState(false);
    const { play } = useInteractionSound();
    const leadingContent = loading ? (
      <span className={styles.loading} aria-hidden="true">
        <span className={styles.spinner} />
      </span>
    ) : leadingIcon ? (
      <span className={styles.icon} aria-hidden="true">
        {leadingIcon}
      </span>
    ) : null;
    const trailingContent =
      !loading && trailingIcon ? (
        <span className={styles.icon} aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null;

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
      if (isUnavailable) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (event.detail === 0) {
        play('click');
      }

      onClick?.(event);
    }

    function handlePointerEnter(event: PointerEvent<HTMLButtonElement>) {
      if (!isUnavailable) {
        play('hover');
      }
      onPointerEnter?.(event);
    }

    function handlePointerLeave(event: PointerEvent<HTMLButtonElement>) {
      setTouchPressed(false);
      if (!isUnavailable) {
        play('leave');
      }
      onPointerLeave?.(event);
    }

    function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
      if (!isUnavailable && event.button === 0) {
        if (event.pointerType === 'touch') setTouchPressed(true);
        play('press');
      }
      onPointerDown?.(event);
    }

    function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
      setTouchPressed(false);
      onPointerUp?.(event);
    }

    function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
      setTouchPressed(false);
      onPointerCancel?.(event);
    }

    const sharedProps = {
      ref,
      type: asChild ? undefined : (type ?? 'button'),
      className: clsx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        iconOnly && styles.iconOnly,
        className,
      ),
      disabled: asChild ? undefined : isUnavailable,
      'aria-disabled': asChild && isUnavailable ? true : undefined,
      'aria-busy': loading || undefined,
      'data-touch-pressed': (touchPressed && !isUnavailable) || undefined,
      onClick: handleClick,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      ...rest,
    };

    const content = (
      <>
        {leadingContent}
        {children ? <span>{children}</span> : null}
        {trailingContent}
        {loading ? <span className="sr-only">{loadingLabel}</span> : null}
      </>
    );

    if (asChild) {
      const child = Children.only(children);
      const childContent = isValidElement<{ children?: ReactNode }>(child)
        ? child.props.children
        : null;

      return (
        <Slot {...sharedProps}>
          {cloneElement(
            child as ReactElement<{ children?: ReactNode }>,
            undefined,
            <>
              {leadingContent}
              {childContent}
              {trailingContent}
              {loading ? (
                <span className="sr-only">{loadingLabel}</span>
              ) : null}
            </>,
          )}
        </Slot>
      );
    }

    return (
      <Component {...sharedProps}>
        {content}
      </Component>
    );
  },
);

Button.displayName = 'Button';
