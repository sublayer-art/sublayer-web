import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },
}));

export default useAuth;
