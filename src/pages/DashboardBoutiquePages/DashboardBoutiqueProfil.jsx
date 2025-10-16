import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Mail, Phone, Calendar, Key } from "lucide-react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import useBoutiqueInfoStore from "../../stores/infoBoutique.store";
import InfoForm from "./components/InfoForm";
import PasswordForm from "./components/PasswordForm";

const DashboardBoutiqueProfil = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("infos");

    const { boutique, fetchBoutiqueInfo, loading } = useBoutiqueInfoStore();

    useEffect(() => {
        fetchBoutiqueInfo();
    }, [fetchBoutiqueInfo]);

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const tabContentVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            x: -20,
            transition: {
                duration: 0.2
            }
        }
    };

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
                    title="Profil de la boutique"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* En-tête avec animation */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-6"
                            >
                                <div className="flex items-center space-x-4">
                                    <motion.div 
                                        className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Store className="w-8 h-8 text-green-600" />
                                    </motion.div>
                                    <div>
                                        <motion.h1 
                                            className="text-2xl font-bold text-green-900"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            {loading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-4 h-4 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                                                    <span>Chargement...</span>
                                                </div>
                                            ) : (
                                                boutique?.nom_btq || "Boutique"
                                            )}
                                        </motion.h1>
                                        <motion.p 
                                            className="text-green-600"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            Gérez les informations de votre boutique
                                        </motion.p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Navigation par onglets */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-2xl shadow-sm border border-green-100 p-2 mb-6"
                            >
                                <div className="flex space-x-2">
                                    <motion.button
                                        onClick={() => setActiveTab("infos")}
                                        className={`flex-1 py-3 px-4 rounded-xl text-center transition-all ${
                                            activeTab === "infos" 
                                                ? "bg-green-600 text-white shadow-md" 
                                                : "text-green-700 hover:bg-green-50"
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <Store className="w-4 h-4" />
                                            <span>Informations</span>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveTab("password")}
                                        className={`flex-1 py-3 px-4 rounded-xl text-center transition-all ${
                                            activeTab === "password" 
                                                ? "bg-green-600 text-white shadow-md" 
                                                : "text-green-700 hover:bg-green-50"
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <Key className="w-4 h-4" />
                                            <span>Mot de passe</span>
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Contenu des onglets avec animation */}
                            <motion.div
                                className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden"
                                layout
                            >
                                <AnimatePresence mode="wait">
                                    {activeTab === "infos" && (
                                        <motion.div
                                            key="infos"
                                            variants={tabContentVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <InfoForm boutique={boutique} loading={loading} />
                                        </motion.div>
                                    )}
                                    {activeTab === "password" && (
                                        <motion.div
                                            key="password"
                                            variants={tabContentVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <PasswordForm />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Informations de compte */}
                            {!loading && boutique && (
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mt-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h3 className="text-lg font-semibold text-green-900 mb-4">
                                        Informations du compte
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <motion.div 
                                            className="flex items-center space-x-3 text-green-700"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Calendar className="w-4 h-4 text-green-500" />
                                            <span>Créé le: {new Date(boutique?.created_at).toLocaleDateString('fr-FR')}</span>
                                        </motion.div>
                                        <motion.div 
                                            className="flex items-center space-x-3 text-green-700"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Calendar className="w-4 h-4 text-green-500" />
                                            <span>Dernière modification: {new Date(boutique?.updated_at).toLocaleDateString('fr-FR')}</span>
                                        </motion.div>
                                        <motion.div 
                                            className="flex items-center space-x-3 text-green-700"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Mail className="w-4 h-4 text-green-500" />
                                            <span>Email: {boutique?.email_btq}</span>
                                        </motion.div>
                                        <motion.div 
                                            className="flex items-center space-x-3 text-green-700"
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Phone className="w-4 h-4 text-green-500" />
                                            <span>Téléphone: {boutique?.tel_btq}</span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Squelette de chargement */}
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                {/* Squelette pour les informations de compte */}
                                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mt-6">
                                    <div className="h-6 bg-green-100 rounded w-1/3 mb-4 animate-pulse"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex items-center space-x-3">
                                                <div className="w-4 h-4 bg-green-100 rounded animate-pulse"></div>
                                                <div className="h-4 bg-green-100 rounded w-2/3 animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardBoutiqueProfil;