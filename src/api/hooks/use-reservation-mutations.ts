import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reservation } from '@api/keys/reservation.key';
import { cancelReservation, createReservation } from '@api/reservation.api';

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservation,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: reservation.getAll().queryKey,
      }),
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: reservation.getMyReservations().queryKey,
      }),
  });
};
