'use client';

import AlertModal from './AlertModal';

const LoginRequiredModal = ({ isOpen, onConfirm }) => (
  <AlertModal
    isOpen={isOpen}
    onClose={onConfirm}
    closeOnOverlayClick={false}
    title="로그인이 필요한 기능입니다"
    message="이 페이지를 이용하려면 로그인이 필요합니다."
  />
);

export default LoginRequiredModal;
