'use client';
import axios from 'axios';
import CustomizedStepper from './customizedStepper';
import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Link from 'next/link';
import useSignupStore from '../../../stores/useSignupStore';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../libs/api/instance.js';

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSignupSave, setIsSignupSave] = useState(false);

  const { signupData, setSignupField, resetSignupData } = useSignupStore();

  const handleSignup = async () => {
    try {
      setSignupField('username', name); // 사용자 이름

      const res = await axiosInstance.post('/user/sign-up', signupData);
      console.log('회원가입 성공:', res.data);

      resetSignupData();
      router.push('/login/sign-up-step4');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  // const handleSignupSave = () => {
  //   setIsSignupSave(!isSignupSave);
  // };

  const isSignupAvailable = () => {
    return name;
  };

  // const handleSignup = () => {
  //   console.log('회원가입 버튼 클릭:', name);
  // };

  return (
    <div className="flex flex-col h-full pt-12 px-4">
      <div className="flex flex-col w-full mb-8 gap-1">
        <h2 className="text-center text-[20px]">회원가입</h2>
        <div className="text-[#333333] text-center text-[14px] font-normal">
          <p>정보 입력</p>
        </div>
      </div>

      <CustomizedStepper />

      <div className="flex-grow w-full mt-20 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label>이름</label>
          <StyledNumberInput
            className="h-10 text-sm"
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="USER 01"
          />
        </div>
      </div>

      <div className="w-full mb-10">
        <Link href="/login/sign-up-step4">
          <Button
            style={{ width: '100%' }}
            onClick={handleSignup}
            disabled={!isSignupAvailable()}
            text="회원가입"
          />
        </Link>
      </div>
    </div>
  );
}

const StyledInput = ({ value, ...props }) => {
  return (
    <input
      className="px-4 py-4 bg-white rounded-md border border-[#9999a2]"
      value={value}
      {...props}
    />
  );
};

const StyledNumberInput = ({ value, ...props }) => {
  return (
    <div className="flex w-full relative">
      <StyledInput {...props} style={{ width: '100%' }} value={value} />
    </div>
  );
};
