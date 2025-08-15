'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import Button from '../../../components/common/Button';
import { isValidPassword, strictEmailRegex } from '../../../constants/regex';
import useTokenStore from '../../../stores/useTokenStore';
import axiosInstance, { setAccessToken } from '../../../libs/api/instance';
import { getLoginErrorMessage } from '../../../utils/errorMessages';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginSave, setIsLoginSave] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const router = useRouter();

  const { setAccessToken: setGlobalAccessToken, setRefreshToken } =
    useTokenStore();

  const handleLoginSave = () => {
    setIsLoginSave(!isLoginSave);
  };

  const handlePasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isLoginAvailable = () =>
    strictEmailRegex.test(email) && isValidPassword(password);

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await axiosInstance.post('/login', formData);

      const accessToken =
        response.headers['access'] ||
        response.headers['Access'] ||
        response.headers['authorization'] ||
        response.headers['Authorization'];

      const refreshToken =
        response.headers['refresh'] || response.headers['Refresh'];

      if (accessToken) {
        setAccessToken(accessToken);
        setGlobalAccessToken(accessToken);
        setRefreshToken(refreshToken || '');
        const decoded = jwtDecode(accessToken);
        console.log('토큰 디코드 결과:', decoded);

        // 관리자 role 확인 후 적절한 페이지로 리다이렉트
        if (decoded.role === 'ROLE_ADMIN') {
          router.push('/admin/dashboard');
        } else {
          setConfirmError('관리자 권한이 없습니다.');
        }
      } else {
        console.warn(
          '응답 헤더에서 access 토큰을 찾지 못했습니다:',
          response.headers,
        );
        setConfirmError('로그인에 실패했습니다. 토큰이 누락되었습니다.');
      }
    } catch (e) {
      console.error('로그인 실패:', e);
      setConfirmError(getLoginErrorMessage(e));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-6 py-8">
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-2xl font-bold text-[#788cff] tracking-tight">
          띵스룸 관리자 로그인
        </h1>
        <div className="text-[#73726e] text-sm leading-relaxed">
          <p>명지대학교 이메일로 가입하여</p>
          <p>스터디룸을 간편히 사용해요!</p>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#37352f]">
              이메일
            </label>
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
            {emailError && (
              <p className="text-red-500 text-xs mt-1.5">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#37352f]">
              비밀번호
            </label>
            <StyledPasswordInput
              id="password"
              value={password}
              onChange={(e) => {
                const pw = e.target.value;
                setPassword(pw);
                if (!isValidPassword(pw)) {
                  setPasswordError(
                    '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.',
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
            {confirmError && (
              <p className="text-red-500 text-xs mt-1.5">{confirmError}</p>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between">
          <StyledCheckbox checked={isLoginSave} onChange={handleLoginSave}>
            로그인 유지
          </StyledCheckbox>

          <div className="flex items-center gap-4 text-xs text-[#73726e]">
            <Link
              href="/login/sign-up-step1"
              className="hover:text-[#37352f] transition-colors"
            >
              회원가입
            </Link>
            <Link
              href="/login/reset-password-step1"
              className="hover:text-[#37352f] transition-colors"
            >
              비밀번호 재설정
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full mt-8">
        <Button
          disabled={!isLoginAvailable()}
          text="관리자 로그인"
          type="submit"
          onClick={handleLogin}
        />
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

const StyledPasswordInput = ({
  value,
  isVisible = false,
  handlePasswordVisible,
  ...props
}) => {
  return (
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
};

const StyledCheckbox = ({ onChange, children, ...props }) => {
  return (
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
      <span className="ml-2 text-xs text-[#73726e] select-none">
        {children}
      </span>
    </label>
  );
};
