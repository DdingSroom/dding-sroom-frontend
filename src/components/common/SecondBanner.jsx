'use client';

import { useRouter } from 'next/navigation';
import useTokenStore from '../../stores/useTokenStore';
import React, { useState } from 'react';
import LoginRequiredModal from './LoginRequiredModal';

const SecondBanner = () => {
  const router = useRouter();
  const { accessToken } = useTokenStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleReserveClick = () => {
    if (!accessToken) {
      setShowLoginModal(true);
      return;
    }
    router.push('/');
  };

  const handleModalConfirm = () => {
    setShowLoginModal(false);
    router.push('/login');
  };

  return (
    <div className="flex flex-col justify-between p-7 bg-[#788DFF] rounded-2xl w-full max-w-[95%] h-auto min-h-[10rem] mt-[1rem]">
      <div className="text-lg">이건 어떨까요?</div>
      <div className="text-md text-white">16시부터 혼잡해요</div>
      <div className="flex justify-between">
        <div className="text-sm text-white">
          자리를 미리 예약해보는건 어떨까요 ?
        </div>
        <button
          onClick={handleReserveClick}
          className="bg-white text-[#788DFF] rounded px-4 py-2 hover:bg-gray-50 hover:text-[#6a7dff] transition-colors duration-200 text-sm font-medium"
        >
          예약하기
        </button>
      </div>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default SecondBanner;
