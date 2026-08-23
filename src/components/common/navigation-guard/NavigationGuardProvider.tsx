'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

import ConfirmModal from '@components/common/ConfirmModal';

interface NavigationGuardContextValue {
  setDirty: (id: string, isDirty: boolean) => void;
  guardedNavigate: (navigateFn: () => void, onCancel?: () => void) => void;
}

const NavigationGuardContext =
  createContext<NavigationGuardContextValue | null>(null);

function useNavigationGuardContext(): NavigationGuardContextValue {
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
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const pendingCancelRef = useRef<(() => void) | null>(null);
  const dirtyIdsRef = useRef<Set<string>>(new Set());

  const setDirty = useCallback((id: string, dirty: boolean) => {
    if (dirty) {
      dirtyIdsRef.current.add(id);
    } else {
      dirtyIdsRef.current.delete(id);
    }
    setIsDirty(dirtyIdsRef.current.size > 0);
  }, []);

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

  // pendingAction/pendingCancel/확인 모달 열림 상태를 한 번에 되돌린다.
  // confirmLeave·cancelLeave가 공통으로 수행하던 초기화라 하나로 모았다.
  const resetPendingNavigation = useCallback(() => {
    pendingActionRef.current = null;
    pendingCancelRef.current = null;
    setIsConfirmOpen(false);
  }, []);

  const confirmLeave = useCallback(() => {
    const runPendingAction = pendingActionRef.current;

    resetPendingNavigation();
    dirtyIdsRef.current.clear();
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

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const guardedHref = window.location.href;
    // 뒤로가기를 한 번도 누르지 않은 채 isDirty가 꺼지면(예: 작성 후 지움),
    // 이 effect가 만든 sentinel 엔트리가 정리되지 않고 히스토리에 그대로
    // 남아 쌓일 수 있다. 현재 sentinel 위에 있는지를 추적해뒀다가
    // cleanup에서 되돌려 남겨두지 않는다.
    let sentinelArmed = false;
    const armSentinel = () => {
      window.history.pushState(
        { ...window.history.state, __unsavedGuard: true },
        '',
        guardedHref,
      );
      sentinelArmed = true;
    };
    armSentinel();

    const handlePopState = () => {
      sentinelArmed = false;
      guardedNavigate(
        () => window.history.go(-1),
        () => armSentinel(),
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (sentinelArmed) {
        window.history.back();
      }
    };
  }, [isDirty, guardedNavigate]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const targetEl = e.target instanceof Element ? e.target : null;
      const anchor = targetEl?.closest('a');
      if (!anchor || !anchor.href) {
        return;
      }

      const anchorTarget = anchor.getAttribute('target');
      if (anchorTarget && anchorTarget !== '_self') {
        return;
      }
      if (anchor.hasAttribute('download')) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      e.preventDefault();
      guardedNavigate(() => router.push(url.pathname + url.search + url.hash));
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () =>
      document.removeEventListener('click', handleDocumentClick, true);
  }, [isDirty, guardedNavigate, router]);

  const value = useMemo<NavigationGuardContextValue>(
    () => ({ setDirty, guardedNavigate }),
    [setDirty, guardedNavigate],
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

export function useUnsavedChangesGuard(isDirty: boolean) {
  const id = useId();
  const { setDirty } = useNavigationGuardContext();

  useEffect(() => {
    setDirty(id, isDirty);
    return () => setDirty(id, false);
  }, [id, isDirty, setDirty]);

  const markClean = useCallback(() => {
    setDirty(id, false);
  }, [id, setDirty]);

  return { markClean };
}

export function useGuardedPush(): (href: string) => void {
  const router = useRouter();
  const { guardedNavigate } = useNavigationGuardContext();

  return useCallback(
    (href: string) => guardedNavigate(() => router.push(href)),
    [guardedNavigate, router],
  );
}
