'use client';

import ConfirmModal from '@components/common/ConfirmModal';

const CancellationModal = ({ isOpen, onClose, onConfirm, children }) => (
  <ConfirmModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    cancelText="돌아가기"
    confirmText="예약 취소"
  >
    <div className="p-6 sm:p-8">{children}</div>
  </ConfirmModal>
);

export default CancellationModal;
