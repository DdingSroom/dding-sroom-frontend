'use client';
import React, { useRef, useState } from 'react';
import Button from '../../../components/common/Button';
import Link from 'next/link';
import axiosInstance from '../../../libs/api/instance';
import { strictEmailRegex } from '../../../constants/regex';

export default function ResetPassWord1() {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [numberError, setNumberError] = useState('');
  const [codeVerificationMessage, setCodeVerificationMessage] = useState('');

  const verificationToken = useRef(0);

  const handleSendCode = async () => {
    try {
      if (!strictEmailRegex.test(email)) {
        setEmailError('유효한 학교 이메일을 입력해주세요. (@mju.ac.kr)');
        return;
      }

      await axiosInstance.post('/user/code-send', { email });
      alert('인증번호가 이메일로 전송되었습니다.');
    } catch (error) {
      console.error('인증번호 전송 실패:', error);
      alert(
        error?.response?.data?.message ||
          '인증번호 전송에 실패했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handleCodeInput = async (value) => {
    setNumber(value);
    setIsCodeVerified(false);
    setNumberError('');
    setCodeVerificationMessage('');

    if (!/^[0-9]{6}$/.test(value)) {
      setNumberError('6자리 숫자 인증번호를 입력해주세요.');
      return;
    }

    const currentToken = ++verificationToken.current;

    try {
      const res = await axiosInstance.post('/user/code-verify', {
        email,
        code: value,
      });

      if (verificationToken.current === currentToken) {
        setIsCodeVerified(true);
        setCodeVerificationMessage('인증 성공');
      }
    } catch (err) {
      if (verificationToken.current === currentToken) {
        setIsCodeVerified(false);
        setCodeVerificationMessage('인증번호가 올바르지 않습니다.');
      }
    }
  };

  const handleLogin = () => {
    sessionStorage.setItem('resetEmail', email);
  };

  return (
    <div className="flex flex-col h-screen pt-12 px-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex flex-col w-full gap-2 text-center">
          <h2 className="text-2xl font-semibold text-[#37352f]">비밀번호 재설정</h2>
          <p className="text-[#73726e] text-sm">등록한 이메일로 찾기</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex-1 flex flex-col">
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[#37352f]">이메일</label>
            <div className="flex justify-between items-center">
              <StyledEmailInput
                className="mr-4 h-10 text-sm"
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  const inputEmail = e.target.value;
                  setEmail(inputEmail);
                  if (inputEmail === '' || strictEmailRegex.test(inputEmail)) {
                    setEmailError('');
                  } else {
                    setEmailError('학교 이메일을 입력해주세요. (@mju.ac.kr)');
                  }
                }}
                placeholder="학교 이메일을 입력해주세요."
                setEmail={setEmail}
              />
              <button
                className="border border-[#788cff] bg-white text-[#788cff] hover:bg-[#788cff] hover:text-white px-4 py-2 rounded-lg flex items-center justify-center whitespace-nowrap h-10 transition-all duration-200 font-medium text-sm"
                onClick={handleSendCode}
              >
                인증번호전송
              </button>
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-[#37352f]">인증번호</label>
            <StyledNumberInput
              className="h-10 text-sm"
              type="text"
              id="number"
              value={number}
              onChange={(e) => handleCodeInput(e.target.value)}
              placeholder="이메일로 전송된 인증번호를 입력해주세요."
              inputMode="numeric"
            />
            {numberError && (
              <p className="text-red-500 text-sm mt-1">{numberError}</p>
            )}
            {codeVerificationMessage && (
              <p
                className={`text-sm mt-1 ${
                  isCodeVerified ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {codeVerificationMessage}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link href={isCodeVerified ? '/login/reset-password-step2' : '#'}>
            <Button
              style={{ width: '100%' }}
              onClick={handleLogin}
              disabled={!isCodeVerified}
              text="다음으로"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

const StyledInput = ({ value, ...props }) => {
  return (
    <input
      className="px-4 py-3 bg-white rounded-lg border border-gray-200 focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/20 outline-none transition-all duration-200 text-sm"
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
