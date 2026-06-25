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
    <Modal.Body>
      {children ?? (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-content mb-4">{title}</h3>
          {message && (
            <p className="text-sm text-content-secondary">{message}</p>
          )}
        </div>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Modal.Button onClick={onClose}>{confirmText}</Modal.Button>
    </Modal.Footer>
  </Modal>
);

export default AlertModal;
