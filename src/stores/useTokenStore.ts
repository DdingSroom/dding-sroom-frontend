import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

interface DecodedAccessToken {
  userId?: number | string;
  id?: number | string;
  uid?: number | string;
  sub?: string;
  role?: string;
  email?: string;
  username?: string;
}

export const decodeAccessToken = (token: string): DecodedAccessToken | null => {
  if (!token) {
    return null;
  }
  try {
    return jwtDecode<DecodedAccessToken>(token);
  } catch {
    return null;
  }
};

const extractUserId = (decoded: DecodedAccessToken | null): number | null => {
  const raw = decoded?.userId ?? decoded?.id ?? decoded?.uid ?? decoded?.sub;
  if (raw === undefined || raw === null) {
    return null;
  }
  const numeric = Number(raw);
  return Number.isNaN(numeric) ? null : numeric;
};

const readSessionItem = (key: string): string =>
  typeof window !== 'undefined' ? sessionStorage.getItem(key) || '' : '';

const writeSessionItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, value);
  }
};

const removeSessionItem = (key: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(key);
  }
};

interface TokenState {
  accessToken: string;
  userId: number | null;
  role: string | null;
  setAccessToken: (token: string) => void;
  clearTokens: () => void;
  rehydrate: () => void;
}

const buildStateFromSession = () => {
  const accessToken = readSessionItem('accessToken');
  const decoded = decodeAccessToken(accessToken);

  return {
    accessToken,
    userId: extractUserId(decoded),
    role: decoded?.role ?? null,
  };
};

const useTokenStore = create<TokenState>()((set) => ({
  ...buildStateFromSession(),

  setAccessToken: (token) => {
    const decoded = decodeAccessToken(token);
    const derivedUserId = extractUserId(decoded);

    set((state) => ({
      accessToken: token,
      role: decoded?.role ?? null,
      userId: derivedUserId ?? state.userId,
    }));

    writeSessionItem('accessToken', token);
  },

  clearTokens: () => {
    set({ accessToken: '', userId: null, role: null });
    removeSessionItem('accessToken');
    removeSessionItem('refreshToken');
  },

  rehydrate: () => {
    if (typeof window === 'undefined') {
      return;
    }
    set(buildStateFromSession());
  },
}));

export default useTokenStore;
