import type { ApiSchemas } from './api';

export type Reservation = ApiSchemas['ReservationDTO'];
export type ReservationResponse = ApiSchemas['ReservationResponseDTO'];
export type CreateReservationRequest = ApiSchemas['ReservationRequestDTO'];
export type CancelReservationRequest =
  ApiSchemas['ReservationCancelRequestDTO'];
