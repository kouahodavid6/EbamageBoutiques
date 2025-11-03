// stores/commande.store.js
import { create } from "zustand";
import { commandeService } from "../services/commande.service";

const useCommandeStore = create((set) => ({
  commandes: [],
  loading: false,
  error: null,

  fetchCommandes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await commandeService.listerCommandes();

      const commandes = Array.isArray(response.data)
        ? response.data
        : [];

      set({ commandes, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors du chargement des commandes";
      set({ error: message, loading: false });
    }
  },
}));

export default useCommandeStore;