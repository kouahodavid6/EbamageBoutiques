import { axiosInstance } from "../api/axiosInstance";

const getBoutiqueInfo = async () => {
    try{
        const response = await axiosInstance.get("/api/info/boutique");
        return response.data.data;
    }
    catch (error) {
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

export const InfoBoutique ={
    getBoutiqueInfo,
    updateBoutiqueInfo,
    updateBoutiquePassword
}