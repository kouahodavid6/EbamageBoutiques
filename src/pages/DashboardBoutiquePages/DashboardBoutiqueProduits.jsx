// ... [tout ton import inchangé] ...
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import { Plus, Search, Image, ArrowUpRight, Package, Filter, Grid3X3 } from "lucide-react";
import ProduitDetailsModal from "./components/ProduitDetailsModal";
import RegisterProduitsModal from "./components/RegisterProduitsModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import useProduitStore from "../../stores/produit.store";
import useCategorieStore from "../../stores/categorie.store";
import CategoriesList from "../../components/CategoriesList";
import { motion } from "framer-motion";

const DashboardBoutiqueProduits = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [editProduct, setEditProduct] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  const { produits, loading, fetchProduits, deleteProduit } = useProduitStore();
  const { categories, fetchCategories } = useCategorieStore();

  useEffect(() => {
    fetchProduits();
    fetchCategories();
  }, [fetchProduits, fetchCategories]);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setDeleteModalOpen(false);
  };

  const openDetailsModal = (product) => {
    setProductDetails(product);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setProductDetails(null);
    setDetailsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduit(productToDelete.hashid);
      toast.success("Produit supprimé avec succès !");
      closeDeleteModal();
      closeDetailsModal();
    } catch (e) {
      console.error("Erreur lors de la suppression:", e);
    }
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setShowAddModal(true);
    closeDetailsModal();
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setEditProduct(null);
  };

  const produitsArray = Array.isArray(produits) ? produits : [];
  const filteredProducts = produitsArray.filter((product) => {
    const nom = product.nom_article?.toLowerCase() || "";
    const matchName = nom.includes(searchTerm.toLowerCase());

    const categories = product.categories || [];
    const matchCategory = categories.some((cat) =>
      cat.nom_categorie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return matchName || matchCategory;
  });

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { text: "Rupture", color: "bg-red-100 text-red-800 border-red-200" };
    if (stock < 5)
      return { text: "Faible", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
    return { text: "Disponible", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
  };

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
          title="Gestion des produits"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="p-4 sm:p-6 md:p-8 space-y-6 bg-transparent min-h-screen">
          {/* En-tête */}
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
                Gestion des produits
              </h1>
              <motion.p 
                className="text-emerald-600/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Gérez votre catalogue de produits et suivez votre inventaire
              </motion.p>
            </div>
          </motion.div>

          {/* Barre d'actions */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <Grid3X3 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-emerald-800">
                Produits ({filteredProducts.length})
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.button
                onClick={() => setShowCategories(!showCategories)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center border border-emerald-600"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showCategories ? "Masquer catégories" : "Voir catégories"}
              </motion.button>
              
              <motion.button
                onClick={() => {
                  setEditProduct(null);
                  setShowAddModal(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center border border-emerald-600"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un produit
              </motion.button>
            </div>
          </motion.div>

          {/* Liste des catégories */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: showCategories ? 1 : 0,
              height: showCategories ? "auto" : 0
            }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            {showCategories && (
              <div className="mb-6">
                <CategoriesList />
              </div>
            )}
          </motion.div>

          {/* Barre de recherche */}
          <motion.div 
            className="w-full bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-emerald-100/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un produit par nom ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 bg-white/50"
              />
            </div>
          </motion.div>

                    {/* Liste des produits */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="p-6">
              {loading ? (
                <motion.div 
                  className="flex justify-center items-center h-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Package className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                  <p className="text-emerald-600/70 text-lg mb-2">Aucun produit trouvé</p>
                  <p className="text-emerald-500/60 text-sm">
                    {searchTerm ? "Essayez de modifier vos critères de recherche" : "Commencez par ajouter votre premier produit"}
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="grid gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.map((product, index) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <motion.div
                        key={product.hashid || product.id}
                        className="flex items-center space-x-4 p-4 border border-emerald-100 rounded-xl hover:shadow-md transition-all duration-300 bg-white/50 hover:bg-white"
                        variants={itemVariants}
                        custom={index}
                        whileHover="hover"
                      >
                        
                        {/* Image du produit */}
                        <motion.div 
                          className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center overflow-hidden border border-emerald-100"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.nom_article}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image className="w-6 h-6 text-emerald-400" />
                          )}
                        </motion.div>

                        {/* Informations du produit */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-emerald-900 truncate">
                            {product.nom_article}
                          </h3>
                          <p className="text-sm text-emerald-600/80 truncate">
                            {product.categories?.map((c) => c.nom_categorie).join(", ") || "Aucune catégorie"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-bold text-emerald-700">
                              {product.prix} FCFA
                            </span>
                            {product.old_price && (
                              <span className="text-sm text-emerald-500/60 line-through">
                                {product.old_price} FCFA
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Statut du stock */}
                        <div className="text-center">
                          <motion.div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {stockStatus.text}
                          </motion.div>
                          <p className="text-xs text-emerald-600/70 mt-1">Stock: {product.stock}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          <motion.button
                            onClick={() => openDetailsModal(product)}
                            className="flex items-center p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-300 border border-transparent hover:border-emerald-200"
                            title="Voir les détails"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            Détails
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {showAddModal && (
        <RegisterProduitsModal
          setShowAddModal={setShowAddModal}
          categories={categories}
          initialData={editProduct}
          isEdit={!!editProduct}
          onClose={closeAddModal}
        />
      )}

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
          productToDelete ? productToDelete.nom_article : "cet élément"
        }
        isDeleting={loading}
      />
    </div>
  );
};

export default DashboardBoutiqueProduits;