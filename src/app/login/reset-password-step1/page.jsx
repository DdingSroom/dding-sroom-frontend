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
    <div className="min-h-screen bg-gray-50 flex flex-col px-6 py-8">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-2xl font-bold text-[#37352f]">비밀번호 재설정</h1>
        <p className="text-[#73726e] text-sm">등록한 이메일로 찾기</p>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#37352f]">이메일</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <StyledEmailInput
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
              </div>
              <button
                className="px-4 py-3 border border-[#788cff] bg-white text-[#788cff] hover:bg-[#788cff] hover:text-white text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap"
                onClick={handleSendCode}
              >
                인증번호전송
              </button>
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1.5">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#37352f]">인증번호</label>
            <StyledNumberInput
              type="text"
              id="number"
              value={number}
              onChange={(e) => handleCodeInput(e.target.value)}
              placeholder="이메일로 전송된 인증번호를 입력해주세요."
              inputMode="numeric"
            />
            {numberError && (
              <p className="text-red-500 text-xs mt-1.5">{numberError}</p>
            )}
            {codeVerificationMessage && (
              <p
                className={`text-xs mt-1.5 ${
                  isCodeVerified ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {codeVerificationMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full mt-8">
        <Link href={isCodeVerified ? '/login/reset-password-step2' : '#'}>
          <Button
            onClick={handleLogin}
            disabled={!isCodeVerified}
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
      className="w-full px-4 py-3 bg-white rounded-lg border border-[#e9e9e7] text-sm placeholder:text-[#9b9998] focus:outline-none focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/10 transition-all duration-200"
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
    <div className="relative">
      <StyledInput {...props} value={value} />
      {value && (
        <button
          type="button"
          onClick={handleRemoveEmailValue}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <img
            src="/static/icons/x_icon.svg"
            alt="Clear"
            width={14}
            height={14}
            className="opacity-60 hover:opacity-80"
          />
        </button>
      )}
    </div>
  );
};

const StyledNumberInput = ({ value, ...props }) => {
  return (
    <StyledInput {...props} value={value} />
  );
};
