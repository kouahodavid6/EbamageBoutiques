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
        const response = await axiosInstance.get("/api/variations");
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const listerVariationsBoutique = async () => {
    try {
        const response = await axiosInstance.get("/api/variations/boutique");
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const modifierVariation = async (hashid, data) => {
    try {
        const response = await axiosInstance.post(`/api/variation/${hashid}/update`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

const supprimerVariation = async (hashid) => {
    try {
        const response = await axiosInstance.post(`/api/variation/${hashid}/delete`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { success: false, message: error.message || "Erreur réseau" };
    }
};

export const VariationLibelleService = {
    ajouterLibellesVariation,
    listerVariations,
    listerVariationsBoutique,
    modifierVariation,
    supprimerVariation
};