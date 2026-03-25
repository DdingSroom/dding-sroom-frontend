'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import axiosInstance from '@api/instance';
import TimeComponent from '@components/reservation/TimeComponent';
import Modal from '@components/common/Modal';
import LoginRequiredModal from '@components/common/LoginRequiredModal';

//타임존 안전 유틸 (KST = UTC+9, DST 없음)
const KST_MS = 9 * 60 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

// UTC 타임스탬프에서 KST 시/분 추출
const kstHour = (utcMs) => new Date(utcMs + KST_MS).getUTCHours();
const kstMinute = (utcMs) => new Date(utcMs + KST_MS).getUTCMinutes();

// KST HH:MM 포맷
const formatTime = (utcMs) =>
  `${String(kstHour(utcMs)).padStart(2, '0')}:${String(kstMinute(utcMs)).padStart(2, '0')}`;

// 오늘 KST 자정의 UTC 타임스탬프
const todayKSTMidnightUTC = () => {
  const kst = new Date(Date.now() + KST_MS);
  return (
    Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()) - KST_MS
  );
};

// 내일 KST 자정의 UTC 타임스탬프
const tomorrowKSTMidnightUTC = () =>
  todayKSTMidnightUTC() + 24 * 60 * 60 * 1000;

// 10분 슬롯 키 (UTC 타임스탬프를 10분 경계로 스냅)
const slotKey10m = (d) => {
  const ms = typeof d === 'number' ? d : new Date(d).getTime();
  return ms - (ms % TEN_MIN);
};

// ISO 문자열에 분 추가
const addMinutesISO = (iso, minutes) =>
  new Date(new Date(iso).getTime() + minutes * 60000).toISOString();

// UTC 타임스탬프를 KST ISO 형식 문자열로 변환 (서버 전송용)
const toKSTISOString = (utcMs) =>
  new Date(utcMs + KST_MS).toISOString().slice(0, 19);

const TomorrowReservationComponent = ({
  index,
  roomId,
  roomName,
  caption,
  notice,
}) => {
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

  // 내일 KST 자정 UTC 타임스탬프
  const tomorrowMidnight = useMemo(() => tomorrowKSTMidnightUTC(), []);

  // KST 내일 날짜 표시용
  const formattedTomorrow = useMemo(() => {
    const kst = new Date(tomorrowMidnight + KST_MS);
    return `${kst.getUTCMonth() + 1}월 ${kst.getUTCDate()}일`;
  }, [tomorrowMidnight]);

  // 예약된 10분 슬롯 키 집합 (빠른 충돌 판정을 위해)
  const reserved10mKeys = useMemo(() => {
    const reservedTimeSlots = reservedTimeSlotsByRoom?.[roomId] || [];
    const set = new Set();
    for (const iso of reservedTimeSlots) {
      set.add(slotKey10m(iso));
    }
    return set;
  }, [reservedTimeSlotsByRoom, roomId]);

  // 내일의 10분 단위 타임슬롯 UTC 타임스탬프 배열 + 표시 전용 23:59
  const timeSlots = useMemo(() => {
    const slots = [];
    // 00:00 ~ 23:50 (144개 슬롯)
    for (let i = 0; i < 144; i++) {
      slots.push(tomorrowMidnight + i * TEN_MIN);
    }
    // 표시 전용 23:59
    slots.push(tomorrowMidnight + (23 * 60 + 59) * 60 * 1000);
    return slots;
  }, [tomorrowMidnight]);

  // 특정 구간이 예약과 충돌하는지 검사 (start 포함, end 제외)
  const isRangeAvailable = (startISO, endISO) => {
    const startMs = new Date(startISO).getTime();
    const endMs = new Date(endISO).getTime();
    for (let ms = startMs; ms < endMs; ms += TEN_MIN) {
      if (reserved10mKeys.has(slotKey10m(ms))) return false;
    }
    return true;
  };

  const getStatus = (slotMs) => {
    // 내일 화면은 전체가 미래이므로 past는 없음. 예약 여부만 표시.
    if (reserved10mKeys.has(slotKey10m(slotMs))) return 'reserved';
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

    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();
    const duration = durationMinutes ?? (endMs - startMs) / (1000 * 60);

    if (duration !== 60 && duration !== 120) {
      alert('예약은 1시간 또는 2시간 단위로만 가능합니다.');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/reservations', {
        userId,
        roomId,
        reservationStartTime: toKSTISOString(startMs),
        reservationEndTime: toKSTISOString(endMs),
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

  const renderLine = (slots) => (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex flex-row min-w-[720px] sm:min-w-0">
        {slots.map((ms) => {
          const hour = kstHour(ms);
          const isFirstOfHour = kstMinute(ms) === 0;
          const status = getStatus(ms);

          return (
            <div
              key={ms}
              className="flex flex-col items-center"
              style={{ width: '10px' }}
            >
              <span
                className="text-[10px] text-content-time"
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
    const morning = timeSlots.filter((ms) => kstHour(ms) < 12);
    const afternoon = timeSlots.filter((ms) => kstHour(ms) >= 12);
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
    return timeSlots
      .filter((ms) => {
        const h = kstHour(ms);
        const m = kstMinute(ms);
        // 23:59 표시 전용 슬롯 제외
        if (h === 23 && m === 59) return false;
        return !reserved10mKeys.has(slotKey10m(ms));
      })
      .map((ms) => {
        const iso = new Date(ms).toISOString();
        return (
          <option key={iso} value={iso}>
            {formatTime(ms)}
          </option>
        );
      });
  };

  const renderEndTimeOptions = () => {
    if (!startTime) return [];
    const startMs = new Date(startTime).getTime();
    const end1Ms = startMs + 60 * 60000;
    const end2Ms = startMs + 120 * 60000;
    const startISO = new Date(startMs).toISOString();

    const candidates = [end1Ms, end2Ms].filter((ms) =>
      isRangeAvailable(startISO, new Date(ms).toISOString()),
    );

    return candidates.map((ms) => {
      const iso = new Date(ms).toISOString();
      return (
        <option key={iso} value={iso}>
          {formatTime(ms)}
        </option>
      );
    });
  };

  return (
    <div className="flex flex-col justify-between p-4 sm:p-7 bg-white rounded-2xl w-full max-w-[100%] mt-[1rem]">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 sm:gap-5 items-center">
          <div className="text-xl sm:text-2xl whitespace-nowrap flex-shrink-0">
            {roomName || `스터디룸 ${index}`}
          </div>
          {caption && (
            <div className="text-status-reserved text-sm whitespace-nowrap flex-shrink-0">
              {caption}
            </div>
          )}
          {notice && (
            <div className="text-primary-dark text-xs whitespace-pre-line">
              {notice}
            </div>
          )}
        </div>
        <button
          className="bg-primary-dark text-white text-lg rounded-3xl px-4 py-2 w-[100px] hover:bg-primary-dark-hover transition-colors duration-200 font-medium"
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
            <div className="font-semibold text-2xl">
              {roomName || `스터디룸 ${index}`}
            </div>
            <div className="flex justify-center items-center text-sm text-gray-500">
              {formattedTomorrow}
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
          <div className="w-2 h-2 bg-primary"></div>
          <span>예약 가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-status-reserved"></div>
          <span>예약됨</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-status-past"></div>
          <span>지난 시간</span>
        </div>
      </div>
      <div className="bg-status-reserved h-0.5 w-full mt-3" />
      <LoginRequiredModal
        isOpen={showLoginModal}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default TomorrowReservationComponent;
