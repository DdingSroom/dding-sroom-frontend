'use client';

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import dynamic from 'next/dynamic';
import useTokenStore from '../stores/useTokenStore';

import Header from '@components/common/Header';
import Banner from '@components/common/Banner';
import SecondBanner from '@components/common/SecondBanner';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';

const AfterLoginBanner = dynamic(
  () => import('@components/common/AfterLoginBanner'),
  {
    ssr: false,
    loading: () => null,
  },
);

const ReservationSection = dynamic(
  () => import('@components/common/ReservationSection'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-[95%] min-h-[240px] rounded-2xl bg-white shadow-sm border border-gray-50" />
    ),
  },
);

const FooterNav = dynamic(() => import('@components/common/FooterNav'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const { accessToken, setUserId } = useTokenStore();

  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    try {
      const decoded = jwtDecode(accessToken);
      const { id } = decoded;

      setUserId(id);
    } catch (e) {
      console.error('토큰 디코딩 실패:', e);
    }
  }, [accessToken, setUserId]);

  return (
    <>
      <div className="w-full">
        <Header />
      </div>

      <div className="flex justify-center w-full">
        {!clientReady ? (
          <Banner className="w-full" />
        ) : accessToken ? (
          <AfterLoginBanner className="w-full" />
        ) : (
          <Banner className="w-full" />
        )}
      </div>

      <div className="flex justify-center w-full">
        <SecondBanner className="w-full" />
      </div>

      <div className="flex justify-center w-full flex-grow">
        <ReservationSection className="w-full" />
      </div>

      <FooterNav />

      <div className="pb-20">
        <PrivacyPolicyFooter />
      </div>
    </>
  );
}
