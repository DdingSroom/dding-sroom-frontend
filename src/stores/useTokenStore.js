import { create } from 'zustand';

const useTokenStore = create((set) => ({
  accessToken: '',
  refreshToken: '',
  userId: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
  setUserId: (id) => set({ userId: id }),
}));

export default useTokenStore;
