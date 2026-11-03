import clsx from 'clsx';
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Space } from '../Space';
import { Text } from '../Text';
import styles from './Panel.module.css';

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  titleId?: string;
  descriptionId?: string;
  headingLevel?: 2 | 3;
}

export const Panel = forwardRef<HTMLElement, PanelProps>(({ title, description, footer,
  onClose, closeLabel = '关闭面板', titleId, descriptionId, headingLevel = 3,
  className, children, ...rest }, ref) => {
  const uid = useId();
  const headingId = titleId ?? uid + '-title';
  return <section {...rest} ref={ref} aria-labelledby={headingId} className={clsx(styles.panel, className)}>
    <Space align="center" justify="space-between" size="md" className={styles.header}>
      <Text as={headingLevel === 2 ? 'h2' : 'h3'} variant="h2" tone="cream" id={headingId} className={styles.title}>{title}</Text>
      {onClose ? <Button variant="plain" iconOnly size="sm" aria-label={closeLabel} onClick={onClose}>
        <Icon name="close" size={32} />
      </Button> : null}
    </Space>
    {description ? <Text as="p" variant="small" tone="muted" id={descriptionId} className={styles.description}>{description}</Text> : null}
    <Space direction="vertical" size="lg" className={styles.body}>{children}</Space>
    {footer ? <Space size="sm" justify="flex-end" align="center" wrap className={styles.footer}>{footer}</Space> : null}
  </section>;
});
Panel.displayName = 'Panel';

export interface PanelSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
}

export function PanelSection({ title, className, children, ...rest }: PanelSectionProps) {
  const id = useId();
  return <section {...rest} aria-labelledby={id} className={clsx(styles.section, className)}>
    <Text as="h4" variant="body" tone="cream" id={id} className={styles.band}>{title}</Text>
    <Space direction="vertical" size="md" className={styles.sectionBody}>{children}</Space>
  </section>;
}
