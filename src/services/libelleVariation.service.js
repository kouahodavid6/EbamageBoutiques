import { axiosInstance } from "../api/axiosInstance";

// Ajouter des libellés à une variation
const ajouterLibellesVariation = async (data) => {
    try {
        const response = await axiosInstance.post("/api/ajout/libelles/variations", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Lister toutes les variations (pour le select)
const listerVariations = async () => {
    try {
        const response = await axiosInstance.get("/api/variations");
        return response.data.data || [];
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Modifier une variation (pour les libellés)
const modifierVariation = async (hashid, data) => {
    try {
        const response = await axiosInstance.put("/api/variation/update", {
            hashid,
            ...data
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Supprimer une variation (pour supprimer les libellés)
const supprimerVariation = async (hashid) => {
    try {
        const response = await axiosInstance.delete(`/api/variation/delete/${hashid}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Récupérer les libellés d'une variation spécifique
const getLibellesByVariation = async (variationId) => {
    try {
        const response = await axiosInstance.get(`/api/variation/${variationId}/libelles`);
        return response.data.data || [];
    } catch (error) {
        throw error.response?.data || error;
    }
};

const LibelleVariationService = {
    ajouterLibellesVariation,
    listerVariations,
    modifierVariation,
    supprimerVariation,
    getLibellesByVariation
};

export default LibelleVariationService;