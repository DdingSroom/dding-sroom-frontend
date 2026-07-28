'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export type ModalActionVariant = 'default' | 'danger' | 'ghost';

const BUTTON_VARIANT_CLASSES: Record<ModalActionVariant, string> = {
  default: 'bg-brand hover:bg-brand-hover text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'bg-white hover:bg-gray-50 text-content-secondary',
};

export interface ModalAction {
  text: string;
  onClick: () => void;
  variant?: ModalActionVariant;
  disabled?: boolean;
}

interface BasicModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  message?: string;
  children?: ReactNode;
  actions?: ModalAction[];
  closeOnOverlayClick?: boolean;
  className?: string;
}

const BasicModal = ({
  isOpen,
  onClose,
  title,
  message,
  children,
  actions,
  closeOnOverlayClick = true,
  className = '',
}: BasicModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') {
        return;
      }

      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-modal"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={`bg-white rounded-2xl w-modal mx-4 shadow-2xl border border-gray-100 overflow-hidden outline-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-modal">
          {children ?? (
            <div className="p-6 text-center">
              {title && (
                <h3 className="text-lg font-semibold text-content mb-4">
                  {title}
                </h3>
              )}
              {message && (
                <p className="text-sm text-content-secondary">{message}</p>
              )}
            </div>
          )}
        </div>
        {actions && actions.length > 0 && (
          <div className="flex border-t border-gray-100">
            {actions.map((action) => (
              <button
                key={action.text}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`flex-1 py-4 text-sm font-medium transition-colors disabled:opacity-60 ${
                  BUTTON_VARIANT_CLASSES[action.variant ?? 'default']
                }`}
              >
                {action.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default BasicModal;
