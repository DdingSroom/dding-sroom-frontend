'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../libs/api/instance';
import { updateRoomStatus } from '../../../libs/api/admin';
import useTokenStore from '../../../stores/useTokenStore';

const ROOM_IDS = [1, 2, 3, 4, 5];
const DEFAULT_ROOM_IMAGE_SRC = '/static/icons/studyroom_image.png';

// 배지(상태표시)
const BADGE_BY_STATUS = {
  IDLE: { className: 'bg-green-100 text-green-700', label: '예약 가능' },
  OCCUPIED: { className: 'bg-amber-100 text-amber-700', label: '사용 중' },
  MAINTENANCE: {
    className: 'bg-gray-100 text-gray-600',
    label: '예약 불가(점검 중)',
  },
};

const normalizeStatus = (v) => {
  const s = String(v ?? '').toUpperCase();
  return ['IDLE', 'OCCUPIED', 'MAINTENANCE'].includes(s) ? s : 'MAINTENANCE';
};

export default function RoomsManagePage() {
  const router = useRouter();
  const { accessToken } = useTokenStore();

  const [rooms, setRooms] = useState(() =>
    ROOM_IDS.reduce((acc, id) => {
      acc[id] = {
        status: 'IDLE',
        imageUrl: DEFAULT_ROOM_IMAGE_SRC,
        name: `스터디룸 ${id}`,
      };
      return acc;
    }, {}),
  );
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState(new Set());

  useEffect(() => {
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded?.role !== 'ROLE_ADMIN') router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  }, [accessToken, router]);

  // 단일 방 조회
  const fetchRoom = useCallback(async (roomId) => {
    const res = await axiosInstance.get(`/admin/rooms/${roomId}`);
    const data = res?.data?.data || {};
    return {
      status: normalizeStatus(data.status ?? 'IDLE'),
      imageUrl: DEFAULT_ROOM_IMAGE_SRC,
      name: data.name || `스터디룸 ${roomId}`,
    };
  }, []);

  // 전체 조회
  const fetchAll = useCallback(async () => {
    try {
      const results = await Promise.all(
        ROOM_IDS.map(async (id) => {
          try {
            const info = await fetchRoom(id);
            return [id, info];
          } catch (e) {
            console.error(`룸 ${id} 상태 조회 실패:`, e);
            return [
              id,
              {
                status: 'IDLE',
                imageUrl: DEFAULT_ROOM_IMAGE_SRC,
                name: `스터디룸 ${id}`,
              },
            ];
          }
        }),
      );
      setRooms((prev) => {
        const next = { ...prev };
        for (const [id, info] of results) next[id] = info;
        return next;
      });
    } finally {
      setLoading(false);
    }
  }, [fetchRoom]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleStatusChange = useCallback(
    async (roomId, newStatus) => {
      const current = rooms[roomId]?.status || 'IDLE';
      if (current === newStatus) return;

      const statusLabels = {
        IDLE: '예약 가능',
        OCCUPIED: '사용 중',
        MAINTENANCE: '예약 불가(점검 중)',
      };

      if (
        !confirm(
          `스터디룸 ${roomId}호를 ${statusLabels[newStatus]} 상태로 전환할까요?`,
        )
      )
        return;

      setSavingIds((s) => new Set(s).add(roomId));

      // 즉시 UI 업데이트 (Optimistic update)
      const previousRoom = rooms[roomId];
      setRooms((prev) => ({
        ...prev,
        [roomId]: { ...prev[roomId], status: newStatus },
      }));

      try {
        await updateRoomStatus(roomId, newStatus);
        alert(
          `스터디룸 ${roomId}호가 ${statusLabels[newStatus]} 상태로 변경되었습니다.`,
        );
      } catch (e) {
        console.error('상태 변경 실패:', e);

        // 실패 시 이전 상태로 롤백
        setRooms((prev) => ({
          ...prev,
          [roomId]: previousRoom,
        }));

        const status = e?.response?.status;
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          (status ? `요청 실패 (HTTP ${status})` : '상태 변경에 실패했습니다.');
        alert(msg);
      } finally {
        setSavingIds((s) => {
          const n = new Set(s);
          n.delete(roomId);
          return n;
        });
      }
    },
    [rooms],
  );

  if (loading) {
    return (
      <div className="bg-[#F1F2F4] p-6 min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-sm">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1F2F4] p-6 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-lg font-semibold mb-4">스터디룸 관리</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROOM_IDS.map((id) => {
            const info = rooms[id];
            const isSaving = savingIds.has(id);
            const badge = BADGE_BY_STATUS[info.status] || BADGE_BY_STATUS.IDLE;

            return (
              <div
                key={id}
                className="border rounded-md p-4 flex gap-4 items-start md:items-center md:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={DEFAULT_ROOM_IMAGE_SRC}
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
                      disabled={isSaving || info.status === 'IDLE'}
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
                      disabled={isSaving || info.status === 'OCCUPIED'}
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
                      disabled={isSaving || info.status === 'MAINTENANCE'}
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
    </div>
  );
}
