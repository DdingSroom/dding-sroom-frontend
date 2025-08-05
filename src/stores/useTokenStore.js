import { create } from 'zustand';

const useTokenStore = create((set) => ({
  accessToken: '',
  refreshToken: '',
  userId: null,

  initializeFromStorage: () => {
    if (typeof window !== 'undefined') {
      const accessToken = sessionStorage.getItem('accessToken') || '';
      const refreshToken = sessionStorage.getItem('refreshToken') || '';
      const userId = parseInt(sessionStorage.getItem('userId')) || null;

      set({ accessToken, refreshToken, userId });
    }
  },

  setAccessToken: (token) => {
    set({ accessToken: token });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', token);
    }
  },

  setRefreshToken: (token) => {
    set({ refreshToken: token });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('refreshToken', token);
    }
  },

  setUserId: (id) => {
    set({ userId: id });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userId', id.toString());
    }
  },

  clearTokens: () => {
    set({ accessToken: '', refreshToken: '', userId: null });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userId');
    }
  },
}));

export default useTokenStore;
