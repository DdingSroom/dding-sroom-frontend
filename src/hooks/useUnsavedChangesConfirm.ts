'use client';

import { useCallback, useEffect } from 'react';

import useNavigationGuardStore from '@stores/useNavigationGuardStore';

interface UseUnsavedChangesConfirmReturn {
  showConfirm: boolean;
  confirmLeave: () => void;
  cancelLeave: () => void;
  markClean: () => void;
}

export function useUnsavedChangesConfirm(
  isDirty: boolean,
): UseUnsavedChangesConfirmReturn {
  const setDirty = useNavigationGuardStore((s) => s.setDirty);
  const guardedNavigate = useNavigationGuardStore((s) => s.guardedNavigate);
  const showConfirm = useNavigationGuardStore((s) => s.isConfirmOpen);
  const confirmLeave = useNavigationGuardStore((s) => s.confirm);
  const cancelLeave = useNavigationGuardStore((s) => s.cancel);

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

  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const guardedHref = window.location.href;
    const armSentinel = () => {
      window.history.pushState({ __unsavedGuard: true }, '', guardedHref);
    };
    armSentinel();

    const handlePopState = () => {
      guardedNavigate(
        () => window.history.go(-1),
        () => armSentinel(),
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDirty, guardedNavigate]);

  const markClean = useCallback(() => {
    setDirty(false);
  }, [setDirty]);

  return { showConfirm, confirmLeave, cancelLeave, markClean };
}
