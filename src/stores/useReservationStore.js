import { create } from 'zustand';

import axiosInstance from '@api/instance';
import { getAllReservations } from '@api/reservation.api';

import useTokenStore from './useTokenStore';

const parseToDate = (raw) => {
  if (!raw) {
    return null;
  }
  if (Array.isArray(raw)) {
    const [y, m, d, h = 0, min = 0] = raw;
    return new Date(y, m - 1, d, h, min);
  }
  if (typeof raw === 'string' && /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(raw)) {
    return new Date(`${raw}+09:00`);
  }
  return new Date(raw);
};

const ALL_RESERVATIONS_SUCCESS_MESSAGE =
  '데이터 조회가 성공적으로 진행되었습니다.';

const isAllReservationsFailure = (data) =>
  !Array.isArray(data?.reservations) ||
  (data.reservations.length === 0 &&
    data.message !== ALL_RESERVATIONS_SUCCESS_MESSAGE);

const useReservationStore = create((set) => ({
  latestReservation: null,
  userReservations: [],
  reservedTimeSlotsByRoom: {},
  isReservedTimesError: false,

  setLatestReservation: (reservation) =>
    set({ latestReservation: reservation }),
  clearReservation: () => set({ latestReservation: null }),
  setUserReservations: (reservations) =>
    set({ userReservations: reservations }),

  fetchLatestReservation: async () => {
    const { accessToken } = useTokenStore.getState();
    if (!accessToken) {
      return;
    }

    try {
      const res = await axiosInstance.get('/api/reservations/me');
      const sorted = res.data.reservations.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      set({ latestReservation: sorted[0] || null });
    } catch (err) {
      console.error('예약 정보 불러오기 실패:', err);
      set({ latestReservation: null });
    }
  },

  fetchAllUserReservations: async () => {
    const { accessToken } = useTokenStore.getState();
    if (!accessToken) {
      return;
    }

    try {
      const res = await axiosInstance.get('/api/reservations/me');
      const nowKST = new Date();

      const filtered = res.data.reservations.filter((r) => {
        const endTime = parseToDate(r.endTime);
        return r.status === 'RESERVED' && endTime > nowKST;
      });

      const sorted = filtered.sort(
        (a, b) => parseToDate(a.startTime) - parseToDate(b.startTime),
      );
      set({ userReservations: sorted });
    } catch (err) {
      console.error('전체 예약 정보 불러오기 실패:', err);
      set({ userReservations: [] });
    }
  },

  fetchAllReservedTimes: async () => {
    try {
      const data = await getAllReservations();
      if (isAllReservationsFailure(data)) {
        throw new Error(data?.message || '전체 예약 응답 형식 오류');
      }
      const all = data.reservations;
      const reservedMap = {};

      all.forEach((r, i) => {
        if (r.status !== 'RESERVED') {
          return;
        }

        const roomId = r.roomId;
        const start = parseToDate(r.startTime);
        const end = parseToDate(r.endTime);

        if (!start || !end || isNaN(start) || isNaN(end)) {
          console.warn(`${i + 1}번째 예약 항목에서 잘못된 날짜 형식`, r);
          return;
        }

        const temp = new Date(start);
        while (temp < end) {
          const iso = temp.toISOString();
          if (!reservedMap[roomId]) {
            reservedMap[roomId] = [];
          }
          reservedMap[roomId].push(iso);
          temp.setMinutes(temp.getMinutes() + 10);
        }
      });

      set({
        reservedTimeSlotsByRoom: reservedMap,
        isReservedTimesError: false,
      });
    } catch (err) {
      console.error('전체 예약 시간대 불러오기 실패:', err);
      set({ isReservedTimesError: true });
    }
  },
}));

export default useReservationStore;
