'use client';
import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Link from 'next/link';

export default function ResetPassWord1() {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [isLoginSave, setIsLoginSave] = useState(false);

  const handleLoginSave = () => {
    setIsLoginSave(!isLoginSave);
  };

  const isLoginAvailable = () => {
    return email && number;
  };

  const handleLogin = () => {
    console.log('다음 버튼 클릭:', email, number);
  };

  return (
    <div className="flex flex-col h-screen pt-12 px-4">
      <div className="flex flex-col w-full mb-8 gap-1">
        <h2 className="text-center text-[20px]">비밀번호 재설정</h2>
        <div className="text-[#333333] text-center text-[14px] font-normal">
          <p>등록한 이메일로 찾기</p>
        </div>
      </div>

      <div className="w-full flex flex-col justify-between h-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label>이메일</label>
            <div className="flex justify-between items-center">
              <StyledEmailInput
                className="mr-4 h-10 text-sm"
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="학교 이메일을 입력해주세요."
                setEmail={setEmail}
              />
              <button
                className="border border-[#788cff] bg-white text-[#788cff] hover:bg-[#788cff] hover:text-white px-4 py-2 rounded flex items-center justify-center whitespace-nowrap h-10"
                onClick={() => console.log('인증번호 전송 버튼 클릭됨')}
              >
                인증번호전송
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label>인증번호</label>
            <StyledNumberInput
              className="h-10 text-sm"
              type="text"
              id="number"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
              }}
              placeholder="이메일로 전송된 인증번호를 입력해주세요."
              inputMode="numeric"
            />
          </div>
        </div>
      </div>

      <div className="w-full mt-auto mb-10 ">
        <Link href="/login/reset-password-step2">
          <Button
            style={{ width: '100%' }}
            onClick={handleLogin}
            disabled={!isLoginAvailable()}
            text="다음으로"
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

const StyledEmailInput = ({ value, setEmail, ...props }) => {
  const handleRemoveEmailValue = () => {
    setEmail('');
  };

  return (
    <div className="flex w-full relative">
      <StyledInput {...props} style={{ width: '100%' }} value={value} />
      <img
        className="absolute top-[50%] right-[10px]"
        style={{ transform: 'translate(-50%, -50%)' }}
        src="/static/icons/x_icon.svg"
        alt="X"
        width={12}
        onClick={handleRemoveEmailValue}
      />
    </div>
  );
};

const StyledNumberInput = ({ value, ...props }) => {
  return (
    <div className="flex w-full relative">
      <StyledInput {...props} style={{ width: '100%' }} value={value} />
    </div>
  );
};
