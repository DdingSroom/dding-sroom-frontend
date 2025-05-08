'use client';

import React from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import MyPageDate from '@components/common/MyPageDate';
import ReservationHistory from '@components/common/ReservationHistory';

export default function Mypage() {
  return (
    <>
      <div className="w-full">
        <MyPageHeader />
        <MyPageDate />
        <ReservationHistory />
      </div>
    </>
  );
}
