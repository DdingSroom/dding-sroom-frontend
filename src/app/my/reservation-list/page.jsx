'use client';

import React from 'react';

import BasicModal from '@components/common/basic-modal';
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

      <BasicModal
        isOpen={requireLogin}
        onClose={redirectToLogin}
        closeOnOverlayClick={false}
        className="max-w-modal-sm"
        title="로그인이 필요한 기능입니다"
        message="이 페이지를 이용하려면 로그인이 필요합니다."
        actions={[{ text: '확인', onClick: redirectToLogin }]}
      />

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}
