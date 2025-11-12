// src/stores/useVariationStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { VariationLibelleService } from "../services/variationLibelle.service";

const useVariationStore = create((set, get) => ({
  variations: [], // Variations simples depuis /api/variations
  variationsBoutique: [], // Variations avec libellés depuis /api/variations/boutique
  loading: false,
  adding: false,
  deleting: false,

  // Pour le formulaire d'ajout de libellés - variations simples
  fetchVariations: async () => {
    set({ loading: true });
    try {
      const response = await VariationLibelleService.listerVariations();
      
      if (response.success) {
        set({ variations: response.data || [] });
      } else {
        toast.error(response.message || "Erreur lors du chargement des variations");
        set({ variations: [] });
      }
    } catch (err) {
      toast.error(err.message || "Impossible de charger les variations.");
      set({ variations: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Pour l'administration - variations avec libellés
  fetchVariationsBoutique: async () => {
    set({ loading: true });
    try {
      const response = await VariationLibelleService.listerVariationsBoutique();
      
      if (response.success) {
        const normalized = (response.data || []).map((v) => ({
          ...v,
          lib_variation: v.lib_variation || [],
        }));
        set({ variationsBoutique: normalized });
      } else {
        toast.error(response.message || "Erreur lors du chargement des variations boutique");
        set({ variationsBoutique: [] });
      }
    } catch (err) {
      toast.error(err.message || "Impossible de charger les variations boutique.");
      set({ variationsBoutique: [] });
    } finally {
      set({ loading: false });
    }
  },

  addLibelles: async (hashid, libelles = []) => {
    if (!hashid || !Array.isArray(libelles) || libelles.length === 0) {
      toast.error("Aucun libellé à ajouter.");
      return null;
    }
    set({ adding: true });
    try {
      const payload = { variation_id: hashid, lib_variation: libelles };
      const res = await VariationLibelleService.ajouterLibellesVariation(payload);
      
      if (res.success) {
        toast.success(res.message || "Libellés ajoutés.");
        // Mettre à jour les stores
        await get().fetchVariationsBoutique();
        return res;
      } else {
        // Si l'API retourne success: false mais avec un message spécifique
        if (res.message === "Toutes les variations ont des libellés.") {
          toast.success("Les libellés sont déjà configurés pour cette variation.");
          await get().fetchVariationsBoutique();
          return { ...res, success: true };
        }
        toast.error(res.message || "Erreur lors de l'ajout des libellés.");
        throw new Error(res.message);
      }
    } catch (err) {
      // Ne pas afficher d'erreur toast si c'est le message "Toutes les variations ont des libellés"
      if (err.message !== "Toutes les variations ont des libellés.") {
        toast.error(err.message || "Erreur lors de l'ajout des libellés.");
      }
      throw err;
    } finally {
      set({ adding: false });
    }
  },

  updateVariation: async (hashid, libelles = []) => {
    set({ adding: true });
    try {
      // CORRECTION : Envoyer les données dans le format attendu par l'API
      const payload = { 
        nom_variation: get().variationsBoutique.find(v => v.hashid === hashid)?.nom_variation,
        lib_variation: libelles 
      };
      const res = await VariationLibelleService.modifierVariation(hashid, payload);
      
      if (res.success) {
        toast.success(res.message || "Variation modifiée.");
        // Mettre à jour le store
        await get().fetchVariationsBoutique();
        return res;
      } else {
        toast.error(res.message || "Erreur lors de la modification.");
        throw new Error(res.message);
      }
    } catch (err) {
      toast.error(err.message || "Erreur lors de la modification.");
      throw err;
    } finally {
      set({ adding: false });
    }
  },

  deleteVariation: async (hashid) => {
    if (!hashid) return;
    set({ deleting: true });
    try {
      const res = await VariationLibelleService.supprimerVariation(hashid);
      
      if (res.success) {
        toast.success(res.message || "Variation supprimée.");
        // Mettre à jour les stores
        await get().fetchVariationsBoutique();
        await get().fetchVariations();
        return res;
      } else {
        toast.error(res.message || "Erreur lors de la suppression.");
        throw new Error(res.message);
      }
    } catch (err) {
      toast.error(err.message || "Erreur lors de la suppression.");
      throw err;
    } finally {
      set({ deleting: false });
    }
  },
}));

export default useVariationStore;