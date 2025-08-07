'use client';

import Link from 'next/link';

const MyPageBlock = ({ name, value, linkPath }) => {
  return (
    <Link href={linkPath}>
      <div className="flex items-center justify-between p-6 bg-[#FFFF] border-b cursor-pointer">
        <div className="flex flex-col">
          <span className="text-xl">{name}</span>
          {value && <span className="text-[#6E6E6E]">{value}</span>}
        </div>
        <img
          src="/static/icons/arrow_right_icon.svg"
          alt="arrow"
          className="h-8"
        />
      </div>
    </Link>
  );
};

export default MyPageBlock;
