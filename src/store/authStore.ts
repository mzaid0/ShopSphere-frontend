import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { StateCreator } from "zustand";

interface AuthState {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role?: string;
    email: string;
    phone: string;
    avatar: string;
    addresses: [
      {
        addressLine: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      }
    ];
    gender: "Male" | "Female" | "Other";
  } | null;
  setUser: (user: AuthState["user"]) => void;
}

const authStore: StateCreator<AuthState> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
});

const useAuthStore = create<AuthState>()(
  devtools(
    persist(authStore, {
      name: "auth",
      partialize: (state) => ({ user: state.user }),
    })
  )
);

export default useAuthStore;
