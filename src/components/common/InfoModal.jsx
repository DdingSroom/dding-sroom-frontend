'use client';

import AlertModal from './AlertModal';

const InfoModal = ({ isOpen, onClose }) => (
  <AlertModal
    isOpen={isOpen}
    onClose={onClose}
    title="알림"
    message="시범 운영 단계에서 지원되지 않는 기능입니다"
  />
);

export default InfoModal;
