import { beforeEach, describe, expect, it } from 'vitest';

import { useHaatzHomeUiStore } from '@/stores/useHaatzHomeUiStore';

describe('useHaatzHomeUiStore', () => {
  beforeEach(() => {
    useHaatzHomeUiStore.setState({
      headerHidden: false,
      introPhase: 'idle',
      popupEligible: false,
      popupPhase: 'hidden',
    });
  });

  it('keeps popup state intact when only the header hidden flag changes', () => {
    useHaatzHomeUiStore.setState({
      headerHidden: false,
      introPhase: 'complete',
      popupEligible: true,
      popupPhase: 'visible',
    });

    useHaatzHomeUiStore.getState().setHeaderHidden(true);

    expect(useHaatzHomeUiStore.getState()).toMatchObject({
      headerHidden: true,
      introPhase: 'complete',
      popupEligible: true,
      popupPhase: 'visible',
    });
  });

  it('resetHomeUi clears headerHidden without breaking dismissed popup persistence', () => {
    useHaatzHomeUiStore.setState({
      headerHidden: true,
      introPhase: 'complete',
      popupEligible: true,
      popupPhase: 'dismissed',
    });

    useHaatzHomeUiStore.getState().resetHomeUi();

    expect(useHaatzHomeUiStore.getState()).toMatchObject({
      headerHidden: false,
      introPhase: 'idle',
      popupEligible: true,
      popupPhase: 'dismissed',
    });
  });
});
