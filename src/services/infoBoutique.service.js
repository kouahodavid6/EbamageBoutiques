import { axiosInstance } from "../api/axiosInstance";

const getBoutiqueInfo = async () => {
    try{
        const response = await axiosInstance.get("/api/info/boutique");
        return response.data.data;
    }catch (error) {
        throw error.response?.data || error;
    }
};

const updateBoutiqueInfo = async (data) => {
    try {
        const response = await axiosInstance.post("/api/boutique/update-infos", data);
        return response.data;
    } catch (error) {
        throw error.response?.error || error;
    }
};

const updateBoutiquePassword = async (data) => {
    try {
        const response = await axiosInstance.post("/api/boutique/update-password", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// NOUVELLE FONCTION POUR METTRE À JOUR L'IMAGE
const updateBoutiqueImage = async (hashid, imageFile) => {
    try {
        const formData = new FormData();
        // Essayez différents noms de champs selon ce qu'attend l'API
        formData.append('image_btq', imageFile); // Essayez ce nom
        // ou formData.append('image', imageFile); // Ou celui-ci
        // ou formData.append('photo', imageFile); // Ou celui-ci
        
        const response = await axiosInstance.post(`/api/boutique/image/${hashid}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        // Meilleure gestion d'erreur
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

export const InfoBoutique ={
    getBoutiqueInfo,
    updateBoutiqueInfo,
    updateBoutiquePassword,
    updateBoutiqueImage
}