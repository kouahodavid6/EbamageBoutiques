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
} from "lucide-react";
import {
  getVariations,
  createVariationShop,
  getVariationsShop,
  updateVariationShop,
  deleteVariationShop,
} from "../../../services/variation.service";
import toast from "react-hot-toast";
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
  const [loading, setLoading] = useState(true);
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
        setLoading(false);

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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Fixe sur desktop, cachée sur mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
                            ${
                              sidebarOpen
                                ? "translate-x-0"
                                : "-translate-x-full"
                            } 
                            md:translate-x-0 md:relative`}>
        {/* Bouton de fermeture mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            aria-label="Fermer la sidebar">
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
          title="Gestion des Variations"
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-100">
          {/* Section pour créer une nouvelle variation */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Créer une nouvelle variation
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sélection de la variation */}
                <div>
                  <label
                    htmlFor="variation"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Type de variation
                  </label>
                  <select
                    id="variation"
                    value={selectedVariation}
                    onChange={handleVariationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    required>
                    <option value="">Sélectionnez une variation</option>
                    {variations.map((variation) => (
                      <option key={variation.hashid} value={variation.hashid}>
                        {variation.nom_variation}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Libellés de variation */}
                {selectedVariation && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-medium text-gray-700">
                        Libellés pour {selectedVariationName}
                      </h3>
                      <button
                        type="button"
                        onClick={addLibVariation}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </button>
                    </div>

                    {libVariations.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        Aucun libellé ajouté. Cliquez sur "Ajouter" pour créer
                        un libellé.
                      </p>
                    )}

                    <div className="space-y-3">
                      {libVariations.map((lib, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2">
                          {selectedVariationName === "color" ? (
                            <div className="flex-1 flex items-center space-x-3">
                              <div
                                className="h-8 w-8 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: lib }}
                                onClick={() => {
                                  const input = document.createElement("input");
                                  input.type = "color";
                                  input.value = lib;
                                  input.addEventListener("input", (e) => {
                                    updateLibVariation(index, e.target.value);
                                  });
                                  input.click();
                                }}>
                                <Palette className="h-4 w-4 text-white opacity-75" />
                              </div>
                              <input
                                type="text"
                                value={lib}
                                onChange={(e) =>
                                  updateLibVariation(index, e.target.value)
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
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
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                              placeholder={`Libellé ${index + 1}`}
                              required
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeLibVariation(index)}
                            className="p-2 text-gray-400 hover:text-red-500 focus:outline-none">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bouton de soumission */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !selectedVariation ||
                      libVariations.length === 0
                    }
                    className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                      isSubmitting ||
                      !selectedVariation ||
                      libVariations.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}>
                    {isSubmitting
                      ? "Création en cours..."
                      : "Créer la variation"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section pour afficher et gérer les variations existantes */}
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Mes variations
            </h2>

            {loadingShopVariations ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : shopVariations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Vous n'avez pas encore créé de variations.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {shopVariations.map((variation) => (
                  <div
                    key={variation.hashid}
                    className="border border-gray-200 rounded-lg p-4">
                    {editingVariation &&
                    editingVariation.hashid === variation.hashid ? (
                      /* Mode édition */
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-md font-medium text-gray-700">
                            Modifier {variation.nom_variation}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={addEditedLibVariation}
                              className="inline-flex items-center px-2 py-1 text-sm border border-transparent rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none">
                              <Plus className="h-4 w-4 mr-1" />
                              Ajouter
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="inline-flex items-center px-2 py-1 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                              <X className="h-4 w-4 mr-1" />
                              Annuler
                            </button>
                            <button
                              type="button"
                              onClick={saveEditing}
                              className="inline-flex items-center px-2 py-1 text-sm border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none">
                              <Check className="h-4 w-4 mr-1" />
                              Enregistrer
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {editedLibVariations.map((lib, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2">
                              {variation.nom_variation === "color" ? (
                                <div className="flex-1 flex items-center space-x-3">
                                  <div
                                    className="h-8 w-8 rounded-full border border-gray-300 cursor-pointer flex items-center justify-center overflow-hidden"
                                    style={{ backgroundColor: lib }}
                                    onClick={() => {
                                      const input =
                                        document.createElement("input");
                                      input.type = "color";
                                      input.value = lib;
                                      input.addEventListener("input", (e) => {
                                        updateEditedLibVariation(
                                          index,
                                          e.target.value
                                        );
                                      });
                                      input.click();
                                    }}>
                                    <Palette className="h-4 w-4 text-white opacity-75" />
                                  </div>
                                  <input
                                    type="text"
                                    value={lib}
                                    onChange={(e) =>
                                      updateEditedLibVariation(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                    placeholder="Code couleur (ex: #FF5733)"
                                    required
                                  />
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  value={lib}
                                  onChange={(e) =>
                                    updateEditedLibVariation(
                                      index,
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                  placeholder={`Libellé ${index + 1}`}
                                  required
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => removeEditedLibVariation(index)}
                                className="p-2 text-gray-400 hover:text-red-500 focus:outline-none"
                                disabled={editedLibVariations.length <= 1}>
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Mode affichage */
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-md font-medium text-gray-800">
                            {variation.nom_variation}
                          </h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(variation)}
                              className="p-1.5 text-gray-500 hover:text-blue-500 focus:outline-none"
                              title="Modifier">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(variation)}
                              className="p-1.5 text-gray-500 hover:text-red-500 focus:outline-none"
                              title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {variation.lib_variation.map((lib, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center">
                              {variation.nom_variation === "color" ||
                              variation.nom_variation.includes("color") ? (
                                <div className="flex items-center space-x-1.5">
                                  <div
                                    className="h-5 w-5 rounded-full border border-gray-300"
                                    style={{ backgroundColor: lib }}></div>
                                  <span className="text-sm text-gray-600">
                                    {lib}
                                  </span>
                                </div>
                              ) : (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                                  {lib}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
