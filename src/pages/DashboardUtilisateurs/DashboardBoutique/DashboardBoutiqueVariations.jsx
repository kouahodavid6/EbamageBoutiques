import { useState, useEffect } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import {
  Plus,
  Trash2,
  Palette,
  Edit2,
  X,
  Check,
  AlertCircle,
  Package,
} from "lucide-react";
import {
  getVariations,
  createVariationShop,
  getVariationsShop,
  updateVariationShop,
  deleteVariationShop,
} from "../../../services/variation.service";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

// Modal de confirmation pour la suppression
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, variationName }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl z-[10000]">
        <div className="flex items-center mb-4 text-red-500">
          <AlertCircle className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
        </div>
        <p className="mb-6 text-gray-600">
          Êtes-vous sûr de vouloir supprimer la variation{" "}
          <span className="font-semibold">{variationName}</span> ? Cette action
          est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
            Supprimer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const DashboardBoutiqueVariations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [variations, setVariations] = useState([]);
  const [shopVariations, setShopVariations] = useState([]);
  const [loadingShopVariations, setLoadingShopVariations] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState("");
  const [selectedVariationName, setSelectedVariationName] = useState("");
  const [libVariations, setLibVariations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVariation, setEditingVariation] = useState(null);
  const [editedLibVariations, setEditedLibVariations] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [variationToDelete, setVariationToDelete] = useState(null);

  // Charger les variations disponibles et les variations de la boutique
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les variations disponibles (définies par l'admin)
        const variationsResponse = await getVariations();
        if (variationsResponse.data.success) {
          setVariations(variationsResponse.data.data);
        }

        // Charger les variations de la boutique
        const shopVariationsResponse = await getVariationsShop();
        if (shopVariationsResponse.data.success) {
          setShopVariations(shopVariationsResponse.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoadingShopVariations(false);
      }
    };

    fetchData();
  }, []);

  // Gérer le changement de variation sélectionnée
  const handleVariationChange = (e) => {
    const variationId = e.target.value;
    setSelectedVariation(variationId);

    // Trouver le nom de la variation sélectionnée
    const selectedVar = variations.find((v) => v.hashid === variationId);
    setSelectedVariationName(selectedVar ? selectedVar.nom_variation : "");

    // Réinitialiser les libellés
    setLibVariations([]);
  };

  // Ajouter un nouveau libellé
  const addLibVariation = () => {
    if (selectedVariationName === "color") {
      setLibVariations([...libVariations, "#cccccc"]);
    } else {
      setLibVariations([...libVariations, ""]);
    }
  };

  // Mettre à jour un libellé
  const updateLibVariation = (index, value) => {
    const updatedLibs = [...libVariations];
    updatedLibs[index] = value;
    setLibVariations(updatedLibs);
  };

  // Supprimer un libellé
  const removeLibVariation = (index) => {
    const updatedLibs = libVariations.filter((_, i) => i !== index);
    setLibVariations(updatedLibs);
  };

  // Soumettre le formulaire de création
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedVariation) {
      toast.error("Veuillez sélectionner une variation");
      return;
    }

    if (libVariations.length === 0) {
      toast.error("Veuillez ajouter au moins un libellé de variation");
      return;
    }

    // Vérifier que tous les libellés sont remplis
    const emptyLibs = libVariations.some((lib) => !lib);
    if (emptyLibs) {
      toast.error("Tous les libellés doivent être remplis");
      return;
    }

    // Préparer les données
    const data = {
      variation_id: selectedVariation,
      lib_variation: libVariations,
    };

    setIsSubmitting(true);

    try {
      const response = await createVariationShop(data);
      if (response.data.success) {
        toast.success("Variation créée avec succès");
        // Réinitialiser le formulaire
        setSelectedVariation("");
        setSelectedVariationName("");
        setLibVariations([]);

        // Recharger les variations de la boutique
        const shopVariationsResponse = await getVariationsShop();
        if (shopVariationsResponse.data.success) {
          setShopVariations(shopVariationsResponse.data.data);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la création de la variation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Commencer l'édition d'une variation
  const startEditing = (variation) => {
    setEditingVariation(variation);
    setEditedLibVariations([...variation.lib_variation]);
  };

  // Annuler l'édition
  const cancelEditing = () => {
    setEditingVariation(null);
    setEditedLibVariations([]);
  };

  // Mettre à jour un libellé en mode édition
  const updateEditedLibVariation = (index, value) => {
    const updatedLibs = [...editedLibVariations];
    updatedLibs[index] = value;
    setEditedLibVariations(updatedLibs);
  };

  // Ajouter un libellé en mode édition
  const addEditedLibVariation = () => {
    if (editingVariation.nom_variation === "color") {
      setEditedLibVariations([...editedLibVariations, "#cccccc"]);
    } else {
      setEditedLibVariations([...editedLibVariations, ""]);
    }
  };

  // Supprimer un libellé en mode édition
  const removeEditedLibVariation = (index) => {
    const updatedLibs = editedLibVariations.filter((_, i) => i !== index);
    setEditedLibVariations(updatedLibs);
  };

  // Sauvegarder les modifications
  const saveEditing = async () => {
    // Validation
    if (editedLibVariations.length === 0) {
      toast.error("Veuillez ajouter au moins un libellé de variation");
      return;
    }

    // Vérifier que tous les libellés sont remplis
    const emptyLibs = editedLibVariations.some((lib) => !lib);
    if (emptyLibs) {
      toast.error("Tous les libellés doivent être remplis");
      return;
    }

    // Préparer les données
    const data = {
      variation_id: editingVariation.hashid,
      lib_variation: editedLibVariations,
    };

    try {
      const response = await updateVariationShop(data);
      if (response.data.success) {
        toast.success("Variation mise à jour avec succès");

        // Recharger les variations de la boutique
        const shopVariationsResponse = await getVariationsShop();
        if (shopVariationsResponse.data.success) {
          setShopVariations(shopVariationsResponse.data.data);
        }

        // Réinitialiser l'édition
        setEditingVariation(null);
        setEditedLibVariations([]);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la variation:", error);
      toast.error("Erreur lors de la mise à jour de la variation");
    }
  };

  // Ouvrir le modal de confirmation de suppression
  const openDeleteModal = (variation) => {
    setVariationToDelete(variation);
    setDeleteModalOpen(true);
  };

  // Fermer le modal de confirmation de suppression
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setVariationToDelete(null);
  };

  // Supprimer une variation
  const deleteVariation = async () => {
    if (!variationToDelete) return;

    setIsDeleting(true);

    try {
      const data = {
        variation_id: variationToDelete.hashid,
      };

      const response = await deleteVariationShop(data);
      if (response.data.success) {
        toast.success("Variation supprimée avec succès");

        // Mettre à jour la liste des variations
        setShopVariations(
          shopVariations.filter((v) => v.hashid !== variationToDelete.hashid)
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la variation:", error);
      toast.error("Erreur lors de la suppression de la variation");
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

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
          title="Gestion des Variations"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto bg-gradient-to-br from-emerald-50 to-green-50/30">
          {/* Section pour créer une nouvelle variation */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              Créer une nouvelle variation
            </h2>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Sélection de la variation */}
              <div>
                <label
                  htmlFor="variation"
                  className="block text-sm font-semibold text-emerald-800 mb-2">
                  Type de variation
                </label>
                <motion.select
                  id="variation"
                  value={selectedVariation}
                  onChange={handleVariationChange}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  required>
                  <option value="">Sélectionnez une variation</option>
                  {variations.map((variation) => (
                    <option key={variation.hashid} value={variation.hashid}>
                      {variation.nom_variation}
                    </option>
                  ))}
                </motion.select>
              </div>

              {/* Libellés de variation */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: selectedVariation ? 1 : 0,
                  height: selectedVariation ? "auto" : 0
                }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                {selectedVariation && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-emerald-800">
                        Libellés pour {selectedVariationName}
                      </h3>
                      <motion.button
                        type="button"
                        onClick={addLibVariation}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none transition-all duration-300"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un libellé
                      </motion.button>
                    </div>

                    {libVariations.length === 0 && (
                      <motion.p 
                        className="text-sm text-emerald-600/70 italic p-4 bg-emerald-50 rounded-lg border border-emerald-100"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        Aucun libellé ajouté. Cliquez sur "Ajouter" pour créer un libellé.
                      </motion.p>
                    )}

                    <motion.div 
                      className="space-y-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {libVariations.map((lib, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100"
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          {selectedVariationName === "color" ? (
                            <div className="flex-1 flex items-center space-x-4">
                              <motion.div
                                className="h-10 w-10 rounded-full border-2 border-emerald-200 cursor-pointer flex items-center justify-center overflow-hidden shadow-sm"
                                style={{ backgroundColor: lib }}
                                onClick={() => {
                                  const input = document.createElement("input");
                                  input.type = "color";
                                  input.value = lib;
                                  input.addEventListener("input", (e) => {
                                    updateLibVariation(index, e.target.value);
                                  });
                                  input.click();
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Palette className="h-5 w-5 text-white opacity-90" />
                              </motion.div>
                              <input
                                type="text"
                                value={lib}
                                onChange={(e) =>
                                  updateLibVariation(index, e.target.value)
                                }
                                className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                                placeholder="Code couleur (ex: #FF5733)"
                                required
                              />
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={lib}
                              onChange={(e) =>
                                updateLibVariation(index, e.target.value)
                              }
                              className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                              placeholder={`Libellé ${index + 1}`}
                              required
                            />
                          )}
                          <motion.button
                            type="button"
                            onClick={() => removeLibVariation(index)}
                            className="p-2 text-emerald-400 hover:text-red-500 focus:outline-none transition-colors duration-300"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Bouton de soumission */}
              <motion.div 
                className="pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !selectedVariation ||
                    libVariations.length === 0
                  }
                  className={`w-full px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white transition-all duration-300 ${
                    isSubmitting ||
                    !selectedVariation ||
                    libVariations.length === 0
                      ? "opacity-50 cursor-not-allowed bg-gray-400"
                      : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  }`}
                  whileHover={!isSubmitting && !(!selectedVariation || libVariations.length === 0) ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting && !(!selectedVariation || libVariations.length === 0) ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Création en cours...
                    </div>
                  ) : (
                    "Créer la variation"
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>

          {/* Section pour afficher et gérer les variations existantes */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60 p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              Mes variations
            </h2>

            {loadingShopVariations ? (
              <motion.div 
                className="flex justify-center items-center h-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
              </motion.div>
            ) : shopVariations.length === 0 ? (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Package className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                <p className="text-emerald-600/70 text-lg">Vous n'avez pas encore créé de variations.</p>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {shopVariations.map((variation, index) => (
                  <motion.div
                    key={variation.hashid}
                    className="border border-emerald-100 rounded-xl p-5 bg-white/50 hover:bg-white transition-all duration-300"
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -2, scale: 1.01 }}
                  >
                    {editingVariation &&
                    editingVariation.hashid === variation.hashid ? (
                      /* Mode édition */
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-emerald-800">
                            Modifier {variation.nom_variation}
                          </h3>
                          <div className="flex space-x-2">
                            <motion.button
                              type="button"
                              onClick={addEditedLibVariation}
                              className="inline-flex items-center px-3 py-2 text-sm border border-transparent rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-all duration-300"
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Ajouter
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={cancelEditing}
                              className="inline-flex items-center px-3 py-2 text-sm border border-emerald-300 rounded-lg text-emerald-700 bg-white hover:bg-emerald-50 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Annuler
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={saveEditing}
                              className="inline-flex items-center px-3 py-2 text-sm border border-transparent rounded-lg text-white bg-green-500 hover:bg-green-600 transition-all duration-300"
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Enregistrer
                            </motion.button>
                          </div>
                        </div>

                        <motion.div 
                          className="space-y-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {editedLibVariations.map((lib, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center space-x-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100"
                              variants={itemVariants}
                              whileHover={{ scale: 1.02 }}
                            >
                              {variation.nom_variation === "color" ? (
                                <div className="flex-1 flex items-center space-x-4">
                                  <motion.div
                                    className="h-10 w-10 rounded-full border-2 border-emerald-200 cursor-pointer flex items-center justify-center overflow-hidden shadow-sm"
                                    style={{ backgroundColor: lib }}
                                    onClick={() => {
                                      const input = document.createElement("input");
                                      input.type = "color";
                                      input.value = lib;
                                      input.addEventListener("input", (e) => {
                                        updateEditedLibVariation(index, e.target.value);
                                      });
                                      input.click();
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Palette className="h-5 w-5 text-white opacity-90" />
                                  </motion.div>
                                  <input
                                    type="text"
                                    value={lib}
                                    onChange={(e) =>
                                      updateEditedLibVariation(index, e.target.value)
                                    }
                                    className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                                    placeholder="Code couleur (ex: #FF5733)"
                                    required
                                  />
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={lib}
                                  onChange={(e) =>
                                    updateEditedLibVariation(index, e.target.value)
                                  }
                                  className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                                  placeholder={`Libellé ${index + 1}`}
                                  required
                                />
                              )}
                              <motion.button
                                type="button"
                                onClick={() => removeEditedLibVariation(index)}
                                className="p-2 text-emerald-400 hover:text-red-500 focus:outline-none transition-colors duration-300"
                                disabled={editedLibVariations.length <= 1}
                                whileHover={{ scale: editedLibVariations.length > 1 ? 1.2 : 1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="h-5 w-5" />
                              </motion.button>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    ) : (
                      /* Mode affichage */
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-emerald-800">
                            {variation.nom_variation}
                          </h3>
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => startEditing(variation)}
                              className="p-2 text-emerald-500 hover:text-blue-500 focus:outline-none transition-colors duration-300 bg-emerald-50 rounded-lg"
                              title="Modifier"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => openDeleteModal(variation)}
                              className="p-2 text-emerald-500 hover:text-red-500 focus:outline-none transition-colors duration-300 bg-emerald-50 rounded-lg"
                              title="Supprimer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>

                        <motion.div 
                          className="flex flex-wrap gap-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {variation.lib_variation.map((lib, index) => (
                            <motion.div
                              key={index}
                              className="inline-flex items-center"
                              variants={itemVariants}
                              whileHover={{ scale: 1.05 }}
                            >
                              {variation.nom_variation === "color" ||
                              variation.nom_variation.includes("color") ? (
                                <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-emerald-100 shadow-sm">
                                  <div
                                    className="h-6 w-6 rounded-full border-2 border-emerald-200 shadow-sm"
                                    style={{ backgroundColor: lib }}></div>
                                  <span className="text-sm font-medium text-emerald-700">
                                    {lib}
                                  </span>
                                </div>
                              ) : (
                                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full border border-emerald-200 shadow-sm">
                                  {lib}
                                </span>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </main>

        {/* Modal de confirmation de suppression */}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={deleteVariation}
          variationName={variationToDelete?.nom_variation}
        />
      </div>
    </div>
  );
};

export default DashboardBoutiqueVariations;
