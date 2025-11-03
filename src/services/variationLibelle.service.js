// src/services/variationLibelle.service.js
import { axiosInstance } from "../api/axiosInstance";

const ajouterLibellesVariation = async (data) => {
    try {
        const response = await axiosInstance.post("/api/ajout/libelles/variations", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const listerVariations = async () => {
    try {
        const response = await axiosInstance.get("/api/variations/boutique");
        return response.data || [];
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const modifierVariation = async (data) => {
    try {
        const response = await axiosInstance.post("/api/variation/update", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const supprimerVariation = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/variation/delete/${hashid}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const VariationLibelleService = {
    ajouterLibellesVariation,
    listerVariations,
    modifierVariation,
    supprimerVariation,
};

export default VariationLibelleService;