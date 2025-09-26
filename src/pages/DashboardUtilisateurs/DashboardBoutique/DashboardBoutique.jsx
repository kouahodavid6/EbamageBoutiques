import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ShoppingCart, TrendingUp, Package, Users, Store } from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { motion } from "framer-motion";

/* ------------------------------------------------------------- */
const DashboardBoutique = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /* ============================================================= */
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
                {/* Croix mobile */}
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

                    {/* Cartes de statistiques */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-600">Produits actifs</h3>
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <Package className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">12</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-xs text-gray-600">+2 ce mois</span>
                            </div>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-600">Commandes ce mois</h3>
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">8</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-xs text-gray-600">+3 vs mois dernier</span>
                            </div>
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-gray-600">Clients satisfaits</h3>
                                <div className="bg-emerald-100 p-2 rounded-lg">
                                    <Users className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-800">94%</p>
                            <div className="flex items-center mt-2">
                                <Store className="w-4 h-4 text-emerald-500 mr-1" />
                                <span className="text-xs text-gray-600">Performance boutique</span>
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
                                    to="/dashboard-boutique/produits"
                                    className="group flex items-center justify-between p-6 border-2 border-dashed border-emerald-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-200 transition-colors duration-300">
                                            <Plus className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700" />
                                        </div>
                                        <div>
                                            <span className="text-gray-700 group-hover:text-gray-800 font-semibold text-lg">
                                                Ajouter un produit
                                            </span>
                                            <p className="text-sm text-gray-600/70 mt-1">
                                                Créer un nouveau produit
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

                            <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.6 }}>
                                <Link 
                                    to="/dashboard-boutique/commandes"
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

                    {/* Message d'encouragement */}
                    <motion.div 
                        className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200/40 rounded-2xl p-6 text-center"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                    >
                        <div className="flex items-center justify-center space-x-3">
                            <Store className="w-6 h-6 text-emerald-500" />
                            <p className="text-gray-700/80 text-lg font-medium">
                                <strong>Votre boutique avance bien</strong> : Continuez à développer votre activité en ligne !
                            </p>
                        </div>
                    </motion.div>
                </main>
            </div>

            {/* Modaux */}
            {/* <DeleteConfirmModal
                isOpen={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={() => {
                setShowDeleteModal(false);
                setSelectedRecrue(null);
                }}
                entityName={`${selectedRecrue?.nom ?? ""} ${selectedRecrue?.prenom ?? ""}`}
            /> */}

            {/* <EditRecrueModal
                isOpen={showEditModal}
                onClose={() => {
                setShowEditModal(false);
                setSelectedRecrue(null);
                }}
                initialData={selectedRecrue}
                onSubmit={confirmEdit}
            /> */}
        </div>
    );
};

export default DashboardBoutique;