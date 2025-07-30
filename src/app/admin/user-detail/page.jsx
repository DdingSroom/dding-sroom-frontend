'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ReservationItem from '@components/admin/ReservationItem';

export default function UserDetail() {
  const router = useRouter();

  return (
    <div className="p-6 bg-[#EFF0F3] min-h-screen">
      {/* 상단 제목 및 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 mb-1"
          >
            ← 사용자 관리
          </button>
          <h1 className="text-xl font-semibold">USER 01</h1>
        </div>
        <button className="bg-[#788DFF] text-white text-sm px-4 py-1.5 rounded">
          개인 메시지 보내기
        </button>
      </div>

      {/* 회원 정보 / 활동 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 회원 정보 */}
        <div className="bg-white p-4 rounded shadow-sm relative">
          <h2 className="font-semibold text-sm mb-2">회원 정보</h2>
          <div className="text-sm space-y-1">
            <p>
              이름 <span className="ml-2">USER 01</span>
            </p>
            <p>
              가입 이메일 <span className="ml-2">mju11111@mju.ac.kr</span>
            </p>
          </div>
          <span className="absolute top-4 right-4 text-sm text-red-500">
            사용자 차단
          </span>
        </div>

        {/* 활동 정보 */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-sm mb-2">활동 정보</h2>
          <div className="text-sm space-y-1">
            <p>
              가입일 <span className="ml-2">2024-08-12</span>
            </p>
            <p>
              로그인 <span className="ml-2">2024-08-31</span>
            </p>
            <p>작성</p>
            <p className="ml-4">게시글 0개</p>
            <p className="ml-4">댓글 0개</p>
            <p className="ml-4">건의 0개</p>
            <p>
              신고 <span className="ml-2 text-red-500">0개</span>
            </p>
          </div>
        </div>
      </div>

      {/* 예약 내역 */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold text-sm mb-3">예약 내역</h2>

        {/* 날짜별 예약 */}
        <div className="space-y-4 text-sm">
          {/* 오늘 */}
          <div>
            <p className="text-gray-500 text-xs mb-2">오늘</p>
            <ReservationItem room="스터디룸 1" time="15:00 - 17:00" />
            <ReservationItem room="스터디룸 1" time="17:00 - 19:00" />
          </div>

          {/* 어제 */}
          <div>
            <p className="text-gray-500 text-xs mb-2">어제</p>
            <ReservationItem room="스터디룸 2" time="12:00 - 14:00" />
            <ReservationItem room="스터디룸 5" time="17:00 - 19:00" />
          </div>

          {/* 8월 29일 */}
          <div>
            <p className="text-gray-500 text-xs mb-2">8월 29일</p>
            <ReservationItem room="스터디룸 2" time="12:00 - 14:00" />
            <ReservationItem room="스터디룸 5" time="17:00 - 19:00" />
          </div>
        </div>
      </div>
    </div>
  );
}
