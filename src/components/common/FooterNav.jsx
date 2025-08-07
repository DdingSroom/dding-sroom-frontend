'use client';

import { useState } from 'react';
import InfoModal from './InfoModal';

const FooterNav = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <>
      <footer className="flex justify-around items-center p-4 bg-white border-t border-gray-100">
        <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
          <img
            src="/static/icons/reservation_icon.png"
            alt="reservation"
            className="w-6 h-6 transition-all duration-200 group-hover:brightness-0 group-hover:invert group-hover:sepia group-hover:saturate-[500%] group-hover:hue-rotate-[210deg]"
          />
          <span className="text-xs text-[#73726e] font-medium group-hover:text-[#788cff] transition-colors">
            예약하기
          </span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
          onClick={() => setIsInfoModalOpen(true)}
        >
          <img
            src="/static/icons/community_icon.png"
            alt="community"
            className="w-6 h-6 transition-all duration-200 group-hover:brightness-0 group-hover:invert group-hover:sepia group-hover:saturate-[500%] group-hover:hue-rotate-[210deg]"
          />
          <span className="text-xs text-[#73726e] font-medium group-hover:text-[#788cff] transition-colors">
            커뮤니티
          </span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
          onClick={() => setIsInfoModalOpen(true)}
        >
          <img
            src="/static/icons/proposal_icon.png"
            alt="proposal"
            className="w-6 h-6 transition-all duration-200 group-hover:brightness-0 group-hover:invert group-hover:sepia group-hover:saturate-[500%] group-hover:hue-rotate-[210deg]"
          />
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
