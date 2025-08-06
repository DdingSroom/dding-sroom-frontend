import { create } from 'zustand';
import axiosInstance from '../libs/api/instance';
import useTokenStore from './useTokenStore';

const useReservationStore = create((set, get) => ({
  latestReservation: null,
  userReservations: [],

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
      const nowKST = new Date(); // 이미 서버에서 KST로 반환 중

      const filtered = res.data.reservations.filter((r) => {
        const raw = r.startTime || r.reservationStartTime;
        const start = Array.isArray(raw)
          ? new Date(raw[0], raw[1] - 1, raw[2], raw[3] || 0, raw[4] || 0)
          : new Date(raw);

        return r.status === 'RESERVED' && start.getTime() > nowKST.getTime();
      });

      const sorted = filtered.sort((a, b) => {
        const aRaw = a.startTime || a.reservationStartTime;
        const bRaw = b.startTime || b.reservationStartTime;

        const aStart = Array.isArray(aRaw)
          ? new Date(aRaw[0], aRaw[1] - 1, aRaw[2], aRaw[3] || 0, aRaw[4] || 0)
          : new Date(aRaw);

        const bStart = Array.isArray(bRaw)
          ? new Date(bRaw[0], bRaw[1] - 1, bRaw[2], bRaw[3] || 0, bRaw[4] || 0)
          : new Date(bRaw);

        return aStart - bStart;
      });

      set({ userReservations: sorted });
    } catch (err) {
      console.error('전체 예약 정보 불러오기 실패:', err);
      set({ userReservations: [] });
    }
  },
}));

export default useReservationStore;
