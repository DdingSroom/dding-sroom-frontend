'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import LoginRequiredModal from '@components/common/LoginRequiredModal';

import useTokenStore from '@stores/useTokenStore';

import { Reservation, Community, Proposal } from 'public/static/icons';

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

  const navItems = [
    {
      Icon: Reservation,
      label: '예약하기',
      onClick: () => router.push('/'),
    },
    {
      Icon: Community,
      label: '커뮤니티',
      onClick: () => router.push('/community'),
    },
    { Icon: Proposal, label: '건의/신고', onClick: handleSuggestClick },
  ];

  return (
    <>
      <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] flex justify-around items-center p-4 bg-white border-t border-gray-100 z-50">
        {navItems.map(({ Icon, label, onClick }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
            onClick={onClick}
          >
            <div className="relative w-6 h-6">
              <Icon
                className="absolute inset-0 text-[#73726e] group-hover:text-[#788cff] transition-colors"
                alt={label}
              />
            </div>
            <span className="text-xs text-[#73726e] font-medium group-hover:text-[#788cff] transition-colors">
              {label}
            </span>
          </button>
        ))}
      </footer>

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onConfirm={handleLoginConfirm}
      />
    </>
  );
};

export default FooterNav;
