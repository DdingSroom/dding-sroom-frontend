'use client';

import { useState, useEffect } from 'react';
import CancellationModal from '@components/common/CancellationModal';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import axiosInstance from '../../libs/api/instance';

const AfterLoginBanner = () => {
  const [openReservationId, setOpenReservationId] = useState(null);
  const { userId, accessToken } = useTokenStore();
  const { userReservations, setUserReservations } = useReservationStore();

  const parseDate = (raw) => {
    if (!raw) return null;
    if (Array.isArray(raw)) {
      const [year, month, day, hour = 0, minute = 0] = raw;
      return new Date(year, month - 1, day, hour, minute);
    }
    return new Date(raw);
  };

  const formatDate = (input) => {
    const d = parseDate(input);
    return d ? `${d.getMonth() + 1}월 ${d.getDate()}일` : '--월 --일';
  };

  const formatTime = (input) => {
    const d = parseDate(input);
    return d
      ? d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      : '--:--';
  };

  const fetchAllUserReservations = async () => {
    if (!userId || !accessToken) return;
    try {
      const res = await axiosInstance.get(`/api/reservations/user/${userId}`);
      const nowKST = new Date();

      const upcoming = res.data.reservations.filter((r) => {
        const rawStart = r.startTime || r.reservationStartTime;
        const start = parseDate(rawStart);
        return (
          r.status === 'RESERVED' && start && start.getTime() > nowKST.getTime()
        );
      });

      const sorted = upcoming.sort(
        (a, b) => parseDate(a.startTime) - parseDate(b.startTime),
      );
      setUserReservations(sorted);
    } catch (err) {
      console.error('예약 정보 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchAllUserReservations();
  }, [userId, accessToken]);

  const cancelReservation = async (reservationId) => {
    try {
      const res = await axiosInstance.post('/api/reservations/cancel', {
        userId,
        reservationId,
      });
      alert(res.data.message || '예약이 취소되었습니다.');
      setOpenReservationId(null);
      fetchAllUserReservations();
    } catch (err) {
      console.error('예약 취소 실패:', err);
      alert(err.response?.data?.message || '예약 취소에 실패했습니다.');
    }
  };

  return (
    <div className="flex gap-[5px] w-full max-w-[95%]">
      <div className="flex bg-white rounded-2xl h-auto min-h-[15rem] w-1/2 p-6 flex-col justify-between">
        <div className="flex flex-col gap-2.5">
          <div className="text-sm md:text-xl">오늘의 혼잡도</div>
          <div className="text-xl md:text-5xl text-[#788DFF] font-semibold">
            여유로움
          </div>
        </div>
        <img
          src="/static/icons/maru_icon.png"
          alt="maru"
          className="w-1/2 h-3/4 self-end"
        />
      </div>

      <div className="flex flex-col bg-white rounded-2xl h-auto min-h-[15rem] w-1/2 p-6 gap-4">
        <div className="font-bold text-base md:text-3xl">내가 예약한 방</div>
        {!Array.isArray(userReservations) || userReservations.length === 0 ? (
          <div className="text-sm md:text-xl text-[#9999A2]">
            예약 내역 없음
          </div>
        ) : (
          userReservations.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex flex-col">
                <div className="text-sm md:text-lg text-[#9999A2]">
                  스터디룸 {r.roomName}
                </div>
                <div className="text-sm md:text-xl">
                  {formatDate(r.startTime)} {formatTime(r.startTime)} ~{' '}
                  {formatTime(r.endTime)}
                </div>
              </div>
              <button
                className="text-sm md:text-xl text-[#788DFF]"
                onClick={() => setOpenReservationId(r.id)}
              >
                취소
              </button>
              <CancellationModal
                isOpen={openReservationId === r.id}
                onClose={() => setOpenReservationId(null)}
                onConfirm={() => cancelReservation(r.id)}
              >
                <div className="text-base md:text-lg font-semibold text-left mb-4">
                  예약을 취소할까요?
                </div>
                <div className="flex items-center gap-4 bg-[#F5F7FF] p-4 rounded-lg">
                  <img
                    src="/static/icons/studyroom_image.png"
                    alt="studyroom"
                    className="w-[80px] h-[80px] object-cover rounded-md"
                  />
                  <div className="flex flex-col text-sm md:text-lg">
                    <div className="font-medium">{`스터디룸 ${r.roomName}`}</div>
                    <div>{formatDate(r.startTime)}</div>
                    <div>
                      {formatTime(r.startTime)} ~ {formatTime(r.endTime)}
                    </div>
                  </div>
                </div>
              </CancellationModal>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AfterLoginBanner;
