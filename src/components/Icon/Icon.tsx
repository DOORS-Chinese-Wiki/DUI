import clsx from 'clsx';
import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import { doorsIconAssets, type DoorsIconName } from './assets';
import { usePreferredAsset } from '../../assets/AssetProvider';
import styles from './Icon.module.css';

export type IconTone = 'inherit' | 'cream' | 'muted' | 'accent' | 'danger';

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  name?: DoorsIconName;
  src?: string;
  file?: string;
  alt?: string;
  size?: 16 | 20 | 24 | 32 | 48 | 64;
  tone?: IconTone;
  mask?: boolean;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      src,
      file,
      alt,
      size = 24,
      tone = 'inherit',
      mask,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const asset = name ? doorsIconAssets[name] : undefined;
    const rawSource = src ?? asset?.src;
    const shouldMask = mask ?? asset?.kind === 'mask';
    const { url: source } = usePreferredAsset(rawSource, shouldMask ? 'mask' : 'image', file);
    const maskUrl = source && `url(${JSON.stringify(source)})`;
    const accessibleLabel = alt ?? (name ? undefined : asset?.label);
    const isSemantic = Boolean(accessibleLabel);

    if (!rawSource && !file) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={clsx(
          styles.icon,
          styles[tone],
          className,
        )}
        style={
          {
            ...style,
            '--icon-size': `${size}px`,
          } as CSSProperties
        }
        role={isSemantic ? 'img' : undefined}
        aria-label={accessibleLabel}
        aria-hidden={isSemantic ? undefined : true}
        {...rest}
      >
        {source && (shouldMask ? (
          <span
            className={styles.mask}
            style={{
              maskImage: maskUrl,
              WebkitMaskImage: maskUrl,
            }}
          />
        ) : (
          <img className={styles.image} src={source} alt="" />
        ))}
      </span>
    );
  },
);

Icon.displayName = 'Icon';
