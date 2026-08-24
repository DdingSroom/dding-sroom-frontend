import { createQueryKeyStore } from '@lukemorales/query-key-factory';

/** ---------- (관리자) 유저 쿼리 ----------- */
const usersStore = createQueryKeyStore({
  'admin/users': {
    // 전체 유저 조회
    getAll: () => ({
      queryKey: ['all'],
      // queryFn: () => null, (추후 추가 예정)
    }),
    // 특정 유저 조회
    getById: (id: number) => ({
      queryKey: [id],
      // queryFn: () => null,
    }),
  },
});

/** ---------- (관리자) 예약 쿼리 ----------- */
const reservationsStore = createQueryKeyStore({
  'admin/reservations': {
    // 전체 예약 조회
    getAll: () => ({
      queryKey: ['all'],
      // queryFn: () => null,
    }),
    // 특정 예약 조회
    getById: (id: number) => ({
      queryKey: [id],
      // queryFn: () => null,
    }),
    // 특정 유저의 예약 조회
    getByUserId: (userId: number) => ({
      queryKey: [userId],
      // queryFn: () => null,
    }),
  },
});

/** ---------- (관리자) 스터디룸 관리 쿼리 ----------- */
const roomsStore = createQueryKeyStore({
  'admin/rooms': {
    getAll: () => ({
      queryKey: ['all'],
      // queryFn: () => null,
    }),
    getById: (id: number) => ({
      queryKey: [id],
      // queryFn: () => null,
    }),
  },
});

export const admin = {
  admin: {
    users: usersStore['admin/users'],
    reservations: reservationsStore['admin/reservations'],
    rooms: roomsStore['admin/rooms'],
  },
};
