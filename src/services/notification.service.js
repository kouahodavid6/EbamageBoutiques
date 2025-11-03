import { axiosInstance } from "../api/axiosInstance";

// Récupérer toutes les notifications de l'utilisateur connecté
const getNotifications = async () => {
    try {
        const response = await axiosInstance.get('/api/notifications');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
        throw new Error(errorMessage);
    }
}

// //Marquer une notification comme lue
// const markAsRead = async (notificationId) => {
//     try {
//         const response = await axiosInstance.put(`/api/notifications/${notificationId}/read`);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// }

// //Marquer toutes les notifications comme lues
// const markAllAsRead = async () => {
//     try {
//         const response = await axiosInstance.put('/api/notifications/mark-all-read');
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// }

// //Supprimer une notification
// const deleteNotification = async (notificationId) => {
//     try {
//         const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
//         return response.data;
//     } catch (error) {
//         throw error.response?.data || error.message;
//     }
// }

export const notificationService = {
    getNotifications,
    // markAsRead,
    // markAllAsRead,
    // deleteNotification
}