'use client';
import axios from 'axios';
import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import PrivacyPolicyFooter from '../../../components/common/PrivacyPolicyFooter';
import CustomizedStepper from './customizedStepper';
import useSignupStore from '../../../stores/useSignupStore';
import { useRouter } from 'next/navigation';

export default function SignUpStep3() {
  const router = useRouter();
  const [name, setName] = useState('');

  const { signupData, resetSignupData } = useSignupStore();

  const handleSignup = async () => {
    try {
      const dataToSend = {
        ...signupData,
        username: name,
      };

      const res = await axios.post(
        'https://ddingsroomserver.click:8443/user/sign-up',
        dataToSend,
        {
          headers: {
            Authorization: undefined,
          },
        },
      );

      console.log('회원가입 성공:', res.data);
      resetSignupData();
      router.push(`/login/sign-up-step4?username=${encodeURIComponent(name)}`);
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(
        error?.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
      );
    }
  };

  const isSignupAvailable = () => {
    return Boolean(name && name.trim().length > 0);
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
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#37352f]"
            >
              이름
            </label>
            <StyledTextInput
              id="name"
              type="text"
              placeholder="USER 01"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-full pt-2">
            <Button
              onClick={handleSignup}
              disabled={!isSignupAvailable()}
              text="회원가입"
            />
          </div>
        </div>
      </main>

      <PrivacyPolicyFooter />
    </div>
  );
}

const StyledTextInput = ({ value, className = '', ...props }) => {
  const base =
    'w-full px-4 py-3 bg-white rounded-lg border border-[#e9e9e7] text-sm ' +
    'placeholder:text-[#9b9998] focus:outline-none focus:border-[#788cff] ' +
    'focus:ring-2 focus:ring-[#788cff]/10 transition-all duration-200';
  return <input className={`${base} ${className}`} value={value} {...props} />;
};
