'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useTokenStore from '../../stores/useTokenStore';
import LoginRequiredModal from './LoginRequiredModal';

const FooterNav = () => {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { accessToken } = useTokenStore();

  const handleSuggestClick = () => {
    if (!accessToken) {
      setIsLoginModalOpen(true);
      return;
    }
    router.push('/suggest');
  };

  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    router.push('/login?redirect=' + encodeURIComponent('/suggest'));
  };

  return (
    <>
      <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] flex justify-around items-center p-4 bg-white border-t border-gray-100 z-50">
        <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
          <div className="relative w-6 h-6">
            <img
              src="/static/icons/reservation_icon.svg"
              alt="reservation"
              className="w-6 h-6 absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
            />
            <img
              src="/static/icons/reservation_2_icon.svg"
              alt="reservation hover"
              className="w-6 h-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
          <span className="text-xs text-[#73726e] font-medium group-hover:text-[#788cff] transition-colors">
            예약하기
          </span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
          onClick={() => router.push('/community')}
        >
          <div className="relative w-6 h-6">
            <img
              src="/static/icons/community_icon.svg"
              alt="community"
              className="w-6 h-6 absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
            />
            <img
              src="/static/icons/community_2_icon.svg"
              alt="community hover"
              className="w-6 h-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
          <span className="text-xs text-[#73726e] font-medium group-hover:text-[#788cff] transition-colors">
            커뮤니티
          </span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
          onClick={handleSuggestClick}
        >
          <div className="relative w-6 h-6">
            <img
              src="/static/icons/proposal_icon.svg"
              alt="proposal"
              className="w-6 h-6 absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
            />
            <img
              src="/static/icons/proposal_2_icon.svg"
              alt="proposal hover"
              className="w-6 h-6 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
          </div>
          <span className="text-xs text-[#73726e] font-medium group-hover:text-[#788cff] transition-colors">
            건의/신고
          </span>
        </button>
      </footer>

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onConfirm={handleLoginConfirm}
      />
    </>
  );
};

export default FooterNav;
