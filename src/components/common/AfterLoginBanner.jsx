'use client';

import { useState, useEffect } from 'react';
import CancellationModal from '@components/common/CancellationModal';
import useTokenStore from '../../stores/useTokenStore';
import axiosInstance from '../../libs/api/instance';

const AfterLoginBanner = () => {
  const [open, setOpen] = useState(false);
  const [latestReservation, setLatestReservation] = useState(null);
  const { userId, accessToken } = useTokenStore();

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

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

  const handleModalClose = async () => {
    setOpen(false);
    await fetchLatestReservation();
  };

  return (
    <div className="flex gap-[5px] w-full max-w-[95%]">
      <div className="flex flex-col bg-white rounded-2xl h-auto min-h-[15rem] w-1/2 p-10 gap-2.5">
        <div className="font-bold text-3xl">내가 예약한 방</div>
        <div className="text-2xl text-[#9999A2]">
          {latestReservation ? latestReservation.roomName : '예약 내역 없음'}
        </div>
        <div className="flex justify-between">
          <div className="text-xl">
            {latestReservation
              ? formatTime(latestReservation.startTime)
              : '--:--'}
          </div>
          <button
            className="text-xl text-[#788DFF]"
            onClick={() => setOpen(true)}
            disabled={!latestReservation}
          >
            취소
          </button>

          <CancellationModal isOpen={open} onClose={handleModalClose}>
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
                    <div>{formatDate(latestReservation.startTime)}</div>
                    <div>
                      {formatTime(latestReservation.startTime)} ~{' '}
                      {formatTime(latestReservation.endTime)}
                    </div>
                  </div>
                </div>
              )}
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
