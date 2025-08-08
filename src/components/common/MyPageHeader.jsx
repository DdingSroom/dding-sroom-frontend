'use client';

import { useRouter } from 'next/navigation';

const MyPageHeader = () => {
  const router = useRouter();

  return (
    <header className="flex items-center px-6 py-4 pt-12 pb-8 bg-white border-b border-gray-100 relative">
      <button
        onClick={() => router.back()}
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
