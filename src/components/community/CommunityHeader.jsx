'use client';

import { useRouter } from 'next/navigation';

const CommunityHeader = ({ title = '커뮤니티' }) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/community');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 relative">
      <div className="mx-auto max-w-4xl px-6 py-4 pt-12 pb-8 flex items-center">
        <button
          onClick={handleBack}
          aria-label="뒤로가기"
          className="p-2 -ml-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <img
            src="/static/icons/arrow_left_icon.svg"
            alt="뒤로가기"
            className="w-5 h-5"
          />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold text-gray-900">
          {title}
        </div>
      </div>
    </header>
  );
};

export default CommunityHeader;
