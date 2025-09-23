import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { ShoppingBag, Search, Clock, MapPin, User, Package, ArrowUpRight } from 'lucide-react';
import useCommandeStore from "../../../stores/commande.store";
import CommandeDetailsModal from "./components/CommandeDetailsModal";

const DashboardBoutiqueCommandes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [commandeDetails, setCommandeDetails] = useState(null);
    
    const { commandes, loading, error, fetchCommandes } = useCommandeStore();
    
    useEffect(() => {
        fetchCommandes();
    }, [fetchCommandes]);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Fixe sur desktop, cachée sur mobile */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
                            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                            md:translate-x-0 md:relative`}>
                {/* Bouton de fermeture mobile */}
                <div className="md:hidden flex justify-end p-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-800 focus:outline-none"
                        aria-label="Fermer la sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <DashboardSidebar role="boutique" />
            </div>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <DashboardHeader
                    title="Commandes"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-100">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <h1 className="text-xl font-bold text-gray-900">Commandes</h1>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Rechercher une commande..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p>{error}</p>
                        </div>
                    ) : commandes && commandes.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Liste des commandes ({commandes.length})
                                </h2>
                                
                                <div className="space-y-4">
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
                                        .map(commande => (
                                            <div 
                                                key={commande.hashid} 
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <User className="h-4 w-4 text-gray-500" />
                                                            <h3 className="font-medium text-gray-900">
                                                                {commande.client.nom_clt}
                                                            </h3>
                                                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                commande.statut === "En attente" ? "bg-yellow-100 text-yellow-800" :
                                                                commande.statut === "Livré" ? "bg-green-100 text-green-800" :
                                                                commande.statut === "Annulé" ? "bg-red-100 text-red-800" :
                                                                "bg-blue-100 text-blue-800"
                                                            }`}>
                                                                {commande.statut}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3 text-gray-400" />
                                                                <span className="text-gray-600">
                                                                    {new Date(commande.created_at).toLocaleDateString('fr-FR')}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3 text-gray-400" />
                                                                <span className="text-gray-600">
                                                                    {commande.localisation.commune}, {commande.localisation.quartier}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1">
                                                                <ShoppingBag className="h-3 w-3 text-gray-400" />
                                                                <span className="text-gray-600">
                                                                    {commande.articles.length} article(s)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className="font-bold text-gray-900">
                                                            {commande.prix_total_commande} FCFA
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setCommandeDetails(commande);
                                                                setDetailsModalOpen(true);
                                                            }}
                                                            className="flex items-center p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                                                        >
                                                            Détails
                                                            <ArrowUpRight className="w-4 h-4 ml-1" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune commande trouvée</h3>
                            <p className="text-gray-500">Vous n'avez pas encore reçu de commandes.</p>
                        </div>
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