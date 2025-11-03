// src/services/variationLibelle.service.js
import { axiosInstance } from "../api/axiosInstance";

const ajouterLibellesVariation = async (data) => {
  // data = { variation_id, lib_variation: ["XL","XXL"] }
    try {
        const response = await axiosInstance.post("/api/ajout/libelles/variations", data);
        return response.data;
    } catch (error) {
        // Normaliser l'erreur
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const listerVariations = async () => {
    try {
        const response = await axiosInstance.get("/api/variations");
        return response.data.data || [];
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const modifierVariation = async (data) => {
  // data = { variation_id, lib_variation: [...] }
    try {
        const response = await axiosInstance.post("/api/variation/update", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const supprimerVariation = async (hashid) => {
    try {
        // ton backend attend POST /api/variation/delete/:hashid
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
