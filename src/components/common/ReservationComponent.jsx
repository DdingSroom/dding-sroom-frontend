'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TimeComponent from '@components/common/TimeComponent';
import Modal from '@components/common/Modal';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import axiosInstance from '../../libs/api/instance';

const ReservationComponent = ({ index, roomId }) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const router = useRouter();
  const { userId, accessToken } = useTokenStore();
  const { fetchLatestReservation } = useReservationStore();

  const now = new Date();
  const currentHour = now.getHours();
  const reservedHours = [13, 14, 15]; // 테스트용 예약 시간

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
    for (let i = 0; i < 5; i++) {
      options.push((currentHour + i) % 24);
    }
    return options;
  };

  const getEndTimeOptions = () => {
    if (startTime === null) return [];
    return [1, 2].map((offset) => (startTime + offset) % 24);
  };

  const handleSubmitReservation = async () => {
    if (startTime === null || endTime === null) {
      alert('예약 시간과 퇴실 시간을 모두 선택해주세요.');
      return;
    }

    const now = new Date();

    const reservationStart = new Date(now);
    if (startTime <= now.getHours()) {
      reservationStart.setDate(reservationStart.getDate() + 1);
    }
    reservationStart.setHours(startTime, 0, 0, 0);

    const reservationEnd = new Date(reservationStart);
    if (endTime <= startTime) {
      reservationEnd.setDate(reservationEnd.getDate() + 1);
    }
    reservationEnd.setHours(endTime, 0, 0, 0);

    const duration = (reservationEnd - reservationStart) / (1000 * 60 * 60);
    if (duration !== 1 && duration !== 2) {
      alert('예약은 1시간 또는 2시간 단위로만 가능합니다.');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/reservations', {
        userId,
        roomId,
        reservationStartTime: reservationStart.toISOString(),
        reservationEndTime: reservationEnd.toISOString(),
      });

      alert(res.data.message || '예약이 완료되었습니다.');

      await fetchLatestReservation();

      setOpen(false);
      setStartTime(null);
      setEndTime(null);
    } catch (err) {
      alert(err.response?.data?.message || '예약에 실패했습니다.');
    }
  };

  const renderTimeBlocks = () => {
    const hours = Array.from(
      { length: 24 - currentHour },
      (_, i) => currentHour + i,
    );
    return (
      <div className="flex flex-col items-start gap-1 mt-2">
        <div className="flex gap-[4px]">
          {hours.map((hour) => (
            <span
              key={`label-${hour}`}
              className="text-[10px] w-[20px] text-center text-[#333]"
            >
              {hour}
            </span>
          ))}
        </div>
        <div className="flex gap-[4px]">
          {hours.map((hour) => (
            <TimeComponent key={hour} status={getStatus(hour)} />
          ))}
        </div>
      </div>
    );
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

        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmitReservation}
          text="예약하기"
        >
          <div className="p-4 flex flex-col h-full">
            <div className="font-semibold text-2xl">스터디룸 {index}</div>
            <div className="flex justify-center items-center mb-4">
              예약 날짜 자동 설정
            </div>

            {renderTimeBlocks()}

            <div className="flex-grow mt-4 mb-3">
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
                value={endTime ?? ''}
                onChange={(e) => setEndTime(Number(e.target.value))}
                disabled={startTime === null}
              >
                <option value="" disabled>
                  {startTime === null ? '예약 시간 먼저 선택' : '시간 선택'}
                </option>
                {getEndTimeOptions().map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal>
      </div>

      {renderTimeBlocks()}

      <div className="bg-black h-0.5 w-full bg-[#9999A3] mt-2"></div>
    </div>
  );
};

export default ReservationComponent;
