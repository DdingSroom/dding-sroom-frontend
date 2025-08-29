'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../../../libs/api/instance';
import InfoModal from '../../../components/common/InfoModal';
import useTokenStore from '../../../stores/useTokenStore';
import ReservationCard from '@components/admin/ReservationCard';

export default function AdminDashboard() {
  const router = useRouter();
  const [todayReservations, setTodayReservations] = useState([]);
  const [tomorrowReservations, setTomorrowReservations] = useState([]);
  const [communityData, setCommunityData] = useState([]);
  const [suggestionsData, setSuggestionsData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
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

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get('/admin/reservations');
      console.log('전체 예약 응답:', response);

      const reservations = response.data.reservations || [];
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const isSameDay = (dateArr1, dateObj2) => {
        return (
          dateArr1[0] === dateObj2.getFullYear() &&
          dateArr1[1] === dateObj2.getMonth() + 1 &&
          dateArr1[2] === dateObj2.getDate()
        );
      };

      const todayFiltered = reservations.filter((r) =>
        isSameDay(r.startTime, today),
      );
      const tomorrowFiltered = reservations.filter((r) =>
        isSameDay(r.startTime, tomorrow),
      );

      const getRandomThree = (arr) =>
        arr.sort(() => 0.5 - Math.random()).slice(0, 3);

      setTodayReservations(getRandomThree(todayFiltered));
      setTomorrowReservations(getRandomThree(tomorrowFiltered));
    } catch (err) {
      console.error('예약 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchCommunityData();
    fetchSuggestionsData();
    fetchRoomData();

    // 스터디룸 상태 실시간 업데이트를 위한 폴링 (30초마다)
    const roomStatusInterval = setInterval(() => {
      fetchRoomData();
    }, 30000);

    // 페이지가 포커스될 때 스터디룸 상태 새로고침
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchRoomData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchRoomData);

    return () => {
      clearInterval(roomStatusInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchRoomData);
    };
  }, [fetchCommunityData, fetchSuggestionsData]);

  const formatTimeRange = (start, end) => {
    const formatHM = (arr) => {
      if (!Array.isArray(arr)) return '';
      const [, , , h = 0, m = 0] = arr;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    return `${formatHM(start)} ~ ${formatHM(end)}`;
  };

  const formatTimestamp = (arr) => {
    if (!Array.isArray(arr)) return '';
    const [y, mo, d, h = 0, m = 0] = arr;
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const fetchCommunityData = async () => {
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
  };

  const fetchSuggestionsData = async () => {
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
  };

  const fetchRoomData = async () => {
    try {
      const roomIds = [1, 2, 3, 4, 5];
      const roomPromises = roomIds.map(async (id) => {
        try {
          const response = await axiosInstance.get(`/admin/rooms/${id}`);
          const data = response?.data?.data || {};
          return {
            id,
            status: data.status || 'IDLE',
            name: data.name || `스터디룸 ${id}`,
          };
        } catch (err) {
          return {
            id,
            status: 'IDLE',
            name: `스터디룸 ${id}`,
          };
        }
      });
      const rooms = await Promise.all(roomPromises);
      setRoomData(rooms);
    } catch (err) {
      console.error('스터디룸 데이터 불러오기 실패:', err);
    }
  };

  const normalizePost = (raw) => {
    return {
      id: raw?.id ?? raw?.post_id ?? raw?.postId,
      title: raw?.title ?? raw?.post_title ?? '(제목 없음)',
      author: raw?.author ?? raw?.user_name ?? raw?.userName ?? '익명',
      content: raw?.content ?? raw?.post_content ?? '',
      createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.created_date ?? [],
      commentCount: raw?.comment_count ?? raw?.commentCount ?? 0,
    };
  };

  const normalizeSuggestion = (raw) => {
    return {
      id: raw?.id ?? raw?.suggest_id ?? raw?.suggestionId,
      userId: raw?.userId ?? raw?.user_id ?? raw?.uid,
      category: raw?.category ?? '',
      location: raw?.location ?? '',
      title: raw?.title ?? raw?.suggest_title ?? '',
      content: raw?.content ?? raw?.suggest_content ?? '',
      createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.created_date ?? [],
    };
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-8 py-6">
      <div className="flex justify-between items-center bg-white border border-gray-100 p-6 rounded-2xl shadow-sm mb-8">
        <h1 className="text-2xl font-bold text-[#37352f]">관리자 대시보드</h1>
        <button
          className="bg-[#788DFF] hover:bg-[#6a7dff] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          onClick={() => router.push('/')}
        >
          예약 서비스 화면으로 가기
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#37352f]">
              날짜별 예약 현황
            </h2>
            <button
              className="text-sm text-[#788DFF] hover:text-[#6a7dff] font-medium transition-colors"
              onClick={() => router.push('/admin/reservations-by-date')}
            >
              더보기 →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-4 text-[#37352f] pb-2 border-b border-gray-100">
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
              <h3 className="text-sm font-semibold mb-4 text-[#37352f] pb-2 border-b border-gray-100">
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
            <h2 className="text-lg font-semibold text-[#37352f]">커뮤니티</h2>
            <button
              className="text-sm text-[#788DFF] hover:text-[#6a7dff] font-medium transition-colors"
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
                  <p className="text-sm font-medium text-[#37352f] mb-1">
                    [게시물 작성] {post.title}
                  </p>
                  <p className="text-xs text-[#73726e]">
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
            <h2 className="text-lg font-semibold text-[#37352f]">
              스터디룸 관리
            </h2>
            <button
              className="text-sm text-[#788DFF] hover:text-[#6a7dff] font-medium transition-colors"
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
                      src="/static/icons/studyroom_image.png"
                      alt={`스터디룸 ${room.id}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#37352f]">
                      스터디룸 {room.id}
                    </p>
                    <p className="text-xs text-[#73726e]">방 번호: {room.id}</p>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      room.status === 'IDLE'
                        ? 'bg-green-100 text-green-700'
                        : room.status === 'OCCUPIED'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {room.status === 'IDLE'
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
            <h2 className="text-lg font-semibold text-[#37352f]">
              답변대기 건의
            </h2>
            <button
              className="text-sm text-[#788DFF] hover:text-[#6a7dff] font-medium transition-colors"
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
                  <p className="text-sm font-medium text-[#37352f] mb-1">
                    [{suggestion.category}] {suggestion.title}
                  </p>
                  <p className="text-xs text-[#73726e]">
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

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
