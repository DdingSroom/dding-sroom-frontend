'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../../libs/api/instance';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import MyPageDate from './MyPageDate';
import ReservationHistory from './ReservationHistory';
import CancellationModal from './CancellationModal';

const groupByDate = (reservations) => {
  const grouped = {};

  reservations.forEach((r) => {
    const rawDate = r.startTime || r.reservationStartTime;

    let date;
    if (Array.isArray(rawDate)) {
      const [year, month, day] = rawDate;
      date = new Date(year, month - 1, day);
    } else {
      date = rawDate ? new Date(rawDate) : null;
    }

    if (!date || isNaN(date)) {
      if (!grouped['Invalid Date']) grouped['Invalid Date'] = [];
      grouped['Invalid Date'].push(r);
      return;
    }

    const dateStr = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(r);
  });

  return grouped;
};

const ReservationList = () => {
  const { userId } = useTokenStore();
  const { fetchAllReservedTimes } = useReservationStore();
  const [groupedReservations, setGroupedReservations] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelModalData, setCancelModalData] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      try {
        const res = await axiosInstance.get(`/api/reservations/user/${userId}`);

        const active = res.data.reservations
          .filter((r) => r.status === 'RESERVED')
          .sort((a, b) => {
            const getTime = (raw) =>
              Array.isArray(raw) ? new Date(...raw) : new Date(raw);
            return getTime(b.startTime) - getTime(a.startTime);
          });

        const grouped = groupByDate(active);
        setGroupedReservations(grouped);
      } catch (err) {
        console.error('예약 내역 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]);

  const handleCancelReservation = (reservation) => {
    setCancelModalData(reservation);
  };

  const confirmCancelReservation = async () => {
    if (!cancelModalData) return;

    try {
      const res = await axiosInstance.post('/api/reservations/cancel', {
        userId,
        reservationId: cancelModalData.id,
      });
      alert(res.data.message || '예약이 취소되었습니다.');
      setCancelModalData(null);

      const res2 = await axiosInstance.get(`/api/reservations/user/${userId}`);
      const active = res2.data.reservations
        .filter((r) => r.status === 'RESERVED')
        .sort((a, b) => {
          const getTime = (raw) =>
            Array.isArray(raw) ? new Date(...raw) : new Date(raw);
          return getTime(b.startTime) - getTime(a.startTime);
        });
      const grouped = groupByDate(active);
      setGroupedReservations(grouped);

      if (fetchAllReservedTimes) {
        await fetchAllReservedTimes();
      }
    } catch (err) {
      console.error('예약 취소 실패:', err);
      alert(err.response?.data?.message || '예약 취소에 실패했습니다.');
    }
  };

  const formatDate = (input) => {
    let date;
    if (Array.isArray(input)) {
      const [year, month, day] = input;
      date = new Date(year, month - 1, day);
    } else {
      date = input ? new Date(input) : null;
    }
    return date ? `${date.getMonth() + 1}월 ${date.getDate()}일` : '--월 --일';
  };

  const formatTime = (input) => {
    let date;
    if (Array.isArray(input)) {
      const [year, month, day, hour = 0, minute = 0] = input;
      date = new Date(year, month - 1, day, hour, minute);
    } else {
      date = input ? new Date(input) : null;
    }
    if (!date) return '--:--';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="w-full">
      {Object.entries(groupedReservations)
        .filter(([date]) => date !== 'Invalid Date')
        .map(([date, reservations]) => (
          <div key={date} className="mb-6">
            <MyPageDate date={date} />
            {reservations.map((reservation) => (
              <ReservationHistory
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancelReservation}
              />
            ))}
          </div>
        ))}

      {cancelModalData && (
        <CancellationModal
          isOpen={true}
          onClose={() => setCancelModalData(null)}
          onConfirm={confirmCancelReservation}
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
              <div className="font-semibold text-[#37352f]">{`스터디룸 ${cancelModalData.roomName}`}</div>
              <div className="text-[#73726e]">
                {formatDate(cancelModalData.startTime)}
              </div>
              <div className="text-[#73726e]">
                {formatTime(cancelModalData.startTime)} ~{' '}
                {formatTime(cancelModalData.endTime)}
              </div>
            </div>
          </div>
        </CancellationModal>
      )}
    </div>
  );
};

export default ReservationList;
