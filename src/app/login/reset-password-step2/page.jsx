'use client';
import React, { useState, useEffect } from 'react';
import Button from '../../../components/common/Button';
import Link from 'next/link';
import { isValidPassword } from '../../../constants/regex';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../libs/api/instance';

export default function ResetPassword2() {
  const [email, setEmail] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [newPassword_2, setnewPassword_2] = useState('');
  const [isnewPasswordVisible, setIsnewPasswordVisible] = useState(false);
  const [isnewPassword_2Visible, setIsnewPassword_2Visible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert('이메일 정보가 유실되었습니다. 처음부터 다시 시도해주세요.');
      router.push('/login/reset-password-step1');
    }
  }, []);

  const handlenewPasswordVisible = () => {
    setIsnewPasswordVisible(!isnewPasswordVisible);
  };

  const handlenewPassword_2Visible = () => {
    setIsnewPassword_2Visible(!isnewPassword_2Visible);
  };

  const isLoginAvailable = () => {
    return isValidPassword(newPassword) && newPassword === newPassword_2;
  };

  const handlePasswordReset = async () => {
    try {
      console.log('요청 전 email:', email);
      console.log('요청 전 password:', newPassword);

      const response = await axiosInstance.post('/user/modify-password', {
        email,
        password: newPassword,
      });

      console.log('비밀번호 재설정 성공:', response.data);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      router.push('/login');
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      console.log('에러 응답:', error?.response?.data);
      alert('비밀번호 재설정에 실패했습니다.');
    }
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
            <ConfirmPasswordField
              className="h-10 text-sm flex-grow"
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
              <p className="text-red-500 text-sm">{confirmError}</p>
            )}
          </div>
        </div>

        <div className="w-full mb-10">
          <Button
            style={{ width: '100%' }}
            onClick={handlePasswordReset}
            disabled={!isLoginAvailable()}
            text="확인"
          />
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
        alt="비밀번호 표시 토글"
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
