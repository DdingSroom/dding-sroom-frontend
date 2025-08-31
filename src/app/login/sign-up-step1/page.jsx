'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { strictEmailRegex } from '../../../constants/regex';
import useSignupStore from '../../../stores/useSignupStore';
import axiosInstance from '../../../libs/api/instance';
import Button from '../../../components/common/Button';
import PrivacyPolicyFooter from '../../../components/common/PrivacyPolicyFooter';
import FooterNav from '../../../components/common/FooterNav';
import CustomizedStepper from './customizedStepper';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

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

  const MANUAL_URL = '/email-verification-manual';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isSending && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm md:backdrop-blur flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center space-y-4 max-w-sm mx-4 sm:max-w-none sm:mx-0">
            <div
              className="w-8 h-8 border-4 border-[#788cff] border-t-transparent rounded-full animate-spin"
              aria-label="로딩 중"
            />
            <p className="text-sm text-gray-600 text-center">
              메일을 전송 중이예요. 시스템 환경에 따라 딜레이가 발생할 수
              있어요.
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 px-6 py-8">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-[#37352f]">회원가입</h1>
          <p className="text-[#73726e] text-sm">학교 이메일 인증하기</p>
        </div>

        <div className="mb-8">
          <CustomizedStepper />
        </div>

        <div className="max-w-md mx-auto w-full space-y-6">
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
                    if (
                      inputEmail === '' ||
                      strictEmailRegex.test(inputEmail)
                    ) {
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
                  placeholder="인증번호를 입력해주세요."
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

          <div
            className="rounded-lg border border-[#e9e9e7] bg-white p-4 sm:p-5 space-y-3"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#d9d9d6] text-xs text-[#73726e]"
                aria-hidden="true"
              >
                i
              </span>
              <div className="flex-1 space-y-2">
                <h3 className="text-sm font-semibold text-[#37352f]">
                  혹시 메일이 도착하지 않는다면?
                </h3>
                <p className="text-xs text-[#73726e] leading-relaxed">
                  학교 계정으로 이메일이 발송되지 않는다면, 해당 계정이{' '}
                  <b>2023년 11월 이전 발급된 계정</b>으로{' '}
                  <b>명지대학교 측에서 메일을 이관하여 현재 사용정지된 상태</b>
                  일 수 있습니다. 아래 <b>해결방법</b> 버튼을 클릭하여{' '}
                  <b>메일 이관</b> 후 회원가입하시길 바랍니다.
                </p>

                <div className="pt-1">
                  <Link
                    href={MANUAL_URL}
                    className="inline-flex items-center justify-center h-10 px-3 rounded-lg border border-[#788cff] text-[#788cff] hover:bg-[#788cff] hover:text-white text-sm font-medium transition-all duration-200"
                    aria-label="이메일 인증 문제 해결 매뉴얼 새 창으로 열기"
                  >
                    해결방법
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="ml-1 h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M12.293 2.293a1 1 0 011.414 0l4 4A1 1 0 0117 8h-3a1 1 0 110-2h.586L12 3.414V4a1 1 0 11-2 0V3a1 1 0 011-1h1.293z" />
                      <path d="M3 5a2 2 0 012-2h4a1 1 0 110 2H5v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={!isCodeVerified}
            text="다음으로"
          />
        </div>
      </div>

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
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
          aria-label="이메일 입력 내용 지우기"
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
