'use client';

import React, { useEffect, useState } from 'react';
import useTokenStore from '../../../stores/useTokenStore';
import MyPageHeader from '@components/common/MyPageHeader';
import ReservationList from '@components/common/ReservationList';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        <MyPageHeader />
        {!showLoginModal && <ReservationList />}
      </main>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onConfirm={handleLoginConfirm}
      />

      <PrivacyPolicyFooter />
    </div>
  );
}
