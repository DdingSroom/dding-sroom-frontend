'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { admin } from '@api/keys/admin.key';
import { ADMIN_ROLE } from '@constants/auth';
import useAuthReady from '@hooks/useAuthReady';

export default function ReservationDetailPage() {
  const { authReady, accessToken, role } = useAuthReady();
  const adminEnabled = authReady && !!accessToken && role === ADMIN_ROLE;

  const {
    data: reservationList = [],
    isLoading,
    isError,
  } = useQuery({
    ...admin.admin.reservations.getAll(),
    enabled: adminEnabled,
    select: (res) => {
      const list = res?.reservations;
      if (!Array.isArray(list)) {
        throw new Error('예약 목록 응답 형식이 올바르지 않습니다.');
      }
      return list;
    },
  });

  const loading = !adminEnabled || isLoading;
  const error = isError ? '예약 정보를 불러오는 데 실패했습니다.' : null;

  const reservations = useMemo(
    () =>
      [...reservationList].sort((a, b) => {
        const dateA = new Date(...a.createdAt);
        const dateB = new Date(...b.createdAt);
        return dateB - dateA;
      }),
    [reservationList],
  );

  return (
    <div className="bg-surface-admin p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">예약 목록</h1>

        {loading && <p>로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-admin-header border-b text-gray-700">
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
                  <td className="py-3 px-2 text-brand">
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
  if (!Array.isArray(array)) {
    return '';
  }
  const [, , , h = 0, m = 0] = array;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTimeRange(start, end) {
  return `${formatHM(start)} ~ ${formatHM(end)}`;
}

function formatDate(arr) {
  if (!Array.isArray(arr)) {
    return '';
  }
  const [y, mo, d, h = 0, m = 0] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
