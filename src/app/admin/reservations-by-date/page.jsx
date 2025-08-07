'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../libs/api/instance';
import ReservationCard from '@components/admin/ReservationCard';

export default function ReservationListPage() {
  const [groupedReservations, setGroupedReservations] = useState({});
  const [sortedDates, setSortedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllReservations = async () => {
    try {
      const response = await axiosInstance.get('/admin/reservations');
      console.log('전체 예약 응답:', response);

      const reservations = response.data.reservations || [];

      // 날짜별 그룹핑
      const grouped = {};
      reservations.forEach((r) => {
        const key = formatDateOnly(r.createdAt);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
      });

      Object.keys(grouped).forEach((date) => {
        grouped[date].sort(
          (a, b) => new Date(...b.createdAt) - new Date(...a.createdAt),
        );
      });

      const sortedDateKeys = Object.keys(grouped).sort(
        (a, b) => new Date(b) - new Date(a),
      );

      setGroupedReservations(grouped);
      setSortedDates(sortedDateKeys);
    } catch (err) {
      console.error('전체 예약 불러오기 실패:', err);
      setError('전체 예약 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReservations();
  }, []);

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">날짜별 예약 현황</h1>

        {loading && <p>로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading &&
          !error &&
          sortedDates.map((date) => (
            <div key={date} className="mb-6">
              <h2 className="text-md font-bold mb-2 border-b pb-1">
                {date} 예약 내역
              </h2>
              <div className="grid gap-3">
                {groupedReservations[date].map((item) => (
                  <ReservationCard
                    key={item.id}
                    roomName={`스터디룸 ${item.roomName}`}
                    time={formatTimeRange(item.startTime, item.endTime)}
                    userName={`사용자 ID: ${item.userId}`}
                    timestamp={formatFullDate(item.createdAt)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// 날짜 key용 YYYY-MM-DD
function formatDateOnly(arr) {
  const [y, mo, d] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// 전체 날짜 & 시간 포맷
function formatFullDate(arr) {
  if (!Array.isArray(arr)) return '';
  const [y, mo, d, h = 0, m = 0] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// 시간 범위 포맷
function formatHM(array) {
  if (!Array.isArray(array)) return '';
  const [_, __, ___, h = 0, m = 0] = array;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTimeRange(start, end) {
  return `${formatHM(start)} ~ ${formatHM(end)}`;
}
