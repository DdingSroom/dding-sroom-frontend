'use client';
import React from 'react';
import Button from '../../../components/common/Button';
import Link from 'next/link';

export default function CancelAccountStep2() {
  const handleCancelAccount = () => {
    console.log('회원 탈퇴 완료:', '회원 탈퇴 완료');
  };

  return (
    <div className="flex flex-col items-center h-full pt-12 px-4">
      <div className="flex flex-col items-center w-full mt-20 flex-grow">
        <div className="flex flex-col items-center gap-4">
          <img src="/static/icons/maru_sad_icon.svg" alt="maru" />
          <div className="text-[#788DFF] text-[25px] font-bold">
            안녕히가세요
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="text-[14px]">회원 탈퇴가 완료되었습니다.</div>
            <div className="text-[14px]">
              확인을 누르시면 비회원용 홈으로 돌아갑니다.
            </div>
            <div className="text-[14px] mt-4">다시 만날 날을 기다릴게요!</div>
          </div>
        </div>
      </div>
      <div className="w-full mt-auto mb-10">
        <Link href="/">
          <Button
            style={{ width: '100%' }}
            onClick={handleCancelAccount}
            text="확인"
          />
        </Link>
      </div>
    </div>
  );
}
