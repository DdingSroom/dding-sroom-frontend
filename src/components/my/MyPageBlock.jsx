'use client';

import Link from 'next/link';

const MyPageBlock = ({ name, value, linkPath }) => {
  return (
    <Link href={linkPath}>
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex flex-col gap-1">
          <span className="text-base font-medium text-[#37352f]">{name}</span>
          {value && <span className="text-sm text-[#73726e]">{value}</span>}
        </div>
        <img
          src="/static/icons/arrow_right_icon.svg"
          alt="arrow"
          className="w-5 h-5 opacity-60"
        />
      </div>
    </Link>
  );
};

export default MyPageBlock;
