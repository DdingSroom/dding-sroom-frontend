'use client';

import React from 'react';
import ReservationCard from '@components/admin/ReservationCard';

export default function AdminDashboard() {
  return (
    <div className="w-full min-h-screen bg-[#F5F5F5] px-10 py-8">
      <div className="flex justify-between items-center bg-white border p-4 rounded mb-6">
        <h1 className="text-lg font-semibold">
          오늘의 할 일{' '}
          <span className="ml-2 text-white text-xs px-2 py-1 rounded bg-[#788DFF]">
            2
          </span>
        </h1>
        <div className="flex gap-2">
          <button className="bg-[#788DFF] text-white text-sm px-4 py-2 rounded">
            현황 업데이트
          </button>
          <button className="bg-[#888888] text-white text-sm px-4 py-2 rounded">
            나가기
          </button>
        </div>
      </div>

      <div className="text-sm text-[#333] mb-6">
        답변대기 건의 <span className="text-[#788DFF]">2</span> / 불쾌사용자
        신고 <span className="text-[#788DFF]">0</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 예약 현황 */}
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">예약 현황</h2>
            <button className="text-sm text-[#788DFF]">더보기</button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-2">오늘 예약</h3>
              <ul className="space-y-4 text-sm">
                <ReservationCard
                  roomName="스터디룸 01"
                  time="15:00 ~ 17:00"
                  userName="USER 01"
                  timestamp="2024-08-31 14:51"
                />
                <ReservationCard
                  roomName="스터디룸 02"
                  time="15:00 ~ 16:00"
                  userName="USER 02"
                  timestamp="2024-08-31 14:30"
                />
                <ReservationCard
                  roomName="스터디룸 04"
                  time="15:00 ~ 17:00"
                  userName="USER 03"
                  timestamp="2024-08-31 14:02"
                />
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">내일 예약</h3>
              <ul className="space-y-4 text-sm">
                <ReservationCard
                  roomName="스터디룸 01"
                  time="12:00~14:00"
                  userName="USER 01"
                  timestamp="2024-08-31 14:51"
                />
                <ReservationCard
                  roomName="스터디룸 02"
                  time="17:00~19:00"
                  userName="USER 02"
                  timestamp="2024-08-31 14:30"
                />
                <ReservationCard
                  roomName="스터디룸 04"
                  time="01:00~03:00"
                  userName="USER 03"
                  timestamp="2024-08-31 14:02"
                />
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
