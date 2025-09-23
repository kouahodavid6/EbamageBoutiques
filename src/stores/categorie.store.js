import { create } from "zustand";
import { produitService } from "../services/produit.service";

const useCategorieStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // READ
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await produitService.getCategories();
      set({ categories: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors du chargement des catégories";
      set({ error: message, loading: false });
      throw error;
    }
  },

  // Reset state
  reset: () => {
    set({ categories: [], loading: false, error: null });
  },
}));

export default useCategorieStore;