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

    // Marquer toutes comme lues (sans appel API)
    markAllAsRead: () => {
        set(state => ({
            notifications: state.notifications.map(notif => ({ ...notif, read: true })),
            unreadCount: 0
        }));
    },

    // Effacer les erreurs
    clearError: () => set({ error: null })
}));