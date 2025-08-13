'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../../../components/common/Button';
import CustomizedStepper from './customizedStepper';
import { isValidPassword, strictEmailRegex } from '../../../constants/regex';
import useSignupStore from '../../../stores/useSignupStore';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [newPassword, setnewPassword] = useState('');
  const [newPassword_2, setnewPassword_2] = useState('');
  const [isnewPasswordVisible, setIsnewPasswordVisible] = useState(false);
  const [isnewPassword_2Visible, setIsnewPassword_2Visible] = useState(false);
  const [isLoginSave, setIsLoginSave] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handlenewPasswordVisible = () => {
    setIsnewPasswordVisible(!isnewPasswordVisible);
  };

  const handlenewPassword_2Visible = () => {
    setIsnewPassword_2Visible(!isnewPassword_2Visible);
  };

  const handleLoginSave = () => {
    setIsLoginSave(!isLoginSave);
  };

  const isLoginAvailable = () => {
    return isValidPassword(newPassword) && newPassword === newPassword_2;
  };

  // const handleLogin = () => {
  //   console.log('비밀번호 재설정:', newPassword, newPassword_2);
  // };

  const { setSignupField } = useSignupStore();

  const handleNextStep = () => {
    setSignupField('password', newPassword);
    router.push('/login/sign-up-step3');
  };

  return (
    <div className="flex flex-col h-full pt-12 px-4">
      <div className="flex flex-col w-full mb-8 gap-1">
        <h2 className="text-center text-[20px]">회원가입</h2>
        <div className="text-[#333333] text-center text-[14px] font-normal">
          <p>비밀번호 입력</p>
        </div>
      </div>
      <CustomizedStepper />

      <div className="flex-grow w-full mt-20 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label>새 비밀번호</label>
          <NewPasswordField
            className="h-10 text-sm"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => {
              const pw = e.target.value;
              setnewPassword(pw);
              if (!isValidPassword(pw)) {
                setPasswordError(
                  '비밀번호는 8자 이상, 영문과 숫자, 특수문자를 포함해야합니다.',
                );
              } else {
                setPasswordError('');
              }
              // 비밀번호 확인과 다르면 오류도 같이 갱신
              if (newPassword_2 && pw !== newPassword_2) {
                setConfirmError('비밀번호가 일치하지 않습니다.');
              } else {
                setConfirmError('');
              }
            }}
            placeholder="비밀번호를 입력해주세요."
            isVisible={isnewPasswordVisible}
            handlePasswordVisible={handlenewPasswordVisible}
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label>새 비밀번호 확인</label>
          <div className="flex items-center">
            <ConfirmPasswordField
              className="h-10 text-sm flex-grow"
              type="password"
              id="newPassword_2"
              value={newPassword_2}
              onChange={(e) => {
                const confirm = e.target.value;
                setnewPassword_2(confirm);
                if (confirm !== newPassword) {
                  setConfirmError('비밀번호가 일치하지 않습니다.');
                } else {
                  setConfirmError('');
                }
              }}
              placeholder="비밀번호를 입력해주세요."
              isVisible={isnewPassword_2Visible}
              handlePasswordVisible={handlenewPassword_2Visible}
              isMatch={
                newPassword && newPassword_2 && newPassword === newPassword_2
              }
            />
          </div>
          {confirmError && (
            <p className="text-red-500 text-sm">{confirmError}</p>
          )}
        </div>
      </div>

      <div className="w-full mb-10">
        <Button
          style={{ width: '100%' }}
          onClick={handleNextStep}
          disabled={!isLoginAvailable()}
          text="확인"
        />
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

const NewPasswordField = ({
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
        alt="X"
        width={18}
        onClick={handlePasswordVisible}
      />
    </div>
  );
};

const ConfirmPasswordField = ({
  value,
  isVisible = false,
  isMatch = false,
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
          isMatch
            ? '/static/icons/check_off_icon.svg'
            : '/static/icons/check_on_icon.svg'
        }
        alt="Check"
        width={18}
        onClick={handlePasswordVisible}
      />
    </div>
  );
};

const StyledCheckbox = ({ onChange, children, ...props }) => {
  console.log(props.checked);
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
            src="/static/icons/check_on_icon.svg"
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
