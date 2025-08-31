'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import useTokenStore from '../../../stores/useTokenStore';
import axiosInstance from '../../../libs/api/instance';
import MyPageHeader from '@components/common/MyPageHeader';
import MyPageBlock from '@components/common/MyPageBlock';
import Modal from '@components/common/Modal';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import PrivacyPolicyFooter from '@components/common/PrivacyPolicyFooter';
import FooterNav from '../../../components/common/FooterNav';

function BottomSafeSpacer({ height = 64 }) {
  return (
    <div
      aria-hidden="true"
      style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }}
    />
  );
}

export default function AccountInfo() {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { accessToken, userId, clearTokens, rehydrate } = useTokenStore();

  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    rehydrate();
    const t = setTimeout(() => setAuthReady(true), 0);
    return () => clearTimeout(t);
  }, [rehydrate]);

  useEffect(() => {
    if (!authReady) return;
    setShowLoginModal(!accessToken);
  }, [authReady, accessToken]);

  const getDecodedUserInfo = useCallback(() => {
    try {
      const decoded = jwtDecode(accessToken);
      const { email, username } = decoded || {};
      return { name: username || '', email: email || '' };
    } catch {
      return { name: '', email: '' };
    }
  }, [accessToken]);

  const [userInfo, setUserInfo] = useState(getDecodedUserInfo);

  useEffect(() => {
    if (!authReady) return;
    setUserInfo(getDecodedUserInfo());
  }, [authReady, accessToken, getDecodedUserInfo]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleUsernameChange = async () => {
    const trimmed = newName.trim();

    if (!trimmed) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (trimmed === (userInfo.name || '')) {
      alert('기존 이름과 동일합니다.');
      return;
    }
    if (submitting) return;

    try {
      setSubmitting(true);
      const res = await axiosInstance.put('/user/change-username', {
        userId,
        newUsername: trimmed,
      });

      if (res.status === 200) {
        alert('이름 변경이 완료되었습니다.');
        setUserInfo((prev) => ({ ...prev, name: trimmed }));
        setOpen(false);
        setNewName('');
      }
    } catch (err) {
      console.error('이름 변경 실패:', err);

      const serverMsg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        (typeof err?.response?.data === 'string' ? err.response.data : null);

      if (err?.response?.status === 409) {
        alert(serverMsg || '중복된 이름입니다.');
      } else if (err?.response?.status === 400) {
        alert(serverMsg || '요청이 올바르지 않습니다.');
      } else {
        alert(
          serverMsg || '이름 변경에 실패했습니다. 잠시 후 다시 시도해주세요.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout', null, {
        withCredentials: true,
      });
    } catch (error) {
      if (error?.response?.status === 403) {
        console.warn(
          'CSRF 검증 실패로 로그아웃이 거부되었습니다. 쿠키/도메인/HTTPS/CORS 설정을 확인하세요.',
        );
      }
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      clearTokens();
      setShowLogoutModal(true);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        <MyPageHeader />

        {/* authReady 전에는 '없음' 같은 빈 상태를 렌더하지 않음 */}
        {!authReady ? (
          <div className="px-6 py-6">로딩 중...</div>
        ) : (
          !showLoginModal && (
            <div className="px-6 py-6">
              {/* 내 정보 카드 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-[#37352f]">
                    내 정보
                  </h2>
                </div>

                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#37352f]">
                      이메일
                    </label>
                    <p className="text-sm text-[#73726e]">
                      {userInfo.email || '이메일 없음'}
                    </p>
                  </div>
                </div>

                <button
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(true)}
                >
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-sm font-medium text-[#37352f]">
                      이름
                    </label>
                    <p className="text-sm text-[#73726e]">
                      {userInfo.name || '이름 없음'}
                    </p>
                  </div>
                  <img
                    src="/static/icons/arrow_right_icon.svg"
                    alt="arrow"
                    className="w-5 h-5 opacity-60"
                  />
                </button>
              </div>

              {/* 예약 내역 진입 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <MyPageBlock name="예약 내역" linkPath="/my/reservation-list" />
              </div>

              {/* 내 커뮤니티 관리 섹션 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-[#37352f]">
                    내 커뮤니티 관리
                  </h2>
                </div>
                <MyPageBlock name="내가 작성한 글" linkPath="/my/posts" />
                <MyPageBlock name="내가 작성한 댓글" linkPath="/my/comments" />
              </div>

              {/* 개인정보 보호 섹션 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-[#37352f]">
                    개인정보 보호
                  </h2>
                </div>

                <MyPageBlock
                  name="비밀번호 재설정"
                  linkPath="/login/reset-password-step1"
                />
                <MyPageBlock
                  name="회원 탈퇴"
                  linkPath="/my/cancel-account-step1"
                />
                <button
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-t border-gray-100"
                  onClick={handleLogout}
                >
                  <span className="text-base font-medium text-[#37352f]">
                    로그아웃
                  </span>
                  <img
                    src="/static/icons/arrow_right_icon.svg"
                    alt="arrow"
                    className="w-5 h-5 opacity-60"
                  />
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* 이름 변경 모달 */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleUsernameChange}
        text={submitting ? '수정 중…' : '수정'}
      >
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#37352f]">이름 변경</h3>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#37352f]">
              이름
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 bg-white rounded-lg border border-[#e9e9e7] text-sm placeholder:text-[#9b9998] focus:outline-none focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/10 transition-all duration-200"
              placeholder={userInfo.name || 'USER NAME'}
            />
            <p className="text-xs text-[#9b9998]">
              기존 이름과 다른 이름으로 변경해주세요.
            </p>
            {submitting && (
              <p className="text-xs text-[#73726e]">이름 변경 중…</p>
            )}
          </div>
        </div>
      </Modal>

      {/* 로그인 요구 모달: authReady 이후에만 표시 */}
      <LoginRequiredModal
        isOpen={authReady && showLoginModal}
        onConfirm={handleLoginConfirm}
      />

      {/* 로그아웃 완료 모달 */}
      <div
        className={`fixed inset-0 bg-black/50 flex justify-center items-center z-[9999] ${
          showLogoutModal ? '' : 'hidden'
        }`}
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={() => setShowLogoutModal(false)}
      >
        <div
          className="bg-white rounded-2xl w-[90%] max-w-md mx-4 shadow-2xl border border-gray-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-y-auto max-h-[70vh] p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">알림</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                로그아웃이 완료되었습니다.
              </p>
            </div>
          </div>

          <div className="flex border-t border-gray-100">
            <button
              onClick={handleLogoutConfirm}
              className="w-full py-4 bg-[#788cff] text-white text-sm font-medium hover:bg-[#6a7dff] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>

      <PrivacyPolicyFooter />
      <BottomSafeSpacer height={64} />
      <FooterNav />
    </div>
  );
}
