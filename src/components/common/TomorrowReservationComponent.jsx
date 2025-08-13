'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TimeComponent from '@components/common/TimeComponent';
import Modal from '@components/common/Modal';
import LoginRequiredModal from '@components/common/LoginRequiredModal';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import axiosInstance from '../../libs/api/instance';

// KST(Asia/Seoul) 현재시각
const nowInKST = () =>
  new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

// 기준 날짜(baseDate)와 HH:MM로 KST Date 생성
const buildKSTDate = (baseDate, hhmm) => {
  const yyyyMmDd = baseDate.toISOString().slice(0, 10);
  return new Date(`${yyyyMmDd}T${hhmm}:00+09:00`);
};

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
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { userId, accessToken } = useTokenStore();
  const {
    fetchLatestReservation,
    fetchAllUserReservations,
    fetchAllReservedTimes,
    reservedTimeSlotsByRoom,
  } = useReservationStore();

  const reservedTimeSlots = reservedTimeSlotsByRoom?.[roomId] || [];
  const router = useRouter();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const formattedTomorrow = tomorrow.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    fetchAllReservedTimes();
    const interval = setInterval(fetchAllReservedTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  const getTimeSlots = () => {
    const slots = [];
    const base = new Date(tomorrow);
    const end = new Date(tomorrow);
    end.setHours(23, 50, 0, 0);
    while (base <= end) {
      slots.push(new Date(base));
      base.setMinutes(base.getMinutes() + 10);
    }
    slots.push(new Date(2025, 0, 2, 23, 59));
    return slots;
  };

  const getStatus = (time) => {
    if (time.endsWith('23:59:00')) return 'display-only';

    // 내일 예약에서는 모든 시간이 미래시간이므로 예약된 시간만 회색으로 표시
    const isReserved = reservedTimeSlots.includes(time);

    let status;
    if (isReserved) {
      status = 'reserved';
    } else {
      status = 'available';
    }

    const timeStr = new Date(time).toTimeString().slice(0, 5);
    console.debug(
      '[TomorrowReservationComponent] timeStr:',
      timeStr,
      'isReserved=',
      isReserved,
      'status=',
      status,
    );

    return status;
  };

  const handleOpenModal = () => {
    if (!accessToken) {
      setShowLoginModal(true);
      return;
    }
    setOpen(true);
  };

  const handleModalConfirm = () => {
    setShowLoginModal(false);
    router.push('/login');
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

  const renderStartTimeOptions = () => {
    const slots = getTimeSlots();
    return slots
      .filter((time) => !reservedTimeSlots.includes(time.toISOString()))
      .map((time) => (
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
          className="bg-[#3250F5] text-white text-lg rounded-3xl px-4 py-2 w-[100px] hover:bg-[#2a47e3] transition-colors duration-200 font-medium"
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
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-[#788DFF]"></div>
          <span>예약 가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-[#9999A3]"></div>
          <span>예약됨</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-[#000000]"></div>
          <span>지난 시간</span>
        </div>
      </div>
      <div className="bg-[#9999A3] h-0.5 w-full mt-3" />
      <LoginRequiredModal
        isOpen={showLoginModal}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default TomorrowReservationComponent;
