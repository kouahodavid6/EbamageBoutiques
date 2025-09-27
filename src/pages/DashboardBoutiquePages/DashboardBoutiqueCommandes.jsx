import { useState, useEffect } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import { ShoppingBag, Search, Clock, MapPin, User, Package, ArrowUpRight, Truck, CreditCard } from 'lucide-react';
import useCommandeStore from "../../stores/commande.store";
import CommandeDetailsModal from "./components/CommandeDetailsModal";
import { motion } from "framer-motion";

const DashboardBoutiqueCommandes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [commandeDetails, setCommandeDetails] = useState(null);
    
    const { commandes, loading, error, fetchCommandes } = useCommandeStore();
    
    useEffect(() => {
        fetchCommandes();
    }, [fetchCommandes]);

    // Variants d'animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case "En attente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Livré": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "Annulé": return "bg-red-100 text-red-800 border-red-200";
            case "En cours": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case "En attente": return <Clock className="w-3 h-3" />;
            case "Livré": return <Package className="w-3 h-3" />;
            case "Annulé": return <span className="w-3 h-3">✕</span>;
            case "En cours": return <Truck className="w-3 h-3" />;
            default: return <ShoppingBag className="w-3 h-3" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50/20 flex flex-col md:flex-row">

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
                    title="Commandes"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* En-tête */}
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">Commandes</h1>
                                <p className="text-emerald-600/80">Gérez et suivez les commandes de vos clients</p>
                            </div>
                            
                            <motion.div 
                                className="relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-emerald-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une commande..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-80 pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                    
                    {loading ? (
                        <motion.div 
                            className="flex justify-center items-center h-64 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p>{error}</p>
                        </motion.div>
                    ) : commandes && commandes.length > 0 ? (
                        <motion.div 
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <ShoppingBag className="w-6 h-6 text-emerald-500" />
                                        <h2 className="text-xl font-semibold text-emerald-900">
                                            Liste des commandes ({commandes.length})
                                        </h2>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-emerald-600">
                                        <CreditCard className="w-4 h-4" />
                                        <span>Total: {commandes.reduce((sum, cmd) => sum + (cmd.prix_total_commande || 0), 0)} FCFA</span>
                                    </div>
                                </div>
                                
                                <motion.div 
                                    className="space-y-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {commandes
                                        .filter(commande => {
                                            if (!searchTerm) return true;
                                            const searchLower = searchTerm.toLowerCase();
                                            return (
                                                commande.client.nom_clt.toLowerCase().includes(searchLower) ||
                                                commande.statut.toLowerCase().includes(searchLower) ||
                                                commande.localisation.commune.toLowerCase().includes(searchLower) ||
                                                commande.localisation.quartier.toLowerCase().includes(searchLower)
                                            );
                                        })
                                        .map((commande, index) => (
                                            <motion.div 
                                                key={commande.hashid} 
                                                className="border border-emerald-100 rounded-xl p-5 bg-white/50 hover:bg-white transition-all duration-300"
                                                variants={itemVariants}
                                                custom={index}
                                                whileHover="hover"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="bg-emerald-100 p-2 rounded-lg">
                                                                <User className="h-4 w-4 text-emerald-600" />
                                                            </div>
                                                            <h3 className="font-semibold text-emerald-900">
                                                                {commande.client.nom_clt}
                                                            </h3>
                                                            <motion.span 
                                                                className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(commande.statut)}`}
                                                                whileHover={{ scale: 1.05 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                {getStatusIcon(commande.statut)}
                                                                <span className="ml-1">{commande.statut}</span>
                                                            </motion.span>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-emerald-400" />
                                                                <span className="text-emerald-600">
                                                                    {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-emerald-400" />
                                                                <span className="text-emerald-600">
                                                                    {commande.localisation.commune}, {commande.localisation.quartier}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <Package className="h-4 w-4 text-emerald-400" />
                                                                <span className="text-emerald-600">
                                                                    {commande.articles.length} article(s)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col items-end gap-3">
                                                        <span className="font-bold text-emerald-700 text-lg">
                                                            {commande.prix_total_commande} FCFA
                                                        </span>
                                                        <motion.button
                                                            onClick={() => {
                                                                setCommandeDetails(commande);
                                                                setDetailsModalOpen(true);
                                                            }}
                                                            className="flex items-center p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-300 border border-transparent hover:border-emerald-200"
                                                            variants={buttonVariants}
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                        >
                                                            <ArrowUpRight className="w-4 h-4 mr-2" />
                                                            Détails
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    }
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-8 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Package className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-emerald-900 mb-2">Aucune commande trouvée</h3>
                            <p className="text-emerald-600/70">Vous n'avez pas encore reçu de commandes.</p>
                        </motion.div>
                    )}
                </main>
            </div>
            
            {/* Modal de détails de commande */}
            <CommandeDetailsModal 
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                commande={commandeDetails}
            />
        </div>
    );
};

export default DashboardBoutiqueCommandes;