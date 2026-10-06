import { createQueryKeyStore } from '@lukemorales/query-key-factory';

import {
  getAllReservations,
  getAllUsers,
  getReservationsByUserId,
  getRoomById,
  getUserById,
} from '@shared/api/admin';

/** ---------- (관리자) 유저 쿼리 ----------- */
const usersStore = createQueryKeyStore({
  'admin/users': {
    // 전체 유저 조회
    getAll: () => ({
      queryKey: ['all'],
      queryFn: () => getAllUsers(),
    }),
    // 특정 유저 조회
    getById: (id: number) => ({
      queryKey: [id],
      queryFn: () => getUserById(id),
    }),
  },
});

/** ---------- (관리자) 예약 쿼리 ----------- */
const reservationsStore = createQueryKeyStore({
  'admin/reservations': {
    // 전체 예약 조회
    getAll: () => ({
      queryKey: ['all'],
      queryFn: () => getAllReservations(),
    }),
    // 특정 예약 조회: 담당 범위에 단건 조회 API가 없어 queryFn 미연결
    getById: (id: number) => ({
      queryKey: [id],
    }),
    // 특정 유저의 예약 조회
    getByUserId: (userId: number) => ({
      queryKey: [userId],
      queryFn: () => getReservationsByUserId(userId),
    }),
  },
});

/** ---------- (관리자) 스터디룸 관리 쿼리 ----------- */
const roomsStore = createQueryKeyStore({
  'admin/rooms': {
    // 전체 조회 API는 없고 단건(getRoomById)만 존재하므로 queryFn 미연결
    getAll: () => ({
      queryKey: ['all'],
    }),
    getById: (id: number) => ({
      queryKey: [id],
      queryFn: () => getRoomById(id),
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
