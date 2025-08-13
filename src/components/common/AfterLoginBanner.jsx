'use client';

import { useState, useEffect } from 'react';
import CancellationModal from '@components/common/CancellationModal';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import axiosInstance from '../../libs/api/instance';

const AfterLoginBanner = () => {
  const [openReservationId, setOpenReservationId] = useState(null);
  const { userId, accessToken } = useTokenStore();
  const { userReservations, setUserReservations, fetchAllReservedTimes } =
    useReservationStore();

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
    if (!d) return '--:--';
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const fetchAllUserReservations = async () => {
    if (!userId || !accessToken) return;
    try {
      const res = await axiosInstance.get(`/api/reservations/user/${userId}`);
      const nowKST = new Date();

      const upcoming = res.data.reservations.filter((r) => {
        const endTime = parseDate(r.endTime);
        return r.status === 'RESERVED' && endTime > nowKST;
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
      await fetchAllUserReservations();
      await fetchAllReservedTimes();
    } catch (err) {
      console.error('예약 취소 실패:', err);
      alert(err.response?.data?.message || '예약 취소에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-row gap-2 sm:gap-3 w-full max-w-[95%]">
      {/* 혼잡도 박스 */}
      <div className="relative flex bg-white rounded-2xl min-h-[280px] w-1/2 p-3 sm:p-6 flex-col justify-between shadow-sm border border-gray-50">
        <div className="flex flex-col gap-2 sm:gap-3 z-10">
          <div className="text-[#73726e] text-xs sm:text-sm font-medium">
            오늘의 혼잡도
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl text-[#788DFF] font-bold whitespace-nowrap overflow-hidden">
            여유로움
          </div>
        </div>
        <img
          src="/static/icons/maru_icon.png"
          alt="maru"
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 object-contain opacity-90"
        />
      </div>

      {/* 예약 내역 박스 */}
      <div className="flex flex-col bg-white rounded-2xl min-h-[280px] w-1/2 p-3 sm:p-6 shadow-sm border border-gray-50">
        <div className="font-bold text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-[#37352f] whitespace-nowrap overflow-hidden">
          내가 예약한 방
        </div>

        {/* 예약 리스트 영역 (스크롤) */}
        <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto pr-1 sm:pr-2 flex-1 max-h-48">
          {!Array.isArray(userReservations) || userReservations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#9b9998] text-xs sm:text-sm">
              예약 내역이 없습니다.
            </div>
          ) : (
            userReservations.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0 mr-2 sm:mr-3">
                  <div className="text-xs text-[#73726e] whitespace-nowrap overflow-hidden text-ellipsis">
                    스터디룸 {r.roomName}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-[#37352f] whitespace-nowrap overflow-hidden text-ellipsis">
                    {formatDate(r.startTime)} {formatTime(r.startTime)} ~{' '}
                    {formatTime(r.endTime)}
                  </div>
                </div>
                <button
                  className="flex-shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-[#788DFF] hover:bg-[#788DFF] hover:text-white rounded-md transition-colors whitespace-nowrap"
                  onClick={() => setOpenReservationId(r.id)}
                >
                  취소
                </button>
                <CancellationModal
                  isOpen={openReservationId === r.id}
                  onClose={() => setOpenReservationId(null)}
                  onConfirm={() => cancelReservation(r.id)}
                >
                  <div className="text-lg font-semibold text-left mb-6 text-[#37352f]">
                    예약을 취소할까요?
                  </div>
                  <div className="flex items-center gap-4 bg-[#f8f9ff] p-4 rounded-xl border border-gray-100">
                    <img
                      src="/static/icons/studyroom_image.png"
                      alt="studyroom"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="font-semibold text-[#37352f]">{`스터디룸 ${r.roomName}`}</div>
                      <div className="text-[#73726e]">
                        {formatDate(r.startTime)}
                      </div>
                      <div className="text-[#73726e]">
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
    </div>
  );
};

export default AfterLoginBanner;
