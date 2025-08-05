'use client';

import React from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import ReservationList from '@components/common/ReservationList';

export default function ReservationInfo() {
  return (
    <div className="w-full">
      <MyPageHeader />
      <ReservationList />
    </div>
  );
}
