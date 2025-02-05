'use client';

import React, { useState } from 'react';
import MyPageHeader from '@components/common/MyPageHeader';
import Modal from '@components/common/Modal';

export default function CancelAccountStep1() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="w-full">
        <MyPageHeader />
        <div className="p-6 bg-[#FFFF] mt-6">
          <label className="mb-2">계정 비밀번호</label>
          <input
            type="text"
            className="border rounded-md p-2 w-full"
            placeholder="비밀번호를 입력해주세요."
          />
          <div className="mt-6">
            <p className="text-[#6E6E6E] text-sm">
              * 탈퇴 후 개인정보, 예약 등의 데이터가 삭제되며, 복구할 수
              없습니다.
            </p>
            <p className="text-[#6E6E6E] text-sm">
              * 작성한 게시물은 삭제되지 않으며, (알수없음)으로 닉네임이
              표시됩니다.
            </p>
            <p className="text-[#6E6E6E] text-sm">
              * 자세한 내용은 개인정보처리방침을 확인해주세요.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center text-center p-6 bg-[#FFFF]">
          <button
            className="text-[#C20000] text-xl"
            onClick={() => setOpen(true)}
          >
            회원탈퇴
          </button>
          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            text="탈퇴하기"
            color="red"
          >
            <div className="p-4 flex flex-col h-full justify-center ">
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
      </div>
    </>
  );
}
