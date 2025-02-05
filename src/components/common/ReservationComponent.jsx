import { useState } from 'react';
import TimeComponent from '@components/common/TimeComponent';
import Modal from '@components/common/Modal';

const ReservationComponent = ({ index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col justify-between p-7 bg-white rounded-2xl w-full max-w-[100%] h-auto min-h-[10rem] mt-[1rem]">
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <div className="text-2xl">스터디룸 {index}</div>
          <div className="text-[#9999A3]">5인실</div>
        </div>
        <button
          className="bg-[#3250F5] text-lg text-white rounded-3xl p-2 w-[15%]"
          onClick={() => setOpen(true)}
        >
          예약
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} text="예약하기">
          <div className="p-4 flex flex-col h-full">
            <div className="font-semibold text-2xl">스터디룸 1</div>
            <div className="flex justify-center items-center">8월 1일</div>
            <div className="flex flex-nowrap justify-between mt-4 mb-4 ">
              {Array.from({ length: 24 }, (_, index) => (
                <TimeComponent key={index} />
              ))}
            </div>
            <div className="flex-grow">
              <div>예약 시간</div>
              <select className="border rounded-md p-2 focus:outline-none w-full">
                <option value="">10:00</option>
                <option value="">11:00</option>
                <option value="">12:00</option>
              </select>
            </div>
            <div className="flex-grow">
              <div>퇴실 시간</div>
              <select className="border rounded-md p-2 focus:outline-none w-full">
                <option value="">16:00</option>
                <option value="">17:00</option>
                <option value="">18:00</option>
              </select>
            </div>
          </div>
        </Modal>
      </div>
      <div className="flex flex-nowrap justify-between ">
        {Array.from({ length: 24 }, (_, index) => (
          <TimeComponent key={index} />
        ))}
      </div>
      <div className="bg-black h-0.5 w-full bg-[#9999A3]"></div>
    </div>
  );
};

export default ReservationComponent;
