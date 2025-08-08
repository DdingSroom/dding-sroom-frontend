'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InfoModal from './InfoModal';

const Header = () => {
  const router = useRouter();
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleClickProfile = () => {
    router.push('/my/account-info');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 pt-12 bg-transparent">
      <img src="/static/icons/logo.svg" alt="logo" className="h-12" />
      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={() => setIsInfoModalOpen(true)}
        >
          <img
            src="/static/icons/bell_icon.png"
            alt="bell"
            className="h-6 w-6"
          />
        </button>
        <button
          className="w-9 h-9 bg-[#788DFF] rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:bg-[#6a7dff] transition-colors shadow-sm"
          onClick={handleClickProfile}
        >
          <img
            src="/static/icons/person_icon.png"
            alt="person_icon"
            className="w-6 h-6 object-contain"
          />
        </button>
      </div>

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </header>
  );
};

export default Header;
