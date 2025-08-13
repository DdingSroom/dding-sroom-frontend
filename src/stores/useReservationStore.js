import { create } from 'zustand';
import axiosInstance from '../libs/api/instance';
import useTokenStore from './useTokenStore';

const parseToDate = (raw) => {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const [y, m, d, h = 0, min = 0] = raw;
    return new Date(y, m - 1, d, h, min);
  }
  return new Date(raw);
};

const useReservationStore = create((set) => ({
  latestReservation: null,
  userReservations: [],
  reservedTimeSlotsByRoom: {},

  setLatestReservation: (reservation) =>
    set({ latestReservation: reservation }),
  clearReservation: () => set({ latestReservation: null }),
  setUserReservations: (reservations) =>
    set({ userReservations: reservations }),

  fetchLatestReservation: async () => {
    const { userId, accessToken } = useTokenStore.getState();
    if (!userId || !accessToken) return;

    try {
      const res = await axiosInstance.get(`/api/reservations/user/${userId}`);
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
    const { userId, accessToken } = useTokenStore.getState();
    if (!userId || !accessToken) return;

    try {
      const res = await axiosInstance.get(`/api/reservations/user/${userId}`);
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
      const res = await axiosInstance.get('/api/reservations/all-reservation');
      const all = res.data.reservations;
      const reservedMap = {};

      all.forEach((r, i) => {
        if (r.status !== 'RESERVED') return;

        const roomId = r.roomId;
        const start = parseToDate(r.startTime || r.reservationStartTime);
        const end = parseToDate(r.endTime || r.reservationEndTime);

        if (!start || !end || isNaN(start) || isNaN(end)) {
          console.warn(`${i + 1}번째 예약 항목에서 잘못된 날짜 형식`, r);
          return;
        }

        const temp = new Date(start);
        while (temp < end) {
          const iso = temp.toISOString();
          if (!reservedMap[roomId]) reservedMap[roomId] = [];
          reservedMap[roomId].push(iso);
          temp.setMinutes(temp.getMinutes() + 10);
        }
      });

      set({ reservedTimeSlotsByRoom: reservedMap });
    } catch (err) {
      console.error('전체 예약 시간대 불러오기 실패:', err);
      set({ reservedTimeSlotsByRoom: {} });
    }
  },
}));

export default useReservationStore;
