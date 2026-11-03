import clsx from 'clsx';
import {
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Slider.module.css';

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange'
  > {
  label?: ReactNode;
  description?: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
}

const DOTS = 10;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      description,
      value,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      id,
      className,
      onValueChange,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const controlRef = useRef<HTMLSpanElement>(null);
    const [firstDotProgress, setFirstDotProgress] = useState(100 / DOTS);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const currentValue = value ?? uncontrolledValue;
    const minimum = Number(min);
    const maximum = Number(max);
    const progress =
      maximum === minimum
        ? 0
        : Math.min(
            100,
            Math.max(0, ((currentValue - minimum) / (maximum - minimum)) * 100),
          );
    const filledDots = Math.round((progress / 100) * DOTS);
    const trackRadius = 4 + Math.min(progress / firstDotProgress, 1) * 8;

    useLayoutEffect(() => {
      const control = controlRef.current;
      const firstDot = control?.querySelector<HTMLElement>(`.${styles.dot}`);
      if (!control || !firstDot) return;

      function updateFirstDotProgress() {
        const trackBounds = control!.getBoundingClientRect();
        const dotBounds = firstDot!.getBoundingClientRect();
        if (trackBounds.width <= 0 || dotBounds.width <= 0) return;
        const dotCenter = dotBounds.left + dotBounds.width / 2 - trackBounds.left;
        setFirstDotProgress((dotCenter / trackBounds.width) * 100);
      }

      updateFirstDotProgress();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(updateFirstDotProgress);
      observer.observe(control);
      observer.observe(firstDot);
      return () => observer.disconnect();
    }, []);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const nextValue = Number(event.target.value);
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    }

    return (
      <label
        htmlFor={inputId}
        className={clsx(styles.field, className)}
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
        <span
          ref={controlRef}
          className={styles.control}
          style={
            {
              '--slider-progress': `${progress}%`,
              '--slider-track-radius': `${trackRadius}px`,
            } as CSSProperties
          }
        >
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            disabled={disabled}
            className={styles.input}
            onChange={handleChange}
          />
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.fill} />
            <span className={styles.dots}>
              {Array.from({ length: DOTS }, (_, index) => (
                <span
                  className={clsx(
                    styles.dot,
                    index < filledDots && styles.dotFilled,
                  )}
                  key={index}
                />
              ))}
            </span>
            <span className={styles.thumb} />
          </span>
        </span>
      </label>
    );
  },
);

Slider.displayName = 'Slider';
