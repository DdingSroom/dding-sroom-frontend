'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueries, useQuery } from '@tanstack/react-query';

import ReservationCard from '@components/admin/ReservationCard';

import axiosInstance from '@api/instance';
import { admin } from '@api/keys/admin.key';
import { ADMIN_ROLE } from '@constants/auth';
import { STUDYROOM_IMAGE_SRC } from '@constants/images';
import useAuthReady from '@hooks/useAuthReady';

import BasicModal from '../../../components/common/basic-modal';

const ROOM_IDS = [1, 2, 3, 4, 5];
const KNOWN_ROOM_STATUS = ['IDLE', 'OCCUPIED', 'MAINTENANCE'];

export default function AdminDashboard() {
  const router = useRouter();
  const { authReady, accessToken, role } = useAuthReady();
  const adminEnabled = authReady && !!accessToken && role === ADMIN_ROLE;
  const [communityData, setCommunityData] = useState([]);
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const formatTimeRange = useCallback((start, end) => {
    const formatHM = (arr) => {
      if (!Array.isArray(arr)) {
        return '';
      }
      const [, , , h = 0, m = 0] = arr;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    return `${formatHM(start)} ~ ${formatHM(end)}`;
  }, []);

  const formatTimestamp = useCallback((arr) => {
    if (!Array.isArray(arr)) {
      return '';
    }
    const [y, mo, d, h = 0, m = 0] = arr;
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }, []);

  const normalizePost = useCallback(
    (raw) => ({
      id: raw?.id ?? raw?.post_id ?? raw?.postId,
      title: raw?.title ?? raw?.post_title ?? '(제목 없음)',
      author: raw?.author ?? raw?.user_name ?? raw?.userName ?? '익명',
      content: raw?.content ?? raw?.post_content ?? '',
      createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.created_date ?? [],
      commentCount: raw?.comment_count ?? raw?.commentCount ?? 0,
    }),
    [],
  );

  const normalizeSuggestion = useCallback(
    (raw) => ({
      id: raw?.id ?? raw?.suggest_id ?? raw?.suggestionId,
      userId: raw?.userId ?? raw?.user_id ?? raw?.uid,
      category: raw?.category ?? '',
      location: raw?.location ?? '',
      title: raw?.title ?? raw?.suggest_title ?? '',
      content: raw?.content ?? raw?.suggest_content ?? '',
      createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.created_date ?? [],
    }),
    [],
  );

  const { data: reservationList = [] } = useQuery({
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

  const { todayReservations, tomorrowReservations } = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (dateArr, dateObj) =>
      Array.isArray(dateArr) &&
      dateArr[0] === dateObj.getFullYear() &&
      dateArr[1] === dateObj.getMonth() + 1 &&
      dateArr[2] === dateObj.getDate();

    const getRandomThree = (arr) =>
      arr
        .slice()
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    return {
      todayReservations: getRandomThree(
        reservationList.filter((r) => isSameDay(r.startTime, today)),
      ),
      tomorrowReservations: getRandomThree(
        reservationList.filter((r) => isSameDay(r.startTime, tomorrow)),
      ),
    };
  }, [reservationList]);

  const fetchCommunityData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/community-posts', {
        params: { page: 0, size: 3 },
      });
      const data = response?.data?.data || response?.data || [];
      const postsArray = data.posts || data.content || data || [];
      setCommunityData(postsArray.slice(0, 3).map(normalizePost));
    } catch (err) {
      console.error('커뮤니티 데이터 불러오기 실패:', err);
    }
  }, [normalizePost]);

  const fetchSuggestionsData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/suggestions', {
        params: { is_answered: 'false' },
      });
      const suggestions = (
        response?.data?.suggestions ??
        response?.data ??
        []
      ).map(normalizeSuggestion);
      setSuggestionsData(suggestions.slice(0, 3));
    } catch (err) {
      console.error('건의 데이터 불러오기 실패:', err);
    }
  }, [normalizeSuggestion]);

  const roomQueries = useQueries({
    queries: ROOM_IDS.map((id) => ({
      ...admin.admin.rooms.getById(id),
      enabled: adminEnabled,
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      select: (res) => {
        const data = res?.data;
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('스터디룸 응답 형식이 올바르지 않습니다.');
        }
        return data;
      },
    })),
  });

  const roomData = ROOM_IDS.map((id, index) => {
    const q = roomQueries[index];
    const rawStatus =
      typeof q.data?.status === 'string' ? q.data.status.toUpperCase() : null;
    const status = KNOWN_ROOM_STATUS.includes(rawStatus) ? rawStatus : null;
    return {
      id,
      failed: q.isError,
      unknownStatus: !q.isError && status == null,
      status,
      name: q.data?.name || `스터디룸 ${id}`,
    };
  });

  useEffect(() => {
    fetchCommunityData();
    fetchSuggestionsData();
  }, [fetchCommunityData, fetchSuggestionsData]);

  return (
    <div className="w-full min-h-screen bg-gray-50 px-8 py-6">
      <div className="flex justify-between items-center bg-white border border-gray-100 p-6 rounded-2xl shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-content">관리자 대시보드</h1>
        <button
          className="bg-brand hover:bg-brand-hover text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          onClick={() => router.push('/')}
        >
          예약 서비스 화면으로 가기
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 날짜별 예약 현황 */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-content">
              날짜별 예약 현황
            </h2>
            <button
              className="text-sm text-brand hover:text-brand-hover font-medium transition-colors"
              onClick={() => router.push('/admin/reservations-by-date')}
            >
              더보기 →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-4 text-content pb-2 border-b border-gray-100">
                오늘 예약
              </h3>
              <div className="space-y-3">
                {todayReservations.map((item) => (
                  <ReservationCard
                    key={item.id}
                    roomName={`스터디룸 ${item.roomName}`}
                    time={formatTimeRange(item.startTime, item.endTime)}
                    userName={`사용자 ID: ${item.userId}`}
                    timestamp={formatTimestamp(item.createdAt)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4 text-content pb-2 border-b border-gray-100">
                내일 예약
              </h3>
              <div className="space-y-3">
                {tomorrowReservations.map((item) => (
                  <ReservationCard
                    key={item.id}
                    roomName={`스터디룸 ${item.roomName}`}
                    time={formatTimeRange(item.startTime, item.endTime)}
                    userName={`사용자 ID: ${item.userId}`}
                    timestamp={formatTimestamp(item.createdAt)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 커뮤니티 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-content">커뮤니티</h2>
            <button
              className="text-sm text-brand hover:text-brand-hover font-medium transition-colors"
              onClick={() => router.push('/admin/community')}
            >
              더보기 →
            </button>
          </div>
          <ul className="space-y-4">
            {communityData.length > 0 ? (
              communityData.map((post) => (
                <li
                  key={post.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm font-medium text-content mb-1">
                    [게시물 작성] {post.title}
                  </p>
                  <p className="text-xs text-content-secondary">
                    {post.author} · {formatTimestamp(post.createdAt)}
                  </p>
                </li>
              ))
            ) : (
              <li className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">
                  커뮤니티 게시글이 없습니다.
                </p>
              </li>
            )}
          </ul>
        </div>

        {/* 스터디룸 관리 */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-content">
              스터디룸 관리
            </h2>
            <button
              className="text-sm text-brand hover:text-brand-hover font-medium transition-colors"
              onClick={() => router.push('/admin/room-management')}
            >
              더보기 →
            </button>
          </div>
          <div className="space-y-3">
            {roomData.slice(0, 3).map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img
                      src={STUDYROOM_IMAGE_SRC}
                      alt={`스터디룸 ${room.id}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-content">
                      스터디룸 {room.id}
                    </p>
                    <p className="text-xs text-content-secondary">
                      방 번호: {room.id}
                    </p>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      room.failed || room.unknownStatus
                        ? 'bg-red-100 text-red-700'
                        : room.status === 'IDLE'
                          ? 'bg-green-100 text-green-700'
                          : room.status === 'OCCUPIED'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {room.failed
                      ? '조회 실패'
                      : room.unknownStatus
                        ? '상태 확인 불가'
                        : room.status === 'IDLE'
                          ? '예약 가능'
                          : room.status === 'OCCUPIED'
                            ? '사용 중'
                            : '예약 불가'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 답변대기 건의 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-content">
              답변대기 건의
            </h2>
            <button
              className="text-sm text-brand hover:text-brand-hover font-medium transition-colors"
              onClick={() => router.push('/admin/suggestions')}
            >
              더보기 →
            </button>
          </div>
          <ul className="space-y-4">
            {suggestionsData.length > 0 ? (
              suggestionsData.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm font-medium text-content mb-1">
                    [{suggestion.category}] {suggestion.title}
                  </p>
                  <p className="text-xs text-content-secondary">
                    USER {suggestion.userId} ·{' '}
                    {formatTimestamp(suggestion.createdAt)}
                  </p>
                </li>
              ))
            ) : (
              <li className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">
                  답변대기 건의가 없습니다.
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>

      <BasicModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        className="max-w-modal-sm"
        title="알림"
        message="시범 운영 단계에서 지원되지 않는 기능입니다"
        actions={[{ text: '확인', onClick: () => setIsInfoModalOpen(false) }]}
      />
    </div>
  );
}
