'use client';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@constants/routes';

export default function useAppNavigation() {
  const router = useRouter();

  return {
    // 공통
    goHome: () => router.push(ROUTES.HOME),
    goBack: () => router.back(),

    // 로그인 이동: 회원 탈퇴 완료 후 등 SPA 이동
    goToLogin: () => router.push(ROUTES.LOGIN),
    // 로그인 이동: 로그아웃 후 전체 페이지 새로고침(window.location)으로 상태 초기화
    redirectToLoginHard: () => {
      window.location.href = ROUTES.LOGIN;
    },

    // 관리자 대시보드 바로가기
    goToReservationsByDate: () =>
      router.push(ROUTES.ADMIN_RESERVATIONS_BY_DATE),
    goToAdminCommunity: () => router.push(ROUTES.ADMIN_COMMUNITY),
    goToRoomManagement: () => router.push(ROUTES.ADMIN_ROOM_MANAGEMENT),
    goToSuggestions: () => router.push(ROUTES.ADMIN_SUGGESTIONS),

    // 사용자 상세 (ID 포함 동적 경로)
    goToUserDetail: (userId: number) =>
      router.push(ROUTES.ADMIN_USER_DETAIL(userId)),
  };
}
