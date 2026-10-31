'use client';

import React, { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import BasicModal from '@components/common/basic-modal';

import { admin } from '@api/keys/admin.key';
import { ADMIN_ROLE } from '@constants/auth';
import { STUDYROOM_IMAGE_SRC } from '@constants/images';
import { ROOMS } from '@constants/rooms';
import useAuthReady from '@hooks/useAuthReady';
import { updateRoomStatus } from '@api/admin.api';

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

  const {
    data: roomList = [],
    isLoading,
    isError,
  } = useQuery({
    ...admin.admin.rooms.getAll(),
    enabled: adminEnabled,
    select: (res) => {
      const list = res?.rooms;
      if (!Array.isArray(list)) {
        throw new Error('스터디룸 목록 응답 형식이 올바르지 않습니다.');
      }
      return list.map((room) => ({
        id: room.id,
        status: normalizeStatus(room.roomStatus),
        name:
          ROOMS.find(({ id }) => id === room.id)?.name ??
          `스터디룸 ${room.roomName}`,
      }));
    },
  });

  const loading = !adminEnabled || isLoading;

  const rooms = Object.fromEntries(roomList.map((room) => [room.id, room]));

  const {
    mutate: changeRoomStatus,
    isPending: isStatusPending,
    variables: savingVars,
  } = useMutation({
    mutationFn: ({ roomId, newStatus }) => updateRoomStatus(roomId, newStatus),
    onSuccess: (_data, { roomId, newStatus }) => {
      queryClient.invalidateQueries({
        queryKey: admin.admin.rooms._def,
      });
      setAlertMessage(
        `${rooms[roomId]?.name ?? `스터디룸 ${roomId}`}이(가) ${STATUS_LABELS[newStatus]} 상태로 변경되었습니다.`,
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

        {isError && (
          <p className="text-red-500">스터디룸 정보를 불러오지 못했습니다.</p>
        )}
        {!isError && roomList.length === 0 && (
          <p className="text-gray-500">등록된 스터디룸이 없습니다.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roomList.map((info) => {
            const { id } = info;
            const unknownStatus = info.status == null;
            const disabledRoom = unknownStatus;
            const isSaving = isStatusPending && savingVars?.roomId === id;
            const badge = unknownStatus
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
                      alt={info.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="font-medium">{info.name}</div>
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
          `${rooms[pendingStatusChange.roomId]?.name ?? `스터디룸 ${pendingStatusChange.roomId}`}을(를) ${STATUS_LABELS[pendingStatusChange.newStatus]} 상태로 전환할까요?`
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
