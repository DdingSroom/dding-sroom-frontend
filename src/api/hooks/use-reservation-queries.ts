import { useQuery } from '@tanstack/react-query';

import { reservation } from '@api/keys/reservation.key';

import type { ApiSchemas } from '../../types/api';

const selectReservations = (response: ApiSchemas['ReservationResponseDTO']) =>
  response.reservations ?? [];

export const useAllReservations = () =>
  useQuery({
    ...reservation.getAll(),
    select: selectReservations,
    refetchInterval: 10_000,
  });

export const useMyReservations = (enabled = true) =>
  useQuery({
    ...reservation.getMyReservations(),
    select: selectReservations,
    enabled,
  });
