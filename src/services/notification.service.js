import { axiosInstance } from "../api/axiosInstance";

const getNotifications = async () => {
    try {
        const response = await axiosInstance.get('/api/notifications');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
        throw new Error(errorMessage);
    }
}

export const notificationService = {
    getNotifications,
}