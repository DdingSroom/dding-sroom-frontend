import { create } from 'zustand';

const useTokenStore = create((set) => ({
  accessToken: '',
  refreshToken: '',
  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),
}));

export default useTokenStore;
