'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TimeComponent from '@components/common/TimeComponent';
import Modal from '@components/common/Modal';
import useTokenStore from '../../stores/useTokenStore';

const ReservationComponent = ({ index }) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const router = useRouter();
  const { accessToken } = useTokenStore();

  const currentHour = new Date().getHours();
  const reservedHours = [13, 14, 15];

  const getStatus = (hour) => {
    if (reservedHours.includes(hour)) return 'reserved';
    if (hour < currentHour) return 'past';
    return 'available';
  };

  const handleOpenModal = () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    setOpen(true);
  };

  const getStartTimeOptions = () => {
    const options = [];
    for (let i = currentHour; i < 24; i++) {
      options.push(i);
    }
    return options;
  };

  const getEndTimeOptions = () => {
    if (startTime === null) return [];
    const options = [];
    for (let i = 1; i <= 2; i++) {
      const endHour = startTime + i;
      options.push(endHour);
    }
    return options;
  };

  return (
    <div className="flex flex-col justify-between p-7 bg-white rounded-2xl w-full max-w-[100%] h-auto min-h-[10rem] mt-[1rem]">
      <div className="flex justify-between items-center">
        <div className="flex gap-5">
          <div className="text-2xl">스터디룸 {index}</div>
          <div className="text-[#9999A3]">5인실</div>
        </div>
        <button
          className="bg-[#3250F5] text-lg text-white rounded-3xl p-2 w-[15%]"
          onClick={handleOpenModal}
        >
          예약
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} text="예약하기">
          <div className="p-4 flex flex-col h-full">
            <div className="font-semibold text-2xl">스터디룸 {index}</div>
            <div className="flex justify-center items-center">8월 1일</div>

            <div className="flex flex-nowrap justify-between mt-4 mb-4">
              {Array.from({ length: 24 }, (_, i) => (
                <TimeComponent key={i} status={getStatus(i)} />
              ))}
            </div>

            <div className="flex-grow mb-3">
              <div>예약 시간</div>
              <select
                className="border rounded-md p-2 focus:outline-none w-full"
                value={startTime ?? ''}
                onChange={(e) => setStartTime(Number(e.target.value))}
              >
                <option value="" disabled>
                  시간 선택
                </option>
                {getStartTimeOptions().map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-grow">
              <div>퇴실 시간</div>
              <select
                className="border rounded-md p-2 focus:outline-none w-full"
                disabled={startTime === null}
              >
                <option value="" disabled selected>
                  {startTime === null ? '예약 시간 선택 먼저' : '시간 선택'}
                </option>
                {getEndTimeOptions().map((hour) => (
                  <option key={hour} value={hour}>
                    {hour % 24}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      </div>

      <div className="flex flex-nowrap justify-between">
        {Array.from({ length: 24 }, (_, i) => (
          <TimeComponent key={i} status={getStatus(i)} />
        ))}
      </div>

      <div className="bg-black h-0.5 w-full bg-[#9999A3]"></div>
    </div>
  );
};

export default ReservationComponent;
