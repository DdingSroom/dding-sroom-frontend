import { api } from '@shared/api/api';
import { RESERVATION_API_ENDPOINTS } from '@shared/api/endpoints';

import type { ApiPaths, ApiSchemas } from '../types/api';

export type ReservationRequest = ApiSchemas['ReservationRequestDTO'];
export type ReservationCancelRequest =
  ApiSchemas['ReservationCancelRequestDTO'];

type ReservationResponse = ApiSchemas['ReservationResponseDTO'];
type ReservationMutationResponse =
  ApiPaths[typeof RESERVATION_API_ENDPOINTS.RESERVATIONS]['post']['responses'][200]['content']['*/*'];

// 내 예약 조회
export const getMyReservations = () =>
  api.get<ReservationResponse>(RESERVATION_API_ENDPOINTS.MY_RESERVATIONS);

// 전체 예약 조회
export const getAllReservations = () =>
  api.get<ReservationResponse>(RESERVATION_API_ENDPOINTS.ALL);

// 예약 생성
export const createReservation = (data: ReservationRequest) =>
  api.post<ReservationMutationResponse, ReservationRequest>(
    RESERVATION_API_ENDPOINTS.RESERVATIONS,
    data,
  );

// 예약 취소
export const cancelReservation = (data: ReservationCancelRequest) =>
  api.post<ReservationMutationResponse, ReservationCancelRequest>(
    RESERVATION_API_ENDPOINTS.CANCEL,
    data,
  );
