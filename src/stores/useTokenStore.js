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
      if (typeof window !== 'undefined')
        sessionStorage.setItem('accessToken', token);
    },
    setRefreshToken: (token) => {
      set({ refreshToken: token });
      if (typeof window !== 'undefined')
        sessionStorage.setItem('refreshToken', token);
    },
    setUserId: (id) => {
      set({ userId: id });
      if (typeof window !== 'undefined')
        sessionStorage.setItem('userId', id?.toString() ?? '');
    },
    clearTokens: () => {
      set({ accessToken: '', refreshToken: '', userId: null });
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('userId');
      }
    },

    rehydrate: () => {
      if (typeof window === 'undefined') return;
      const at = sessionStorage.getItem('accessToken') || '';
      const rt = sessionStorage.getItem('refreshToken') || '';
      const uid = sessionStorage.getItem('userId');
      set({
        accessToken: at,
        refreshToken: rt,
        userId: uid !== null ? parseInt(uid) : null,
      });
    },
  };
});

export default useTokenStore;
