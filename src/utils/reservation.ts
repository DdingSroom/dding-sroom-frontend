import type { ApiSchemas } from '../types/api';

interface ReservationLike {
  roomId?: number;
  status?: string;
  startTime?: string | number[];
  endTime?: string | number[];
  reservationStartTime?: string | number[];
  reservationEndTime?: string | number[];
}

export const selectReservations = (
  response: ApiSchemas['ReservationResponseDTO'],
) => response.reservations ?? [];

export const parseReservationDate = (raw?: string | number[]) => {
  if (!raw) {
    return null;
  }

  if (Array.isArray(raw)) {
    const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] = raw;
    const date = new Date(year, month - 1, day, hour, minute, second);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const toReservedTimeSlotsByRoom = (reservations: ReservationLike[]) => {
  const reservedTimeSlotsByRoom: Record<number, string[]> = {};

  reservations.forEach((reservation) => {
    if (reservation.status !== 'RESERVED' || !reservation.roomId) {
      return;
    }

    const start = parseReservationDate(
      reservation.startTime ?? reservation.reservationStartTime,
    );
    const end = parseReservationDate(
      reservation.endTime ?? reservation.reservationEndTime,
    );

    if (!start || !end) {
      return;
    }

    for (
      const slot = new Date(start);
      slot < end;
      slot.setMinutes(slot.getMinutes() + 10)
    ) {
      (reservedTimeSlotsByRoom[reservation.roomId] ??= []).push(
        slot.toISOString(),
      );
    }
  });

  return reservedTimeSlotsByRoom;
};
