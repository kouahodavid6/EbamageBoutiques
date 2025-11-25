import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { InfoBoutique } from "../services/infoBoutique.service";

const useBoutiqueInfoStore = create(
  persist(
    (set, get) => ({
      boutique: null,
      loading: false,
      lastFetchTime: null,
      currentBoutiqueHash: null, // ✅ NOUVEAU: pour détecter les changements de boutique

      fetchBoutiqueInfo: async (forceRefresh = false) => {
        const state = get();
        
        // ✅ Vérifier si la boutique a changé (nouvelle connexion)
        const hasBoutiqueChanged = async () => {
          try {
            const freshData = await InfoBoutique.getBoutiqueInfo();
            return freshData.hashid !== state.currentBoutiqueHash;
          } catch (error) {
            return true; // En cas d'erreur, on considère que ça a changé
          }
        };

        // ✅ Forcer le refresh si changement de boutique détecté
        const boutiqueChanged = forceRefresh ? true : await hasBoutiqueChanged();
        
        if (!boutiqueChanged && state.lastFetchTime && (Date.now() - state.lastFetchTime < 30000)) {
          return;
        }

        set({ loading: true });
        try {
          const data = await InfoBoutique.getBoutiqueInfo();
          set({ 
            boutique: data,
            lastFetchTime: Date.now(),
            currentBoutiqueHash: data.hashid // ✅ Stocker le hash actuel
          });
        } catch (error) {
          toast.error(error.message || "Erreur lors du chargement des informations");
        } finally {
          set({ loading: false });
        }
      },

      // ✅ VIDER seulement quand c'est nécessaire (déconnexion)
      clearBoutiqueStore: () => {
        set({ 
          boutique: null, 
          loading: false,
          lastFetchTime: null,
          currentBoutiqueHash: null
        });
      },

      // ✅ Rafraîchir sans vider
      refreshBoutiqueInfo: async () => {
        set({ loading: true });
        try {
          const data = await InfoBoutique.getBoutiqueInfo();
          set({ 
            boutique: data,
            lastFetchTime: Date.now(),
            currentBoutiqueHash: data.hashid
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
      },

      // ✅ NOUVELLE méthode: Vérifier et rafraîchir si nécessaire
      checkAndRefreshBoutique: async () => {
        const state = get();
        if (!state.boutique || !state.currentBoutiqueHash) {
          await get().fetchBoutiqueInfo(true);
          return;
        }

        try {
          const freshData = await InfoBoutique.getBoutiqueInfo();
          if (freshData.hashid !== state.currentBoutiqueHash) {
            console.log('🔄 Changement de boutique détecté, rafraîchissement...');
            await get().refreshBoutiqueInfo();
          }
        } catch (error) {
          console.error('Erreur lors de la vérification:', error);
        }
      }
    }),
    {
      name: "boutique-info-storage",
      partialize: (state) => ({ 
        boutique: state.boutique,
        lastFetchTime: state.lastFetchTime,
        currentBoutiqueHash: state.currentBoutiqueHash // ✅ Persister aussi le hash
      }),
    }
  )
);

export default useBoutiqueInfoStore;