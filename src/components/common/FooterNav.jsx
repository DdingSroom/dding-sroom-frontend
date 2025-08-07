const FooterNav = () => {
  return (
    <footer className="flex justify-around items-center p-4 bg-white border-t border-gray-100">
      <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <img
          src="/static/icons/reservation_icon.png"
          alt="reservation"
          className="w-6 h-6"
        />
        <span className="text-xs text-[#73726e] font-medium">예약하기</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <img
          src="/static/icons/community_icon.png"
          alt="community"
          className="w-6 h-6"
        />
        <span className="text-xs text-[#73726e] font-medium">커뮤니티</span>
      </button>
      <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <img
          src="/static/icons/proposal_icon.png"
          alt="proposal"
          className="w-6 h-6"
        />
        <span className="text-xs text-[#73726e] font-medium">건의하기</span>
      </button>
    </footer>
  );
};

export default FooterNav;
