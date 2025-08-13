'use client';

import { useState } from 'react';
import InfoModal from './InfoModal';

const FooterNav = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
          onClick={() => setIsInfoModalOpen(true)}
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
          onClick={() => setIsInfoModalOpen(true)}
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
            건의하기
          </span>
        </button>
      </footer>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </>
  );
};

export default FooterNav;
