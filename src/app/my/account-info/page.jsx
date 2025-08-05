'use client';

import React, { useEffect, useState } from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import MyPageBlock from '@components/common/MyPageBlock';
import Modal from '@components/common/Modal';
import { jwtDecode } from 'jwt-decode';
import useTokenStore from '../../../stores/useTokenStore';

export default function AccountInfo() {
  const [open, setOpen] = useState(false);
  const { accessToken } = useTokenStore();

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
      alert('로그인이 필요한 기능입니다.');
      window.location.href = '/login';
    }
  }, [accessToken]);

  return (
    <div className="w-full">
      <MyPageHeader />

      <div className="flex-col items-center justify-center p-6 bg-[#FFFF] mt-6">
        <p className="text-2xl">내 정보</p>
      </div>

      <div className="flex-col items-center justify-center p-6 bg-[#FFFF] mt-1">
        <p className="text-xl">이메일</p>
        <p className="text-[#6E6E6E]">{userInfo.email || '이메일 없음'}</p>
      </div>

      <div
        className="flex items-center justify-between p-6 bg-[#FFFF] border-b border-t cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col">
          <p className="text-xl">이름</p>
          <p className="text-[#6E6E6E]">{userInfo.name || '이름 없음'}</p>
        </div>
        <img
          src="/static/icons/arrow_right_icon.svg"
          alt="arrow"
          className="h-8"
        />
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} text="수정">
        <div className="p-4 flex flex-col h-full">
          <div className="font-semibold text-2xl text-center">이름 변경</div>
          <div className="mt-20">
            <label className="mb-2">이름</label>
            <input
              type="text"
              className="border rounded-md p-2 w-full"
              placeholder={userInfo.name || 'USER NAME'}
            />
          </div>
        </div>
      </Modal>

      <MyPageBlock name="예약 내역" linkPath="/my/reservation-list" />

      <div className="flex-col items-center justify-center p-6 bg-[#FFFF] mt-8 mb-1">
        <p className="text-2xl">개인 정보 보호</p>
      </div>

      <MyPageBlock
        name="비밀 번호 재설정"
        linkPath="/login/reset-password-step1"
      />
      <MyPageBlock name="회원 탈퇴" linkPath="/my/cancel-account-step1" />
    </div>
  );
}
