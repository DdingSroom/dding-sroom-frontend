'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseUnsavedChangesConfirmReturn {
  showConfirm: boolean;
  confirmLeave: () => void;
  cancelLeave: () => void;
  markClean: () => void;
}

export function useUnsavedChangesConfirm(
  isDirty: boolean,
): UseUnsavedChangesConfirmReturn {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const pendingNavRef = useRef<(() => void) | null>(null);
  const bypassRef = useRef(false);

  // beforeunload: browser tab close / refresh
  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Client-side navigation guard: intercept pushState + popstate
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const savedHref = window.location.href;
    const originalPushState = history.pushState.bind(history);

    history.pushState = (
      data: unknown,
      unused: string,
      url?: string | URL | null,
    ) => {
      if (bypassRef.current) {
        bypassRef.current = false;
        return originalPushState(data, unused, url);
      }
      if (!url) {
        return originalPushState(data, unused, url);
      }

      try {
        const nextHref = new URL(String(url), window.location.href).href;
        if (nextHref === window.location.href) {
          return originalPushState(data, unused, url);
        }
        const { pathname, search, hash } = new URL(nextHref);
        pendingNavRef.current = () => {
          history.pushState = originalPushState;
          router.push(pathname + search + hash);
        };
        setShowConfirm(true);
      } catch {
        return originalPushState(data, unused, url);
      }
    };

    // Back/forward button — capture phase runs before Next.js's bubble listener
    const handlePopState = (e: Event) => {
      e.stopImmediatePropagation();
      const targetHref = window.location.href;
      originalPushState(null, '', savedHref); // restore URL without re-intercepting

      try {
        const { pathname, search, hash } = new URL(targetHref);
        const targetPath = pathname + search + hash;
        pendingNavRef.current = () => {
          history.pushState = originalPushState;
          router.push(targetPath);
        };
      } catch {
        pendingNavRef.current = () => {
          history.pushState = originalPushState;
          router.back();
        };
      }
      setShowConfirm(true);
    };

    window.addEventListener('popstate', handlePopState, true);

    return () => {
      history.pushState = originalPushState;
      window.removeEventListener('popstate', handlePopState, true);
    };
  }, [isDirty, router]);

  const confirmLeave = useCallback(() => {
    setShowConfirm(false);
    const nav = pendingNavRef.current;
    pendingNavRef.current = null;
    nav?.();
  }, []);

  const cancelLeave = useCallback(() => {
    setShowConfirm(false);
    pendingNavRef.current = null;
  }, []);

  // Call this before a programmatic success navigation to skip the guard
  const markClean = useCallback(() => {
    bypassRef.current = true;
  }, []);

  return { showConfirm, confirmLeave, cancelLeave, markClean };
}
