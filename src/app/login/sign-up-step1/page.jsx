'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '../../../components/common/Button';
import CustomizedStepper from './customizedStepper';
import { strictEmailRegex } from '../../../constants/regex';
import useSignupStore from '../../../stores/useSignupStore';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../libs/api/instance';

export default function SignUpStep1() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [numberError, setNumberError] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [codeVerificationMessage, setCodeVerificationMessage] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const timerRef = useRef(null);

  const { setSignupField } = useSignupStore();

  const commonCodeButtonClass =
    'inline-flex items-center justify-center w-[100px] h-10 ' +
    'border border-[#788cff] bg-white text-[#788cff] ' +
    'hover:bg-[#788cff] hover:text-white text-sm font-medium rounded-lg ' +
    'transition-all duration-200 whitespace-nowrap disabled:opacity-50';

  const startTimer = () => {
    setSecondsLeft(300);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const mmss = useMemo(() => {
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [secondsLeft]);

  const handleSendCode = async () => {
    try {
      setCodeVerificationMessage('');
      setNumberError('');
      setIsCodeVerified(false);

      if (!strictEmailRegex.test(email)) {
        setEmailError('유효한 학교 이메일을 입력해주세요. (@mju.ac.kr)');
        return;
      }
      setEmailError('');
      setIsSending(true);

      await axiosInstance.post('/user/code-send', { email });

      setCodeSent(true);
      startTimer();
      alert('인증번호가 이메일로 전송되었습니다.');
    } catch (error) {
      console.error('인증번호 전송 실패:', error);
      alert(
        error?.response?.data?.message ||
          '인증번호 전송에 실패했습니다. 다시 시도해주세요.',
      );
      setCodeSent(false);
      setSecondsLeft(0);
    } finally {
      setIsSending(false);
    }
  };

  const handleNumberChange = (value) => {
    const v = value.replace(/\s/g, '');
    setNumber(v);
    setIsCodeVerified(false);
    setCodeVerificationMessage('');
    if (v && !/^[0-9]{6}$/.test(v)) {
      setNumberError('6자리 숫자 인증번호를 입력해주세요.');
    } else {
      setNumberError('');
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsVerifying(true);
      setCodeVerificationMessage('');
      setIsCodeVerified(false);

      if (!codeSent) {
        setCodeVerificationMessage('먼저 인증번호를 전송해주세요.');
        return;
      }
      if (secondsLeft <= 0) {
        setCodeVerificationMessage(
          '인증번호가 만료되었습니다. 다시 전송해주세요.',
        );
        return;
      }
      if (!/^[0-9]{6}$/.test(number)) {
        setNumberError('6자리 숫자 인증번호를 입력해주세요.');
        return;
      }

      const res = await axiosInstance.post('/user/code-verify', {
        email,
        code: number,
      });
      const ok =
        (res?.data?.verified ?? res?.data?.success) === true ||
        res?.status === 200;

      if (ok) {
        setIsCodeVerified(true);
        setCodeVerificationMessage('인증 성공');
      } else {
        setIsCodeVerified(false);
        setCodeVerificationMessage('인증번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('인증번호 확인 실패:', err);
      setIsCodeVerified(false);
      setCodeVerificationMessage(
        '인증번호 확인에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    setSignupField('email', email);
    router.push('/login/sign-up-step2');
  };

  const canVerify = codeSent && secondsLeft > 0 && /^[0-9]{6}$/.test(number);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-6 py-8">
      {/* 스피너 오버레이 */}
      {isSending && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
            <div
              className="w-8 h-8 border-4 border-[#788cff] border-t-transparent rounded-full animate-spin"
              aria-label="로딩 중"
            ></div>
            <p className="text-sm text-gray-600 text-center">
              메일을 전송 중이예요. 시스템 환경에 따라 딜레이가 발생할 수
              있어요.
            </p>
          </div>
        </div>
      )}

      <div className="text-center space-y-3 mb-8">
        <h1 className="text-2xl font-bold text-[#37352f]">회원가입</h1>
        <p className="text-[#73726e] text-sm">학교 이메일 인증하기</p>
      </div>

      <div className="mb-8">
        <CustomizedStepper />
      </div>

      <div className="flex-1 max-w-md mx-auto w-full space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#37352f]">
            이메일
          </label>
          <div className="flex gap-2">
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
                disabled={isSending}
              />
            </div>
            <button
              className={commonCodeButtonClass}
              onClick={handleSendCode}
              disabled={isSending || !strictEmailRegex.test(email)}
            >
              {isSending ? '전송중' : '인증번호 전송'}
            </button>
          </div>
          {emailError && (
            <p className="text-red-500 text-xs mt-1.5">{emailError}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#37352f]">
            인증번호
          </label>
          <div className="flex items-center gap-2 flex-nowrap">
            <div className="relative flex-1 min-w-0">
              <StyledNumberInput
                type="text"
                id="number"
                value={number}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder="이메일로 전송된 인증번호를 입력해주세요."
                inputMode="numeric"
                maxLength={6}
                className="pr-14"
                disabled={isSending}
              />
              {codeSent && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#666]">
                  {secondsLeft > 0 ? mmss : '만료'}
                </span>
              )}
            </div>
            <button
              className={commonCodeButtonClass}
              onClick={handleVerifyCode}
              disabled={!canVerify || isVerifying || isSending}
            >
              {isVerifying ? '확인중' : '인증번호 확인'}
            </button>
          </div>
          {numberError && (
            <p className="text-red-500 text-xs mt-1.5">{numberError}</p>
          )}
          {codeVerificationMessage && (
            <p
              className={`text-xs mt-1.5 ${isCodeVerified ? 'text-green-600' : 'text-red-500'}`}
            >
              {codeVerificationMessage}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto w-full mt-8">
        <Button
          onClick={handleNext}
          disabled={!isCodeVerified}
          text="다음으로"
        />
      </div>
    </div>
  );
}

const StyledInput = ({ value, className = '', ...props }) => {
  const base =
    'w-full px-4 py-3 bg-white rounded-lg border border-[#e9e9e7] text-sm ' +
    'placeholder:text-[#9b9998] focus:outline-none focus:border-[#788cff] ' +
    'focus:ring-2 focus:ring-[#788cff]/10 transition-all duration-200';
  return <input className={`${base} ${className}`} value={value} {...props} />;
};

const StyledEmailInput = ({
  value,
  setEmail,
  className = '',
  disabled,
  ...props
}) => {
  const handleRemoveEmailValue = () => setEmail('');
  return (
    <div className="relative">
      <StyledInput
        {...props}
        value={value}
        className={className}
        disabled={disabled}
      />
      {value && !disabled && (
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

const StyledNumberInput = ({ value, className = '', ...props }) => {
  return <StyledInput {...props} value={value} className={className} />;
};
