'use client';

import React, { useState } from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import MyPageBlock from '@components/common/MyPageBlock';
import Modal from '@components/common/Modal';

export default function AccountInfo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full">
        <MyPageHeader />
        <div className="flex-col items-center justify-center p-6 bg-[#FFFF] mt-6">
          <p className="text-2xl">내 정보</p>
        </div>
        <div className="flex-col items-center justify-center p-6 bg-[#FFFF] mt-1">
          <p className="text-xl">이메일</p>
          <p className="text-[#6E6E6E]">MJUstudy@mju.ac.kr</p>
        </div>
        <div className="flex-col items-center justify-center p-6 bg-[#FFFF]">
          <button className="text-xl" onClick={() => setOpen(true)}>
            이름
          </button>
          <br />
          <button className="text-[#6E6E6E]" onClick={() => setOpen(true)}>
            USER 01
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
                  placeholder="USER 01"
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
