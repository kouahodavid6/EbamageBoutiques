import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { InfoBoutique } from "../services/infoBoutique.service";

const useBoutiqueInfoStore = create(
  persist(
    (set) => ({
      boutique: null,
      loading: false,

      fetchBoutiqueInfo: async () => {
        set({ loading: true });
        try {
          const data = await InfoBoutique.getBoutiqueInfo();
          set({ boutique: data });
        } catch (error) {
          toast.error(error.message || "Erreur lors du chargement des informations");
        } finally {
          set({ loading: false });
        }
      },

      updateBoutiqueInfo: async (data) => {
        set({ loading: true });
        try {
          const res = await InfoBoutique.updateBoutiqueInfo(data);
          toast.success(res.message || "Informations mises à jour !");
          set((state) => ({ 
            boutique: { ...state.boutique, ...data } 
          }));
          return res;
        } catch (error) {
          toast.error(error.message || "Erreur lors de la mise à jour");
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateBoutiquePassword: async (data) => {
        set({ loading: true });
        try {
          const res = await InfoBoutique.updateBoutiquePassword(data);
          toast.success(res.message || "Mot de passe mis à jour !");
          return res;
        } catch (error) {
          toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      updateBoutiqueImage: async (hashid, imageFile) => {
        set({ loading: true });
        try {
          const res = await InfoBoutique.updateBoutiqueImage(hashid, imageFile);
          toast.success(res.message || "Image de la boutique mise à jour avec succès !");
          
          set((state) => ({
            boutique: {
              ...state.boutique,
              image_btq: res.data.image_btq
            }
          }));
          
          return res;
        } catch (error) {
          const errorMessage = error.message || 
                             error.errors?.image_btq?.[0] || 
                             error.errors?.image?.[0] ||
                             "Erreur lors de la mise à jour de l'image";
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Action pour vider le store (optionnel)
      clearBoutique: () => {
        set({ boutique: null });
      }
    }),
    {
      name: "boutique-info-storage", // nom pour le localStorage
      partialize: (state) => ({ boutique: state.boutique }), // ne persister que boutique
    }
  )
);

export default useBoutiqueInfoStore;