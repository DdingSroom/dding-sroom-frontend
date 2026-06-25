'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const BUTTON_VARIANT_CLASSES = {
  default: 'bg-brand hover:bg-brand-hover text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'bg-white hover:bg-gray-50 text-content-secondary',
};

const Modal = ({
  isOpen,
  onClose,
  children,
  className = '',
  closeOnOverlayClick = true,
}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
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
        {children}
      </div>
    </div>,
    document.body,
  );
};

Modal.Body = function ModalBody({ children }) {
  return <div className="overflow-y-auto max-h-modal">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return <div className="flex border-t border-gray-100">{children}</div>;
};

Modal.Button = function ModalButton({
  children,
  onClick,
  variant = 'default',
  disabled = false,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-4 text-sm font-medium transition-colors disabled:opacity-60 ${BUTTON_VARIANT_CLASSES[variant]}`}
    >
      {children}
    </button>
  );
};

export default Modal;
