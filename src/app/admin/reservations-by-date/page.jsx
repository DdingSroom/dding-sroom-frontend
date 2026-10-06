'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import ReservationCard from '@components/admin/ReservationCard';
import BasicModal from '@components/common/basic-modal';

import { admin } from '@api/keys/admin.key';
import { ADMIN_ROLE } from '@constants/auth';
import useAuthReady from '@hooks/useAuthReady';
import { forceCancelReservation } from '@api/use-admin';

export default function ReservationListPage() {
  const { authReady, accessToken, role } = useAuthReady();
  const adminEnabled = authReady && !!accessToken && role === ADMIN_ROLE;
  const queryClient = useQueryClient();

  const [forceCancelTargetId, setForceCancelTargetId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const {
    data: reservations = [],
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
  const error = isError ? '전체 예약 정보를 불러오는 데 실패했습니다.' : null;

  const { groupedReservations, sortedDates } = useMemo(() => {
    const grouped = {};
    reservations.forEach((r) => {
      const key = formatDateOnly(r.createdAt);
      if (!grouped[key]) {
        grouped[key] = [];
      }
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

    return { groupedReservations: grouped, sortedDates: sortedDateKeys };
  }, [reservations]);

  const {
    mutate: forceCancel,
    isPending: isCancelPending,
    variables: cancellingId,
  } = useMutation({
    mutationFn: (reservationId) => forceCancelReservation(reservationId),
    onSuccess: (_data, reservationId) => {
      queryClient.invalidateQueries({
        queryKey: admin.admin.reservations.getAll().queryKey,
      });
      const target = reservations.find((r) => r.id === reservationId);
      if (target?.userId != null) {
        queryClient.invalidateQueries({
          queryKey: admin.admin.reservations.getByUserId(target.userId)
            .queryKey,
        });
      }
      setAlertMessage('예약을 강제로 취소했습니다.');
    },
    onError: (err) => {
      console.error('예약 강제 취소 실패:', err);
      setAlertMessage(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          '예약 강제 취소에 실패했습니다.',
      );
    },
  });

  const handleForceCancel = (reservationId) => {
    if (!reservationId) {
      return;
    }
    setForceCancelTargetId(reservationId);
  };

  const confirmForceCancel = () => {
    const reservationId = forceCancelTargetId;
    setForceCancelTargetId(null);
    if (!reservationId) {
      return;
    }
    forceCancel(reservationId);
  };

  return (
    <div className="bg-surface-admin p-6 min-h-screen">
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
                  const isCancelling =
                    isCancelPending && cancellingId === item.id;
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
                                isCancelling
                                  ? 'opacity-60 cursor-not-allowed'
                                  : ''
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

      <BasicModal
        isOpen={forceCancelTargetId !== null}
        onClose={() => setForceCancelTargetId(null)}
        className="max-w-modal"
        title="예약 강제 취소"
        message="이 예약을 강제로 취소하시겠습니까?"
        actions={[
          {
            text: '취소',
            onClick: () => setForceCancelTargetId(null),
            variant: 'ghost',
          },
          { text: '취소하기', onClick: confirmForceCancel, variant: 'danger' },
        ]}
      />

      <BasicModal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage('')}
        className="max-w-modal-sm"
        title="알림"
        message={alertMessage}
        actions={[{ text: '확인', onClick: () => setAlertMessage('') }]}
      />
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
  if (!Array.isArray(arr)) {
    return '';
  }
  const [y, mo, d, h = 0, m = 0] = arr;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(
    h,
  ).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// 시간 범위 포맷
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
