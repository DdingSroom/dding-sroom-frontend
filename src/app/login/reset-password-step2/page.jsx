'use client';
import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Link from 'next/link';
import { isValidPassword, strictEmailRegex } from '../../../constants/regex';

export default function ResetPassword2() {
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

  const handleLogin = () => {
    console.log('비밀번호 재설정:', newPassword, newPassword_2);
  };

  return (
    <div className="flex flex-col items-center h-full pt-12 px-4">
      <div className="flex flex-col w-full mb-8 gap-1">
        <h2 className="text-center text-[20px]">비밀번호 재설정</h2>
        <div className="text-[#333333] text-center text-[14px] font-normal">
          <p>비밀번호 입력</p>
        </div>
      </div>

      <div className="flex flex-col justify-between w-full h-full">
        <div className="flex flex-col gap-4 flex-grow">
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
          <Link href="/login">
            <Button
              style={{ width: '100%' }}
              onClick={handleLogin}
              disabled={!isLoginAvailable()}
              text="확인"
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
  handlePasswordVisible,
  isMatch,
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
        alt="비밀번호 일치 여부 표시"
        width={18}
        onClick={handlePasswordVisible}
      />
    </div>
  );
};
