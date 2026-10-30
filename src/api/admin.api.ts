import { ADMIN_API_ENDPOINTS } from '@api/endpoints';
import { api } from '@shared/api/api';

import type { ApiPaths, ApiSchemas } from '../types/api';

type AdminResponseDTO = ApiSchemas['AdminResponseDTO'];
type AdminUserListResponse = ApiSchemas['AdminUserListResponse'];
type AdminUserDetailResponse = ApiSchemas['AdminUserDetailResponse'];
type AdminReservationListResponse = ApiSchemas['AdminReservationListResponse'];
type AdminUserReservationsResponse =
  ApiSchemas['AdminUserReservationsResponse'];
type AdminRoomDetailResponse = ApiSchemas['AdminRoomDetailResponse'];

export type UserStatus =
  ApiPaths['/admin/users/{userId}/status']['put']['parameters']['query']['status'];

export type RoomStatus =
  ApiPaths['/admin/rooms/{roomId}/status']['put']['parameters']['query']['status'];

export const getAllUsers = (): Promise<AdminUserListResponse> =>
  api.get<AdminUserListResponse>(ADMIN_API_ENDPOINTS.USERS);

export const getUserById = (userId: number): Promise<AdminUserDetailResponse> =>
  api.get<AdminUserDetailResponse>(ADMIN_API_ENDPOINTS.USER_BY_ID(userId));

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

export const getAllReservations = (): Promise<AdminReservationListResponse> =>
  api.get<AdminReservationListResponse>(ADMIN_API_ENDPOINTS.RESERVATIONS);

export const getReservationsByUserId = (
  userId: number,
): Promise<AdminUserReservationsResponse> =>
  api.get<AdminUserReservationsResponse>(
    ADMIN_API_ENDPOINTS.RESERVATIONS_BY_USER(userId),
  );

export const forceCancelReservation = (
  reservationId: number,
): Promise<AdminResponseDTO> =>
  api.post<AdminResponseDTO>(
    ADMIN_API_ENDPOINTS.RESERVATION_FORCE_CANCEL(reservationId),
  );

export const getRoomById = (roomId: number): Promise<AdminRoomDetailResponse> =>
  api.get<AdminRoomDetailResponse>(ADMIN_API_ENDPOINTS.ROOM_BY_ID(roomId));

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
