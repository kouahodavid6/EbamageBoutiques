import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { InfoBoutique } from "../services/infoBoutique.service";

const useBoutiqueInfoStore = create(
  persist(
    (set, get) => ({
      boutique: null,
      loading: false,
      lastFetchTime: null, // Pour détecter les changements

      // FORCER le rechargement à chaque appel
      fetchBoutiqueInfo: async (forceRefresh = false) => {
        // Si pas de forceRefresh et données récentes (< 30 secondes), ne pas recharger
        if (!forceRefresh && get().lastFetchTime && (Date.now() - get().lastFetchTime < 30000)) {
          return;
        }

        set({ loading: true });
        try {
          const data = await InfoBoutique.getBoutiqueInfo();
          set({ 
            boutique: data,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          toast.error(error.message || "Erreur lors du chargement des informations");
        } finally {
          set({ loading: false });
        }
      },

      // VIDER complètement le store
      clearBoutiqueStore: () => {
        set({ 
          boutique: null, 
          loading: false,
          lastFetchTime: null 
        });
      },

      // Recharger en forçant le reset
      refreshBoutiqueInfo: async () => {
        set({ loading: true });
        try {
          const data = await InfoBoutique.getBoutiqueInfo();
          set({ 
            boutique: data,
            lastFetchTime: Date.now()
          });
        } catch (error) {
          toast.error(error.message || "Erreur lors du rafraîchissement");
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
          toast.success(res.message || "Image mise à jour avec succès !");

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
      }
    }),
    {
      name: "boutique-info-storage",
      partialize: (state) => ({ 
        boutique: state.boutique,
        lastFetchTime: state.lastFetchTime 
      }),
    }
  )
);

export default useBoutiqueInfoStore;