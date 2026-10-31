import { RESERVATION_API_ENDPOINTS } from '@api/endpoints';
import { api } from '@shared/api/api';

import type { ApiSchemas } from '../types/api';

type ReservationResponseDTO = ApiSchemas['ReservationResponseDTO'];
type ReservationMessageResponse = ApiSchemas['ReservationMessageResponse'];

export const getAllReservations = (): Promise<ReservationResponseDTO> =>
  api.get<ReservationResponseDTO>(RESERVATION_API_ENDPOINTS.ALL_RESERVATIONS);

export const getCrowdingLevel = (): Promise<ReservationMessageResponse> =>
  api.get<ReservationMessageResponse>(RESERVATION_API_ENDPOINTS.CROWDING_LEVEL);
