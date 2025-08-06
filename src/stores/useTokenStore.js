import { create } from 'zustand';

const useTokenStore = create((set) => {
  let initialAccessToken = '';
  let initialRefreshToken = '';
  let initialUserId = null;

  if (typeof window !== 'undefined') {
    initialAccessToken = sessionStorage.getItem('accessToken') || '';
    initialRefreshToken = sessionStorage.getItem('refreshToken') || '';
    const storedUserId = sessionStorage.getItem('userId');
    initialUserId = storedUserId !== null ? parseInt(storedUserId) : null;
  }

  return {
    accessToken: initialAccessToken,
    refreshToken: initialRefreshToken,
    userId: initialUserId,

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
  };
});

export default useTokenStore;
