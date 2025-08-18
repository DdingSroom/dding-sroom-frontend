'use client';

import { useRouter } from 'next/navigation';

const CommunityHeader = ({ title = '커뮤니티' }) => {
  const router = useRouter();

  return (
    <header className="flex items-center px-6 py-4 bg-white border-b border-gray-100">
      <button
        onClick={() => router.back()}
        className="p-2 hover:bg-gray-50 rounded-lg transition-colors mr-2"
      >
        <img
          src="/static/icons/arrow_left_icon.svg"
          alt="뒤로가기"
          className="w-6 h-6"
        />
      </button>
      <h1 className="flex-1 text-center text-lg font-bold text-[#37352f] mr-10">
        {title}
      </h1>
    </header>
  );
};

export default CommunityHeader;
