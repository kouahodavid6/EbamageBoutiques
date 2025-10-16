import { create } from "zustand";
import toast from "react-hot-toast";
import { InfoBoutique } from "../services/infoBoutique.service";

const useBoutiqueInfoStore = create((set) => ({
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
        try {
            const res = await InfoBoutique.updateBoutiqueInfo();
            toast.success(res.message || "Information mise à jour !");
            set({ boutique: {...data} });
            return res;
        }
        catch (error) {
            toast.error(error.message || "Erreur lors de la mise à jour");
            throw error;
        }
    },

    updateBoutiquePassword: async (data) => {
        try {
            const res = await InfoBoutique.updateBoutiquePassword(data);
            toast.success(res.message || "Mot de passe mis à jour !");
            return res;
        }
        catch (error) {
            toast.error(error.message || "Erreur lors de la mis à jour du mot de passe");
            throw error;
        }
    }
}));

export default useBoutiqueInfoStore;