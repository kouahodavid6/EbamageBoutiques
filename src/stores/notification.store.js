import { create } from 'zustand';
import { notificationService } from '../services/notification.service';

export const useNotificationStore = create((set) => ({
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0,

  // Récupérer les notifications
    getNotifications: async () => {
        set({ loading: true, error: null });
        try {
            const response = await notificationService.getNotifications();
            set({ 
                notifications: response.data,
                unreadCount: response.data.filter(notif => !notif.read).length,
                loading: false 
            });
        } catch (error) {
            set({ 
                error: error.message || 'Erreur lors du chargement des notifications',
                loading: false 
            });
        }
    },

    // Marquer comme lu
    // markAsRead: async (notificationId) => {
    //     try {
    //         await notificationService.markAsRead(notificationId);

    //         set(state => ({
    //             notifications: state.notifications.map(notif =>
    //             notif.id === notificationId ? { ...notif, read: true } : notif
    //             ),
    //             unreadCount: state.unreadCount - 1
    //         }));
    //     } catch (error) {
    //         set({ error: error.message || 'Erreur lors de la mise à jour' });
    //     }
    // },

    // Marquer toutes comme lues
    // markAllAsRead: async () => {
    //     try {
    //         await notificationService.markAllAsRead();

    //         set(state => ({
    //             notifications: state.notifications.map(notif => ({ ...notif, read: true })),
    //             unreadCount: 0
    //         }));
    //     } catch (error) {
    //         set({ error: error.message || 'Erreur lors de la mise à jour' });
    //     }
    // },

    // Supprimer une notification
    // deleteNotification: async (notificationId) => {
    //     try {
    //         await notificationService.deleteNotification(notificationId);

    //         const state = get();
    //         const notificationToDelete = state.notifications.find(notif => notif.id === notificationId);

    //         set({   
    //             notifications: state.notifications.filter(notif => notif.id !== notificationId),
    //             unreadCount: notificationToDelete && !notificationToDelete.read 
    //             ? state.unreadCount - 1 
    //             : state.unreadCount
    //         });
    //     } catch (error) {
    //         set({ error: error.message || 'Erreur lors de la suppression' });
    //     }
    // },

    // Effacer les erreurs
    clearError: () => set({ error: null })
}));