import { create } from 'zustand';
import axiosInstance from '../libs/api/instance';
import useTokenStore from './useTokenStore';

const useReservationStore = create((set, get) => ({
  latestReservation: null,

  setLatestReservation: (reservation) =>
    set({ latestReservation: reservation }),

  clearReservation: () => set({ latestReservation: null }),

  fetchLatestReservation: async () => {
    const { userId, accessToken } = useTokenStore.getState();
    if (!userId || !accessToken) {
      console.warn('사용자 정보가 없어 예약 정보를 불러올 수 없습니다.');
      return;
    }

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
}));

export default useReservationStore;
