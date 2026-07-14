'use client';

import { useRouter } from 'next/navigation';

import useNavigationGuardStore from '@stores/useNavigationGuardStore';

export function useGuardedNavigate() {
  const router = useRouter();
  const guardedNavigate = useNavigationGuardStore((s) => s.guardedNavigate);

  return {
    push: (href: string) => guardedNavigate(() => router.push(href)),
    replace: (href: string) => guardedNavigate(() => router.replace(href)),
    back: () => guardedNavigate(() => router.back()),
  };
}
