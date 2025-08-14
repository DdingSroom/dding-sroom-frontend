'use client';
import CustomizedStepper from './customizedStepper';
import React, { Suspense } from 'react';
import Button from '../../../components/common/Button';
import PrivacyPolicyFooter from '../../../components/common/PrivacyPolicyFooter';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SignUpStep4() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || 'USER 01';

  const handleSignup = () => {
    console.log('확인 버튼 클릭:', '회원가입 성공');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 px-6 py-8">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-[#37352f]">회원가입</h1>
          <p className="text-[#73726e] text-sm">정보 입력</p>
        </div>

        <div className="mb-8">
          <CustomizedStepper />
        </div>

        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/static/icons/check_circle_icon.svg"
              alt="check-circle"
              width={56}
              height={56}
            />
            <div className="text-[#788DFF] text-[25px] font-bold">
              회원가입 완료!
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="text-[14px]">
                {username}님의 회원가입을 축하합니다.
              </div>
              <div className="text-[14px]">띵스룸을 통해 빠르고 쾌적하게</div>
              <div className="text-[14px]">스터디룸을 이용할 수 있어요!</div>
            </div>
          </div>

          <div className="mt-4">
            <Link href="/login">
              <div className="max-w-xs mx-auto">
                <Button onClick={handleSignup} text="확인" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      <PrivacyPolicyFooter />
    </div>
  );
}

export default function SignUpStep4Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpStep4 />
    </Suspense>
  );
}
