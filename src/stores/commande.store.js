import { create } from "zustand";
import { commandeService } from "../services/commande.service";

const useCommandeStore = create((set) => ({
  commandes: [],
  loading: false,
  error: null,

  // READ
  fetchCommandes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await commandeService.listerCommandes();
      console.log("Response fetchCommandes", response.data);
      set({ commandes: response.data.data, loading: false });
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors du chargement des commandes";
      console.log("Response catch fetchCommandes ", error);
      set({ error: message, loading: false });
    }
  },
}));

export default useCommandeStore;