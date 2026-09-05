'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { ADMIN_LOGIN_PATH, ADMIN_ROLE } from '@constants/auth';

import useAuthReady from './useAuthReady';

export default function useAdminGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { authReady, accessToken, role } = useAuthReady();

  useEffect(() => {
    if (!authReady || pathname === ADMIN_LOGIN_PATH) {
      return;
    }

    if (!accessToken || role !== ADMIN_ROLE) {
      router.push(ADMIN_LOGIN_PATH);
    }
  }, [authReady, pathname, accessToken, role, router]);
}
