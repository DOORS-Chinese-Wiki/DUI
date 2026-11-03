import clsx from 'clsx';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Panel } from '../Panel';
import styles from './Dialog.module.css';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  closeOnBackdrop?: boolean;
  className?: string;
  /** Mount within an embedded theme scope; native modal dialogs still enter the top layer. */
  portalContainer?: HTMLElement;
}

export function Dialog({ open, onOpenChange, title, description, children, footer,
  closeLabel = '关闭弹窗', closeOnBackdrop = true, className, portalContainer }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const uid = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [open]);
  if (typeof document === 'undefined') return null;
  return createPortal(<dialog ref={ref} aria-modal="true" aria-labelledby={uid + '-title'}
    aria-describedby={description ? uid + '-description' : undefined}
    className={clsx(styles.dialog, className)} onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'))
        .filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (!first) { event.preventDefault(); event.currentTarget.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }} onCancel={event => {
      event.preventDefault(); onOpenChange(false);
    }} onClick={event => {
      if (!closeOnBackdrop || event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onOpenChange(false);
    }}>
    <Panel title={title} titleId={uid + '-title'} headingLevel={2} description={description}
      descriptionId={uid + '-description'} onClose={() => onOpenChange(false)} closeLabel={closeLabel} footer={footer}>
      {children}
    </Panel>
  </dialog>, portalContainer ?? document.body);
}
