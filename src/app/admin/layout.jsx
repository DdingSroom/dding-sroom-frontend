'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import BasicModal from '../../components/common/basic-modal';

// export const metadata = {
//   title: 'DdingsRoom 관리자',
//   description: '명지대학교 스터디룸 관리자 페이지',
// };

export default function AdminLayout({ children }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isMobileBlocked, setIsMobileBlocked] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobileBlocked(true);
    }
  }, []);

  const handleMobileBlockedConfirm = () => {
    window.location.href = '/';
  };

  return (
    <>
      <div className="w-full min-h-screen bg-surface-admin flex overflow-x-hidden">
        <aside className="w-64 bg-white border-r p-6 hidden md:flex flex-col">
          <h1 className="text-xl font-bold mb-8">사이트 관리</h1>
          <nav className="flex flex-col gap-4 text-sm text-gray-700">
            <Link
              href="/admin/dashboard"
              className="text-gray-700 hover:text-login-btn font-semibold transition-colors"
            >
              대시보드
            </Link>
            <Link
              href="/admin/user-management"
              className="hover:text-brand transition-colors"
            >
              사용자 관리
            </Link>
            <Link
              href="/admin/reservations-by-date"
              className="hover:text-brand transition-colors"
            >
              날짜별 예약 현황
            </Link>
            <Link
              href="/admin/reservation-detail"
              className="hover:text-brand transition-colors"
            >
              예약 목록
            </Link>
            <Link
              href="/admin/community"
              className="hover:text-brand transition-colors"
            >
              커뮤니티 관리
            </Link>
            <Link
              href="/admin/suggestions"
              className="hover:text-brand transition-colors"
            >
              건의 내역
            </Link>
            <Link
              href="/admin/room-management"
              className="hover:text-brand transition-colors"
            >
              스터디룸 관리
            </Link>
            <Link
              href="/admin/notifications"
              className="hover:text-brand transition-colors"
            >
              공지사항 관리
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-10 overflow-y-auto">{children}</main>
      </div>
      {/*  */}
      <BasicModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        className="max-w-modal-sm"
        title="알림"
        message="시범 운영 단계에서 지원되지 않는 기능입니다"
        actions={[{ text: '확인', onClick: () => setIsInfoModalOpen(false) }]}
      />

      {/* 모바일 접근 제한 */}
      <BasicModal
        isOpen={isMobileBlocked}
        onClose={handleMobileBlockedConfirm}
        closeOnOverlayClick={false}
        className="max-w-modal-sm"
        title="알림"
        message="관리자 페이지는 데스크탑에서만 접속 가능합니다."
        actions={[{ text: '확인', onClick: handleMobileBlockedConfirm }]}
      />
    </>
  );
}
