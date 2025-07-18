import { create } from 'zustand';

const useReservationStore = create((set) => ({
  latestReservation: null,
  setLatestReservation: (reservation) =>
    set({ latestReservation: reservation }),
  clearReservation: () => set({ latestReservation: null }),
}));

export default useReservationStore;
