'use client';
import CustomizedStepper from './customizedStepper';
import React, { Suspense } from 'react';
import Button from '../../../components/common/Button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SignUpStep4() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || 'USER 01';

  const handleSignup = () => {
    console.log('확인 버튼 클릭:', '회원가입 성공');
  };

  return (
    <div className="flex flex-col items-center h-full pt-12 px-4">
      <div className="flex flex-col w-full mb-8 gap-1">
        <h2 className="text-center text-[20px]">회원가입</h2>
        <div className="text-[#333333] text-center text-[14px] font-normal">
          <p>정보 입력</p>
        </div>
      </div>

      <CustomizedStepper />

      <div className="flex flex-col items-center w-full mt-20">
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
          <div className="w-full mt-8">
            <Link href="/login">
              <Button
                style={{ width: '100%' }}
                onClick={handleSignup}
                text="확인"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpStep4 />
    </Suspense>
  );
}
