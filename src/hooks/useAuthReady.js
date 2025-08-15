'use client';

import { useEffect, useState } from 'react';
import useTokenStore from '../stores/useTokenStore';
import { jwtDecode } from 'jwt-decode';

export default function useAuthReady() {
  const { accessToken, userId, setUserId, rehydrate } = useTokenStore();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    rehydrate();
    const t = setTimeout(() => setAuthReady(true), 0);
    return () => clearTimeout(t);
  }, [rehydrate]);

  useEffect(() => {
    if (!authReady || userId || !accessToken) return;
    try {
      const d = jwtDecode(accessToken);
      const uid = d?.userId ?? d?.id ?? d?.uid ?? d?.sub ?? null;
      if (uid) setUserId(Number(uid));
    } catch {
      // ignore
    }
  }, [authReady, accessToken, userId, setUserId]);

  return { authReady, accessToken, userId };
}
