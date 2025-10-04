import { create } from "zustand";
import { produitService } from "../services/produit.service";

const useProduitStore = create((set, get) => ({
  produits: [],
  loading: false,
  error: null,

  addProduit: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await produitService.ajouterProduit(formData);
      const newProduit = response.data?.data;

      if (newProduit) {
        set((state) => ({
          produits: [newProduit, ...state.produits],
          loading: false,
        }));
      } else {
        set({ loading: false });
      }

      return newProduit;
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de l'ajout du produit";
      set({ error: message, loading: false });
      throw error;
    }
  },

  fetchProduits: async () => {
    set({ loading: true, error: null });
    try {
      const response = await produitService.listerProduits();
      const produits = response.data?.data || [];

      set({
        produits,
        loading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors du chargement des produits";

      set({ error: message, loading: false });
    }
  },

  updateProduit: async (hashid, formData) => {
    set({ loading: true, error: null });
    try {
      const response = await produitService.updateProduit(hashid, formData);
      const updatedProduit = response.data?.data;

      if (updatedProduit) {
        set((state) => ({
          produits: state.produits.map((p) =>
            p.hashid === hashid ? { ...p, ...updatedProduit } : p
          ),
          loading: false,
        }));
      } else {
        set({ loading: false });
      }

      return updatedProduit;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Erreur lors de la modification du produit";
      set({ error: message, loading: false });
      throw error;
    }
  },

  deleteProduit: async (hashid) => {
    set({ loading: true, error: null });
    try {
      await produitService.deleteProduit(hashid);

      set({
        produits: get().produits.filter((p) => p.hashid !== hashid),
        loading: false,
      });

      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      throw error;
    }
  },
}));

export default useProduitStore;