'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TimeComponent from '@components/common/TimeComponent';
import Modal from '@components/common/Modal';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import axiosInstance from '../../libs/api/instance';

const toKSTISOString = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 19);
};

const formatTime = (date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const TomorrowReservationComponent = ({ index, roomId }) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reservedTimes, setReservedTimes] = useState([]);

  const router = useRouter();
  const { userId, accessToken } = useTokenStore();
  const { fetchLatestReservation } = useReservationStore();

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 1);
  baseDate.setHours(0, 0, 0, 0);

  const formattedTomorrow = baseDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });

  const getTimeSlots = () => {
    const slots = [];
    const base = new Date(baseDate);
    const end = new Date(baseDate);
    end.setHours(23, 50, 0, 0);
    while (base <= end) {
      slots.push(new Date(base));
      base.setMinutes(base.getMinutes() + 10);
    }
    const lastDisplaySlot = new Date(baseDate);
    lastDisplaySlot.setHours(23, 59, 0, 0);
    slots.push(lastDisplaySlot);
    return slots;
  };

  const getStatus = (time) => {
    const timeDate = new Date(time);
    const now = new Date();
    if (time.endsWith('23:59:00')) return 'display-only';
    if (reservedTimes.includes(time)) return 'reserved';
    if (timeDate < baseDate) return 'past';
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

  const handleSubmitReservation = async () => {
    if (!startTime || !endTime) {
      alert('예약 시간과 퇴실 시간을 모두 선택해주세요.');
      return;
    }

    const reservationStart = new Date(startTime);
    const reservationEnd = new Date(endTime);
    const duration = (reservationEnd - reservationStart) / (1000 * 60);

    if (duration !== 60 && duration !== 120) {
      alert('예약은 1시간 또는 2시간 단위로만 가능합니다.');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/reservations', {
        userId,
        roomId,
        reservationStartTime: toKSTISOString(reservationStart),
        reservationEndTime: toKSTISOString(reservationEnd),
      });

      alert(res.data.message || '예약이 완료되었습니다.');
      await fetchLatestReservation();

      const updated = [];
      const temp = new Date(reservationStart);
      while (temp < reservationEnd) {
        updated.push(temp.toISOString());
        temp.setMinutes(temp.getMinutes() + 10);
      }
      setReservedTimes((prev) => [...prev, ...updated]);

      setOpen(false);
      setStartTime('');
      setEndTime('');
    } catch (err) {
      console.error('예약 실패:', err.response?.data || err.message);
      alert(err.response?.data?.message || '예약에 실패했습니다.');
    }
  };

  const renderLine = (slots) => (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-row min-w-[720px] sm:min-w-0">
        {slots.map((time) => {
          const hour = time.getHours();
          const isFirstOfHour = time.getMinutes() === 0;
          const timeStr = time.toISOString();

          return (
            <div
              key={timeStr}
              className="flex flex-col items-center justify-start"
              style={{ width: '10px' }}
            >
              <span
                className="text-[10px] text-[#4b4b4b] leading-none"
                style={{
                  visibility: isFirstOfHour ? 'visible' : 'hidden',
                  height: '16px',
                  width: '16px',
                  display: 'inline-block',
                  textAlign: 'center',
                }}
              >
                {hour}
              </span>
              <TimeComponent status={getStatus(timeStr)} />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTimeBlocks = () => {
    const timeSlots = getTimeSlots();
    const morningSlots = timeSlots.filter((time) => time.getHours() < 12);
    const afternoonSlots = timeSlots.filter((time) => time.getHours() >= 12);

    return (
      <div className="flex flex-col w-full gap-2">
        {morningSlots.length > 0 && (
          <div>
            <div className="text-xs font-semibold mb-1">오전</div>
            {renderLine(morningSlots)}
          </div>
        )}
        {afternoonSlots.length > 0 && (
          <div>
            <div className="text-xs font-semibold mb-1">오후</div>
            {renderLine(afternoonSlots)}
          </div>
        )}
      </div>
    );
  };

  const renderStartTimeOptions = () => {
    const slots = getTimeSlots();

    return slots
      .filter((time) => {
        const iso = time.toISOString();
        return !reservedTimes.includes(iso);
      })
      .map((time) => (
        <option key={time.toISOString()} value={time.toISOString()}>
          {formatTime(time)}
        </option>
      ));
  };

  const renderEndTimeOptions = () => {
    if (!startTime) return [];
    const start = new Date(startTime);
    const oneHourLater = new Date(start);
    const twoHourLater = new Date(start);
    oneHourLater.setMinutes(oneHourLater.getMinutes() + 60);
    twoHourLater.setMinutes(twoHourLater.getMinutes() + 120);

    return [oneHourLater, twoHourLater].map((time) => (
      <option key={time.toISOString()} value={time.toISOString()}>
        {formatTime(time)}
      </option>
    ));
  };

  return (
    <div className="flex flex-col justify-between p-4 sm:p-7 bg-white rounded-2xl w-full max-w-[100%] mt-[1rem]">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 sm:gap-5">
          <div className="text-xl sm:text-2xl">스터디룸 {index}</div>
          <div className="text-[#9999A3] text-sm">5인실</div>
        </div>
        <button
          className="bg-[#3250F5] text-white text-lg rounded-3xl px-4 py-2 w-[100px]"
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
            <div className="flex justify-center items-center text-sm text-gray-500">
              {formattedTomorrow}
            </div>

            <div className="flex flex-col mt-4 mb-4">{renderTimeBlocks()}</div>

            <div className="mb-3">
              <div>예약 시간</div>
              <select
                className="border rounded-md p-2 w-full"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                <option value="" disabled>
                  시간 선택
                </option>
                {renderStartTimeOptions()}
              </select>
            </div>

            <div>
              <div>퇴실 시간</div>
              <select
                className="border rounded-md p-2 w-full"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={!startTime}
              >
                <option value="" disabled>
                  {startTime === '' ? '예약 시간 먼저 선택' : '시간 선택'}
                </option>
                {renderEndTimeOptions()}
              </select>
            </div>
          </div>
        </Modal>
      </div>

      <div className="mt-4 flex flex-col w-full">{renderTimeBlocks()}</div>
      <div className="bg-[#9999A3] h-0.5 w-full mt-3" />
    </div>
  );
};

export default TomorrowReservationComponent;
