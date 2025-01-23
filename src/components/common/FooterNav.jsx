const FooterNav = () => {
    return (
      <footer className="flex justify-between items-center p-4 bg-white h-full">
        <div className="flex flex-col items-center">
          <img src="/static/icons/reservation_icon.png" alt="reservation" className="w-1/2 h-auto" />
          <div>예약하기</div>
        </div>
        <div className="flex flex-col items-center">
          <img src="/static/icons/community_icon.png" alt="community" className="w-1/2 h-auto" />
          <div>커뮤니티</div>
        </div>
        <div className="flex flex-col items-center">
          <img src="/static/icons/proposal_icon.png" alt="proposal" className="w-1/2 h-auto" />
          <div>건의하기</div>
        </div>
      </footer>
    );
  };
  
  export default FooterNav;
  