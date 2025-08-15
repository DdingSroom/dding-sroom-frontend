'use client';

import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../libs/api/instance';
import useTokenStore from '../../stores/useTokenStore';
import useReservationStore from '../../stores/useReservationStore';
import MyPageDate from './MyPageDate';
import ReservationHistory from './ReservationHistory';
import CancellationModal from './CancellationModal';
import jwtDecode from 'jwt-decode';

const toDateFromRaw = (raw) => {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const [y, m = 1, d = 1, hh = 0, mm = 0, ss = 0, ms = 0] = raw;
    return new Date(y, m - 1, d, hh, mm, ss, ms);
  }
  const dt = new Date(raw);
  return isNaN(dt) ? null : dt;
};

const norm = (v) =>
  String(v ?? '')
    .toUpperCase()
    .trim();

const isCanceled = (r) => {
  const s = norm(r.status);
  if (r.canceledAt || r.cancelledAt) return true;
  if (s === 'CANCELLED' || s === 'CANCELED') return true;
  return false;
};

const groupByDate = (reservations) => {
  const grouped = {};
  reservations.forEach((r) => {
    const start = toDateFromRaw(r.startTime ?? r.reservationStartTime);
    if (!start) {
      (grouped['Invalid Date'] ??= []).push(r);
      return;
    }
    const key = start.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    (grouped[key] ??= []).push(r);
  });
  return grouped;
};

export default function ReservationList() {
  // rehydrate 추가로 세션→스토어 동기화
  const { userId, accessToken, rehydrate } = useTokenStore();
  const { fetchAllReservedTimes } = useReservationStore();

  const [groupedReservations, setGroupedReservations] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelModalData, setCancelModalData] = useState(null);
  const [authReady, setAuthReady] = useState(false); // ✅ 준비 플래그

  // 첫 마운트 시 세션 값을 스토어로 강제 동기화
  useEffect(() => {
    if (typeof rehydrate === 'function') {
      rehydrate();
    }
    // 로그인 후 리다이렉트 시 토큰 동기화를 위해 더 긴 지연시간 설정
    const t = setTimeout(() => setAuthReady(true), 100);
    return () => clearTimeout(t);
  }, [rehydrate]);

  // userId 미존재 시 토큰에서 보조 추출
  const resolvedUserId = useMemo(() => {
    if (userId) return userId;
    if (!accessToken) return null;
    try {
      const d = jwtDecode(accessToken);
      return d?.userId ?? d?.id ?? d?.uid ?? d?.sub ?? null;
    } catch {
      return null;
    }
  }, [userId, accessToken]);

  const sortByStartDesc = (a, b) => {
    const aT =
      toDateFromRaw(a.startTime ?? a.reservationStartTime)?.getTime() ?? 0;
    const bT =
      toDateFromRaw(b.startTime ?? b.reservationStartTime)?.getTime() ?? 0;
    return bT - aT;
  };

  const buildGrouped = (reservations) => {
    const visible = (reservations ?? [])
      .filter((r) => !isCanceled(r))
      .sort(sortByStartDesc);
    return groupByDate(visible);
  };

  const fetchReservations = async (uid) => {
    try {
      setLoading(true);
      // 캐시 우회 파라미터로 최초 빈 응답/재사용 방지
      const res = await axiosInstance.get(
        `/api/reservations/user/${uid}?t=${Date.now()}`,
      );
      setGroupedReservations(buildGrouped(res.data?.reservations));
    } catch (err) {
      console.error('예약 내역 불러오기 실패:', err);
      setGroupedReservations({});
    } finally {
      setLoading(false);
    }
  };

  // authReady 이후에만 판단/요청 실행
  useEffect(() => {
    if (!authReady) return;

    if (!accessToken || !resolvedUserId) {
      setGroupedReservations({});
      setLoading(false);
      return;
    }

    const sessionToken =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('accessToken')
        : null;
    if (!sessionToken) {
      const retryTimeout = setTimeout(() => {
        const retryToken =
          typeof window !== 'undefined'
            ? sessionStorage.getItem('accessToken')
            : null;
        if (retryToken && resolvedUserId) {
          fetchReservations(resolvedUserId);
        } else {
          setGroupedReservations({});
          setLoading(false);
        }
      }, 50);
      return () => clearTimeout(retryTimeout);
    }

    fetchReservations(resolvedUserId);
  }, [authReady, resolvedUserId, accessToken]);

  const handleCancelReservation = (reservation) => {
    setCancelModalData(reservation);
  };

  const confirmCancelReservation = async () => {
    if (!cancelModalData || !resolvedUserId) return;
    try {
      const res = await axiosInstance.post('/api/reservations/cancel', {
        userId: resolvedUserId,
        reservationId: cancelModalData.id,
      });
      alert(res.data?.message || '예약이 취소되었습니다.');
      setCancelModalData(null);

      const res2 = await axiosInstance.get(
        `/api/reservations/user/${resolvedUserId}?t=${Date.now()}`,
      );
      setGroupedReservations(buildGrouped(res2.data?.reservations));

      if (fetchAllReservedTimes) await fetchAllReservedTimes();
    } catch (err) {
      console.error('예약 취소 실패:', err);
      alert(err.response?.data?.message || '예약 취소에 실패했습니다.');
    }
  };

  const formatDate = (input) => {
    const d = toDateFromRaw(input);
    return d ? `${d.getMonth() + 1}월 ${d.getDate()}일` : '--월 --일';
  };
  const formatTime = (input) => {
    const d = toDateFromRaw(input);
    if (!d) return '--:--';
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (!authReady || loading) return <div className="p-6">로딩 중...</div>;

  const entries = Object.entries(groupedReservations).filter(
    ([date]) => date !== 'Invalid Date',
  );

  return (
    <div className="w-full">
      {entries.length === 0 ? (
        <div className="p-6 text-sm text-[#73726e]">
          표시할 예약 내역이 없습니다. (취소된 내역은 제외됩니다)
        </div>
      ) : (
        entries.map(([date, reservations]) => (
          <div key={date} className="mb-6">
            <MyPageDate date={date} />
            {reservations.map((reservation) => (
              <ReservationHistory
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancelReservation}
              />
            ))}
          </div>
        ))
      )}

      {cancelModalData && (
        <CancellationModal
          isOpen={true}
          onClose={() => setCancelModalData(null)}
          onConfirm={confirmCancelReservation}
        >
          <div className="text-lg font-semibold text-left mb-6 text-[#37352f]">
            예약을 취소할까요?
          </div>
          <div className="flex items-center gap-4 bg-[#f8f9ff] p-4 rounded-xl border border-gray-100">
            <img
              src="/static/icons/studyroom_image.png"
              alt="studyroom"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex flex-col gap-1 text-sm">
              <div className="font-semibold text-[#37352f]">{`스터디룸 ${cancelModalData.roomName}`}</div>
              <div className="text-[#73726e]">
                {formatDate(cancelModalData.startTime)}
              </div>
              <div className="text-[#73726e]">
                {formatTime(cancelModalData.startTime)} ~{' '}
                {formatTime(cancelModalData.endTime)}
              </div>
            </div>
          </div>
        </CancellationModal>
      )}
    </div>
  );
}
