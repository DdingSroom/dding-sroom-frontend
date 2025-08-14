'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../libs/api/instance';
import useTokenStore from '../../../stores/useTokenStore';

export default function ReservationDetailPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { accessToken } = useTokenStore();

  useEffect(() => {
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.role !== 'ROLE_ADMIN') {
        router.push('/admin/login');
        return;
      }
    } catch (error) {
      console.error('토큰 디코드 오류:', error);
      router.push('/admin/login');
      return;
    }
  }, [accessToken, router]);

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get('/admin/reservations');
      console.log('예약 데이터:', response.data);

      setReservations(
        (response.data.reservations || []).sort((a, b) => {
          const dateA = new Date(...a.createdAt);
          const dateB = new Date(...b.createdAt);
          return dateB - dateA;
        }),
      );
    } catch (err) {
      console.error('예약 불러오기 실패:', err);
      setError('예약 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">예약 목록</h1>

        {loading && <p>로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F7F7F7] border-b text-[#333]">
              <tr>
                <th className="py-3 px-2 w-8">#</th>
                <th className="py-3 px-2">스터디룸</th>
                <th className="py-3 px-2">예약 시간</th>
                <th className="py-3 px-2">사용자 ID</th>
                <th className="py-3 px-2">예약일</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {reservations.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">스터디룸 {item.roomName}</td>
                  <td className="py-3 px-2 text-[#788DFF]">
                    {formatTimeRange(item.startTime, item.endTime)}
                  </td>
                  <td className="py-3 px-2">{item.userId}</td>
                  <td className="py-3 px-2 text-xs text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function formatHM(array) {
  if (!Array.isArray(array)) return '';
  const [, , , h = 0, m = 0] = array;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTimeRange(start, end) {
  return `${formatHM(start)} ~ ${formatHM(end)}`;
}

function formatDate(arr) {
  if (!Array.isArray(arr)) return '';
  const [y, mo, d, h = 0, m = 0] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
