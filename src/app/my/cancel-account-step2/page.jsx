'use client';
import React from 'react';
import Link from 'next/link';
import Button from '../../../components/common/Button';
import PrivacyPolicyFooter from '../../../components/common/PrivacyPolicyFooter';

export default function CancelAccountStep2() {
  const handleCancelAccount = () => {
    console.log('회원 탈퇴 완료:', '회원 탈퇴 완료');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="flex flex-col items-center gap-4 mt-20">
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

          <Link href="/">
            <Button onClick={handleCancelAccount} text="확인" />
          </Link>
        </div>
      </main>

      <PrivacyPolicyFooter />
    </div>
  );
}
