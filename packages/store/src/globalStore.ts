import { createStore } from 'zustand/vanilla';

export interface GlobalState {
  count: number;
  setCount: (count: number) => void;
}

export const globalStore = createStore<GlobalState>((set) => ({
  count: 0,
  setCount: (count: number) => set({ count }),
}));
