'use client';

import React from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import MyPageBlock from '@components/common/MyPageBlock';

export default function Mypage() {
  return (
    <>
      <div className="w-full">
        <MyPageHeader />
        <div className="flex-col items-center justify-center text-center p-6 bg-[#FFFF] mt-6">
          <p className="text-xl">USER 01</p>
          <p>MJUstudy@mju.ac.kr</p>
        </div>
        <div className="mt-6 p-2 pl-6">내 정보</div>
        <MyPageBlock name="계정 정보" />
        <div className="mt-6 p-2 pl-6">예약</div>
        <MyPageBlock name="예약 내역" />
        <div className="mt-6 p-2 pl-6">앱 정보</div>
        <MyPageBlock name="공지사항" />
      </div>
    </>
  );
}
