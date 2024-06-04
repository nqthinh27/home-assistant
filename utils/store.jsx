import { create } from 'zustand';

const useStore = create(set => ({
  currentUser: null,
  setCurrentUser: user => set({ currentUser: user }),
  removeCurrentUser: () => set({ currentUser: null }),
  
  entityId: null,
  setEntityId: id => set({ entityId: id }),

  scenarioId: null,
  setScenarioId: id => set({ scenarioId: id }),
}));

export default useStore;
