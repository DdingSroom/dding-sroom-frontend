const SecondBanner = () => {
    return (
      <div className="flex flex-col justify-between p-7 bg-[#788DFF] rounded-2xl w-full max-w-[95%] h-auto min-h-[10rem] mt-[1rem]">
        <div className="text-lg">이건 어떨까요?</div>
        <div className="text-md text-white">16시부터 혼잡해요</div>
        <div className="flex justify-between">
          <div className="text-sm text-white">자리를 미리 예약해보는건 어떨까요 ?</div>
          <button className="bg-white text-[#788DFF] rounded px-4 py-2">예약하기</button>
        </div>
      </div>
    );
  };
  
  export default SecondBanner;