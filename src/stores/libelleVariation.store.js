import { create } from "zustand";
import toast from "react-hot-toast";
import LibelleVariationService from "../services/libelleVariation.service";


const useLibelleVariationStore = create((set, get) => ({
    variations: [],
    libelles: [],
    loading: false,

    // Charger toutes les variations pour le select
    fetchVariations: async () => {
        set({ loading: true });
        try {
            const data = await LibelleVariationService.listerVariations();
            set({ variations: data });
        } catch (error) {
            toast.error(error.message || "Erreur lors du chargement des variations.");
        } finally {
            set({ loading: false });
        }
    },

    // Ajouter des libellés à une variation
    ajouterLibelles: async (data) => {
        try {
            const res = await LibelleVariationService.ajouterLibellesVariation(data);
            toast.success(res.message || "Libellés ajoutés avec succès !");
            
            // Recharger les libellés après ajout
            get().fetchLibellesByVariation(data.variation_id);
            
            return res;
        } catch (error) {
            toast.error(error.message || "Erreur lors de l'ajout des libellés.");
            throw error;
        }
    },

    // Charger les libellés d'une variation spécifique
    fetchLibellesByVariation: async (variationId) => {
        try {
            const data = await LibelleVariationService.getLibellesByVariation(variationId);
            set({ libelles: data });
        } catch (error) {
            console.error("Erreur chargement libellés:", error);
        }
    },

    // Modifier un libellé
    modifierLibelle: async (variationId, libelleIndex, nouvelleValeur) => {
        try {
            // Récupérer la variation actuelle
            const variation = get().variations.find(v => v.hashid === variationId);
            if (!variation) throw new Error("Variation non trouvée");

            // Mettre à jour les libellés
            const nouveauxLibelles = [...variation.valeurs];
            nouveauxLibelles[libelleIndex] = nouvelleValeur;

            const res = await LibelleVariationService.modifierVariation(variationId, {
                valeurs: nouveauxLibelles
            });

            toast.success(res.message || "Libellé modifié avec succès !");
            
            // Mettre à jour le store
            set(state => ({
                variations: state.variations.map(v => 
                    v.hashid === variationId 
                        ? { ...v, valeurs: nouveauxLibelles }
                        : v
                )
            }));

            return res;
        } catch (error) {
            toast.error(error.message || "Erreur lors de la modification.");
            throw error;
        }
    },

    // Supprimer un libellé
    supprimerLibelle: async (variationId, libelleIndex) => {
        try {
            // Récupérer la variation actuelle
            const variation = get().variations.find(v => v.hashid === variationId);
            if (!variation) throw new Error("Variation non trouvée");

            // Filtrer les libellés
            const nouveauxLibelles = variation.valeurs.filter((_, index) => index !== libelleIndex);

            const res = await LibelleVariationService.modifierVariation(variationId, {
                valeurs: nouveauxLibelles
            });

            toast.success("Libellé supprimé avec succès !");
            
            // Mettre à jour le store
            set(state => ({
                variations: state.variations.map(v => 
                    v.hashid === variationId 
                        ? { ...v, valeurs: nouveauxLibelles }
                        : v
                )
            }));

            return res;
        } catch (error) {
            toast.error(error.message || "Erreur lors de la suppression.");
            throw error;
        }
    },

    // Supprimer toute une variation (avec tous ses libellés)
    supprimerVariation: async (variationId) => {
        try {
            await LibelleVariationService.supprimerVariation(variationId);
            toast.success("Variation supprimée avec succès !");
            
            // Mettre à jour le store
            set(state => ({
                variations: state.variations.filter(v => v.hashid !== variationId)
            }));
        } catch (error) {
            toast.error(error.message || "Erreur lors de la suppression de la variation.");
            throw error;
        }
    }
}));

export default useLibelleVariationStore;