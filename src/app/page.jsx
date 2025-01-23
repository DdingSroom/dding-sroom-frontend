'use client';

import React from 'react';
import Header from '@components/common/Header';
import Banner from '@components/common/Banner';
import SecondBanner from '@components/common/SecondBanner';
import ReservationSection from '@components/common/ReservationSection';
import FooterNav from '@components/common/FooterNav';

export default function Home() {
  return (
    <>
      <div className="w-full">
        <Header />
      </div>
      <div className="flex justify-center w-full">
        <Banner className="w-full" />
      </div>
      <div className="flex justify-center w-full">
        <SecondBanner className="w-full" />
      </div>
      <div className="flex justify-center w-full flex-grow">
        <ReservationSection className="w-full" />
      </div>
      <div className="mt-[1px] w-full sticky bottom-0 bg-white fixed bottom-0 left-0 right-0 ">
        <FooterNav />
      </div>
    </>
  );
}
