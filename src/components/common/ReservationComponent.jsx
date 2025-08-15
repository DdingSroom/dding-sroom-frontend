'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import axiosInstance from '../../libs/api/instance';
import TimeComponent from '@components/common/TimeComponent';
import Modal from '@components/common/Modal';
import LoginRequiredModal from '@components/common/LoginRequiredModal';

// KST(Asia/Seoul) 현재시각
const nowInKST = () =>
  new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

// 서버로 보낼 때 KST 로컬 시간을 ISO 형식(초까지)으로 전송
const toKSTISOString = (date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 19);
};

const formatTime = (date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

// 10분 슬롯 키 (밀리초 단위, 10분 경계에 맞춰 스냅)
const slotKey10m = (d) => {
  const t = new Date(d);
  t.setSeconds(0, 0);
  const m = t.getMinutes();
  t.setMinutes(m - (m % 10));
  return t.getTime();
};

const addMinutesISO = (iso, minutes) =>
  new Date(new Date(iso).getTime() + minutes * 60000).toISOString();

// 오늘(현지 PC 타임존 무관) KST 기준 00:00 Date
const todayKSTMidnight = () => {
  const n = nowInKST();
  const t = new Date(n);
  t.setHours(0, 0, 0, 0);
  return t;
};

const ReservationComponent = ({ index, roomId }) => {
  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { userId, accessToken } = useTokenStore();
  const {
    fetchLatestReservation,
    fetchAllUserReservations,
    fetchAllReservedTimes,
    reservedTimeSlotsByRoom,
  } = useReservationStore();

  const router = useRouter();

  // 예약된 10분 슬롯 키 집합 (roomId별)
  const reserved10mKeys = useMemo(() => {
    const reservedTimeSlots = reservedTimeSlotsByRoom?.[roomId] || [];
    const set = new Set();
    for (const iso of reservedTimeSlots) {
      set.add(slotKey10m(iso));
    }
    return set;
  }, [reservedTimeSlotsByRoom, roomId]);

  // KST 오늘 타임슬롯(10분 단위) + 표시 전용 23:59
  const timeSlots = useMemo(() => {
    const slots = [];
    const base = todayKSTMidnight();
    const end = new Date(base);
    end.setHours(23, 50, 0, 0);
    const walker = new Date(base);

    while (walker <= end) {
      slots.push(new Date(walker));
      walker.setMinutes(walker.getMinutes() + 10);
    }
    const disp = new Date(base);
    disp.setHours(23, 59, 0, 0);
    slots.push(disp);

    return slots;
  }, []);

  useEffect(() => {
    fetchAllReservedTimes();
    const interval = setInterval(fetchAllReservedTimes, 10000);
    return () => clearInterval(interval);
  }, [fetchAllReservedTimes]);

  // 특정 구간이 예약과 충돌하는지 검사 (start 포함, end 제외)
  const isRangeAvailable = (startISO, endISO) => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const walker = new Date(start);
    while (walker < end) {
      if (reserved10mKeys.has(slotKey10m(walker))) return false;
      walker.setMinutes(walker.getMinutes() + 10);
    }
    return true;
  };

  // 슬롯 색상 판정: past > reserved > available
  const getStatus = (timeISO) => {
    const t = new Date(timeISO);

    // 23:59(표시 전용)는 end 계산에서 10분 더하지 않음
    const isDisplayLast = t.getHours() === 23 && t.getMinutes() === 59;

    const slotEnd = isDisplayLast
      ? new Date(t) // 표시에만 쓰므로 end == start 취급
      : new Date(t.getTime() + 10 * 60 * 1000);

    const now = nowInKST();
    const isPast = slotEnd.getTime() <= now.getTime(); // end <= now 이면 과거

    if (!isDisplayLast && isPast) return 'past';
    if (reserved10mKeys.has(slotKey10m(t))) return 'reserved';
    return 'available';
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
    const duration =
      durationMinutes ?? (reservationEnd - reservationStart) / (1000 * 60);

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

      await Promise.all([
        fetchLatestReservation(),
        fetchAllUserReservations(),
        fetchAllReservedTimes(),
      ]);

      setOpen(false);
      setStartTime('');
      setEndTime('');
      setDurationMinutes(null);
    } catch (err) {
      console.error('예약 실패:', err.response?.data || err.message);
      alert(err.response?.data?.message || '예약에 실패했습니다.');
    }
  };

  // KST 현재 시각을 10분 단위로 올림(예: 14:03 → 14:10)
  const kstRoundedUpNow = () => {
    const n = nowInKST();
    const r = new Date(n);
    r.setSeconds(0, 0);
    const m = r.getMinutes();
    r.setMinutes(m % 10 === 0 ? m : m + (10 - (m % 10)));
    return r;
  };

  // 오늘 모달: 시작시간 옵션(미래+비예약만)
  const renderStartTimeOptions = () => {
    const rounded = kstRoundedUpNow();
    const end = todayKSTMidnight();
    end.setHours(23, 50, 0, 0);

    const options = [];
    const walker = new Date(rounded);
    while (walker <= end) {
      const k = slotKey10m(walker);
      if (!reserved10mKeys.has(k)) {
        options.push(new Date(walker));
      }
      walker.setMinutes(walker.getMinutes() + 10);
    }

    return options.map((time) => (
      <option key={time.toISOString()} value={time.toISOString()}>
        {formatTime(time)}
      </option>
    ));
  };

  // 오늘 모달: 종료시간 후보(1h/2h) 중 충돌 없는 것만
  const renderEndTimeOptions = () => {
    if (!startTime) return [];
    const start = new Date(startTime);
    const end1 = new Date(start.getTime() + 60 * 60000);
    const end2 = new Date(start.getTime() + 120 * 60000);

    const candidates = [end1, end2].filter((time) =>
      isRangeAvailable(start.toISOString(), time.toISOString()),
    );

    return candidates.map((time) => (
      <option key={time.toISOString()} value={time.toISOString()}>
        {formatTime(time)}
      </option>
    ));
  };

  const renderLine = (slots) => (
    <div className="w-full overflow-x-auto pb-3">
      <div className="flex flex-row min-w-[720px] sm:min-w-0">
        {slots.map((time) => {
          const hour = time.getHours();
          const isFirstOfHour = time.getMinutes() === 0;
          const timeISO = time.toISOString();
          const status = getStatus(timeISO);

          return (
            <div
              key={timeISO}
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
    const morning = timeSlots.filter((t) => t.getHours() < 12);
    const afternoon = timeSlots.filter((t) => t.getHours() >= 12);
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
              {nowInKST().toLocaleDateString('ko-KR', {
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
                onChange={(e) => {
                  const newStart = e.target.value;
                  setStartTime(newStart);

                  const tryAuto = (len) => {
                    const candidateEnd = addMinutesISO(newStart, len);
                    if (isRangeAvailable(newStart, candidateEnd)) {
                      setEndTime(candidateEnd);
                      setDurationMinutes(len);
                    } else {
                      setEndTime('');
                    }
                  };

                  if (durationMinutes) {
                    tryAuto(durationMinutes);
                  } else {
                    tryAuto(60);
                  }
                }}
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
                onChange={(e) => {
                  const selectedEnd = e.target.value;
                  setEndTime(selectedEnd);
                  if (startTime) {
                    const dur =
                      (new Date(selectedEnd) - new Date(startTime)) /
                      (1000 * 60);
                    if (dur === 60 || dur === 120) setDurationMinutes(dur);
                  }
                }}
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

export default ReservationComponent;
