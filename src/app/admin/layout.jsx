'use client';

import { useState } from 'react';
import InfoModal from '../../components/common/InfoModal';

// export const metadata = {
//   title: 'DdingsRoom 관리자',
//   description: '명지대학교 스터디룸 관리자 페이지',
// };

export default function AdminLayout({ children }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <html lang="ko">
      <body className="admin-body bg-[#F5F5F5] min-h-screen overflow-x-hidden">
        <div className="w-full min-h-screen bg-[#F5F5F5] flex">
          <aside className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
            <h1 className="text-xl font-bold mb-8">사이트 관리</h1>
            <nav className="flex flex-col gap-4 text-sm text-gray-700">
              <a
                href="/admin/dashboard"
                className="text-gray-700 hover:text-[#5B72EE] font-semibold transition-colors"
              >
                대시보드
              </a>
              <a
                href="/admin/user-management"
                className="hover:text-[#788cff] transition-colors"
              >
                사용자 관리
              </a>
              <a
                href="/admin/reservations-by-date"
                className="hover:text-[#788cff] transition-colors"
              >
                날짜별 예약 현황
              </a>
              <a
                href="/admin/reservation-detail"
                className="hover:text-[#788cff] transition-colors"
              >
                예약 목록
              </a>
              <a
                href="/admin/community"
                className="hover:text-[#788cff] transition-colors"
              >
                커뮤니티 관리
              </a>
              <a
                href="/admin/suggestions"
                className="hover:text-[#788cff] transition-colors"
              >
                건의 내역
              </a>
              <a
                href="/admin/room-management"
                className="hover:text-[#788cff] transition-colors"
              >
                스터디룸 관리
              </a>
              <a
                href="/admin/notifications"
                className="hover:text-[#788cff] transition-colors"
              >
                공지사항 관리
              </a>
            </nav>
          </aside>

          <main className="flex-1 p-10 overflow-y-auto">{children}</main>
        </div>
        {/*  */}
        <InfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
        />

        {/* 모바일 접근 제한 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.innerWidth < 768) {
                alert('관리자 페이지는 데스크탑에서만 접속 가능합니다.');
                window.location.href = '/';
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
