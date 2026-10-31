import { createQueryKeyStore } from '@lukemorales/query-key-factory';

import {
  getAllReservations,
  getAllRooms,
  getAllUsers,
  getReservationsByUserId,
  getRoomById,
  getUserById,
} from '@api/admin.api';

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
    // 특정 예약 조회: 명세에 GET /admin/reservations/{reservationId}가 있으나 사용하는 화면이 없어 queryFn 미연결
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
    getAll: () => ({
      queryKey: ['all'],
      queryFn: () => getAllRooms(),
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
