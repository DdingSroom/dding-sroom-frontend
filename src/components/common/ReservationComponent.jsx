'use client';

import { useState, useEffect } from 'react';
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

const ReservationComponent = ({ index, roomId }) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { userId, accessToken } = useTokenStore();
  const {
    fetchLatestReservation,
    fetchAllUserReservations,
    fetchAllReservedTimes,
    reservedTimeSlotsByRoom,
  } = useReservationStore();

  const reservedTimeSlots = reservedTimeSlotsByRoom?.[roomId] || [];
  const router = useRouter();
  const now = new Date();

  useEffect(() => {
    fetchAllReservedTimes();
    const interval = setInterval(fetchAllReservedTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  const getTimeSlots = () => {
    const slots = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 50, 0, 0);
    while (base <= end) {
      slots.push(new Date(base));
      base.setMinutes(base.getMinutes() + 10);
    }
    slots.push(new Date(2025, 0, 1, 23, 59));
    return slots;
  };

  const getStatus = (time) => {
    const timeDate = new Date(time);
    if (time.endsWith('23:59:00')) return 'display-only';
    if (timeDate < now) return 'past';
    if (reservedTimeSlots.includes(time)) return 'reserved';
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
      await fetchAllUserReservations();
      await fetchAllReservedTimes();

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
          const status = getStatus(timeStr);

          return (
            <div
              key={timeStr}
              className="flex flex-col items-center"
              style={{ width: '10px' }}
            >
              <span
                className="text-[10px] text-[#4b4b4b]"
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
              <TimeComponent status={status} />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTimeBlocks = () => {
    const slots = getTimeSlots();
    const morning = slots.filter((t) => t.getHours() < 12);
    const afternoon = slots.filter((t) => t.getHours() >= 12);
    return (
      <div className="flex flex-col gap-2">
        {morning.length > 0 && (
          <div>
            <div className="text-xs font-semibold mb-1">오전</div>
            {renderLine(morning)}
          </div>
        )}
        {afternoon.length > 0 && (
          <div>
            <div className="text-xs font-semibold mb-1">오후</div>
            {renderLine(afternoon)}
          </div>
        )}
      </div>
    );
  };

  const renderStartTimeOptions = () => {
    const now = new Date();
    const rounded = new Date(now);
    rounded.setMinutes(Math.ceil(now.getMinutes() / 10) * 10);
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);

    const end = new Date();
    end.setHours(23, 50, 0, 0);

    const options = [];
    while (rounded <= end) {
      const iso = rounded.toISOString().slice(0, 19);
      const isReserved = reservedTimeSlots.some((t) => t.slice(0, 19) === iso);
      if (!isReserved) {
        options.push(new Date(rounded));
      }
      rounded.setMinutes(rounded.getMinutes() + 10);
    }

    return options.map((time) => (
      <option key={time.toISOString()} value={time.toISOString()}>
        {formatTime(time)}
      </option>
    ));
  };

  const renderEndTimeOptions = () => {
    if (!startTime) return [];
    const start = new Date(startTime);
    const end1 = new Date(start);
    const end2 = new Date(start);
    end1.setMinutes(end1.getMinutes() + 60);
    end2.setMinutes(end2.getMinutes() + 120);

    return [end1, end2].map((time) => (
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
              {new Date().toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
              })}
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

export default ReservationComponent;
