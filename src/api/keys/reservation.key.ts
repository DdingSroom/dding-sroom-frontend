import { createQueryKeys } from '@lukemorales/query-key-factory';

/** ---------- (공통) 예약 쿼리 ----------- */
export const reservation = createQueryKeys('reservation', {
  // 모든 예약 조회
  getAll: () => ({
    queryKey: ['all'],
    queryFn: null,
  }),
  // 나의 예약 조회
  getMyReservations: () => ({
    queryKey: ['me'],
    queryFn: null,
  }),
});
