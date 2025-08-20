'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../libs/api/instance';
import useTokenStore from '../../../stores/useTokenStore';
import ReservationCard from '@components/admin/ReservationCard';

export default function ReservationListPage() {
  const [groupedReservations, setGroupedReservations] = useState({});
  const [sortedDates, setSortedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoadingIds, setCancelLoadingIds] = useState(new Set());
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

  const fetchAllReservations = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/admin/reservations');
      const reservations = response.data.reservations || [];

      // 날짜별 그룹핑
      const grouped = {};
      reservations.forEach((r) => {
        const key = formatDateOnly(r.createdAt);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
      });

      // 그룹 내 정렬 (생성일 내림차순)
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
  }, []);

  useEffect(() => {
    fetchAllReservations();
  }, [fetchAllReservations]);

  const removeReservationFromState = useCallback((reservationId) => {
    setGroupedReservations((prev) => {
      const next = { ...prev };
      for (const date of Object.keys(next)) {
        const filtered = next[date].filter((r) => r.id !== reservationId);
        next[date] = filtered;
      }
      return next;
    });
  }, []);

  const handleForceCancel = useCallback(
    async (reservationId) => {
      if (!reservationId) return;
      if (!confirm('이 예약을 강제로 취소하시겠습니까?')) return;

      setCancelLoadingIds((s) => new Set(s).add(reservationId));

      try {
        await axiosInstance.post(
          `/admin/reservations/${reservationId}/force-cancel`,
        );

        removeReservationFromState(reservationId);

        alert('예약을 강제로 취소했습니다.');
      } catch (err) {
        console.error('예약 강제 취소 실패:', err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          '예약 강제 취소에 실패했습니다.';
        alert(msg);
      } finally {
        // 버튼 로딩 off
        setCancelLoadingIds((s) => {
          const n = new Set(s);
          n.delete(reservationId);
          return n;
        });
      }
    },
    [removeReservationFromState],
  );

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
                {groupedReservations[date].filter(Boolean).map((item) => {
                  const isCancelling = cancelLoadingIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border rounded-md p-3"
                    >
                      {/* 기존 카드 유지 */}
                      <ReservationCard
                        roomName={`스터디룸 ${item.roomName}`}
                        time={formatTimeRange(item.startTime, item.endTime)}
                        userName={`사용자 ID: ${item.userId}`}
                        timestamp={formatFullDate(item.createdAt)}
                      />

                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleForceCancel(item.id)}
                          disabled={isCancelling}
                          className={`px-3 py-2 text-sm rounded-md border bg-white text-red-600 border-red-300
                              hover:bg-red-50 hover:border-red-400 transition ${
                                // eslint-disable-next-line prettier/prettier
                                isCancelling ? 'opacity-60 cursor-not-allowed' : ''
                              }`}
                          aria-busy={isCancelling ? 'true' : 'false'}
                          title="관리자 권한으로 예약을 강제 취소합니다"
                        >
                          {isCancelling ? '취소 중…' : '예약 강제 취소'}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(
    h,
  ).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// 시간 범위 포맷
function formatHM(array) {
  if (!Array.isArray(array)) return '';
  const [, , , h = 0, m = 0] = array;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTimeRange(start, end) {
  return `${formatHM(start)} ~ ${formatHM(end)}`;
}
