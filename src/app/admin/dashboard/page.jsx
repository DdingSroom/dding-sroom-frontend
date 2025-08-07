'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../libs/api/instance';
import { useRouter } from 'next/navigation';
import ReservationCard from '@components/admin/ReservationCard';
import InfoModal from '../../../components/common/InfoModal';

export default function AdminDashboard() {
  const router = useRouter();
  const [todayReservations, setTodayReservations] = useState([]);
  const [tomorrowReservations, setTomorrowReservations] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
  }, []);

  const formatTimeRange = (start, end) => {
    const formatHM = (arr) => {
      if (!Array.isArray(arr)) return '';
      const [_, __, ___, h = 0, m = 0] = arr;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
    return `${formatHM(start)} ~ ${formatHM(end)}`;
  };

  const formatTimestamp = (arr) => {
    if (!Array.isArray(arr)) return '';
    const [y, mo, d, h = 0, m = 0] = arr;
    return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
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
              onClick={() => setIsInfoModalOpen(true)}
            >
              더보기 →
            </button>
          </div>
          <ul className="space-y-4">
            <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-[#37352f] mb-1">
                [게시물 작성] [일반게시글] 커뮤니티 제목입니다.
              </p>
              <p className="text-xs text-[#73726e]">
                USER 01 · 2024-08-31 15:20
              </p>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-[#37352f] mb-1">
                [게시물 작성] [분실물게시글] 커뮤니티 제목입니다.
              </p>
              <p className="text-xs text-[#73726e]">
                USER 02 · 2024-08-31 15:20
              </p>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-[#37352f] mb-1">
                [댓글 작성] 댓글 내용입니다.
              </p>
              <p className="text-xs text-[#73726e]">
                USER 01 · 2024-08-31 15:20
              </p>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-[#37352f] mb-1">
                [게시물 작성] [일반게시글] 커뮤니티 제목입니다.
              </p>
              <p className="text-xs text-[#73726e]">
                USER 03 · 2024-08-31 15:20
              </p>
            </li>
          </ul>
        </div>

        {/* 분실물 신고 */}
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#37352f]">
              분실물 신고
            </h2>
            <button
              className="text-sm text-[#788DFF] hover:text-[#6a7dff] font-medium transition-colors"
              onClick={() => setIsInfoModalOpen(true)}
            >
              더보기 →
            </button>
          </div>
          <div className="flex gap-4">
            {[1, 2, 3].map((item, idx) => (
              <div
                key={idx}
                className="w-36 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
              >
                {item === 3 ? (
                  <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-xs text-[#9b9998] rounded-t-xl">
                    NO IMAGE
                  </div>
                ) : (
                  <img
                    src={`/lost${item}.jpg`}
                    alt={`분실물${item}`}
                    className="w-full h-24 object-cover rounded-t-xl"
                  />
                )}
                <div className="p-3 text-center space-y-1">
                  <p className="text-sm font-medium text-[#37352f]">
                    분실물 이름
                  </p>
                  <p className="text-xs text-[#73726e]">스터디룸{item}</p>
                  <p className="text-xs text-[#9b9998]">2024-08-31</p>
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
              onClick={() => setIsInfoModalOpen(true)}
            >
              더보기 →
            </button>
          </div>
          <ul className="space-y-4">
            <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-[#37352f] mb-1">
                [소음문제] 건의제목입니다.
              </p>
              <p className="text-xs text-[#73726e]">
                USER 01 · 2024-08-31 15:20
              </p>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-[#37352f] mb-1">
                [분실물] 건의제목입니다.
              </p>
              <p className="text-xs text-[#73726e]">
                USER 02 · 2024-08-31 15:20
              </p>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-[#37352f] mb-1">
                [시설요청] 건의제목입니다.
              </p>
              <p className="text-xs text-[#73726e]">
                USER 02 · 2024-08-31 15:20
              </p>
            </li>
            <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="text-sm font-medium text-[#37352f] mb-1">
                [기타] 건의제목입니다.
              </p>
              <p className="text-xs text-[#73726e]">
                USER 03 · 2024-08-31 15:20
              </p>
            </li>
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
