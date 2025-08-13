'use client';

import React, { useEffect, useState } from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import ReservationList from '@components/common/ReservationList';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import useTokenStore from '../../../stores/useTokenStore';

export default function ReservationInfo() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { accessToken } = useTokenStore();

  useEffect(() => {
    if (!accessToken) {
      setShowLoginModal(true);
    }
  }, [accessToken]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  return (
    <div className="w-full">
      <MyPageHeader />
      {!showLoginModal && <ReservationList />}

      <LoginRequiredModal
        isOpen={showLoginModal}
        onConfirm={handleLoginConfirm}
      />
    </div>
  );
}
