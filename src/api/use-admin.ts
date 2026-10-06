import { api } from '@shared/api/api';

import type { ApiSchemas } from '../types/api';

type AdminResponseDTO = ApiSchemas['AdminResponseDTO'];

// 조회(GET) 응답: schema상 `Record<string, never>`로만 정의
// -> 실제 구조를 알 수 없어 백엔드 응답 DTO가 확인되면 정확한 타입으로 교체 예정
type UnknownResponse = unknown;

export type UserStatus = 'normal' | 'blocked';

export type RoomStatus = 'IDLE' | 'OCCUPIED' | 'MAINTENANCE';

const ADMIN_API_ENDPOINTS = {
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

export const getAllUsers = (): Promise<UnknownResponse> =>
  api.get<UnknownResponse>(ADMIN_API_ENDPOINTS.USERS);

export const getUserById = (userId: number): Promise<UnknownResponse> =>
  api.get<UnknownResponse>(ADMIN_API_ENDPOINTS.USER_BY_ID(userId));

export const updateUserStatus = (
  userId: number,
  status: UserStatus,
): Promise<AdminResponseDTO> =>
  api.put<AdminResponseDTO>(
    ADMIN_API_ENDPOINTS.USER_STATUS(userId),
    undefined,
    {
      params: { status },
    },
  );

export const getAllReservations = (): Promise<UnknownResponse> =>
  api.get<UnknownResponse>(ADMIN_API_ENDPOINTS.RESERVATIONS);

export const getReservationsByUserId = (
  userId: number,
): Promise<UnknownResponse> =>
  api.get<UnknownResponse>(ADMIN_API_ENDPOINTS.RESERVATIONS_BY_USER(userId));

export const forceCancelReservation = (
  reservationId: number,
): Promise<AdminResponseDTO> =>
  api.post<AdminResponseDTO>(
    ADMIN_API_ENDPOINTS.RESERVATION_FORCE_CANCEL(reservationId),
  );

export const getRoomById = (roomId: number): Promise<UnknownResponse> =>
  api.get<UnknownResponse>(ADMIN_API_ENDPOINTS.ROOM_BY_ID(roomId));

export const updateRoomStatus = (
  roomId: number,
  status: RoomStatus,
): Promise<AdminResponseDTO> =>
  api.put<AdminResponseDTO>(
    ADMIN_API_ENDPOINTS.ROOM_STATUS(roomId),
    undefined,
    {
      params: { status },
    },
  );
