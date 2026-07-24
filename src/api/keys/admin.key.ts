import { createQueryKeyStore } from '@lukemorales/query-key-factory';

export const admin = createQueryKeyStore({
  /** ---------- (관리자) 유저 쿼리 ----------- */
  users: {
    // 전체 유저 조회
    getAll: () => ({
      queryKey: ['all'],
      queryFn: null,
    }),
    // 특정 유저 조회
    getById: (id: number) => ({
      queryKey: [id],
      queryFn: null,
    }),
  },
  /** ---------- (관리자) 예약 쿼리 ----------- */
  reservations: {
    // 전체 예약 조회
    getAll: () => ({
      queryKey: ['all'],
      queryFn: null,
    }),
    // 특정 예약 조회
    getById: (id: number) => ({
      queryKey: [id],
      queryFn: null,
    }),
    // 특정 유저의 예약 조회
    getByUserId: (userId: number) => ({
      queryKey: [userId],
      queryFn: null,
    }),
  },
  /** ---------- (관리자) 스터디룸 관리 쿼리 ----------- */
  rooms: {
    getAll: () => ({
      queryKey: ['all'],
      queryFn: null,
    }),
    getById: (id: number) => ({
      queryKey: [id],
      queryFn: null,
    }),
  },
});
