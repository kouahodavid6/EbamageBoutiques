import { create } from "zustand";
import { produitService } from "../services/produit.service";

const useProduitStore = create((set, get) => ({
  produits: [],
  loading: false,
  error: null,

  // CREATE
  addProduit: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await produitService.ajouterProduit(formData);
      const newProduit = response.data.data;
      set((state) => ({
        produits: [newProduit, ...state.produits],
        loading: false,
      }));
      return newProduit;
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de l'ajout du produit";
      set({ error: message, loading: false });
      throw error;
    }
  },

  // READ
  fetchProduits: async () => {
    set({ loading: true, error: null });
    try {
      const response = await produitService.listerProduits();
      console.log("Response fetchProduit", response.data);
      set({ produits: response.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors du chargement des produits";
      console.log("Response catch fetchProduit ", error);
      set({ error: message, loading: false });
    }
  },

  // UPDATE
  updateProduit: async (hashid, formData) => {
    set({ loading: true, error: null });
    try {
      const response = await produitService.updateProduit(hashid, formData);
      const updatedProduit = response.data.data;

      set((state) => ({
        produits: state.produits.map((p) => 
          p.hashid === hashid ? { ...p, ...updatedProduit } : p
        ),
        loading: false,
      }));
      return updatedProduit;
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la modification du produit";
      set({ error: message, loading: false });
      throw error;
    }
  },

  // DELETE
  deleteProduit: async (hashid) => {
    set({ loading: true, error: null });
    try {
      await produitService.deleteProduit(hashid);
      set({
        produits: get().produits.filter((p) => p.hashid !== hashid),
        loading: false
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