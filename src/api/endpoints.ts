export const USER_API_ENDPOINTS = {
  CHANGE_USERNAME: '/user/change-username',
  VERIFY_EMAIL: '/user/verify-email',
  WITHDRAW: '/user/withdraw',
} as const;

export const ADMIN_API_ENDPOINTS = {
  USERS: '/admin/users',
  USER_BY_ID: (userId: number) => `/admin/users/${userId}`,
  USER_STATUS: (userId: number) => `/admin/users/${userId}/status`,
  RESERVATIONS: '/admin/reservations',
  RESERVATIONS_BY_USER: (userId: number) =>
    `/admin/reservations/user/${userId}`,
  RESERVATION_FORCE_CANCEL: (reservationId: number) =>
    `/admin/reservations/${reservationId}/force-cancel`,
  ROOM_BY_ID: (roomId: number) => `/admin/rooms/${roomId}`,
  ROOM_STATUS: (roomId: number) => `/admin/rooms/${roomId}/status`,
} as const;
