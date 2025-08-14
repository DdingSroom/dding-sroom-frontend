'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const SecondBanner = () => {
  const router = useRouter();

  const handleGuideClick = () => {
    router.push('/service-manual');
  };

  return (
    <div
      className="
        text-white
        w-full max-w-[95%]
        rounded-2xl
        bg-[#788DFF]
        mt-4
        /* spacing */
        p-5 sm:p-6 md:p-7
        /* layout */
        flex flex-col gap-3 sm:gap-4
        min-h-[9.5rem] sm:min-h-[10rem]
      "
    >
      {/* 헤더 텍스트 */}
      <div className="text-base sm:text-lg md:text-xl font-semibold">
        띵스룸이 처음이신가요?
      </div>

      {/* 설명 텍스트 */}
      <div className="text-sm sm:text-base opacity-95 leading-relaxed">
        이용 가이드를 참고하여 스터디룸 이용을 시작해보세요!
      </div>

      {/* 하단 영역: 모바일=세로 스택 / 데스크톱=가로 배치 */}
      <div
        className="
          mt-1 sm:mt-2
          flex flex-col sm:flex-row sm:items-end sm:justify-between
          gap-3 sm:gap-4
        "
      >
        <div className="text-xs sm:text-sm opacity-95">
          회원가입부터 예약까지 차근차근 안내해드려요.
        </div>

        <button
          onClick={handleGuideClick}
          aria-label="이용가이드 페이지로 이동"
          className="
            w-full sm:w-auto
            text-sm font-medium
            rounded
            px-4 py-2
            bg-white text-[#788DFF]
            hover:bg-gray-50 hover:text-[#6a7dff]
            transition-colors duration-200
            shadow-sm
          "
        >
          이용가이드 보러 가기
        </button>
      </div>
    </div>
  );
};

export default SecondBanner;
