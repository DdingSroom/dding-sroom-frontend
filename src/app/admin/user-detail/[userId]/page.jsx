'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import ReservationItem from '@components/admin/ReservationItem';

import axiosInstance from '@api/instance';

const pad = (n) => String(n).padStart(2, '0');

function formatDateArrayExactly(arr) {
  if (!Array.isArray(arr)) {
    return '없음';
  }
  const [y, m, d, h, min, s] = arr;
  return `${y}. ${pad(m)}. ${pad(d)}. ${pad(h)}:${pad(min)}:${pad(s)}`;
}

function formatDateTimeRange(startArray, endArray) {
  if (!Array.isArray(startArray) || !Array.isArray(endArray)) {
    return '';
  }
  const [y, m, d, h, min] = startArray;
  const [, , , h2, min2] = endArray;
  return `${y}.${pad(m)}.${pad(d)} ${pad(h)}:${pad(min)} ~ ${pad(h2)}:${pad(min2)}`;
}

export default function UserDetailPage() {
  const { userId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  const fetchUserDetail = useCallback(async () => {
    if (!userId) {
      return null;
    }
    try {
      const res = await axiosInstance.get(`/admin/users/${userId}`);
      const data = res?.data?.data;
      setUser(data);
      return data;
    } catch (error) {
      console.error('사용자 상세 조회 실패:', error);
      return null;
    }
  }, [userId]);

  const fetchUserReservations = useCallback(async () => {
    if (!userId) {
      return;
    }
    try {
      const res = await axiosInstance.get(`/admin/reservations/user/${userId}`);
      setReservations(res.data.reservations || []);
    } catch (error) {
      console.error('사용자 예약 조회 실패:', error);
    } finally {
      setLoadingReservations(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
      fetchUserReservations();
    }
  }, [userId, fetchUserDetail, fetchUserReservations]);

  /* Loading */
  if (!user) {
    return <p className="p-6">로딩 중...</p>;
  }

  return (
    <div className="p-6 bg-surface-admin min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 mb-1"
          >
            ← 사용자 관리
          </button>
          <h1 className="text-xl font-semibold">{user.username}</h1>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 회원 정보 */}
        <div className="bg-white p-4 rounded shadow-sm relative">
          <h2 className="font-semibold text-sm mb-2">회원 정보</h2>
          <div className="text-sm space-y-1">
            <p>
              이름 <span className="ml-2">{user.username}</span>
            </p>
            <p>
              이메일 <span className="ml-2">{user.email}</span>
            </p>
            <p>
              역할 <span className="ml-2">{user.role}</span>
            </p>
          </div>
        </div>

        {/* 가입 정보 */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-sm mb-2">가입 정보</h2>
          <div className="text-sm space-y-1">
            <p>
              가입일{' '}
              <span className="ml-2">
                {formatDateArrayExactly(user.registrationDate)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 예약 내역 */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold text-sm mb-3">예약 내역</h2>
        {loadingReservations ? (
          <p>예약 정보를 불러오는 중...</p>
        ) : reservations.length === 0 ? (
          <p className="text-sm text-gray-500">예약 내역이 없습니다.</p>
        ) : (
          reservations
            .sort((a, b) => new Date(...b.createdAt) - new Date(...a.createdAt))
            .map((item) => (
              <ReservationItem
                key={item.id}
                room={`스터디룸 ${item.roomName}`}
                time={formatDateTimeRange(item.startTime, item.endTime)}
              />
            ))
        )}
      </div>
    </div>
  );
}
