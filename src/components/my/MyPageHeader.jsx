'use client';

import { useRouter, usePathname } from 'next/navigation';

const MyPageHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (pathname === '/my/account-info') {
      router.push('/');
    } else {
      router.back();
    }
  };

  return (
    <header className="flex items-center px-6 py-4 pt-12 pb-8 bg-white border-b border-gray-100 relative">
      <button
        onClick={handleBack}
        className="p-2 hover:bg-gray-50 rounded-lg transition-colors -ml-2"
      >
        <img
          src="/static/icons/arrow_left_icon.svg"
          alt="Back"
          className="w-5 h-5"
        />
      </button>

      <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-[#37352f]">
        마이페이지
      </div>
    </header>
  );
};

export default MyPageHeader;
