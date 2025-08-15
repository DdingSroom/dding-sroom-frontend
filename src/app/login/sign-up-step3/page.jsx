'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useSignupStore from '../../../stores/useSignupStore';
import Button from '../../../components/common/Button';
import PrivacyPolicyFooter from '../../../components/common/PrivacyPolicyFooter';
import CustomizedStepper from './customizedStepper';

const NAME_DRAFT_KEY = 'signup_name_draft';

export default function SignUpStep3() {
  const router = useRouter();
  const [name, setName] = useState('');

  const [hasOpenedPolicy, setHasOpenedPolicy] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const { signupData, resetSignupData } = useSignupStore();

  // 1) 마운트 시: 개인정보 처리방침 확인 여부 + 이름 초깃값 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reviewed = sessionStorage.getItem('policyReviewed');
      if (reviewed === '1') {
        setHasOpenedPolicy(true);
        sessionStorage.removeItem('policyReviewed');
      }

      // 이름 초깃값 복원
      const savedName = sessionStorage.getItem(NAME_DRAFT_KEY);
      if (savedName && savedName.trim().length > 0) {
        setName(savedName);
      }
    }
  }, []);

  // 2) 이름 입력 변화 시: 세션 스토리지에 임시 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 비어있으면 저장값 제거(선택사항): sessionStorage.removeItem(...)
      sessionStorage.setItem(NAME_DRAFT_KEY, name ?? '');
    }
  }, [name]);

  const openPrivacyPolicy = () => {
    // 이름 상태를 즉시 저장
    if (typeof window !== 'undefined' && name) {
      sessionStorage.setItem(NAME_DRAFT_KEY, name);
    }
    router.push('/privacy-policy-2');
    setHasOpenedPolicy(true);
  };

  const handleSignup = async () => {
    if (!consentChecked) {
      alert('개인정보처리방침에 동의해야 회원가입을 진행할 수 있습니다.');
      return;
    }

    try {
      const dataToSend = {
        ...signupData,
        username: name,
        privacyAgreed: true,
      };

      const res = await axios.post(
        'https://ddingsroomserver.click:8443/user/sign-up',
        dataToSend,
        { headers: { Authorization: undefined } },
      );

      console.log('회원가입 성공:', res.data);

      // 3) 성공 시 임시 이름 제거 + 스토어 초기화
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(NAME_DRAFT_KEY);
      }
      resetSignupData();

      router.push(`/login/sign-up-step4?username=${encodeURIComponent(name)}`);
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(
        error?.response?.data?.message || '회원가입 중 오류가 발생했습니다.',
      );
    }
  };

  const isSignupAvailable = () => {
    return Boolean(name && name.trim().length > 0 && consentChecked);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 px-6 py-8">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-[#37352f]">회원가입</h1>
          <p className="text-[#73726e] text-sm">정보 입력</p>
        </div>

        <div className="mb-8">
          <CustomizedStepper />
        </div>

        <div className="max-w-md mx-auto w-full space-y-6">
          {/* 이름 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#37352f]"
            >
              이름
            </label>
            <StyledTextInput
              id="name"
              type="text"
              placeholder="USER 01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name" // 브라우저 자동완성 힌트 (선택)
              inputMode="text"
            />
          </div>

          {/* 개인정보처리방침 동의 섹션 */}
          <div className="rounded-lg border border-[#e9e9e7] bg-white p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#37352f]">
                  개인정보처리방침 동의
                  <span className="ml-1 text-[#9b9998] text-xs">(필수)</span>
                </p>
                <p className="text-xs text-[#73726e] mt-1">
                  버튼을 눌러 개인정보처리방침을 확인한 뒤, 동의 체크를
                  해주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={openPrivacyPolicy}
                className="shrink-0 px-3 py-1.5 rounded-md border border-[#e9e9e7] text-sm text-[#37352f] hover:bg-gray-50 transition"
              >
                개인정보처리방침 보기
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="privacy-consent"
                type="checkbox"
                className="h-4 w-4 shrink-0 inline-block align-middle rounded border-[#e9e9e7]
                           bg-white appearance-auto accent-[#788cff]
                           focus:ring-2 focus:ring-[#788cff]/20
                           disabled:opacity-60 disabled:cursor-not-allowed"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                disabled={!hasOpenedPolicy}
                aria-disabled={!hasOpenedPolicy}
              />
              <label
                htmlFor="privacy-consent"
                className={`text-sm ${hasOpenedPolicy ? 'text-[#37352f]' : 'text-[#9b9998]'}`}
              >
                (필수) 개인정보처리방침에 동의합니다.
              </label>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <div className="w-full pt-2">
            <Button
              onClick={handleSignup}
              disabled={!isSignupAvailable()}
              text="회원가입"
            />
          </div>
        </div>
      </main>

      <PrivacyPolicyFooter />
    </div>
  );
}

const StyledTextInput = ({ value, className = '', ...props }) => {
  const base =
    'w-full px-4 py-3 bg-white rounded-lg border border-[#e9e9e7] text-sm ' +
    'placeholder:text-[#9b9998] focus:outline-none focus:border-[#788cff] ' +
    'focus:ring-2 focus:ring-[#788cff]/10 transition-all duration-200';
  return <input className={`${base} ${className}`} value={value} {...props} />;
};
