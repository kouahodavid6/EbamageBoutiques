import { create } from "zustand";
import { commandeService } from "../services/commande.service";

const useCommandeStore = create((set) => ({
  commandes: [],
  loading: false,
  error: null,

  fetchCommandes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await commandeService.listerCommandesBoutique();

      // Accéder au tableau data depuis la réponse API
      const commandes = response.data?.data || response.data || [];

      set({ 
        commandes: Array.isArray(commandes) ? commandes : [],
        loading: false 
      });
    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors du chargement des commandes";
      set({ error: message, loading: false });
    }
  },

  // Mettre à jour automatiquement les commandes (pour les mises à jour en temps réel)
  updateCommande: (commandeUpdated) => {
    set(state => ({
      commandes: state.commandes.map(commande =>
        commande.hashid === commandeUpdated.hashid ? commandeUpdated : commande
      )
    }));
  },

  // Marquer le dû comme réclamé pour une commande spécifique
  markDuAsReclame: (commandeId) => {
    set(state => ({
      commandes: state.commandes.map(commande =>
        commande.hashid === commandeId 
          ? { ...commande, du_reclame: true }
          : commande
      )
    }));
  },

  clearError: () => set({ error: null })
}));

export default useCommandeStore;