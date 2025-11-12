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
        
        formData.append('image_btq', imageFile);
        
        const response = await axiosInstance.post(`/api/boutique/image/${hashid}/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
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