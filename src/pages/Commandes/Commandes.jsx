import { useState, useEffect } from "react";
import DashboardSidebar from "../../pages/components/DashboardSidebar";
import DashboardHeader from "../../pages/components/DashboardHeader";
import {
    Search,
    Filter,
    User,
    Store,
    Package,
    Clock,
    CreditCard,
    MapPin,
    CheckCircle,
    XCircle,
    Eye,
    DollarSign,
} from "lucide-react";
import useCommandeStore from "../../stores/commande.store";
import { useBoutiqueStore } from "../../stores/boutique.store";
import { format, differenceInDays } from "date-fns";
import fr from "date-fns/locale/fr";
import CommandeDetailsModal from "./components/CommandeDetailsModal";
import { motion, AnimatePresence } from "framer-motion";

const Commandes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        statut: '',
        localisation: ''
    });

    const { commandes = [], loading, error, fetchCommandes, markDuAsReclame } = useCommandeStore();
    const { reclamerDu, loading: loadingReclamation } = useBoutiqueStore();

    useEffect(() => {
        fetchCommandes();
    }, [fetchCommandes]);

    // Fonction pour vérifier si on peut réclamer le dû (3 jours après livraison)
    const canReclamerDu = (commande) => {
        if (commande.statut !== 'Livrée' && commande.statut !== 'Livré') return false;
        
        // Utiliser la date de mise à jour si la commande est livrée
        const dateLivraison = new Date(commande.updated_at);
        const aujourdHui = new Date();
        const joursEcoules = differenceInDays(aujourdHui, dateLivraison);
        
        return joursEcoules >= 3 && !commande.du_reclame;
    };

    // Fonction pour gérer la réclamation du dû
    const handleReclamerDu = async (commande, e) => {
        e.stopPropagation(); // Empêcher l'ouverture de la modal
        try {
            await reclamerDu(commande.hashid);
            
            // Marquer la commande comme ayant réclamé son dû
            markDuAsReclame(commande.hashid);
            
        } catch (error) {
            console.error('Erreur lors de la réclamation:', error);
        }
    };

    // 🔎 Filtrage combiné (recherche + filtres)
    const filteredCommandes = commandes.filter((commande) => {
        try {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                commande?.client?.nom_clt?.toLowerCase()?.includes(searchLower) ||
                commande?.articles?.some(
                    (article) =>
                        article?.nom_article?.toLowerCase()?.includes(searchLower) ||
                        article?.boutique?.nom_btq?.toLowerCase()?.includes(searchLower)
                ) ||
                commande?.localisation?.commune?.toLowerCase()?.includes(searchLower) ||
                commande?.localisation?.quartier?.toLowerCase()?.includes(searchLower) ||
                commande?.statut?.toLowerCase()?.includes(searchLower) ||
                commande?.code_commande?.toLowerCase()?.includes(searchLower);

            // Filtres supplémentaires
            const matchesStatut = !localFilters.statut || commande.statut === localFilters.statut;
            const matchesLocalisation = !localFilters.localisation || 
                (commande.localisation?.commune?.toLowerCase().includes(localFilters.localisation.toLowerCase()) ||
                    commande.localisation?.ville?.toLowerCase().includes(localFilters.localisation.toLowerCase()));

            return matchesSearch && matchesStatut && matchesLocalisation;
        } catch (e) {
            console.error("Erreur de filtrage", e);
            return false;
        }
    });

    // 📦 Skeleton loader
    const skeletonCount = 3;

    // 🏷️ Badges de statut
    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
        switch (status) {
            case "En attente":
                return (
                    <span className={`bg-amber-100 text-amber-800 ${baseClasses}`}>
                        <Clock className="w-3 h-3" /> {status}
                    </span>
                );
            case "Livré":
            case "Livrée":
                return (
                    <span className={`bg-emerald-100 text-emerald-800 ${baseClasses}`}>
                        <CheckCircle className="w-3 h-3" /> {status}
                    </span>
                );
            case "Annulé":
            case "Annulée":
                return (
                    <span className={`bg-red-100 text-red-800 ${baseClasses}`}>
                        <XCircle className="w-3 h-3" /> {status}
                    </span>
                );
            case "Confirmée":
                return (
                    <span className={`bg-green-100 text-green-800 ${baseClasses}`}>
                        <CheckCircle className="w-3 h-3" /> {status}
                    </span>
                );
            default:
                return (
                    <span className={`bg-gray-100 text-gray-800 ${baseClasses}`}>
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, "dd MMM yyyy HH:mm", { locale: fr });
        } catch (e) {
            return "Date invalide";
        }
    };

    // Options de statut pour le filtre
    const statutOptions = [
        { value: '', label: 'Tous les statuts' },
        { value: 'En attente', label: 'En attente' },
        { value: 'Confirmée', label: 'Confirmée' },
        { value: 'Livrée', label: 'Livrée' },
        { value: 'Annulée', label: 'Annulée' }
    ];

    // Réinitialiser les filtres
    const handleReinitialiserFiltres = () => {
        setLocalFilters({ statut: '', localisation: '' });
        setSearchTerm('');
    };

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = localFilters.statut || localFilters.localisation || searchTerm;

    // 🎬 Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
        hover: {
            y: -4,
            boxShadow: "0 20px 40px rgba(16, 185, 129, 0.12)",
            transition: { duration: 0.3 },
        },
    };

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } },
    };

    // 🚨 Gestion erreur
    if (error)
        return (
            <motion.div
                className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center max-w-md">
                    <p className="font-semibold mb-2">Erreur de chargement</p>
                    <p className="text-sm">{error}</p>
                    <button 
                        onClick={fetchCommandes}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </motion.div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50/30 to-emerald-50/50 flex flex-col md:flex-row">
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
                <DashboardSidebar />
            </div>

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                <DashboardHeader
                    title="Commandes"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-transparent space-y-6">
                    {/* En-tête */}
                    <motion.div
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
                                Commandes de la boutique
                            </h1>
                            <p className="text-emerald-600/80">
                                Visualisez toutes les commandes passées dans votre boutique
                            </p>
                        </div>
                        {!loading && (
                            <motion.div
                                className="flex items-center gap-2 text-emerald-600/80 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2 border border-emerald-100/60"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Package className="w-5 h-5" />
                                <span className="font-medium">
                                    {filteredCommandes.length} commande
                                    {filteredCommandes.length !== 1 ? "s" : ""}
                                </span>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Barre de recherche et filtres */}
                    <motion.div
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                            <div className="relative flex-1 min-w-0">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-emerald-400 w-5 h-5" />
                                </div>
                                <motion.input
                                    type="text"
                                    placeholder="Rechercher par client, article, code commande ou statut..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </div>
                            <motion.button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all duration-300 whitespace-nowrap font-medium text-emerald-700"
                                style={{ height: "48px" }}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Filter className="w-5 h-5" />
                                <span>Filtres</span>
                                {hasActiveFilters && (
                                    <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        !
                                    </span>
                                )}
                            </motion.button>
                        </div>

                        {/* Panneau des filtres */}
                        <AnimatePresence>
                            {filtersOpen && (
                                <motion.div
                                    className="mt-4 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                                        {/* Filtre par statut */}
                                        <div className="flex-1 min-w-0">
                                            <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                Statut de la commande
                                            </label>
                                            <select
                                                value={localFilters.statut}
                                                onChange={(e) => setLocalFilters(prev => ({ ...prev, statut: e.target.value }))}
                                                className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 bg-white"
                                            >
                                                {statutOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Filtre par localisation */}
                                        <div className="flex-1 min-w-0">
                                            <label className="block text-sm font-medium text-emerald-700 mb-2">
                                                Localisation (ville/commune)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Abobo, Abidjan..."
                                                value={localFilters.localisation}
                                                onChange={(e) => setLocalFilters(prev => ({ ...prev, localisation: e.target.value }))}
                                                className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 bg-white"
                                            />
                                        </div>

                                        {/* Bouton réinitialiser */}
                                        <motion.button
                                            onClick={handleReinitialiserFiltres}
                                            disabled={!hasActiveFilters}
                                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                                            variants={buttonVariants}
                                            whileHover={hasActiveFilters ? "hover" : {}}
                                            whileTap={hasActiveFilters ? "tap" : {}}
                                        >
                                            Réinitialiser
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Liste commandes */}
                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {loading ? (
                            // Skeletons
                            Array(skeletonCount)
                                .fill(0)
                                .map((_, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 animate-pulse"
                                        variants={itemVariants}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-emerald-200 rounded-xl" />
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-emerald-200 rounded w-40" />
                                                    <div className="h-3 bg-emerald-100 rounded w-28" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 w-32">
                                                <div className="h-5 bg-emerald-200 rounded" />
                                                <div className="h-4 bg-emerald-100 rounded" />
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-emerald-100 flex gap-4">
                                            <div className="h-4 bg-emerald-100 rounded w-24" />
                                            <div className="h-4 bg-emerald-100 rounded w-24" />
                                            <div className="h-4 bg-emerald-100 rounded w-24" />
                                        </div>
                                    </motion.div>
                                ))
                        ) : filteredCommandes.length === 0 ? (
                            <motion.div
                                className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Package className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-emerald-900 mb-2">
                                    {hasActiveFilters
                                        ? "Aucune commande trouvée"
                                        : "Aucune commande disponible"}
                                </h3>
                                <p className="text-emerald-600/70">
                                    {hasActiveFilters
                                        ? "Essayez de modifier vos critères de recherche"
                                        : "Les commandes apparaîtront ici une fois passées"}
                                </p>
                                {hasActiveFilters && (
                                    <motion.button
                                        onClick={handleReinitialiserFiltres}
                                        className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Réinitialiser les filtres
                                    </motion.button>
                                )}
                            </motion.div>
                        ) : (
                            filteredCommandes.map((commande) => (
                                <motion.div
                                    key={commande.hashid}
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 overflow-hidden group"
                                    variants={itemVariants}
                                    whileHover="hover"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                            <div className="flex items-center space-x-4">
                                                <motion.div
                                                    className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-3 rounded-xl shadow-lg"
                                                    whileHover={{
                                                        scale: 1.1,
                                                        rotate: 5,
                                                    }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Package className="w-6 h-6 text-white" />
                                                </motion.div>
                                                <div>
                                                    <h3 className="font-semibold text-emerald-900 text-lg">
                                                        Commande {commande.code_commande}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <User className="w-4 h-4 text-emerald-500" />
                                                        <span className="text-sm text-emerald-600/80">
                                                            {commande.client?.nom_clt}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col lg:items-end gap-3">
                                                <div className="text-xl font-bold text-emerald-900">
                                                    {commande.prix_total_commande?.toLocaleString("fr-FR")} FCFA
                                                </div>
                                                {getStatusBadge(commande.statut)}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-emerald-100">
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-600/80">
                                                <div className="flex items-center gap-2">
                                                    <Store className="w-4 h-4 text-emerald-500" />
                                                    <span>
                                                        {commande.articles?.[0]?.boutique?.nom_btq || "Boutique inconnue"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-emerald-500" />
                                                    <span>{commande.moyen_de_paiement}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-emerald-500" />
                                                    <span>
                                                        {commande.localisation?.commune},{" "}
                                                        {commande.localisation?.quartier}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-emerald-500" />
                                                    <span>
                                                        {formatDate(commande.created_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-4 flex flex-wrap gap-3">
                                                {/* Bouton Voir détail */}
                                                <motion.button
                                                    onClick={() => setSelectedCommande(commande)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                                    variants={buttonVariants}
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Voir détail
                                                </motion.button>

                                                {/* Bouton Réclamer son dû (conditionnel) */}
                                                {canReclamerDu(commande) && (
                                                    <motion.button
                                                        onClick={(e) => handleReclamerDu(commande, e)}
                                                        disabled={loadingReclamation}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
                                                        variants={buttonVariants}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                        {loadingReclamation ? "Traitement..." : "Réclamer son dû"}
                                                    </motion.button>
                                                )}

                                                {/* Indicateur si déjà réclamé */}
                                                {commande.du_reclame && (
                                                    <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        Dû réclamé
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>

                    {/* Modal détail commande */}
                    {selectedCommande && (
                        <CommandeDetailsModal
                            commande={selectedCommande}
                            isOpen={!!selectedCommande}
                            onClose={() => setSelectedCommande(null)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default Commandes;