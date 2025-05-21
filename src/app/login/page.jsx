'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/common/Button';
import { isValidPassword, strictEmailRegex } from '../../constants/regex';

export default function Login() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginSave, setIsLoginSave] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [newPassword_2, setnewPassword_2] = useState('');

  const handlePasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLoginSave = () => {
    setIsLoginSave(!isLoginSave);
  };

  const isLoginAvailable = () => {
    return strictEmailRegex.test(email) && isValidPassword(password);
  };

  const handleLogin = () => {
    console.log('로그인 시도:', email, password);
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center h-full pt-12 px-4">
      <div className="flex flex-col w-full mb-8 gap-1 mt-20">
        <h2 className="text-center text-[#788cff] text-[25px] font-bold">
          띵스룸
        </h2>
        <div className="text-[#333333] text-center text-[13px] font-normal">
          <p>명지대학교 이메일로 가입하여</p>
          <p>스터디룸을 간편히 사용해요!</p>
        </div>
      </div>

      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="w-full"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label>이메일</label>
              <StyledEmailInput
                className="h-10 text-sm"
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
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label>비밀번호</label>
              <StyledPasswordInput
                className="h-10 text-sm"
                id="password"
                value={password}
                onChange={(e) => {
                  const pw = e.target.value;
                  setPassword(pw); // ✔️ 수정: password state에 반영
                  if (!isValidPassword(pw)) {
                    setPasswordError(
                      '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.',
                    );
                  } else {
                    setPasswordError('');
                  }
                  if (newPassword_2 && pw !== newPassword_2) {
                    setConfirmError('비밀번호가 일치하지 않습니다.');
                  } else {
                    setConfirmError('');
                  }
                }}
                placeholder="비밀번호를 입력해주세요."
                isVisible={isPasswordVisible}
                handlePasswordVisible={handlePasswordVisible}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
              {confirmError && (
                <p className="text-red-500 text-sm mt-1">{confirmError}</p>
              )}
            </div>

            <div className="w-full mt-4">
              <Button
                style={{ width: '100%' }}
                disabled={!isLoginAvailable()}
                text="로그인"
                type="submit"
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between w-full mt-4">
          <div className="check_wrap">
            <StyledCheckbox checked={isLoginSave} onChange={handleLoginSave}>
              로그인 유지
            </StyledCheckbox>
          </div>

          <div className="button_wrap inline-flex gap-2 text-[#333333] text-sm font-normal">
            <Link href="/login/sign-up-step1">
              <button>회원가입</button>
            </Link>
            <Link href="/login/reset-password-step1">
              <button>비밀번호 재설정</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------- Styled Components -------------------------

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

const StyledPasswordInput = ({
  value,
  isVisible = false,
  handlePasswordVisible,
  ...props
}) => {
  return (
    <div className="flex w-full relative">
      <StyledInput
        {...props}
        style={{ width: '100%' }}
        value={value}
        type={isVisible ? 'text' : 'password'}
      />
      <img
        className="absolute top-[50%] right-[5px]"
        style={{ transform: 'translate(-50%, -50%)' }}
        src={
          isVisible
            ? '/static/icons/eye_off_icon.svg'
            : '/static/icons/eye_on_icon.svg'
        }
        alt="Toggle Password Visibility"
        width={18}
        onClick={handlePasswordVisible}
      />
    </div>
  );
};

const StyledCheckbox = ({ onChange, children, ...props }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={props.checked}
          onChange={onChange}
          className="appearance-none w-6 h-6 focus:outline-none"
        />
        <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6">
          <img
            src={
              props.checked
                ? '/static/icons/check_off_icon.svg'
                : '/static/icons/check_on_icon.svg'
            }
            alt="Checkbox Icon"
            width={24}
            height={24}
          />
        </div>
      </div>
      <span className="inline-flex items-center ml-2">{children}</span>
    </label>
  );
};
