import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Image, X, Plus, ChevronDown, Upload, Package } from "lucide-react";
import useProduitStore from "../../../stores/produit.store";
import useCategorieStore from "../../../stores/categorie.store";
// import { getVariationsShop } from "../../../services/libelleVariation.service";
import { motion, AnimatePresence } from "framer-motion";

const RegisterProduitsModal = ({
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
    images: [],
    variations: [],
  });
  
  const [shopVariations, setShopVariations] = useState([]);
  const [loadingVariations, setLoadingVariations] = useState(true);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    
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

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  // Variants d'animation
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: { duration: 0.3 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

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

  const handleAddVariation = () => {
    setSelectedVariations([...selectedVariations, ""]);
  };
  
  const handleVariationChange = (index, value) => {
    const updatedVariations = [...selectedVariations];
    updatedVariations[index] = value;
    setSelectedVariations(updatedVariations);
  };
  
  const handleRemoveVariation = (index) => {
    const updatedVariations = selectedVariations.filter((_, i) => i !== index);
    setSelectedVariations(updatedVariations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nom_article", formData.nom_article);
      formDataToSend.append("prix", formData.prix);
      formDataToSend.append("description", formData.description);

      if (formData.categorie) {
        formDataToSend.append("id_categories[]", formData.categorie);
      }
      
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

      if (isEdit && initialData?.hashid) {
        await updateProduit(initialData.hashid, formDataToSend);
        toast.success("Produit mis à jour avec succès !");
      } else {
        await addProduit(formDataToSend);
        toast.success("Produit ajouté avec succès !");
      }
      onClose();
    } catch (err) {
      console.error("Erreur détaillée:", err.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {(
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
            variants={overlayVariants}
          />

          <motion.div
            className="relative z-[10000] bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-emerald-100"
            variants={modalVariants}
          >
            {/* En-tête */}
            <div className="flex justify-between items-center p-6 border-b border-emerald-100 bg-white sticky top-0">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring" }}
                >
                  <Package className="h-6 w-6 text-emerald-600" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">
                    {isEdit ? "Modifier le produit" : "Ajouter un produit"}
                  </h3>
                  <p className="text-emerald-600/70 text-sm">
                    {isEdit ? "Mettez à jour les informations de votre produit" : "Créez un nouveau produit dans votre catalogue"}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 transition-all duration-300"
                aria-label="Fermer"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Nom produit */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">
                  Nom du produit <span className="text-red-500">*</span>
                </label>
                <motion.input
                  type="text"
                  value={formData.nom_article}
                  onChange={(e) =>
                    setFormData({ ...formData, nom_article: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                  placeholder="Ex: Chaussure Nike Air Max"
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              {/* Prix et ancien prix */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={itemVariants}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-2">
                    Prix actuel <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="number"
                    value={formData.prix}
                    onChange={(e) =>
                      setFormData({ ...formData, prix: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                    placeholder="15000"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-2">
                    Ancien prix
                  </label>
                  <motion.input
                    type="number"
                    value={formData.old_price}
                    onChange={(e) =>
                      setFormData({ ...formData, old_price: e.target.value })
                    }
                    min="0"
                    className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                    placeholder="20000"
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
              </motion.div>

              {/* Catégorie */}
              <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                {categoriesLoading ? (
                  <div className="text-emerald-600/70 text-sm p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    Chargement des catégories...
                  </div>
                ) : categoriesError ? (
                  <div className="text-red-500 text-sm p-3 bg-red-50 rounded-xl border border-red-100">{categoriesError}</div>
                ) : (
                  <motion.select
                    value={formData.categorie}
                    onChange={(e) =>
                      setFormData({ ...formData, categorie: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 appearance-none"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.hashid} value={cat.hashid}>
                        {cat.nom_categorie}
                      </option>
                    ))}
                  </motion.select>
                )}
              </motion.div>

              {/* Description */}
              <motion.div variants={itemVariants} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">
                  Description
                </label>
                <motion.textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 resize-vertical"
                  placeholder="Décrivez votre produit en détail..."
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>
              
              {/* Variations */}
              <motion.div variants={itemVariants} transition={{ delay: 0.4 }}>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-emerald-800">
                    Variations du produit
                  </label>
                  <motion.button
                    type="button"
                    onClick={handleAddVariation}
                    className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-medium"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une variation
                  </motion.button>
                </div>
                
                {loadingVariations ? (
                  <div className="text-emerald-600/70 text-sm p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    Chargement des variations...
                  </div>
                ) : shopVariations.length === 0 ? (
                  <div className="text-emerald-600/70 text-sm p-4 bg-amber-50 rounded-xl border border-amber-100">
                    Aucune variation disponible. Veuillez d'abord créer des variations dans l'onglet Variations.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedVariations.length === 0 ? (
                      <div className="text-emerald-600/70 text-sm p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        Cliquez sur "Ajouter une variation" pour sélectionner des variations pour ce produit.
                      </div>
                    ) : (
                      selectedVariations.map((variationId, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + (index * 0.1) }}
                        >
                          <motion.select
                            value={variationId}
                            onChange={(e) => handleVariationChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 appearance-none"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <option value="">Sélectionner une variation</option>
                            {shopVariations.map((variation) => (
                              <option key={variation.hashid} value={variation.hashid}>
                                {variation.nom_variation} ({variation.lib_variation.join(", ")})
                              </option>
                            ))}
                          </motion.select>
                          <div className="relative pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-emerald-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveVariation(index)}
                            className="p-2 text-emerald-400 hover:text-red-500 focus:outline-none transition-colors duration-300"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="h-5 w-5" />
                          </motion.button>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </motion.div>

              {/* Images */}
              <motion.div variants={itemVariants} transition={{ delay: 0.5 }}>
                <label className="block text-sm font-semibold text-emerald-800 mb-2">
                  Images du produit{" "}
                  {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <motion.div 
                  className="border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center hover:border-emerald-400 transition-all duration-300 bg-emerald-50/30 cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Upload className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <p className="text-sm text-emerald-600/80 mb-2">
                    Glissez vos images ici ou cliquez pour sélectionner
                  </p>
                  <p className="text-xs text-emerald-500/60 mb-3">
                    Taille maximale : 2 Mo par image
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
                  <motion.label
                    htmlFor="product-image"
                    className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer text-sm font-medium transition-all duration-300"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Parcourir les fichiers
                  </motion.label>
                </motion.div>

                {formData.images.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-4 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {formData.images.map((img, i) => (
                      <motion.div
                        key={i}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-100 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={img.url}
                          alt={`preview-${i}`}
                          className="object-cover w-full h-full"
                        />
                        <motion.button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-0 right-0 bg-black/70 text-white rounded-bl-lg p-1 hover:bg-red-500 transition-colors duration-300"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="h-3 w-3" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {/* Boutons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-emerald-100"
                variants={itemVariants}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all duration-300 font-medium"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Annuler
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg hover:shadow-emerald-200/50"
                  }`}
                  variants={buttonVariants}
                  whileHover={!isSubmitting ? "hover" : {}}
                  whileTap={!isSubmitting ? "tap" : {}}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      {isEdit ? "Modification..." : "Ajout..."}
                    </div>
                  ) : (
                    isEdit ? "Modifier le produit" : "Ajouter le produit"
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterProduitsModal;