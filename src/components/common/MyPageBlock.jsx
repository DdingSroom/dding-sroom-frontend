import Link from 'next/link';
const MyPageBlock = ({ name }) => {
  return (
    <header className="flex items-center justify-between p-6 bg-[#FFFF]">
      <div className="">{name}</div>
      <Link href="/my/account-info">
        <img
          src="/static/icons/arrow_right_icon.svg"
          alt="arrow"
          className="h-8"
        />
      </Link>
    </header>
  );
};

export default MyPageBlock;
