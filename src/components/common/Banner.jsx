const Banner = () => {
  return (
    <div className="flex justify-between items-center p-7 bg-white rounded-2xl w-full max-w-[95%] h-auto min-h-[15rem]">
      <div className="flex flex-col gap-2.5 ">
        <div>
          <div>오늘의 혼잡도</div>
          <div className="text-5xl text-[#788DFF] ">여유로움</div>
        </div>
        <div>
          <div>로그인하여 자리를 예약해보세요!</div>
          <button className="flex ">
            로그인{' '}
            <img
              src="/static/icons/arrow_icon.png"
              alt="arrow"
              className="gap-[10px] "
            />
          </button>
        </div>
      </div>
      <img
        src="/static/icons/maru_icon.png"
        alt="maru"
        className="w-1/4 h-auto"
      />
    </div>
  );
};

export default Banner;
