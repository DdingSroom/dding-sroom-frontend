'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../../../components/common/Button';
import CustomizedStepper from './customizedStepper';
import { strictEmailRegex } from '../../../constants/regex';
import useSignupStore from '../../../stores/useSignupStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [isLoginSave, setIsLoginSave] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [numberError, setNumberError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleLoginSave = () => {
    setIsLoginSave(!isLoginSave);
  };

  const isLoginAvailable = () =>
    strictEmailRegex.test(email) && /^\d{6}$/.test(number);

  // const handleLogin = () => {
  //   console.log('다음 버튼 클릭:', email, number);
  // };

  const { setSignupField } = useSignupStore();

  const handleNextStep = () => {
    setSignupField('email', email);
    router.push('/login/sign-up-step2');
  };

  const handleSendVerificationCode = async () => {
    // if (!strictEmailRegex.test(email)) {
    //   setEmailError('학교 이메일 형식을 확인해주세요. (@mju.ac.kr)');
    //   return;
    // }
    try {
      setIsSending(true);
      const response = await axios.post('/user/code-send', { email });
      if (response.status === 200 && response.data.success) {
        setSendSuccess(true);
        alert(response.data.message || '인증번호가 이메일로 전송되었습니다.');
      } else {
        alert(response.data.message || '인증번호 전송 실패');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('에러 응답:', error.response?.data);
        alert(
          error.response?.data?.message ||
            '서버 오류로 인해 인증번호 전송에 실패했습니다.',
        );
      } else {
        console.error('예상치 못한 에러:', error);
        alert('예상치 못한 오류가 발생했습니다.');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full pt-12 px-4">
      <div className="flex flex-col w-full mb-8 gap-1">
        <h2 className="text-center text-[20px]">회원가입</h2>
        <div className="text-[#333333] text-center text-[14px] font-normal">
          <p>학교 이메일 인증하기</p>
        </div>
      </div>

      <CustomizedStepper />

      <div className="flex-grow w-full mt-20 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label>이메일</label>
          <div className="flex justify-between items-center relative">
            <StyledEmailInput
              className="mr-4 h-10 text-sm pr-10"
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
            <button
              className={`border border-[#788cff] bg-white text-[#788cff] hover:bg-[#788cff] hover:text-white px-4 py-2 rounded flex items-center justify-center whitespace-nowrap h-10 ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSendVerificationCode}
              disabled={isSending}
            >
              {isSending ? '전송 중...' : '인증번호전송'}
            </button>
          </div>
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label>인증번호</label>
          <div className="flex justify-between items-center relative">
            <StyledNumberInput
              className="h-10 text-sm pr-10"
              type="text"
              id="number"
              value={number}
              onChange={(e) => {
                const value = e.target.value;
                setNumber(value);
                if (value.trim() === '') {
                  setNumberError('인증번호를 입력해주세요.');
                } else if (!/^\d{6}$/.test(value)) {
                  setNumberError('6자리 숫자 인증번호를 입력해주세요.');
                } else {
                  setNumberError('');
                }
              }}
              placeholder="이메일로 전송된 인증번호를 입력해주세요."
              inputMode="numeric"
            />
            {number && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <StyledCheckbox
                  checked={isLoginSave}
                  onChange={handleLoginSave}
                ></StyledCheckbox>
              </div>
            )}
          </div>
          {numberError && <p className="text-red-500 text-sm">{numberError}</p>}
        </div>
      </div>

      <div className="w-full mb-10">
        <Button
          style={{ width: '100%' }}
          onClick={handleNextStep}
          disabled={!isLoginAvailable()}
          text="다음으로"
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

const StyledNumberInput = ({ value, ...props }) => {
  return (
    <div className="flex w-full relative">
      <StyledInput {...props} style={{ width: '100%' }} value={value} />
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
            src="/static/icons/x_icon.svg"
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
