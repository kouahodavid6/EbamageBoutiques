// ✅ auth.store.js
import { create } from "zustand";
import { authService } from "../services/auth.service";

const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const useAuthStore = create((set) => ({
  user: initialUser,
  loading: false,
  error: null,
  showError: false,

  setError: (error) => set({ error, showError: true }),
  clearError: () => set({ error: null, showError: false }),

  setUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },

  registerBoutique: async (formData) => {
    set({ loading: true });
    try {
      const response = await authService.registerBoutique(formData);
      const { data, token } = response.data;
      const userData = { ...data, token };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData, loading: false });

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, showError: true, loading: false });
      throw error;
    }
  },

  loginBoutique: async (credentials) => {
    set({ loading: true });
    try {
      const response = await authService.loginBoutique(credentials);
      const { data, token } = response.data;
      const userData = { ...data, token };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData, loading: false });

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      set({ error: errorMessage, showError: true, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null });
  },
}));

export default useAuthStore;