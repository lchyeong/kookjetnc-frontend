import { create } from 'zustand';

export type HaatzIntroPhase = 'idle' | 'active' | 'settling' | 'complete';
export type HaatzPopupPhase = 'hidden' | 'revealing' | 'visible' | 'dismissed';

interface HaatzHomeUiState {
  headerHidden: boolean;
  introPhase: HaatzIntroPhase;
  popupEligible: boolean;
  popupPhase: HaatzPopupPhase;
  dismissPopup: () => void;
  finishPopupReveal: () => void;
  resetHomeUi: () => void;
  setHeaderHidden: (headerHidden: boolean) => void;
  setIntroPhase: (introPhase: HaatzIntroPhase) => void;
  setPopupEligible: (popupEligible: boolean) => void;
  startPopupReveal: () => void;
}

const initialState = {
  headerHidden: false,
  introPhase: 'idle' as const,
  popupEligible: false,
  popupPhase: 'hidden' as const,
};

export const useHaatzHomeUiStore = create<HaatzHomeUiState>((set) => ({
  ...initialState,
  dismissPopup: () => {
    set({
      popupEligible: false,
      popupPhase: 'dismissed',
    });
  },
  finishPopupReveal: () => {
    set((state) => ({
      popupPhase: state.popupEligible ? 'visible' : 'hidden',
    }));
  },
  resetHomeUi: () => {
    set((state) => ({
      ...initialState,
      popupEligible: state.popupEligible,
      popupPhase: state.popupPhase === 'dismissed' ? 'dismissed' : 'hidden',
    }));
  },
  setHeaderHidden: (headerHidden) => {
    set({ headerHidden });
  },
  setIntroPhase: (introPhase) => {
    set({ introPhase });
  },
  setPopupEligible: (popupEligible) => {
    set((state) => ({
      popupEligible,
      popupPhase:
        state.popupPhase === 'dismissed'
          ? 'dismissed'
          : popupEligible
            ? state.popupPhase
            : 'hidden',
    }));
  },
  startPopupReveal: () => {
    set((state) => {
      if (!state.popupEligible || state.popupPhase !== 'hidden') {
        return state;
      }

      return {
        popupPhase: 'revealing',
      };
    });
  },
}));
