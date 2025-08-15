'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isValidPassword } from '../../../constants/regex';
import useSignupStore from '../../../stores/useSignupStore';
import Button from '../../../components/common/Button';
import PrivacyPolicyFooter from '../../../components/common/PrivacyPolicyFooter';
import CustomizedStepper from './customizedStepper';

export default function SignUpStep2() {
  const router = useRouter();
  const [newPassword, setnewPassword] = useState('');
  const [newPassword_2, setnewPassword_2] = useState('');
  const [isnewPasswordVisible, setIsnewPasswordVisible] = useState(false);
  const [isnewPassword_2Visible, setIsnewPassword_2Visible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const { setSignupField } = useSignupStore();

  const handlenewPasswordVisible = () => {
    setIsnewPasswordVisible(!isnewPasswordVisible);
  };

  const handlenewPassword_2Visible = () => {
    setIsnewPassword_2Visible(!isnewPassword_2Visible);
  };

  const isNextAvailable = () => {
    return isValidPassword(newPassword) && newPassword === newPassword_2;
  };

  const handleNextStep = () => {
    setSignupField('password', newPassword);
    router.push('/login/sign-up-step3');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 px-6 py-8">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-[#37352f]">회원가입</h1>
          <p className="text-[#73726e] text-sm">비밀번호 입력</p>
        </div>

        <div className="mb-8">
          <CustomizedStepper />
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#37352f]">
                비밀번호
              </label>
              <NewPasswordField
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
                <p className="text-red-500 text-xs mt-1.5">{passwordError}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#37352f]">
                비밀번호 확인
              </label>
              <ConfirmPasswordField
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
              {confirmError && (
                <p className="text-red-500 text-xs mt-1.5">{confirmError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full mt-8">
          <Button
            onClick={handleNextStep}
            disabled={!isNextAvailable()}
            text="확인"
          />
        </div>
      </main>

      <PrivacyPolicyFooter />
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

const NewPasswordField = ({
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

const ConfirmPasswordField = ({
  value,
  isVisible = false,
  handlePasswordVisible,
  isMatch,
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
            isMatch
              ? '/static/icons/check_off_icon.svg'
              : '/static/icons/check_on_icon.svg'
          }
          alt="Password Match Indicator"
          width={18}
          height={18}
          className="opacity-60 hover:opacity-80"
        />
      </button>
    </div>
  );
};
