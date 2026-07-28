'use client';

import { useCallback, useEffect } from 'react';

import { useNavigationGuardContext } from './NavigationGuardProvider';

interface UseUnsavedChangesConfirmReturn {
  markClean: () => void;
}

export function useUnsavedChangesConfirm(
  isDirty: boolean,
): UseUnsavedChangesConfirmReturn {
  const { setDirty } = useNavigationGuardContext();

  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  const markClean = useCallback(() => {
    setDirty(false);
  }, [setDirty]);

  return { markClean };
}
