'use client';

import { useQuery } from '@tanstack/react-query';

import { reservation } from '@api/keys/reservation.key';
import { getCrowdingText, parseCrowdingCount } from '@utils/crowding';

const CROWDING_REFETCH_INTERVAL_MS = 60 * 1000;

export default function useCrowdingLevel() {
  const { data, isPending, isError } = useQuery({
    ...reservation.getCrowdingLevel(),
    refetchInterval: CROWDING_REFETCH_INTERVAL_MS,
    select: (res) => parseCrowdingCount(res?.message),
  });

  if (isPending) {
    return { text: '확인 중', isUnavailable: false };
  }

  const count = isError ? null : data;
  return { text: getCrowdingText(count), isUnavailable: count === null };
}
