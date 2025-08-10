'use client';

import React, { useEffect, useState } from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import MyPageBlock from '@components/common/MyPageBlock';
import Modal from '@components/common/Modal';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import { jwtDecode } from 'jwt-decode';
import useTokenStore from '../../../stores/useTokenStore';
import axiosInstance from '../../../libs/api/instance';

export default function AccountInfo() {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { accessToken, userId } = useTokenStore();

  const getDecodedUserInfo = () => {
    try {
      const decoded = jwtDecode(accessToken);
      const { email, username } = decoded;
      return { name: username, email };
    } catch {
      return { name: '', email: '' };
    }
  };

  const [userInfo, setUserInfo] = useState(getDecodedUserInfo);

  useEffect(() => {
    if (!accessToken) {
      setShowLoginModal(true);
    }
  }, [accessToken]);

  const handleLoginConfirm = () => {
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const handleUsernameChange = async () => {
    try {
      if (!newName.trim()) {
        alert('이름을 입력해주세요.');
        return;
      }

      const response = await axiosInstance.put('/user/change-username', {
        userId,
        newUsername: newName,
      });

      if (response.status === 200) {
        alert('이름 변경 완료되었습니다.');
        setUserInfo((prev) => ({ ...prev, name: newName }));
        setOpen(false);
        setNewName('');
      }
    } catch (error) {
      console.error('이름 변경 실패:', error);
      alert('이름 변경에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MyPageHeader />

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#37352f]">내 정보</h2>
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
              <label className="text-sm font-medium text-[#37352f]">이름</label>
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <MyPageBlock name="예약 내역" linkPath="/my/reservation-list" />
        </div>

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
          <MyPageBlock name="회원 탈퇴" linkPath="/my/cancel-account-step1" />
        </div>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleUsernameChange}
        text="수정"
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
              className="w-full px-4 py-3 bg-white rounded-lg border border-[#e9e9e7] text-sm placeholder:text-[#9b9998] focus:outline-none focus:border-[#788cff] focus:ring-2 focus:ring-[#788cff]/10 transition-all duration-200"
              placeholder={userInfo.name || 'USER NAME'}
            />
          </div>
        </div>
      </Modal>
      
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onConfirm={handleLoginConfirm} 
      />
    </div>
  );
}
