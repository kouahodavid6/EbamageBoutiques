import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import { Image, X, Plus, ChevronDown, Upload, Package, Crop, RotateCcw, Check, Palette } from "lucide-react";
import useProduitStore from "../../../stores/produit.store";
import useCategorieStore from "../../../stores/categorie.store";
import useVariationStore from "../../../stores/variationLibelle.store";
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

  const { variationsBoutique, fetchVariationsBoutique, loading: variationsLoading } = useVariationStore();

  const [formData, setFormData] = useState({
    nom_article: "",
    prix: "",
    old_price: "",
    categorie: "",
    description: "",
    images: [],
  });
  
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isCropping, setIsCropping] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [cropScale, setCropScale] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchVariationsBoutique();
  }, [fetchCategories, fetchVariationsBoutique]);

  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        nom_article: initialData.nom_article || "",
        prix: initialData.prix || "",
        old_price: initialData.old_price || "",
        categorie: initialData.categories?.[0]?.hashid || "",
        description: initialData.description || "",
        images: initialData.images?.map((img) => ({ url: img })) || [],
      });
      
      if (initialData.variations && initialData.variations.length > 0) {
        const variationsWithLibelles = initialData.variations.map(variation => ({
          variationId: variation.hashid,
          selectedLibelles: variation.lib_variation || []
        }));
        setSelectedVariations(variationsWithLibelles);
      } else {
        setSelectedVariations([]);
      }
    } else {
      setFormData({
        nom_article: "",
        prix: "",
        old_price: "",
        categorie: "",
        description: "",
        images: [],
      });
      setSelectedVariations([]);
    }
  }, [initialData, isEdit]);

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

  const startCropping = (index) => {
    setCurrentImageIndex(index);
    setIsCropping(true);
    setCropScale(1);
  };

  const cancelCropping = () => {
    setIsCropping(false);
    setCurrentImageIndex(null);
    setCropScale(1);
  };

  const applyCrop = () => {
    if (currentImageIndex === null || !canvasRef.current) {
      toast.error("Erreur lors du redimensionnement");
      return;
    }

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const image = new Image();
      
      image.onload = () => {
        const targetSize = 500;
        canvas.width = targetSize;
        canvas.height = targetSize;
        
        const scaledWidth = image.width * cropScale;
        const scaledHeight = image.height * cropScale;
        const x = (image.width - scaledWidth) / 2;
        const y = (image.height - scaledHeight) / 2;
        
        ctx.clearRect(0, 0, targetSize, targetSize);
        ctx.drawImage(
          image,
          Math.max(0, x), Math.max(0, y), 
          Math.min(scaledWidth, image.width), 
          Math.min(scaledHeight, image.height),
          0, 0, targetSize, targetSize
        );
        
        canvas.toBlob((blob) => {
          if (!blob) {
            toast.error("Erreur lors de la conversion de l'image");
            return;
          }

          const newUrl = URL.createObjectURL(blob);
          const updatedImages = [...formData.images];
          updatedImages[currentImageIndex] = {
            file: new File([blob], `cropped-image-${Date.now()}.jpg`, { type: 'image/jpeg' }),
            url: newUrl
          };
          
          setFormData(prev => ({ ...prev, images: updatedImages }));
          setIsCropping(false);
          setCurrentImageIndex(null);
          setCropScale(1);
          toast.success("Image redimensionnée avec succès !");
        }, 'image/jpeg', 0.9);
      };
      
      image.onerror = () => toast.error("Erreur lors du chargement de l'image");
      image.src = formData.images[currentImageIndex].url;
    } catch (error) {
      toast.error("Erreur lors du redimensionnement de l'image");
    }
  };

  const handleZoomIn = () => setCropScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setCropScale(prev => Math.max(prev - 0.2, 0.5));
  const resetCrop = () => setCropScale(1);

  const handleAddVariation = () => {
    setSelectedVariations(prev => [...prev, {
      variationId: "",
      selectedLibelles: []
    }]);
  };
  
  const handleVariationChange = (index, variationId) => {
    const updatedVariations = [...selectedVariations];
    updatedVariations[index] = {
      variationId,
      selectedLibelles: []
    };
    setSelectedVariations(updatedVariations);
  };
  
  const handleRemoveVariation = (index) => {
    const updatedVariations = selectedVariations.filter((_, i) => i !== index);
    setSelectedVariations(updatedVariations);
  };

  const handleLibelleToggle = (variationIndex, libelle) => {
    const updatedVariations = [...selectedVariations];
    const variation = updatedVariations[variationIndex];
    
    if (!variation) return;
    
    if (variation.selectedLibelles.includes(libelle)) {
      variation.selectedLibelles = variation.selectedLibelles.filter(l => l !== libelle);
    } else {
      variation.selectedLibelles.push(libelle);
    }
    
    setSelectedVariations(updatedVariations);
  };

  const isColorVariation = (variationId) => {
    if (!variationId) return false;
    const variation = variationsBoutique.find(v => v.hashid === variationId);
    return variation?.nom_variation?.toLowerCase().includes('couleur') || 
           variation?.nom_variation?.toLowerCase().includes('color');
  };

  const getVariationName = (variationId) => {
    if (!variationId) return "";
    const variation = variationsBoutique.find(v => v.hashid === variationId);
    return variation?.nom_variation || "";
  };

  const getVariationLibelles = (variationId) => {
    if (!variationId) return [];
    const variation = variationsBoutique.find(v => v.hashid === variationId);
    return variation?.lib_variation || [];
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
      
      selectedVariations.forEach(variation => {
        if (variation.variationId) {
          formDataToSend.append("id_variations[]", variation.variationId);
          
          if (variation.selectedLibelles.length > 0) {
            variation.selectedLibelles.forEach(libelle => {
              formDataToSend.append(`libelles[${variation.variationId}][]`, libelle);
            });
          }
        }
      });

      formData.images.forEach((img) => {
        if (img.file) {
          formDataToSend.append("images[]", img.file);
        } else if (img.url && !img.url.startsWith('blob:')) {
          formDataToSend.append("existing_images[]", img.url);
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
      toast.error(err.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
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

        <AnimatePresence>
          {isCropping && currentImageIndex !== null && (
            <motion.div
              className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-semibold text-emerald-900">
                    Redimensionner l'image
                  </h3>
                  <button
                    onClick={cancelCropping}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="relative mb-4 border-2 border-dashed border-emerald-200 rounded-lg overflow-hidden max-h-96 flex items-center justify-center bg-gray-50 p-4">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={formData.images[currentImageIndex].url}
                        alt="À redimensionner"
                        className="max-w-full max-h-80 transition-transform duration-300"
                        style={{
                          transform: `scale(${cropScale})`,
                          transformOrigin: 'center'
                        }}
                      />
                    </div>
                    
                    <div className="absolute inset-4 border-2 border-white border-dashed pointer-events-none rounded-lg">
                      <div className="absolute top-2 left-2 text-white text-sm bg-black/70 px-2 py-1 rounded">
                        Zoom: {Math.round(cropScale * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="flex flex-wrap gap-3 mb-4 justify-center">
                    <motion.button
                      onClick={handleZoomOut}
                      disabled={cropScale <= 0.5}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ${
                        cropScale <= 0.5 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                      }`}
                      whileHover={cropScale > 0.5 ? { scale: 1.05 } : {}}
                      whileTap={cropScale > 0.5 ? { scale: 0.95 } : {}}
                    >
                      <Crop className="h-4 w-4" />
                      Zoom - 
                    </motion.button>
                    
                    <motion.button
                      onClick={handleZoomIn}
                      disabled={cropScale >= 3}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ${
                        cropScale >= 3 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                      }`}
                      whileHover={cropScale < 3 ? { scale: 1.05 } : {}}
                      whileTap={cropScale < 3 ? { scale: 0.95 } : {}}
                    >
                      <Crop className="h-4 w-4" />
                      Zoom +
                    </motion.button>
                    
                    <motion.button
                      onClick={resetCrop}
                      className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg flex items-center gap-2 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Réinitialiser
                    </motion.button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600 mb-4">
                    L'image sera automatiquement recadrée en format carré. Ajustez le zoom pour cadrer votre produit.
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.button
                      onClick={cancelCropping}
                      className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      onClick={applyCrop}
                      className="flex-1 px-6 py-3 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Check className="h-4 w-4" />
                      Appliquer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative z-[10000] bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-emerald-100"
          variants={modalVariants}
        >
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
                  step="0.01"
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
                  step="0.01"
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300"
                  placeholder="20000"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
              <label className="block text-sm font-semibold text-emerald-800 mb-2">
                Catégorie <span className="text-red-500">*</span>
              </label>
              {categoriesLoading ? (
                <div className="text-emerald-600/70 text-sm p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  Chargement des catégories...
                </div>
              ) : categoriesError ? (
                <div className="text-red-500 text-sm p-3 bg-red-50 rounded-xl border border-red-100">
                  {categoriesError}
                </div>
              ) : (
                <motion.select
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 appearance-none bg-white"
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
            
            <motion.div variants={itemVariants} transition={{ delay: 0.4 }}>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-emerald-800">
                  Variations du produit
                </label>
                <motion.button
                  type="button"
                  onClick={handleAddVariation}
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-2 font-medium transition-colors duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une variation
                </motion.button>
              </div>
              
              {variationsLoading ? (
                <div className="text-emerald-600/70 text-sm p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  Chargement des variations...
                </div>
              ) : variationsBoutique.length === 0 ? (
                <div className="text-emerald-600/70 text-sm p-4 bg-amber-50 rounded-xl border border-amber-100">
                  Aucune variation disponible. Veuillez d'abord créer des variations dans l'onglet Variations.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedVariations.length === 0 ? (
                    <div className="text-emerald-600/70 text-sm p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      Cliquez sur "Ajouter une variation" pour sélectionner des variations pour ce produit.
                    </div>
                  ) : (
                    selectedVariations.map((variation, index) => (
                      <motion.div 
                        key={index} 
                        className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <motion.select
                            value={variation.variationId}
                            onChange={(e) => handleVariationChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 appearance-none bg-white"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <option value="">Sélectionner une variation</option>
                            {variationsBoutique.map((shopVariation) => (
                              <option key={shopVariation.hashid} value={shopVariation.hashid}>
                                {shopVariation.nom_variation} 
                                {shopVariation.lib_variation?.length > 0 && 
                                  ` (${shopVariation.lib_variation.length} options)`
                                }
                              </option>
                            ))}
                          </motion.select>
                          
                          <div className="relative pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-emerald-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                          </div>
                          
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveVariation(index)}
                            className="p-2 text-emerald-400 hover:text-red-500 transition-colors duration-300"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="h-5 w-5" />
                          </motion.button>
                        </div>

                        {variation.variationId && (
                          <div className="space-y-2 ml-4">
                            <label className="block text-sm text-emerald-700 font-medium">
                              Sélectionnez les options pour {getVariationName(variation.variationId)}:
                            </label>
                            
                            <div className="flex flex-wrap gap-2">
                              {getVariationLibelles(variation.variationId).map((libelle, libelleIndex) => (
                                <motion.button
                                  key={libelleIndex}
                                  type="button"
                                  onClick={() => handleLibelleToggle(index, libelle)}
                                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                    variation.selectedLibelles.includes(libelle)
                                      ? 'bg-emerald-500 text-white border-emerald-500'
                                      : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {isColorVariation(variation.variationId) && (
                                    <div 
                                      className="w-4 h-4 rounded border border-emerald-200"
                                      style={{ backgroundColor: libelle }}
                                    />
                                  )}
                                  {libelle}
                                </motion.button>
                              ))}
                            </div>
                            
                            {variation.selectedLibelles.length > 0 && (
                              <div className="text-sm text-emerald-600 mt-2">
                                {variation.selectedLibelles.length} option(s) sélectionnée(s)
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>

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
                      className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-100 shadow-sm group"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={img.url}
                        alt={`Preview ${i + 1}`}
                        className="object-cover w-full h-full"
                      />
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1">
                        <motion.button
                          type="button"
                          onClick={() => startCropping(i)}
                          className="p-1 bg-white/90 text-emerald-600 rounded-lg hover:bg-white transition-colors duration-300"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          title="Redimensionner"
                        >
                          <Crop className="h-3 w-3" />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="p-1 bg-white/90 text-red-500 rounded-lg hover:bg-white transition-colors duration-300"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          title="Supprimer"
                        >
                          <X className="h-3 w-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

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
    </AnimatePresence>
  );
};

export default RegisterProduitsModal;