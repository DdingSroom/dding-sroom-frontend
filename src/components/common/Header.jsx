'use client';

import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  const handleClickProfile = () => {
    router.push('/my/account-info');
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 pt-12 bg-white">
      <img src="/static/icons/logo.svg" alt="logo" className="h-10" />
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <img src="/static/icons/bell_icon.png" alt="bell" className="h-6 w-6" />
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
    </header>
  );
};

export default Header;
