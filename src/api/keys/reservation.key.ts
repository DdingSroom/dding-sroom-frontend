import { createQueryKeys } from '@lukemorales/query-key-factory';

import { getAllReservations, getMyReservations } from '@api/reservation.api';

/** ---------- (공통) 예약 쿼리 ----------- */
export const reservation = createQueryKeys('reservation', {
  // 모든 예약 조회
  getAll: () => ({
    queryKey: ['all'],
    queryFn: () => getAllReservations,
  }),
  // 나의 예약 조회
  getMyReservations: () => ({
    queryKey: ['me'],
    queryFn: () => getMyReservations,
  }),
});
