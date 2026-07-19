'use client';

import React from 'react';

import LoginRequiredModal from '@components/common/LoginRequiredModal';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import MyPageHeader from '@components/my/MyPageHeader';
import ReservationList from '@components/reservation/ReservationList';

import useRequireAuth from '@hooks/useRequireAuth';

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
  const { isAuthenticated, requireLogin, redirectToLogin } = useRequireAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        <MyPageHeader />
        {!requireLogin && (
          <ReservationList
            /* key로 리마운트 보조 */ key={isAuthenticated ? 'auth' : 'guest'}
          />
        )}
      </main>

      <LoginRequiredModal isOpen={requireLogin} onConfirm={redirectToLogin} />

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}
