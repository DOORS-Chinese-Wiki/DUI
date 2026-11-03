import clsx from 'clsx';
import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Switch.module.css';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  checked?: boolean;
  defaultChecked?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md';
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      label,
      description,
      size = 'md',
      disabled = false,
      id,
      className,
      onChange,
      onCheckedChange,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const isChecked = checked ?? uncontrolledChecked;

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      if (checked === undefined) {
        setUncontrolledChecked(event.target.checked);
      }
      onChange?.(event);
      onCheckedChange?.(event.target.checked);
    }

    return (
      <label
        htmlFor={inputId}
        className={clsx(styles.field, size === 'sm' && styles.small, className)}
        data-disabled={disabled}
      >
        {label || description ? (
          <span className={styles.labelGroup}>
            {label ? <span className={styles.label}>{label}</span> : null}
            {description ? (
              <span className={styles.description}>{description}</span>
            ) : null}
          </span>
        ) : null}
        <span className={styles.control}>
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type="checkbox"
            role="switch"
            className={styles.input}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
          />
          <span className={styles.track} aria-hidden="true">
            <span className={styles.thumb} />
          </span>
        </span>
      </label>
    );
  },
);

Switch.displayName = 'Switch';
