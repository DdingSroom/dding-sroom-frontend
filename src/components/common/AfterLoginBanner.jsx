'use client';

import { useState, useEffect } from 'react';
import CancellationModal from '@components/common/CancellationModal';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import axiosInstance from '../../libs/api/instance';

const AfterLoginBanner = () => {
  const [open, setOpen] = useState(false);
  const { userId, accessToken } = useTokenStore();
  const { latestReservation, setLatestReservation } = useReservationStore();

  const toKSTDate = (input) => {
    if (!input) return null;

    if (Array.isArray(input)) {
      const [year, month, day, hour = 0, minute = 0] = input;
      return new Date(year, month - 1, day, hour, minute);
    }

    const date = new Date(input);
    if (isNaN(date.getTime())) return null;
    return date;
  };

  const formatTime = (input) => {
    const date = toKSTDate(input);
    if (!date) return '--:--';
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (input) => {
    const date = toKSTDate(input);
    if (!date) return '날짜 없음';
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  };

  const getStartTime = () =>
    latestReservation?.startTime ??
    latestReservation?.reservationStartTime ??
    null;

  const getEndTime = () =>
    latestReservation?.endTime ?? latestReservation?.reservationEndTime ?? null;

  const fetchLatestReservation = async () => {
    if (!userId || !accessToken) return;
    try {
      const res = await axiosInstance.get(`/api/reservations/user/${userId}`);
      const sorted = res.data.reservations.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setLatestReservation(sorted[0] || null);
    } catch (err) {
      console.error('예약 정보 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchLatestReservation();
  }, [userId, accessToken]);

  useEffect(() => {
    if (latestReservation) {
      console.log('📦 예약 데이터 확인:', latestReservation);
    }
  }, [latestReservation]);

  const cancelReservation = async () => {
    if (!latestReservation?.id || !userId) {
      alert('취소할 예약 정보가 없습니다.');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/reservations/cancel', {
        userId,
        reservationId: latestReservation.id,
      });

      alert(res.data.message || '예약이 취소되었습니다.');
      setLatestReservation(null);
      setOpen(false);
    } catch (err) {
      console.error('예약 취소 실패:', err);
      alert(err.response?.data?.message || '예약 취소에 실패했습니다.');
    }
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex gap-[5px] w-full max-w-[95%]">
      {/* 좌측 박스 */}
      <div className="flex flex-col bg-white rounded-2xl h-auto min-h-[15rem] w-1/2 p-10 gap-2.5">
        <div className="font-bold text-3xl">내가 예약한 방</div>
        <div className="text-2xl text-[#9999A2]">
          {latestReservation ? latestReservation.roomName : '예약 내역 없음'}
        </div>
        <div className="flex justify-between">
          <div className="text-xl">
            {latestReservation && getStartTime()
              ? formatTime(getStartTime())
              : '--:--'}
          </div>
          <button
            className="text-xl text-[#788DFF]"
            onClick={() => setOpen(true)}
          >
            취소
          </button>

          <CancellationModal
            isOpen={open}
            onClose={handleModalClose}
            onConfirm={cancelReservation}
          >
            <div className="p-4 flex flex-col h-full justify-center">
              <div className="font-semibold text-2xl">예약을 취소할까요?</div>
              {latestReservation && (
                <div className="flex gap-[10px] bg-[#788DFF] bg-opacity-10 p-4 mt-10">
                  <img
                    src="/static/icons/studyroom_image.png"
                    alt="studyroom"
                    className="w-1/4 h-auto items-center"
                  />
                  <div className="flex flex-col justify-center">
                    <div>{latestReservation.roomName}</div>
                    <div>{formatDate(getStartTime())}</div>
                    <div>
                      {formatTime(getStartTime())} ~ {formatTime(getEndTime())}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CancellationModal>
        </div>
      </div>

      {/* 우측 박스 */}
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
