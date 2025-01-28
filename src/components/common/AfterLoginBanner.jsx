import { useState } from 'react';
import CancellationModal from '@components/common/CancellationModal';

const AfterLoginBanner = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-[5px] w-full max-w-[95%]">
      <div className="flex flex-col bg-white rounded-2xl h-auto min-h-[15rem] w-1/2 p-10 gap-2.5">
        <div className="font-bold text-3xl">내가 예약한 방</div>
        <div className="text-2xl text-[#9999A2]">N 번방</div>
        <div className="flex justify-between">
          <div className="text-xl ">13:00</div>
          <button
            className="text-xl text-[#788DFF] "
            onClick={() => setOpen(true)}
          >
            취소
          </button>
          <CancellationModal isOpen={open} onClose={() => setOpen(false)}>
            <div className="p-4 flex flex-col h-full justify-center">
              <div className="font-semibold text-2xl">예약을 취소할까요?</div>
              <div className="flex gap-[10px] bg-[#788DFF] bg-opacity-10 p-4 mt-10">
                <img
                  src="/static/icons/studyroom_image.png"
                  alt="studyroom"
                  className="w-1/4 h-auto items-center"
                />
                <div className="flex flex-col justify-center ">
                  <div>스터디룸2</div>
                  <div>8월 31일</div>
                  <div>13:00 ~ 15:00</div>
                </div>
              </div>
            </div>
          </CancellationModal>
        </div>
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
