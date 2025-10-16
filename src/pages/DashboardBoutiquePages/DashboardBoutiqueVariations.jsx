import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, List, Tag } from "lucide-react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import useLibelleVariationStore from "../../stores/libelleVariation.store";
import FormulaireLibelles from "./components/FormulaireLibelles";
import ListeVariationsAvecLibelles from "./components/ListeVariationsAvecLibelles";

const DashboardBoutiqueVariation = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const { variations, fetchVariations, loading } = useLibelleVariationStore();

    useEffect(() => {
        fetchVariations();
    }, [fetchVariations]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20 flex flex-col md:flex-row">
            
            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 z-40 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 w-64 h-screen bg-white shadow-md`}
            >
                <div className="md:hidden flex justify-end p-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                        aria-label="Fermer la sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <DashboardSidebar />
            </div>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                <DashboardHeader
                    title="Gestion des libellés de variations"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* En-tête */}
                            <motion.div 
                                className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                                        <Tag className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-green-900">
                                            Gestion des libellés de variations
                                        </h1>
                                        <p className="text-green-600 mt-1">
                                            Ajoutez des valeurs spécifiques aux types de variations
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Formulaire d'ajout */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-8"
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <Plus className="w-6 h-6 text-green-600" />
                                    <h2 className="text-xl font-semibold text-green-900">
                                        Ajouter des libellés
                                    </h2>
                                </div>
                                <FormulaireLibelles variations={variations} loading={loading} />
                            </motion.div>

                            {/* Liste des variations avec leurs libellés */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-green-100 p-6"
                            >
                                <div className="flex items-center space-x-3 mb-6">
                                    <List className="w-6 h-6 text-green-600" />
                                    <h2 className="text-xl font-semibold text-green-900">
                                        Variations et leurs libellés
                                    </h2>
                                </div>
                                <ListeVariationsAvecLibelles 
                                    variations={variations} 
                                    loading={loading} 
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardBoutiqueVariation;