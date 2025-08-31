'use client';

import React, { useEffect, useState } from 'react';
import useTokenStore from '../../../stores/useTokenStore';
import MyPageHeader from '@components/common/MyPageHeader';
import ReservationList from '@components/common/ReservationList';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import FooterNav from '../../../components/common/FooterNav';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

export default function ReservationInfo() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { accessToken, rehydrate } = useTokenStore();

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

  // 토큰 유무에 따라 모달을 양방향으로 토글
  useEffect(() => {
    setShowLoginModal(!accessToken);
  }, [accessToken]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        <MyPageHeader />
        {!showLoginModal && (
          <ReservationList
            /* key로 리마운트 보조 */ key={accessToken || 'guest'}
          />
        )}
      </main>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onConfirm={handleLoginConfirm}
      />

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}
