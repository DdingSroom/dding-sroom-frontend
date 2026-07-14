import { create } from 'zustand';

interface NavigationGuardState {
  isDirty: boolean;
  pendingAction: (() => void) | null;
  pendingCancel: (() => void) | null;
  isConfirmOpen: boolean;
  setDirty: (isDirty: boolean) => void;
  guardedNavigate: (navigateFn: () => void, onCancel?: () => void) => void;
  confirm: () => void;
  cancel: () => void;
}

const useNavigationGuardStore = create<NavigationGuardState>((set, get) => ({
  isDirty: false,
  pendingAction: null,
  pendingCancel: null,
  isConfirmOpen: false,

  setDirty: (isDirty) => set({ isDirty }),

  guardedNavigate: (navigateFn, onCancel) => {
    if (!get().isDirty) {
      navigateFn();
      return;
    }
    set({
      pendingAction: navigateFn,
      pendingCancel: onCancel ?? null,
      isConfirmOpen: true,
    });
  },

  confirm: () => {
    const { pendingAction } = get();
    set({ pendingAction: null, pendingCancel: null, isConfirmOpen: false });
    pendingAction?.();
  },

  cancel: () => {
    const { pendingCancel } = get();
    set({ pendingAction: null, pendingCancel: null, isConfirmOpen: false });
    pendingCancel?.();
  },
}));

export default useNavigationGuardStore;
