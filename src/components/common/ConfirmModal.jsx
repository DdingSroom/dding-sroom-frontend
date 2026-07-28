'use client';

import BasicModal from './BasicModal';

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
  <BasicModal
    isOpen={isOpen}
    onClose={onClose}
    className="max-w-modal"
    title={title}
    message={message}
    actions={[
      { text: cancelText, onClick: onClose, variant: 'ghost' },
      {
        text: confirmText,
        onClick: onConfirm,
        variant,
        disabled: confirmDisabled,
      },
    ]}
  >
    {children}
  </BasicModal>
);

export default ConfirmModal;
