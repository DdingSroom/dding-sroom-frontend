export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  // 마이페이지
  MY_RESERVATION_LIST: '/my/reservation-list',
  MY_POSTS: '/my/posts',
  MY_COMMENTS: '/my/comments',
  MY_CANCEL_ACCOUNT_STEP1: '/my/cancel-account-step1',
  RESET_PASSWORD_STEP1: '/reset-password/step1',

  // 관리자
  ADMIN_RESERVATIONS_BY_DATE: '/admin/reservations-by-date',
  ADMIN_COMMUNITY: '/admin/community',
  ADMIN_ROOM_MANAGEMENT: '/admin/room-management',
  ADMIN_SUGGESTIONS: '/admin/suggestions',
  ADMIN_USER_DETAIL: (userId: number) => `/admin/user-detail/${userId}`,
} as const;
