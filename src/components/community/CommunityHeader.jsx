'use client';

import { useRouter } from 'next/navigation';

const CommunityHeader = ({ title = '커뮤니티' }) => {
  const router = useRouter();

  return (
    <header className="flex items-center px-4 md:px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
      <button
        onClick={() => router.back()}
        className="p-2 hover:bg-[#788cff]/10 rounded-xl transition-all duration-200 mr-3 group touch-manipulation"
      >
        <img
          src="/static/icons/arrow_left_icon.svg"
          alt="뒤로가기"
          className="w-6 h-6 group-hover:scale-105 transition-transform"
        />
      </button>
      <div className="flex-1 text-center mr-8 md:mr-10">
        <h1 className="text-lg md:text-xl font-bold text-[#37352f] mb-1">
          {title}
        </h1>
        {title === '커뮤니티' && (
          <p className="text-xs text-[#9b9998] font-medium hidden sm:block">
            띵스룸 사용자들과 소통해보세요!
          </p>
        )}
      </div>
    </header>
  );
};

export default CommunityHeader;
