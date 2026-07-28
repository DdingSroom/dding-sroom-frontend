'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ConfirmModal from '@components/common/ConfirmModal';

interface NavigationGuardContextValue {
  isDirty: boolean;
  setDirty: (isDirty: boolean) => void;
  guardedNavigate: (navigateFn: () => void, onCancel?: () => void) => void;
}

const NavigationGuardContext =
  createContext<NavigationGuardContextValue | null>(null);

export function useNavigationGuardContext(): NavigationGuardContextValue {
  const context = useContext(NavigationGuardContext);
  if (!context) {
    throw new Error(
      'useNavigationGuardContext must be used within a NavigationGuardProvider',
    );
  }
  return context;
}

interface NavigationGuardProviderProps {
  children: ReactNode;
}

export default function NavigationGuardProvider({
  children,
}: NavigationGuardProviderProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const pendingCancelRef = useRef<(() => void) | null>(null);

  const setDirty = useCallback((dirty: boolean) => setIsDirty(dirty), []);

  const guardedNavigate = useCallback(
    (navigateFn: () => void, onCancel?: () => void) => {
      if (!isDirty) {
        navigateFn();
        return;
      }
      pendingActionRef.current = navigateFn;
      pendingCancelRef.current = onCancel ?? null;
      setIsConfirmOpen(true);
    },
    [isDirty],
  );

  const resetPendingNavigation = useCallback(() => {
    pendingActionRef.current = null;
    pendingCancelRef.current = null;
    setIsConfirmOpen(false);
  }, []);

  const confirmLeave = useCallback(() => {
    const runPendingAction = pendingActionRef.current;

    resetPendingNavigation();
    setIsDirty(false);

    runPendingAction?.();
  }, [resetPendingNavigation]);

  const cancelLeave = useCallback(() => {
    const runPendingCancel = pendingCancelRef.current;

    resetPendingNavigation();

    runPendingCancel?.();
  }, [resetPendingNavigation]);

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

  // popstate: browser back/forward, guarded via a re-armed history sentinel
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

  const value = useMemo<NavigationGuardContextValue>(
    () => ({ isDirty, setDirty, guardedNavigate }),
    [isDirty, setDirty, guardedNavigate],
  );

  return (
    <NavigationGuardContext.Provider value={value}>
      {children}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={cancelLeave}
        onConfirm={confirmLeave}
        title="작성 중인 내용이 있습니다"
        message="페이지를 나가면 작성 중인 내용이 사라질 수 있습니다. 정말 나가시겠습니까?"
        cancelText="계속 작성하기"
        confirmText="나가기"
      />
    </NavigationGuardContext.Provider>
  );
}
