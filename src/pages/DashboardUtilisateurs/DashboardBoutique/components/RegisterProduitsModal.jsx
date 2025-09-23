import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Image, X, Plus, ChevronDown } from "lucide-react";
import useProduitStore from "../../../../stores/produit.store";
// import { produitService } from "../../../../services/produit.service";
import useCategorieStore from "../../../../stores/categorie.store";
import { getVariationsShop } from "../../../../services/variation.service";

const RegisterProduitsModal = ({
  //setShowAddModal,
  initialData,
  isEdit,
  onClose,
}) => {
  const { addProduit, updateProduit } = useProduitStore();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    fetchCategories,
  } = useCategorieStore();

  const [formData, setFormData] = useState({
    nom_article: "",
    prix: "",
    old_price: "",
    categorie: "",
    description: "",
    images: [], // { file, url }
    variations: [], // Tableau des variations sélectionnées
  });
  
  const [shopVariations, setShopVariations] = useState([]);
  const [loadingVariations, setLoadingVariations] = useState(true);
  const [selectedVariations, setSelectedVariations] = useState([]);

  useEffect(() => {
    fetchCategories();
    
    // Charger les variations de la boutique
    const fetchShopVariations = async () => {
      try {
        const response = await getVariationsShop();
        if (response.data.success) {
          setShopVariations(response.data.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des variations:", error);
        toast.error("Erreur lors du chargement des variations");
      } finally {
        setLoadingVariations(false);
      }
    };
    
    fetchShopVariations();
  }, [fetchCategories]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom_article: initialData.nom_article || "",
        prix: initialData.prix || "",
        old_price: initialData.old_price || "",
        categorie: initialData.categories?.[0]?.hashid || "",
        description: initialData.description || "",
        images: initialData.images?.map((img) => ({ url: img })) || [],
        variations: initialData.variations || [],
      });
      
      // Si le produit a des variations, les sélectionner
      if (initialData.variations && initialData.variations.length > 0) {
        setSelectedVariations(initialData.variations.map(v => v.hashid));
      }
    }
  }, [initialData]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      formData.images.forEach((img) => {
        if (img.url && img.url.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [formData.images]);

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 Mo

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = [];
    const tooBigImages = [];
    files.forEach((file) => {
      if (file.size <= MAX_IMAGE_SIZE) {
        validImages.push({ file, url: URL.createObjectURL(file) });
      } else {
        tooBigImages.push(file.name);
      }
    });
    if (tooBigImages.length > 0) {
      toast.error(`Certaines images dépassent 2 Mo et n'ont pas été ajoutées`);
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validImages],
    }));
  };

  const handleRemoveImage = (index) => {
    const updated = [...formData.images];
    const removed = updated.splice(index, 1)[0];
    if (removed.url && removed.url.startsWith("blob:")) {
      URL.revokeObjectURL(removed.url);
    }
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  // Ajouter une variation à la sélection
  const handleAddVariation = () => {
    setSelectedVariations([...selectedVariations, ""]);
  };
  
  // Mettre à jour une variation sélectionnée
  const handleVariationChange = (index, value) => {
    const updatedVariations = [...selectedVariations];
    updatedVariations[index] = value;
    setSelectedVariations(updatedVariations);
  };
  
  // Supprimer une variation de la sélection
  const handleRemoveVariation = (index) => {
    const updatedVariations = selectedVariations.filter((_, i) => i !== index);
    setSelectedVariations(updatedVariations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nom_article", formData.nom_article);
      formDataToSend.append("prix", formData.prix);
      formDataToSend.append("description", formData.description);

      // S'assurer que la catégorie est envoyée comme un tableau
      if (formData.categorie) {
        // Utiliser id_categories[] pour indiquer au backend qu'il s'agit d'un tableau
        formDataToSend.append("id_categories[]", formData.categorie);
      }
      
      // Ajouter les variations sélectionnées
      selectedVariations.forEach(variationId => {
        if (variationId) {
          formDataToSend.append("id_variations[]", variationId);
        }
      });

      formData.images.forEach((img) => {
        if (img.file) {
          formDataToSend.append("images[]", img.file);
        }
      });
      if (formData.old_price) {
        formDataToSend.append("old_price", formData.old_price);
      }

      // Afficher les données envoyées pour débogage
      console.log("Données envoyées au serveur:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      if (isEdit && initialData?.hashid) {
        await updateProduit(initialData.hashid, formDataToSend);
        toast.success("Produit mis à jour avec succès !");
      } else {
        await addProduit(formDataToSend);
        toast.success("Produit ajouté avec succès !");
      }
      onClose();
    } catch (err) {
      // L'erreur est déjà gérée par l'intercepteur Axios
      console.error("Erreur détaillée:", err.response?.data);
      // Pas besoin d'afficher un toast ici car l'intercepteur le fait déjà
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-[10000] bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-100">
              <Plus className="h-5 w-5 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isEdit ? "Modifier le produit" : "Ajouter un produit"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Nom produit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom_article}
              onChange={(e) =>
                setFormData({ ...formData, nom_article: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Ex: Chaussure Nike"
            />
          </div>

          {/* Prix et ancien prix */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix actuel <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.prix}
                onChange={(e) =>
                  setFormData({ ...formData, prix: e.target.value })
                }
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="15000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ancien prix
              </label>
              <input
                type="number"
                value={formData.old_price}
                onChange={(e) =>
                  setFormData({ ...formData, old_price: e.target.value })
                }
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                placeholder="20000"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            {categoriesLoading ? (
              <div className="text-gray-400 text-sm">
                Chargement des catégories...
              </div>
            ) : categoriesError ? (
              <div className="text-red-500 text-sm">{categoriesError}</div>
            ) : (
              <select
                value={formData.categorie}
                onChange={(e) =>
                  setFormData({ ...formData, categorie: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.hashid} value={cat.hashid}>
                    {cat.nom_categorie}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Description du produit..."
            />
          </div>
          
          {/* Variations */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Variations
              </label>
              <button
                type="button"
                onClick={handleAddVariation}
                className="text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Ajouter une variation
              </button>
            </div>
            
            {loadingVariations ? (
              <div className="text-gray-400 text-sm">
                Chargement des variations...
              </div>
            ) : shopVariations.length === 0 ? (
              <div className="text-gray-500 text-sm p-3 border border-gray-200 rounded-lg">
                Aucune variation disponible. Veuillez d'abord créer des variations dans l'onglet Variations.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedVariations.length === 0 ? (
                  <div className="text-gray-500 text-sm p-3 border border-gray-200 rounded-lg">
                    Cliquez sur "Ajouter une variation" pour sélectionner des variations pour ce produit.
                  </div>
                ) : (
                  selectedVariations.map((variationId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={variationId}
                        onChange={(e) => handleVariationChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 appearance-none">
                        <option value="">Sélectionner une variation</option>
                        {shopVariations.map((variation) => (
                          <option key={variation.hashid} value={variation.hashid}>
                            {variation.nom_variation} ({variation.lib_variation.join(", ")})
                          </option>
                        ))}
                      </select>
                      <div className="relative pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariation(index)}
                        className="p-2 text-gray-400 hover:text-red-500 focus:outline-none">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images du produit{" "}
              {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-500 transition-colors">
              <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Glissez une image ici ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="product-image"
                multiple
                onChange={handleImageChange}
                required={!isEdit && formData.images.length === 0}
              />
              <label
                htmlFor="product-image"
                className="text-pink-500 hover:text-pink-600 cursor-pointer text-sm">
                Parcourir
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded overflow-hidden border">
                    <img
                      src={img.url}
                      alt={`preview-${i}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-0 right-0 bg-black/60 text-white rounded-bl px-1">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors">
              {isEdit ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterProduitsModal;
