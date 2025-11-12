import { useState, useEffect } from 'react';
import { Bell, Store } from "lucide-react";
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import { motion } from "framer-motion";
import { useNotificationStore } from '../../stores/notification.store';

const Notifications = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        notifications,
        unreadCount,
        loading,
        error,
        getNotifications,
        clearError,
        markAllAsRead
    } = useNotificationStore();

    // Charger les notifications au montage du composant
    useEffect(() => {
        getNotifications();
    }, [getNotifications]);

    // Marquer toutes les notifications comme lues quand on arrive sur la page
    useEffect(() => {
        if (unreadCount > 0) {
            markAllAsRead();
        }
    }, [unreadCount, markAllAsRead]);

    // Réessayer en cas d'erreur
    const handleRetry = () => {
        clearError();
        getNotifications();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date inconnue';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Vérifier si les données de l'API sont valides
    const isValidNotifications = Array.isArray(notifications);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 flex flex-col md:flex-row">

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 w-64 h-screen`}
            >
                <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-emerald-600 hover:text-emerald-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
                        aria-label="Fermer la sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <DashboardSidebar/>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0 flex flex-col">

                <DashboardHeader
                    title="Notifications"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
                    {/* Section d'en-tête */}
                    <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    Vos notifications
                                </h1>
                                <p className="text-gray-600/80 text-lg">
                                    Restez informé de l'activité de votre boutique
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Affichage des erreurs */}
                    {error && (
                        <motion.div 
                            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <Bell className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-red-800 font-medium">
                                            Erreur: {error}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRetry}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Réessayer
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Liste des notifications */}
                    <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {loading ? (
                            // Skeleton pendant le chargement
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            null
                        ) : !isValidNotifications ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
                                <Bell className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                                    Format de données invalide
                                </h3>
                                <p className="text-yellow-700 max-w-md mx-auto mb-6">
                                    Les données reçues ne sont pas au format attendu.
                                </p>
                                <button
                                    onClick={handleRetry}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                                >
                                    Réessayer
                                </button>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Aucune notification pour le moment
                                </h3>
                                <p className="text-gray-600 max-w-md mx-auto mb-6">
                                    Votre boutique n'a pas encore reçu de notifications. 
                                    Les alertes concernant les nouvelles commandes, messages clients 
                                    et activités importantes apparaîtront ici.
                                </p>
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 inline-block">
                                    <p className="text-emerald-700 text-sm font-medium">
                                        💡 Les notifications s'affichent automatiquement
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Liste des notifications (sans boutons d'action)
                            notifications.map((notification, index) => (
                                <motion.div
                                    key={notification.id || index}
                                    className={`bg-white/80 backdrop-blur-sm rounded-2xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
                                        !notification.read 
                                            ? 'border-l-emerald-500 bg-emerald-50/50' 
                                            : 'border-l-gray-300'
                                    }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className={`font-semibold text-lg ${
                                                    !notification.read ? 'text-gray-900' : 'text-gray-700'
                                                }`}>
                                                    {notification.title || 'Sans titre'}
                                                </h3>
                                                <p className="text-gray-600 mt-2">
                                                    {notification.message || 'Aucun message'}
                                                </p>
                                                <p className="text-sm text-gray-400 mt-3">
                                                    {formatDate(notification.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* Message informatif */}
                    {!loading && !error && isValidNotifications && notifications.length > 0 && (
                        <motion.div 
                            className="mt-8 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200/40 rounded-2xl p-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-center space-x-3">
                                <Store className="w-6 h-6 text-emerald-500" />
                                <p className="text-gray-700/80 text-lg font-medium">
                                    <strong>Notifications en temps réel</strong> : Soyez alerté des nouvelles commandes et activités de votre boutique
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Message quand il n'y a pas de notifications */}
                    {!loading && !error && isValidNotifications && notifications.length === 0 && (
                        <motion.div 
                            className="mt-8 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200/40 rounded-2xl p-6 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-center space-x-3">
                                <Store className="w-6 h-6 text-blue-500" />
                                <p className="text-gray-700/80 text-lg font-medium">
                                    <strong>Votre boutique est prête</strong> : Les notifications s'afficheront ici dès que vous aurez de l'activité
                                </p>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Notifications;