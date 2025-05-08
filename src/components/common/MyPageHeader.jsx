import Link from 'next/link';

const MyPageHeader = () => {
  return (
    <header className="flex items-center p-4 pt-8 pb-12 bg-[#FFFF] relative">
      <Link href="/my/mypage">
        <img
          src="/static/icons/arrow_left_icon.svg"
          alt="arrow"
          className="h-8"
        />
      </Link>
      <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl">
        마이 페이지
      </div>
    </header>
  );
};

export default MyPageHeader;
