'use client';

import BasicModal from './BasicModal';

const AlertModal = ({
  isOpen,
  onClose,
  title = '알림',
  message,
  children,
  confirmText = '확인',
  closeOnOverlayClick = true,
}) => (
  <BasicModal
    isOpen={isOpen}
    onClose={onClose}
    className="max-w-modal-sm"
    closeOnOverlayClick={closeOnOverlayClick}
    title={title}
    message={message}
    actions={[{ text: confirmText, onClick: onClose }]}
  >
    {children}
  </BasicModal>
);

export default AlertModal;
