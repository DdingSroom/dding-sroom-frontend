'use client';

import BasicModal from './BasicModal';

const LoginRequiredModal = ({ isOpen, onConfirm }) => (
  <BasicModal
    isOpen={isOpen}
    onClose={onConfirm}
    closeOnOverlayClick={false}
    className="max-w-modal-sm"
    title="로그인이 필요한 기능입니다"
    message="이 페이지를 이용하려면 로그인이 필요합니다."
    actions={[{ text: '확인', onClick: onConfirm }]}
  />
);

export default LoginRequiredModal;
