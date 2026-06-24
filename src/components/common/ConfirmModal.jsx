'use client';

import Modal from './Modal';

const CONFIRM_VARIANT_CLASSES = {
  default: 'bg-brand hover:bg-brand-hover',
  danger: 'bg-red-500 hover:bg-red-600',
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmText = '확인',
  cancelText = '취소',
  confirmDisabled = false,
  variant = 'default',
}) => (
  <Modal isOpen={isOpen} onClose={onClose} className="max-w-modal">
    <div className="overflow-y-auto max-h-modal">
      {children ?? (
        <div className="p-6 text-center">
          {title && (
            <h3 className="text-lg font-semibold text-content mb-4">{title}</h3>
          )}
          {message && (
            <p className="text-sm text-content-secondary">{message}</p>
          )}
        </div>
      )}
    </div>

    <div className="flex border-t border-gray-100">
      <button
        onClick={onClose}
        className="flex-1 py-4 bg-white text-content-secondary text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!confirmDisabled) {
            onConfirm?.();
          }
        }}
        disabled={confirmDisabled}
        className={`flex-1 py-4 text-white text-sm font-medium transition-colors disabled:opacity-60 ${CONFIRM_VARIANT_CLASSES[variant]}`}
      >
        {confirmText}
      </button>
    </div>
  </Modal>
);

export default ConfirmModal;
