'use client';

import React, { useCallback, useState } from 'react';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';

import BasicModal from '@components/common/basic-modal';

import { admin } from '@api/keys/admin.key';
import { ADMIN_ROLE } from '@constants/auth';
import { STUDYROOM_IMAGE_SRC } from '@constants/images';
import useAuthReady from '@hooks/useAuthReady';
import { updateRoomStatus } from '@shared/api/admin';

const ROOM_IDS = [1, 2, 3, 4, 5];

// 배지(상태표시)
const BADGE_BY_STATUS = {
  IDLE: { className: 'bg-green-100 text-green-700', label: '예약 가능' },
  OCCUPIED: { className: 'bg-amber-100 text-amber-700', label: '사용 중' },
  MAINTENANCE: {
    className: 'bg-gray-100 text-gray-600',
    label: '예약 불가(점검 중)',
  },
};

const STATUS_LABELS = {
  IDLE: '예약 가능',
  OCCUPIED: '사용 중',
  MAINTENANCE: '예약 불가(점검 중)',
};

// 지원하는 정상 상태값만 정규화하고, 그 외(누락/미지원)는 null을 반환한다.
const normalizeStatus = (v) => {
  const s = String(v ?? '').toUpperCase();
  return ['IDLE', 'OCCUPIED', 'MAINTENANCE'].includes(s) ? s : null;
};

export default function RoomsManagePage() {
  const { authReady, accessToken, role } = useAuthReady();
  const adminEnabled = authReady && !!accessToken && role === ADMIN_ROLE;
  const queryClient = useQueryClient();

  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const roomQueries = useQueries({
    queries: ROOM_IDS.map((id) => ({
      ...admin.admin.rooms.getById(id),
      enabled: adminEnabled,
      select: (res) => {
        const data = res?.data;
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('스터디룸 응답 형식이 올바르지 않습니다.');
        }
        return {
          status: normalizeStatus(data.status),
          name: data.name || `스터디룸 ${id}`,
        };
      },
    })),
  });

  const loading = !adminEnabled || roomQueries.some((q) => q.isLoading);

  const rooms = ROOM_IDS.reduce((acc, id, index) => {
    const q = roomQueries[index];
    acc[id] = q.isError
      ? { failed: true, imageUrl: STUDYROOM_IMAGE_SRC, name: `스터디룸 ${id}` }
      : {
          status: q.data?.status ?? null,
          imageUrl: STUDYROOM_IMAGE_SRC,
          name: q.data?.name ?? `스터디룸 ${id}`,
        };
    return acc;
  }, {});

  const {
    mutate: changeRoomStatus,
    isPending: isStatusPending,
    variables: savingVars,
  } = useMutation({
    mutationFn: ({ roomId, newStatus }) => updateRoomStatus(roomId, newStatus),
    onSuccess: (_data, { roomId, newStatus }) => {
      queryClient.invalidateQueries({
        queryKey: admin.admin.rooms.getById(roomId).queryKey,
      });
      setAlertMessage(
        `스터디룸 ${roomId}호가 ${STATUS_LABELS[newStatus]} 상태로 변경되었습니다.`,
      );
    },
    onError: (e) => {
      console.error('상태 변경 실패:', e);
      const status = e?.response?.status;
      setAlertMessage(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          (status ? `요청 실패 (HTTP ${status})` : '상태 변경에 실패했습니다.'),
      );
    },
  });

  const handleStatusChange = useCallback(
    (roomId, newStatus) => {
      const current = rooms[roomId]?.status || 'IDLE';
      if (current === newStatus) {
        return;
      }
      setPendingStatusChange({ roomId, newStatus });
    },
    [rooms],
  );

  const confirmStatusChange = () => {
    const { roomId, newStatus } = pendingStatusChange || {};
    setPendingStatusChange(null);
    if (!roomId) {
      return;
    }
    changeRoomStatus({ roomId, newStatus });
  };

  if (loading) {
    return (
      <div className="bg-surface-admin p-6 min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-sm">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface-admin p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">스터디룸 관리</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROOM_IDS.map((id) => {
            const info = rooms[id];
            const failed = info.failed;
            const unknownStatus = !failed && info.status == null;
            const disabledRoom = failed || unknownStatus;
            const isSaving = isStatusPending && savingVars?.roomId === id;
            const badge = failed
              ? { className: 'bg-red-100 text-red-700', label: '조회 실패' }
              : unknownStatus
                ? {
                    className: 'bg-red-100 text-red-700',
                    label: '상태 확인 불가',
                  }
                : BADGE_BY_STATUS[info.status] || BADGE_BY_STATUS.IDLE;

            return (
              <div
                key={id}
                className="border rounded-md p-4 flex gap-4 items-start md:items-center md:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={STUDYROOM_IMAGE_SRC}
                      alt={`스터디룸 ${id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="font-medium">
                      {info.name || `스터디룸 ${id}`}
                    </div>
                    <div className="text-xs text-gray-500">방 번호: {id}</div>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleStatusChange(id, 'IDLE')}
                      disabled={
                        isSaving || disabledRoom || info.status === 'IDLE'
                      }
                      className={`px-3 py-1.5 text-xs rounded-md transition ${
                        info.status === 'IDLE'
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      } ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      예약 가능
                    </button>
                    <button
                      onClick={() => handleStatusChange(id, 'OCCUPIED')}
                      disabled={
                        isSaving || disabledRoom || info.status === 'OCCUPIED'
                      }
                      className={`px-3 py-1.5 text-xs rounded-md transition ${
                        info.status === 'OCCUPIED'
                          ? 'bg-amber-100 text-amber-700 cursor-not-allowed'
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      } ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      사용 중
                    </button>
                    <button
                      onClick={() => handleStatusChange(id, 'MAINTENANCE')}
                      disabled={
                        isSaving ||
                        disabledRoom ||
                        info.status === 'MAINTENANCE'
                      }
                      className={`px-3 py-1.5 text-xs rounded-md transition ${
                        info.status === 'MAINTENANCE'
                          ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-500 text-white hover:bg-gray-600'
                      } ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      점검 중
                    </button>
                  </div>
                  {isSaving && (
                    <div className="text-xs text-gray-500 mt-1">처리 중...</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BasicModal
        isOpen={pendingStatusChange !== null}
        onClose={() => setPendingStatusChange(null)}
        className="max-w-modal"
        title="스터디룸 상태 변경"
        message={
          pendingStatusChange &&
          `스터디룸 ${pendingStatusChange.roomId}호를 ${STATUS_LABELS[pendingStatusChange.newStatus]} 상태로 전환할까요?`
        }
        actions={[
          {
            text: '취소',
            onClick: () => setPendingStatusChange(null),
            variant: 'ghost',
          },
          { text: '전환', onClick: confirmStatusChange },
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
