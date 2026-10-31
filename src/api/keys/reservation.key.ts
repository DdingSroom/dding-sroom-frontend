import { createQueryKeys } from '@lukemorales/query-key-factory';

import { getCrowdingLevel } from '@api/reservation.api';

export const reservation = createQueryKeys('reservation', {
  getAll: () => ({
    queryKey: ['all'],
    // queryFn: () => null, (추후 추가 예정)
  }),
  getCrowdingLevel: () => ({
    queryKey: ['crowding-level'],
    queryFn: () => getCrowdingLevel(),
  }),
  getMyReservations: () => ({
    queryKey: ['me'],
    // queryFn: () => null,
  }),
});
