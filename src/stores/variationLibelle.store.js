// src/stores/useVariationStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import VariationLibelleService from "../services/variationLibelle.service";

const useVariationStore = create((set, get) => ({
  variations: [],
  loading: false,
  adding: false,
  deleting: false,

  fetchVariations: async () => {
    set({ loading: true });
    try {
      const variations = await VariationLibelleService.listerVariations();
      // Normalize keys: ensure libellés dans "lib_variation" ou "valeurs"
      const normalized = variations.map((v) => ({
        ...v,
        lib_variation: v.lib_variation || v.valeurs || [],
      }));
      set({ variations: normalized });
    } catch (err) {
      toast.error(err.message || "Impossible de charger les variations.");
    } finally {
      set({ loading: false });
    }
  },

  addLibelles: async (variationId, libelles = []) => {
    if (!variationId || !Array.isArray(libelles) || libelles.length === 0) {
      toast.error("Aucun libellé à ajouter.");
      return null;
    }
    set({ adding: true });
    try {
      const payload = { variation_id: variationId, lib_variation: libelles };
      const res = await VariationLibelleService.ajouterLibellesVariation(payload);
      toast.success(res.message || "Libellés ajoutés.");
      // Mettre à jour le store : remplacer/ajouter la variation
      const current = get().variations.slice();
      const idx = current.findIndex((v) => v.hashid === res.hashid);
      const updatedVariation = {
        ...current[idx],
        nom_variation: res.nom_variation || current[idx]?.nom_variation,
        lib_variation: res.lib_variation || [],
        hashid: res.hashid,
      };
      if (idx === -1) current.push(updatedVariation);
      else current[idx] = updatedVariation;
      set({ variations: current });
      return updatedVariation;
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'ajout des libellés.");
      throw err;
    } finally {
      set({ adding: false });
    }
  },

  updateVariation: async (variationId, libelles = []) => {
    set({ adding: true });
    try {
      const payload = { variation_id: variationId, lib_variation: libelles };
      const res = await VariationLibelleService.modifierVariation(payload);
      toast.success(res.message || "Variation modifiée.");
      // res.data is an array per ton exemple
      const returned = Array.isArray(res.data) ? res.data[0] : res.data;
      const current = get().variations.slice();
      const idx = current.findIndex((v) => v.hashid === returned.hashid || v.hashid === variationId);
      const updatedVariation = {
        ...current[idx],
        ...returned,
        lib_variation: returned.lib_variation || [],
      };
      if (idx === -1) current.push(updatedVariation);
      else current[idx] = updatedVariation;
      set({ variations: current });
      return updatedVariation;
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
      toast.success(res.message || "Variation supprimée.");
      set((state) => ({ variations: state.variations.filter((v) => v.hashid !== hashid) }));
      return res;
    } catch (err) {
      toast.error(err.message || "Erreur lors de la suppression.");
      throw err;
    } finally {
      set({ deleting: false });
    }
  },
}));

export default useVariationStore;
