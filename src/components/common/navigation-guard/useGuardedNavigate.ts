'use client';

import { useRouter } from 'next/navigation';

import { useNavigationGuardContext } from './NavigationGuardProvider';

export function useGuardedNavigate() {
  const router = useRouter();
  const { guardedNavigate } = useNavigationGuardContext();

  return {
    push: (href: string) => guardedNavigate(() => router.push(href)),
    replace: (href: string) => guardedNavigate(() => router.replace(href)),
    back: () => guardedNavigate(() => router.back()),
  };
}
