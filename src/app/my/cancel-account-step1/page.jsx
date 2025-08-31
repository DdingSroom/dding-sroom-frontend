'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import useTokenStore from '../../../stores/useTokenStore';
import axiosInstance from '../../../libs/api/instance';
import Button from '../../../components/common/Button';
import PrivacyPolicyFooter from '../../../components/common/PrivacyPolicyFooter';
import MyPageHeader from '@components/common/MyPageHeader';
import Modal from '@components/common/Modal';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import FooterNav from '../../../components/common/FooterNav';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

export default function CancelAccountStep1() {
  const [open, setOpen] = useState(false);
  const [isSendingVerify, setIsSendingVerify] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { accessToken } = useTokenStore();
  const router = useRouter();

  const commonCodeButtonClass =
    'inline-flex items-center justify-center w-[100px] h-10 ' +
    'border border-[#788cff] bg-white text-[#788cff] ' +
    'hover:bg-[#788cff] hover:text-white text-sm font-medium rounded-lg ' +
    'transition-all duration-200 whitespace-nowrap disabled:opacity-50';

  useEffect(() => {
    if (!accessToken) {
      setShowLoginModal(true);
    }
  }, [accessToken]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleEmailVerify = async () => {
    if (!emailInput || !accessToken) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      const tokenEmail = decodedToken.email;

      if (emailInput !== tokenEmail) {
        alert('입력하신 이메일이 계정 이메일과 일치하지 않습니다.');
        return;
      }

      setIsSendingVerify(true);
      const response = await axiosInstance.post(
        '/user/verify-email',
        { email: emailInput },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('이메일 인증 성공:', response.data);
      setIsVerified(true);
      alert('이메일 인증이 완료되었습니다.');
    } catch (error) {
      console.error('이메일 인증 실패:', error);
      alert('이메일 인증 중 오류가 발생했습니다.');
    } finally {
      setIsSendingVerify(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isVerified || !accessToken) {
      alert('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    try {
      setIsWithdrawing(true);
      const response = await axiosInstance.delete('/user/withdraw', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('탈퇴 성공:', response.data);
      alert('회원 탈퇴가 완료되었습니다.');
      router.push('/login');
    } catch (error) {
      console.error('탈퇴 실패:', error);
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setIsWithdrawing(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-1">
          <MyPageHeader />

          {!showLoginModal && (
            <div className="px-6 py-8">
              <div className="max-w-md mx-auto w-full space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#37352f]">
                    계정 이메일
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <StyledInput
                        type="email"
                        placeholder="이메일을 입력해주세요."
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        disabled={isSendingVerify || isVerified}
                        aria-label="계정 이메일 입력"
                      />
                    </div>
                    <button
                      className={commonCodeButtonClass}
                      onClick={handleEmailVerify}
                      disabled={isSendingVerify || isVerified || !emailInput}
                    >
                      {isSendingVerify
                        ? '인증 중...'
                        : isVerified
                          ? '인증 완료'
                          : '이메일 인증'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-[#6E6E6E] text-sm">
                  <p>
                    * 탈퇴 후 개인정보, 예약 등의 데이터가 삭제되며, 복구할 수
                    없습니다.
                  </p>
                  {/* <p>
                    * 작성한 게시물은 삭제되지 않으며, (알수없음)으로 닉네임이
                    표시됩니다.
                  </p> */}
                  <p>* 자세한 내용은 개인정보처리방침을 확인해주세요.</p>
                </div>

                <div className="w-full pt-2">
                  <Button
                    onClick={() => setOpen(true)}
                    disabled={!isVerified || isWithdrawing}
                    text={isWithdrawing ? '탈퇴 처리 중...' : '회원탈퇴'}
                  />
                </div>
              </div>

              <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={handleDeleteAccount}
                text={isWithdrawing ? '탈퇴 처리 중...' : '탈퇴하기'}
                color="red"
                disabled={isWithdrawing}
              >
                <div className="p-4 flex flex-col h-full justify-center">
                  <p className="font-semibold text-2xl text-left mb-2">
                    정말 탈퇴하시겠습니까?
                  </p>
                  <p className="text-[#6E6E6E] text-sm text-left">
                    탈퇴하기 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다.
                  </p>
                  <p className="text-[#6E6E6E] text-sm text-left">
                    복구되지 않습니다.
                  </p>
                </div>
              </Modal>
            </div>
          )}
        </main>

        <PrivacyPolicyFooter />
        <BottomSafeSpacer height={64} />
        <FooterNav />
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onConfirm={handleLoginConfirm}
      />
    </>
  );
}

const StyledInput = ({ value, className = '', ...props }) => {
  const base =
    'w-full px-4 py-3 bg-white rounded-lg border border-[#e9e9e7] text-sm ' +
    'placeholder:text-[#9b9998] focus:outline-none focus:border-[#788cff] ' +
    'focus:ring-2 focus:ring-[#788cff]/10 transition-all duration-200';
  return <input className={`${base} ${className}`} value={value} {...props} />;
};
