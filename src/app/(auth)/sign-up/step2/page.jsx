'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@components/common/Button';
import FooterNav from '@components/common/FooterNav';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';

import { isValidPassword } from '@constants/regex';
import useSignupStore from '@stores/useSignupStore';

import CustomizedStepper from './customizedStepper';
import { Input } from '@components/common/Input';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

export default function SignUpStep2() {
  const router = useRouter();
  const [newPassword, setnewPassword] = useState('');
  const [newPassword_2, setnewPassword_2] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const { setSignupField } = useSignupStore();

  const isNextAvailable = () =>
    isValidPassword(newPassword) && newPassword === newPassword_2;

  const handleNextStep = () => {
    setSignupField('password', newPassword);
    router.push('/sign-up/step3');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 px-6 py-8">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-content">회원가입</h1>
          <p className="text-content-secondary text-sm">비밀번호 입력</p>
        </div>

        <div className="mb-8">
          <CustomizedStepper />
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-content">
                비밀번호
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(value) => {
                  setnewPassword(value);
                  if (!isValidPassword(value)) {
                    setPasswordError(
                      '비밀번호는 8자 이상, 영문과 숫자, 특수문자를 포함해야합니다.',
                    );
                  } else {
                    setPasswordError('');
                  }
                  if (newPassword_2 && value !== newPassword_2) {
                    setConfirmError('비밀번호가 일치하지 않습니다.');
                  } else {
                    setConfirmError('');
                  }
                }}
                placeholder="비밀번호를 입력해주세요."
              >
                <Input.VisibleButton />
              </Input>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1.5">{passwordError}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-content">
                비밀번호 확인
              </label>
              <Input
                id="newPassword_2"
                type="password"
                value={newPassword_2}
                onChange={(value) => {
                  setnewPassword_2(value);
                  if (value !== newPassword) {
                    setConfirmError('비밀번호가 일치하지 않습니다.');
                  } else {
                    setConfirmError('');
                  }
                }}
                placeholder="비밀번호를 입력해주세요."
              >
                <Input.Check
                  validation={() =>
                    newPassword &&
                    newPassword_2 &&
                    newPassword === newPassword_2
                  }
                />
                <Input.VisibleButton />
              </Input>
              {confirmError && (
                <p className="text-red-500 text-xs mt-1.5">{confirmError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full mt-8">
          <Button
            onClick={handleNextStep}
            disabled={!isNextAvailable()}
            text="확인"
          />
        </div>
      </main>

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}
