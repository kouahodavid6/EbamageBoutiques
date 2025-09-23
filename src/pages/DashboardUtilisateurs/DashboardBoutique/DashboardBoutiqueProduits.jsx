// ... [tout ton import inchangé] ...
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import DashboardSidebar from "../components/DashboardSidebar";
import { Plus, Search, Image, ArrowUpRight, Package } from "lucide-react";
import ProduitDetailsModal from "./components/ProduitDetailsModal";
import RegisterProduitsModal from "./components/RegisterProduitsModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import useProduitStore from "../../../stores/produit.store";
import useCategorieStore from "../../../stores/categorie.store";
import CategoriesList from "../../../components/CategoriesList";

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
      // L'erreur est déjà gérée par l'intercepteur Axios
      console.error("Erreur lors de la suppression:", e);
      // Pas besoin d'afficher un toast ici car l'intercepteur le fait déjà
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
      return { text: "Rupture", color: "bg-red-100 text-red-800" };
    if (stock < 5)
      return { text: "Faible", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Disponible", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:sticky top-0 z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 h-screen bg-white shadow-md`}>
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-800 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <DashboardSidebar role="boutique" />
      </div>

      <div className="flex-1 min-w-0">
        <DashboardHeader
          title="Gestion des produits"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="p-4 sm:p-6 md:p-8 space-y-6 bg-gray-50 min-h-screen">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Gérer votre catalogue de produits
            </h1>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center">
                {showCategories
                  ? "Masquer les catégories"
                  : "Voir les catégories"}
              </button>
              <button
                onClick={() => {
                  setEditProduct(null);
                  setShowAddModal(true);
                }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un produit
              </button>
            </div>
          </div>

          {showCategories && (
            <div className="mb-4">
              <CategoriesList />
            </div>
          )}

          <div className="w-full bg-white p-4 rounded-xl shadow border border-gray-200">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Produits ({filteredProducts.length})
              </h2>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun produit trouvé</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <div
                        key={product.hashid || product.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.nom_article}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {product.nom_article}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.categories
                              ?.map((c) => c.nom_categorie)
                              .join(", ")}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-bold text-gray-900">
                              {product.prix} FCFA
                            </span>
                            {product.old_price && (
                              <span className="text-sm text-gray-500 line-through">
                                {product.old_price} FCFA
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-center">
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                          </div>
                          {/* <p className="text-sm text-gray-500 mt-1">Stock: {product.stock}</p> */}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => openDetailsModal(product)}
                            className="flex items-center p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                            title="Détails">
                            Détails
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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
