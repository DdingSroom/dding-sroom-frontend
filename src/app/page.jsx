'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import Banner from '@components/common/Banner';
import FooterNav from '@components/common/FooterNav';
import Header from '@components/common/Header';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import SecondBanner from '@components/common/SecondBanner';
import ReservationSection from '@components/reservation/ReservationSection';

import useTokenStore from '../stores/useTokenStore';

const AfterLoginBanner = dynamic(
  () => import('@components/common/AfterLoginBanner'),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function Home() {
  const { accessToken, rehydrate } = useTokenStore();

  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    rehydrate();
  }, [rehydrate]);

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
