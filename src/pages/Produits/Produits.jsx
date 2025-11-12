import { useEffect, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Image as ImageIcon,
  ArrowUpRight,
  Package,
  Filter,
  Grid3X3,
  Calendar,
  Clock,
} from "lucide-react";
import DashboardSidebar from "../../pages/components/DashboardSidebar"
import DashboardHeader from "../../pages/components/DashboardHeader";
import ProduitDetailsModal from "./components/ProduitDetailsModal";
import RegisterProduitsModal from "./components/RegisterProduitsModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import CategoriesList from "./components/CategoriesList";
import useProduitStore from "../../stores/produit.store";
import useCategorieStore from "../../stores/categorie.store";
import { motion } from "framer-motion";

const Produits = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [editProduct, setEditProduct] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  // États pour les filtres
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { produits = [], loading = false, fetchProduits, deleteProduit } = useProduitStore();
  const { categories = [], fetchCategories } = useCategorieStore();

  // Fetch once on mount
  useEffect(() => {
    fetchProduits?.();
    fetchCategories?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDeleteModal = useCallback((product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  }, []);

  const openDetailsModal = useCallback((product) => {
    setProductDetails(product);
    setDetailsModalOpen(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setProductDetails(null);
    setDetailsModalOpen(false);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!productToDelete) return;
    try {
      await deleteProduit(productToDelete.hashid);
      toast.success("Produit supprimé avec succès !");
      closeDeleteModal();
      closeDetailsModal();
    } catch (e) {
      console.error("Erreur lors de la suppression:", e);
      toast.error("Échec de la suppression du produit.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToDelete]);

  const openEditModal = useCallback((product) => {
    setEditProduct(product);
    setShowAddModal(true);
    setProductDetails(null);
    setDetailsModalOpen(false);
  }, []);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setEditProduct(null);
  }, []);

  // Fonction pour formater la date et l'heure
  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return "Date inconnue";
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('fr-FR'),
        time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { date: "Date invalide", time: "" };
    }
  }, []);

  // Normalize produits
  const produitsArray = useMemo(() => (Array.isArray(produits) ? produits : []), [produits]);

  // Filtrage des produits
  const filteredProducts = useMemo(() => {
    let filtered = [...produitsArray];

    // Filtre par recherche
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((product) => {
        const nom = product.nom_article?.toLowerCase() || "";
        const matchName = nom.includes(q);

        const cats = Array.isArray(product.categories) ? product.categories : [];
        const matchCategory = cats.some((cat) => (cat?.nom_categorie || "").toLowerCase().includes(q));

        return matchName || matchCategory;
      });
    }

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        const cats = Array.isArray(product.categories) ? product.categories : [];
        return cats.some(cat => cat.hashid === selectedCategory);
      });
    }

    // Filtre par prix
    if (priceRange !== "all") {
      filtered = filtered.filter((product) => {
        const prix = product.prix || 0;
        switch (priceRange) {
          case "0-5000":
            return prix <= 5000;
          case "5000-15000":
            return prix > 5000 && prix <= 15000;
          case "15000-30000":
            return prix > 15000 && prix <= 30000;
          case "30000+":
            return prix > 30000;
          default:
            return true;
        }
      });
    }

    // Tri des produits
    filtered.sort((a, b) => {
      const aDate = a?.created_at || a?.createdAt;
      const bDate = b?.created_at || b?.createdAt;

      switch (sortBy) {
        case "newest":
          return new Date(bDate) - new Date(aDate);
        case "oldest":
          return new Date(aDate) - new Date(bDate);
        case "price-low":
          return (a.prix || 0) - (b.prix || 0);
        case "price-high":
          return (b.prix || 0) - (a.prix || 0);
        case "name-asc":
          return (a.nom_article || "").localeCompare(b.nom_article || "");
        case "name-desc":
          return (b.nom_article || "").localeCompare(a.nom_article || "");
        default:
          return new Date(bDate) - new Date(aDate);
      }
    });

    return filtered;
  }, [produitsArray, searchTerm, selectedCategory, priceRange, sortBy]);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange("all");
    setSortBy("newest");
  }, []);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.12 } },
    tap: { scale: 0.98, transition: { duration: 0.08 } },
  };

  // Skeleton loader for products
  const ProductSkeleton = () => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-emerald-100 rounded-xl bg-white/50 gap-4 animate-pulse">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="w-16 h-16 bg-emerald-200 rounded-xl flex-shrink-0"></div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-emerald-200 rounded w-3/4"></div>
          <div className="h-3 bg-emerald-200 rounded w-1/2"></div>
          <div className="h-4 bg-emerald-200 rounded w-1/4"></div>
        </div>
      </div>

      <div className="flex justify-end sm:justify-center">
        <div className="w-24 h-10 bg-emerald-200 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50/20 flex flex-col md:flex-row">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed md:sticky top-0 z-50 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-64 h-screen`}>
        <div className="md:hidden flex justify-end p-4 absolute top-0 right-0 z-50">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-emerald-600 hover:text-emerald-800 transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg"
            aria-label="Fermer la sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader title="Gestion des produits" toggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="p-4 sm:p-6 md:p-8 space-y-6 bg-transparent min-h-screen">
          {/* Header */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">Gestion des produits</h1>
              <p className="text-emerald-600/80">Gérez votre catalogue de produits</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-2xl border border-emerald-100">
                <Package className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">
                  {loading ? (
                    <div className="h-4 w-16 bg-emerald-200 rounded animate-pulse"></div>
                  ) : (
                    `${filteredProducts.length} produit${filteredProducts.length !== 1 ? "s" : ""}`
                  )}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center space-x-3">
              <Grid3X3 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-emerald-800">
                {loading ? (
                  <div className="h-6 w-32 bg-emerald-200 rounded animate-pulse"></div>
                ) : (
                  `Produits (${filteredProducts.length})`
                )}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.button onClick={() => setShowCategories((v) => !v)} className="bg-white hover:bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center border border-emerald-200 hover:border-emerald-300" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Filter className="w-4 h-4 mr-2" />
                {showCategories ? "Masquer catégories" : "Voir catégories"}
              </motion.button>

              <motion.button onClick={() => { setEditProduct(null); setShowAddModal(true); }} className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center border border-emerald-600" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un produit
              </motion.button>
            </div>
          </motion.div>

          {/* Categories toggle / list */}
          {showCategories && (
            <div className="mb-6">
              <CategoriesList />
            </div>
          )}

          {/* Filtres avancés */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-100/60">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  aria-label="Recherche de produit" 
                  type="text" 
                  placeholder="Rechercher un produit..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50" 
                />
              </div>

              {/* Filtre par catégorie */}
              <div>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.hashid} value={category.hashid}>
                      {category.nom_categorie}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre par prix */}
              <div>
                <select 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
                >
                  <option value="all">Tous les prix</option>
                  <option value="0-5000">0 - 5 000 FCFA</option>
                  <option value="5000-15000">5 000 - 15 000 FCFA</option>
                  <option value="15000-30000">15 000 - 30 000 FCFA</option>
                  <option value="30000+">30 000 FCFA et plus</option>
                </select>
              </div>

              {/* Tri */}
              <div>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
                >
                  <option value="newest">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="name-asc">Nom A-Z</option>
                  <option value="name-desc">Nom Z-A</option>
                </select>
              </div>
            </div>

            {/* Bouton réinitialiser les filtres */}
            {(searchTerm || selectedCategory !== "all" || priceRange !== "all" || sortBy !== "newest") && (
              <div className="flex justify-end">
                <motion.button 
                  onClick={resetFilters}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Réinitialiser les filtres
                </motion.button>
              </div>
            )}
          </div>

          {/* Products list */}
          <motion.div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60" initial="hidden" animate="visible" variants={containerVariants}>
            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                  <p className="text-emerald-600/70 text-lg mb-2">
                    {searchTerm || selectedCategory !== "all" || priceRange !== "all" ? "Aucun produit trouvé" : "Aucun produit"}
                  </p>
                  <p className="text-emerald-500/60 text-sm">
                    {searchTerm || selectedCategory !== "all" || priceRange !== "all" ? "Essayez de modifier vos critères de recherche" : "Commencez par ajouter votre premier produit"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredProducts.map((product, index) => {
                    const imageSrc = Array.isArray(product.images) && product.images.length > 0 ? (product.images[0].url || product.images[0]) : null;
                    const { date, time } = formatDateTime(product.created_at || product.createdAt);

                    return (
                      <motion.div key={product.hashid} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-emerald-100 rounded-xl hover:shadow-md transition-all duration-300 bg-white/50 hover:bg-white gap-4" variants={itemVariants} custom={index} whileHover={{ y: -2 }}>
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <motion.div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center overflow-hidden border border-emerald-100 flex-shrink-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            {imageSrc ? (
                              <img src={imageSrc} alt={product.nom_article} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-emerald-400" />
                            )}
                          </motion.div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-emerald-900 truncate text-base">{product.nom_article}</h3>
                            <p className="text-sm text-emerald-600/80 truncate mt-1">{product.categories?.map((c) => c.nom_categorie).join(", ") || "Aucune catégorie"}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="font-bold text-emerald-700 text-lg">{product.prix ? `${product.prix.toLocaleString('fr-FR')} FCFA` : '—'}</span>
                              {product.old_price && <span className="text-sm text-emerald-500/60 line-through">{product.old_price} FCFA</span>}
                            </div>
                            
                            {/* Date et heure de création */}
                            <div className="flex items-center space-x-2 mt-2 text-xs text-emerald-500/70">
                              <Calendar className="w-3 h-3" />
                              <span>{date}</span>
                              {time && (
                                <>
                                  <Clock className="w-3 h-3" />
                                  <span>{time}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end sm:justify-center">
                          <motion.button onClick={() => openDetailsModal(product)} className="flex items-center p-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-300 border border-emerald-200 hover:border-emerald-300 w-full sm:w-auto justify-center" title="Voir les détails" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={`Voir détails ${product.nom_article}`}>
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            <span className="whitespace-nowrap">Détails</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      {showAddModal && <RegisterProduitsModal setShowAddModal={setShowAddModal} categories={categories} initialData={editProduct} isEdit={!!editProduct} onClose={closeAddModal} />}

      <ProduitDetailsModal 
        isOpen={detailsModalOpen} 
        onClose={closeDetailsModal} 
        produit={productDetails} 
        onDelete={() => openDeleteModal(productDetails)} 
        onEdit={() => openEditModal(productDetails)} 
      />

      <DeleteConfirmModal 
        isOpen={deleteModalOpen} 
        onConfirm={confirmDelete} 
        onCancel={closeDeleteModal} 
        entityName={
          productToDelete 
          ? 
          productToDelete.nom_article 
          : 
          "cet élément"
        } 
        isDeleting={loading} 
      />
    </div>
  );
};

export default Produits;