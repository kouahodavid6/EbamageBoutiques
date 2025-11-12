import { create } from 'zustand';
import { boutiqueService } from '../services/boutique.service';

export const useBoutiqueStore = create((set, get) => ({
  // États
  soldeBoutique: 0,
  loading: false,
  error: null,
  success: null,

  // Actions
  // Récupérer le solde boutique
  async fetchSoldeBoutique() {
    set({ loading: true, error: null });
    try {
      const response = await boutiqueService.getSoldeBoutique();
      set({ 
        soldeBoutique: response.data,
        loading: false,
        success: response.message || 'Solde boutique récupéré avec succès'
      });
      return response;
    } catch (error) {
      set({ 
        error: error.message,
        loading: false 
      });
      throw error;
    }
  },

  // Réclamer son dû
  async reclamerDu(id_commande) {
    set({ loading: true, error: null });
    try {
      const response = await boutiqueService.reclamerDu(id_commande);
      
      // Mettre à jour le solde après réclamation
      const { soldeBoutique } = get();
      set({ 
        soldeBoutique: soldeBoutique + response.data.montant, // response.data.montant contient 13500
        loading: false,
        success: response.message || 'Dû réclamé avec succès'
      });
      
      return response;
    } catch (error) {
      set({ 
        error: error.message,
        loading: false 
      });
      throw error;
    }
  },

  // Clear messages
  clearMessages() {
    set({ error: null, success: null });
  }
}));