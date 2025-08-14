'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../../libs/api/instance';
import useTokenStore from '../../../../stores/useTokenStore';
import ReservationItem from '@components/admin/ReservationItem';

function formatDateArrayExactly(dateArray) {
  if (!Array.isArray(dateArray)) return '없음';

  const [y, m, d, h, min, s] = dateArray;

  const pad = (n) => String(n).padStart(2, '0');

  return `${y}. ${pad(m)}. ${pad(d)}. ${pad(h)}:${pad(min)}:${pad(s)}`;
}

// 날짜 + 시간 형식으로 반환 (ex: 2025.08.07 15:00 ~ 17:00)
function formatDateTimeRange(startArray, endArray) {
  if (!Array.isArray(startArray) || !Array.isArray(endArray)) return '';

  const [y, m, d, h, min] = startArray;
  const [, , , h2, min2] = endArray;

  const pad = (n) => String(n).padStart(2, '0');

  const dateStr = `${y}.${pad(m)}.${pad(d)}`;
  const timeStr = `${pad(h)}:${pad(min)} ~ ${pad(h2)}:${pad(min2)}`;

  return `${dateStr} ${timeStr}`;
}

export default function UserDetailPage() {
  const { userId } = useParams();
  const router = useRouter();
  const { accessToken } = useTokenStore();

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

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

  const fetchUserDetail = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}`);
      console.log('사용자 응답:', response);
      setUser(response.data.data);
    } catch (error) {
      console.error('사용자 상세 조회 실패:', error);
    }
  }, [userId]);

  const fetchUserReservations = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/admin/reservations/user/${userId}`);
      console.log('사용자 예약 내역:', res.data);
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

  if (!user) {
    return <p className="p-6">로딩 중...</p>;
  }

  return (
    <div className="p-6 bg-[#EFF0F3] min-h-screen">
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
            .sort((a, b) => {
              const dateA = new Date(...a.createdAt);
              const dateB = new Date(...b.createdAt);
              return dateB - dateA;
            })
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
