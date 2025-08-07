'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../libs/api/instance';
import { useRouter } from 'next/navigation';
import ReservationCard from '@components/admin/ReservationCard';

export default function AdminDashboard() {
  const router = useRouter();
  const [todayReservations, setTodayReservations] = useState([]);
  const [tomorrowReservations, setTomorrowReservations] = useState([]);

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
    <div className="w-full min-h-screen bg-[#F5F5F5] px-10 py-8">
      <div className="flex justify-between items-center bg-white border p-4 rounded mb-6">
        <h1 className="text-lg font-semibold">관리자 페이지 대시보드</h1>
        <div className="flex gap-2">
          <button
            className="bg-[#788DFF] text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/')}
          >
            예약 서비스 화면으로 가기
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">날짜별 예약 현황</h2>
            <button
              className="text-sm text-[#788DFF]"
              onClick={() => router.push('/admin/reservations-by-date')}
            >
              더보기
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">오늘 예약</h3>
              <ul className="space-y-4 text-sm">
                {todayReservations.map((item) => (
                  <ReservationCard
                    key={item.id}
                    roomName={`스터디룸 ${item.roomName}`}
                    time={formatTimeRange(item.startTime, item.endTime)}
                    userName={`사용자 ID: ${item.userId}`}
                    timestamp={formatTimestamp(item.createdAt)}
                  />
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">내일 예약</h3>
              <ul className="space-y-4 text-sm">
                {tomorrowReservations.map((item) => (
                  <ReservationCard
                    key={item.id}
                    roomName={`스터디룸 ${item.roomName}`}
                    time={formatTimeRange(item.startTime, item.endTime)}
                    userName={`사용자 ID: ${item.userId}`}
                    timestamp={formatTimestamp(item.createdAt)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 커뮤니티 */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">커뮤니티</h2>
            <button className="text-sm text-[#788DFF]">더보기</button>
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <p>[게시물 작성] [일반게시글] 커뮤니티 제목입니다.</p>
              <p className="text-xs text-gray-500">
                USER 01 · 2024-08-31 15:20
              </p>
            </li>
            <li>
              <p>[게시물 작성] [분실물게시글] 커뮤니티 제목입니다.</p>
              <p className="text-xs text-gray-500">
                USER 02 · 2024-08-31 15:20
              </p>
            </li>
            <li>
              <p>[댓글 작성] 댓글 내용입니다.</p>
              <p className="text-xs text-gray-500">
                USER 01 · 2024-08-31 15:20
              </p>
            </li>
            <li>
              <p>[게시물 작성] [일반게시글] 커뮤니티 제목입니다.</p>
              <p className="text-xs text-gray-500">
                USER 03 · 2024-08-31 15:20
              </p>
            </li>
          </ul>
        </div>

        {/* 분실물 신고 */}
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">분실물 신고</h2>
            <button className="text-sm text-[#788DFF]">더보기</button>
          </div>
          <div className="flex gap-4">
            {[1, 2, 3].map((item, idx) => (
              <div
                key={idx}
                className="w-32 h-40 bg-gray-100 rounded text-xs flex flex-col items-center justify-start"
              >
                {item === 3 ? (
                  <div className="w-full h-20 bg-gray-300 flex items-center justify-center text-xs">
                    NO IMAGE
                  </div>
                ) : (
                  <img
                    src={`/lost${item}.jpg`}
                    alt={`분실물${item}`}
                    className="w-full h-20 object-cover rounded-t"
                  />
                )}
                <div className="mt-2 text-center">
                  분실물 이름
                  <br />
                  스터디룸{item}
                  <br />
                  2024-08-31
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 답변대기 건의 */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">답변대기 건의</h2>
            <button className="text-sm text-[#788DFF]">더보기</button>
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <p>[소음문제] 건의제목입니다.</p>
              <p className="text-xs text-gray-500">
                USER 01 · 2024-08-31 15:20
              </p>
            </li>
            <li>
              <p>[분실물] 건의제목입니다.</p>
              <p className="text-xs text-gray-500">
                USER 02 · 2024-08-31 15:20
              </p>
            </li>
            <li>
              <p>[시설요청] 건의제목입니다.</p>
              <p className="text-xs text-gray-500">
                USER 02 · 2024-08-31 15:20
              </p>
            </li>
            <li>
              <p>[기타] 건의제목입니다.</p>
              <p className="text-xs text-gray-500">
                USER 03 · 2024-08-31 15:20
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
