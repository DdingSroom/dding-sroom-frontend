'use client';

import { useEffect, useState } from 'react';

import useTokenStore from '@stores/useTokenStore';

export default function useAuthReady() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const userId = useTokenStore((state) => state.userId);
  const role = useTokenStore((state) => state.role);
  const rehydrate = useTokenStore((state) => state.rehydrate);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    rehydrate();
    const timer = setTimeout(() => setAuthReady(true), 0);
    return () => clearTimeout(timer);
  }, [rehydrate]);

  return { authReady, accessToken, userId, role };
}
