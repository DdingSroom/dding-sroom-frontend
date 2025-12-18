'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Banner = () => {
  return (
    <div className="flex justify-between items-center p-8 bg-white rounded-2xl w-full max-w-[95%] min-h-[240px] shadow-sm border border-gray-50">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <div className="text-[#73726e] text-sm font-medium">
            오늘의 혼잡도
          </div>
          <div className="text-4xl md:text-5xl text-[#788DFF] font-bold">
            여유로움
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[#37352f] text-sm leading-relaxed">
            로그인하여 자리를 예약해보세요!
          </div>

          <Link href="/login" className="inline-block">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#5B72EE] text-white text-sm font-medium rounded-lg hover:bg-[#4f63d1] transition-colors shadow-sm">
              로그인
              <span aria-hidden="true" className="w-4 h-4">
                <Image
                  src="/static/icons/arrow_right_icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="filter brightness-0 invert"
                />
              </span>
            </button>
          </Link>
        </div>
      </div>

      <Image
        src="/static/icons/maru_icon.png"
        alt="maru"
        width={128}
        height={128}
        priority
        sizes="128px"
        className="w-32 h-32 object-contain"
      />
    </div>
  );
};

export default Banner;
