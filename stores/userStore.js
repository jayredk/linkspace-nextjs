import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: {},
      setUser: (user) => set({ user }),
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const useUser = () => useUserStore((state) => state.user);

export const useSetUser = () => useUserStore((state) => state.setUser);
