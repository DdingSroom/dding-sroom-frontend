'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '../../libs/api/instance';
import useTokenStore from '../../stores/useTokenStore';
import MyPageDate from './MyPageDate';
import ReservationHistory from './ReservationHistory';

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
  const [groupedReservations, setGroupedReservations] = useState({});
  const [loading, setLoading] = useState(true);

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
              />
            ))}
          </div>
        ))}
    </div>
  );
};

export default ReservationList;
