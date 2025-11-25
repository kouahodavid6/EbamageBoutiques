import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, ShoppingCart, TrendingUp, Package, Users, Store, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import DashboardSidebar from "../../pages/components/DashboardSidebar"
import DashboardHeader from "../../pages/components/DashboardHeader";
import { motion } from "framer-motion";
import { useBoutiqueStore } from "../../stores/boutique.store";
import useDeviceTokenStore from "../../stores/deviceToken.store";
import useAuthStore from "../../stores/auth.store";
import { generateToken } from "../../notifications/firebase";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Stores Zustand
    const { user } = useAuthStore();
    const {
        soldeBoutique,
        loading: boutiqueLoading,
        error: boutiqueError,
        success: boutiqueSuccess,
        fetchSoldeBoutique,
        clearMessages: clearBoutiqueMessages
    } = useBoutiqueStore();

    const {
        // loading: deviceTokenLoading,
        error: deviceTokenError,
        success: deviceTokenSuccess,
        registerDeviceToken,
        clearMessages: clearDeviceTokenMessages
    } = useDeviceTokenStore();

    // ENREGISTREMENT AUTOMATIQUE DU DEVICE TOKEN
    useEffect(() => {
        const registerDeviceTokenAutomatically = async () => {
            if (user?.hashid) {
                try {
                    const token = await generateToken();
                    if (token) {
                        await registerDeviceToken(user.hashid, token);
                    }
                } catch (error) {
                    // Gestion silencieuse des erreurs - PAS DE TOAST
                    console.error('Erreur enregistrement token:', error);
                }
            }
        };

        registerDeviceTokenAutomatically();
    }, [user?.hashid, registerDeviceToken]);

    // Chargement initial du solde
    useEffect(() => {
        fetchSoldeBoutique();
    }, [fetchSoldeBoutique]);

    // Clear messages après 5 secondes
    useEffect(() => {
        if (boutiqueError || boutiqueSuccess) {
            const timer = setTimeout(() => {
                clearBoutiqueMessages();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [boutiqueError, boutiqueSuccess, clearBoutiqueMessages]);

    useEffect(() => {
        if (deviceTokenError || deviceTokenSuccess) {
            const timer = setTimeout(() => {
                clearDeviceTokenMessages();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [deviceTokenError, deviceTokenSuccess, clearDeviceTokenMessages]);

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
                    title="Tableau de bord"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
                    {/* Messages d'erreur seulement pour la boutique - PAS pour les notifications */}
                    {boutiqueError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {boutiqueError}
                        </motion.div>
                    )}

                    {/* SUPPRIMER le message d'erreur pour deviceTokenError */}
                    {/* {deviceTokenError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6"
                        >
                            <AlertCircle className="w-5 h-5" />
                            Erreur notifications: {deviceTokenError}
                        </motion.div>
                    )} */}

                    {/* Section de bienvenue */}
                    <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Bienvenue sur votre espace boutique
                        </h1>
                        <p className="text-gray-600/80 text-lg">
                            Gérez votre boutique en ligne et développez votre activité
                        </p>
                    </motion.div>

                    {/* Cartes de statistiques - SEULEMENT le solde réel */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        {/* Carte Solde Boutique */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-600">Solde Boutique</h3>
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>
                            {boutiqueLoading ? (
                                <div className="animate-pulse">
                                    <div className="h-8 bg-emerald-200 rounded mb-2"></div>
                                    <div className="h-4 bg-emerald-100 rounded w-20"></div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {soldeBoutique?.toLocaleString('fr-FR')} FCFA
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-xs text-gray-600">Solde disponible</span>
                                    </div>
                                </>
                            )}
                        </div>
                        
                        {/* Carte Informations Boutique */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-600">Votre Boutique</h3>
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <Store className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Statut</span>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                        Active
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Membre depuis</span>
                                    <span className="text-sm font-medium text-gray-800">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '--/--/----'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions rapides */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Actions rapides</h2>
                            <Store className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    to="/produits"
                                    className="group flex items-center justify-between p-6 border-2 border-dashed border-emerald-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors duration-300">
                                            <Plus className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700" />
                                        </div>
                                        <div>
                                            <span className="text-gray-700 group-hover:text-gray-800 font-semibold text-lg">
                                                Gérer les produits
                                            </span>
                                            <p className="text-sm text-gray-600/70 mt-1">
                                                Ajouter et modifier vos produits
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-emerald-300 group-hover:text-emerald-400 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link 
                                    to="/commandes"
                                    className="group flex items-center justify-between p-6 border-2 border-dashed border-emerald-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors duration-300">
                                            <ShoppingCart className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700" />
                                        </div>
                                        <div>
                                            <span className="text-gray-700 group-hover:text-gray-800 font-semibold text-lg">
                                                Voir les commandes
                                            </span>
                                            <p className="text-sm text-gray-600/70 mt-1">
                                                Gérer vos commandes en cours
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-emerald-300 group-hover:text-emerald-400 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Section informations supplémentaires */}
                    <motion.div 
                        className="grid grid-cols-1 gap-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        {/* Guide de démarrage */}
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Étapes</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    Complétez votre profil boutique
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    Ajoutez vos variations
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    Ajouter vos produits
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    Gérer vos commandes
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Message d'encouragement */}
                    <motion.div 
                        className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200/40 rounded-2xl p-6 text-center"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-center space-x-3">
                            <Store className="w-6 h-6 text-emerald-500" />
                            <p className="text-gray-700/80 text-lg font-medium">
                                <strong>Prêt à développer votre activité</strong> : Commencez par ajouter vos premiers produits !
                            </p>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;