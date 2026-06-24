'use client';

import Modal from './Modal';

const AlertModal = ({
  isOpen,
  onClose,
  title = '알림',
  message,
  children,
  confirmText = '확인',
  closeOnOverlayClick = true,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    className="max-w-modal-sm"
    closeOnOverlayClick={closeOnOverlayClick}
  >
    <div className="overflow-y-auto max-h-modal">
      {children ?? (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-content mb-4">{title}</h3>
          {message && (
            <p className="text-sm text-content-secondary">{message}</p>
          )}
        </div>
      )}
    </div>

    <div className="border-t border-gray-100">
      <button
        onClick={onClose}
        className="w-full py-4 bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors"
      >
        {confirmText}
      </button>
    </div>
  </Modal>
);

export default AlertModal;
