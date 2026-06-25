'use client';

import Modal from './Modal';

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
    <Modal.Body>
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
    </Modal.Body>
    <Modal.Footer>
      <Modal.Button variant="ghost" onClick={onClose}>
        {cancelText}
      </Modal.Button>
      <Modal.Button
        variant={variant}
        onClick={onConfirm}
        disabled={confirmDisabled}
      >
        {confirmText}
      </Modal.Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmModal;
