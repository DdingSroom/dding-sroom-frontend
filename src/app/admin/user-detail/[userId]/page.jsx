'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../../libs/api/instance';
import useTokenStore from '../../../../stores/useTokenStore';
import ReservationItem from '@components/admin/ReservationItem';

const pad = (n) => String(n).padStart(2, '0');

function formatDateArrayExactly(arr) {
  if (!Array.isArray(arr)) return '없음';
  const [y, m, d, h, min, s] = arr;
  return `${y}. ${pad(m)}. ${pad(d)}. ${pad(h)}:${pad(min)}:${pad(s)}`;
}

function formatDateTimeRange(startArray, endArray) {
  if (!Array.isArray(startArray) || !Array.isArray(endArray)) return '';
  const [y, m, d, h, min] = startArray;
  const [, , , h2, min2] = endArray;
  return `${y}.${pad(m)}.${pad(d)} ${pad(h)}:${pad(min)} ~ ${pad(h2)}:${pad(min2)}`;
}

function normalizeStatus(v) {
  if (v == null) return 'normal';
  const s = String(v).toLowerCase();
  if (['blocked', 'block', 'banned', 'inactive', 'disabled'].includes(s))
    return 'blocked';
  if (['normal', 'active', 'enabled'].includes(s)) return 'normal';
  return 'normal';
}

function deriveStatus(u) {
  if (!u) return 'normal';
  if (typeof u.isBlocked === 'boolean')
    return u.isBlocked ? 'blocked' : 'normal';
  if (typeof u.enabled === 'boolean') return u.enabled ? 'normal' : 'blocked';
  if (u.accountStatus != null) return normalizeStatus(u.accountStatus);
  if (u.status != null) return normalizeStatus(u.status);
  return 'normal';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function UserDetailPage() {
  const { userId } = useParams();
  const router = useRouter();
  const { accessToken } = useTokenStore();

  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  // const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      router.push('/admin/login');
      return;
    }
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.role !== 'ROLE_ADMIN') router.push('/admin/login');
    } catch (e) {
      console.error('토큰 디코드 오류:', e);
      router.push('/admin/login');
    }
  }, [accessToken, router]);

  const fetchUserDetail = useCallback(async () => {
    if (!userId) return null;
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
    if (!userId) return;
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

  const userStatus = useMemo(() => deriveStatus(user), [user]);
  // const isBlocked = userStatus === 'blocked';

  const updateUserStatus = useCallback(
    async (nextStatus) => {
      if (!userId)
        throw new Error(
          'userId가 없습니다. 라우트 세그먼트 [userId]를 확인하세요.',
        );
      const prevUser = user;

      try {
        // 즉시 UI 업데이트 (Optimistic update)
        setUser((p) =>
          p
            ? {
                ...p,
                status: nextStatus,
                accountStatus: nextStatus,
                isBlocked: nextStatus === 'blocked',
                enabled: nextStatus !== 'blocked',
              }
            : p,
        );

        console.log(`Updating user ${userId} status to:`, nextStatus);

        const response = await axiosInstance.put(
          `/admin/users/${userId}/status`,
          null,
          {
            params: { status: nextStatus },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log('User status update success:', response.data);

        // API 성공 후 최신 상태 재조회
        for (let i = 0; i < 3; i++) {
          await sleep(250 * (i + 1));
          const fresh = await fetchUserDetail();
          if (fresh && deriveStatus(fresh) === nextStatus) break;
        }
      } catch (e) {
        console.error('사용자 상태 변경 실패:', e);

        // 실패 시 이전 상태로 롤백
        setUser(prevUser);
        throw e;
      }
    },
    [userId, user, fetchUserDetail, accessToken],
  );

  // const handleStatusToggle = useCallback(async () => {
  if (!user) return;

  const currentStatus = userStatus;
  const newStatus = currentStatus === 'normal' ? 'blocked' : 'normal';
  const statusText = newStatus === 'blocked' ? '차단' : '정상';

  // if (
  //   !confirm(`${user.username}님을 ${statusText} 상태로 변경하시겠습니까?`)
  // ) {
  //   return;
  // }

  // setUpdatingStatus(true);

  // try {
  //   await updateUserStatus(newStatus);
  //   alert(`${user.username}님이 ${statusText} 상태로 변경되었습니다.`);
  // } catch (error) {
  //   console.error('사용자 상태 변경 실패:', error);
  //   const msg = error?.response?.data?.message || '상태 변경에 실패했습니다.';
  //   alert(msg);
  // } finally {
  //   setUpdatingStatus(false);
  // }
  // }, [user, userStatus, updateUserStatus]);

  /* Loading */
  if (!user) return <p className="p-6">로딩 중...</p>;

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
