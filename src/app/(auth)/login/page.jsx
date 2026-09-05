'use client';
import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import Button from '@components/common/button';
import FooterNav from '@components/common/FooterNav';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';

import { isValidPassword, strictEmailRegex } from '@constants/regex';
import { login } from '@shared/api/auth';
import useTokenStore from '@stores/useTokenStore';
import { getLoginErrorMessage } from '@utils/errorMessages';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginInfoRemembered, setIsLoginInfoRemembered] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState('/');

  const { setAccessToken: setGlobalAccessToken } = useTokenStore();

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      const decoded = decodeURIComponent(redirect);
      if (decoded.startsWith('/') && !decoded.startsWith('//')) {
        setRedirectUrl(decoded);
      }
    }
  }, [searchParams]);

  const handlePasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLoginInfoRemembered = () => {
    setIsLoginInfoRemembered(!isLoginInfoRemembered);
  };

  const isLoginAvailable = () =>
    strictEmailRegex.test(email) && isValidPassword(password);

  const handleLogin = async () => {
    try {
      const { accessToken } = await login(email, password);

      if (!accessToken) {
        console.warn('로그인 응답에서 access 토큰을 찾지 못했습니다.');
        setLoginError('로그인에 실패했습니다. 토큰이 누락되었습니다.');
        return;
      }

      setGlobalAccessToken(accessToken);

      // 토큰 설정이 완료된 후 리다이렉트
      setTimeout(() => {
        router.push(redirectUrl);
      }, 50);
    } catch (e) {
      console.error('로그인 실패:', e);
      setLoginError(getLoginErrorMessage(e));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 본문 */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-brand tracking-tight">
            띵스룸
          </h1>
          <div className="text-content-secondary text-sm leading-relaxed">
            <p>명지대학교 이메일로 가입하여</p>
            <p>스터디룸을 간편히 사용해요!</p>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-content">
                이메일
              </label>
              <StyledEmailInput
                type="email"
                id="email"
                name="email"
                autoComplete={isLoginInfoRemembered ? 'username' : 'off'}
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
              {emailError && (
                <p className="text-red-500 text-xs mt-1.5">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-content">
                비밀번호
              </label>
              <StyledPasswordInput
                id="password"
                name="password"
                autoComplete={
                  isLoginInfoRemembered ? 'current-password' : 'off'
                }
                value={password}
                onChange={(e) => {
                  const pw = e.target.value;
                  setPassword(pw);
                  if (!isValidPassword(pw)) {
                    setPasswordError(
                      '비밀번호는 8자 이상, 영문과 숫자, 특수문자를 포함해야합니다.',
                    );
                  } else {
                    setPasswordError('');
                  }
                }}
                placeholder="비밀번호를 입력해주세요."
                isVisible={isPasswordVisible}
                handlePasswordVisible={handlePasswordVisible}
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1.5">{passwordError}</p>
              )}
              {loginError && (
                <p className="text-red-500 text-xs mt-1.5">{loginError}</p>
              )}
            </div>
          </form>

          <div className="flex items-center justify-between">
            <StyledCheckbox
              checked={isLoginInfoRemembered}
              onChange={handleLoginInfoRemembered}
            >
              로그인 정보 기억
            </StyledCheckbox>

            <div className="flex items-center gap-4 text-xs text-content-secondary">
              <Link
                href="/sign-up/step1"
                className="hover:text-content transition-colors"
              >
                회원가입
              </Link>
              <Link
                href="/reset-password/step1"
                className="hover:text-content transition-colors"
              >
                비밀번호 재설정
              </Link>
            </div>
          </div>

          <Button
            disabled={!isLoginAvailable()}
            type="submit"
            onClick={handleLogin}
          >
            로그인
          </Button>
        </div>
      </div>

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}

const StyledInput = ({ value, ...props }) => (
  <input
    className="w-full px-4 py-3 bg-white rounded-lg border border-line text-sm placeholder:text-content-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all duration-200"
    value={value}
    {...props}
  />
);

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

const StyledPasswordInput = ({
  value,
  isVisible = false,
  handlePasswordVisible,
  ...props
}) => (
  <div className="relative">
    <StyledInput
      {...props}
      value={value}
      type={isVisible ? 'text' : 'password'}
    />
    <button
      type="button"
      onClick={handlePasswordVisible}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
    >
      <img
        src={
          isVisible
            ? '/static/icons/eye_on_icon.svg'
            : '/static/icons/eye_off_icon.svg'
        }
        alt="Toggle Password Visibility"
        width={18}
        height={18}
        className="opacity-60 hover:opacity-80"
      />
    </button>
  </div>
);

const StyledCheckbox = ({ onChange, children, ...props }) => (
  <label className="inline-flex items-center cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={onChange}
        className="appearance-none w-5 h-5 focus:outline-none"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={
            props.checked
              ? '/static/icons/check_off_icon.svg'
              : '/static/icons/check_on_icon.svg'
          }
          alt="Checkbox"
          width={20}
          height={20}
          className="group-hover:opacity-80 transition-opacity"
        />
      </div>
    </div>
    <span className="ml-2 text-xs text-content-secondary select-none">
      {children}
    </span>
  </label>
);

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
