'use client';

import React, { useEffect, useState } from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import MyPageBlock from '@components/common/MyPageBlock';
import Modal from '@components/common/Modal';
import { jwtDecode } from 'jwt-decode';
import useTokenStore from '../../../stores/useTokenStore'; // 토큰 상태 저장소

export default function AccountInfo() {
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  const { accessToken } = useTokenStore(); // Zustand에서 accessToken 가져오기

  useEffect(() => {
    if (!accessToken) {
      alert('로그인이 필요한 기능입니다.');
      window.location.href = '/';
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const { name, email } = decoded;
      setUserInfo({ name, email });
    } catch (error) {
      console.error('토큰 디코딩 실패:', error);
      alert('유효하지 않은 토큰입니다.');
      window.location.href = '/';
    }
  }, [accessToken]);

  return (
    <>
      <div className="w-full">
        <MyPageHeader />
        <div className="flex-col items-center justify-center p-6 bg-[#FFFF] mt-6">
          <p className="text-2xl">내 정보</p>
        </div>
        <div className="flex-col items-center justify-center p-6 bg-[#FFFF] mt-1">
          <p className="text-xl">이메일</p>
          <p className="text-[#6E6E6E]">{userInfo.email || '불러오는 중...'}</p>
        </div>
        <div className="flex-col items-center justify-center p-6 bg-[#FFFF]">
          <button className="text-xl" onClick={() => setOpen(true)}>
            이름
          </button>
          <br />
          <button className="text-[#6E6E6E]" onClick={() => setOpen(true)}>
            {userInfo.name || '불러오는 중...'}
          </button>
          <Modal isOpen={open} onClose={() => setOpen(false)} text="수정">
            <div className="p-4 flex flex-col h-full">
              <div className="font-semibold text-2xl text-center">
                이름 변경
              </div>
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
        </div>
        <div className="flex-col items-center justify-center p-6 bg-[#FFFF] mt-8 mb-1">
          <p className="text-2xl">개인 정보 보호</p>
        </div>
        <MyPageBlock
          name="비밀 번호 재설정"
          linkPath="/login/reset-password-step1"
        />
        <MyPageBlock name="회원 탈퇴" linkPath="/my/cancel-account-step1" />
      </div>
    </>
  );
}
