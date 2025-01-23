const AfterLoginBanner = () => {
  return (
    <div className="flex gap-[5px] w-full max-w-[95%]">
      <div className="flex flex-col bg-white rounded-2xl h-auto min-h-[15rem] w-1/2 p-10 gap-2.5">
        <div className="font-bold text-3xl">내가 예약한 방</div>
        <div className="text-2xl text-[#9999A2]">N 번방</div>
      </div>
      <div className="flex bg-white rounded-2xl h-auto min-h-[15rem] w-1/2 p-10 flex-col justify-between">
        <div className="flex flex-col gap-2.5">
          <div className="text-xl">오늘의 혼잡도</div>
          <div className="text-5xl text-[#788DFF] font-semibold">여유로움</div>
        </div>
        <img
          src="/static/icons/maru_icon.png"
          alt="maru"
          className="w-1/2 h-3/4 self-end"
        />
      </div>
    </div>
  );
};

export default AfterLoginBanner;
