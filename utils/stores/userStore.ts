// userStore.ts
import { create } from 'zustand';

interface UserState {
  user: BasicUser | null;
  setUser: (user: BasicUser | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
