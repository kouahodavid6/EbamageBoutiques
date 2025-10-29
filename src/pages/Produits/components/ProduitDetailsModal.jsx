import { X, Edit, Trash2, PackageSearch, Image, Tag, DollarSign, Palette } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProduitDetailsModal = ({
  isOpen,
  onClose,
  produit,
  onEdit,
  onDelete,
}) => {
  useEffect(() => {
    if (isOpen && produit) {
      console.log("Produit reçu dans le modal :", produit);
    }
  }, [isOpen, produit]);

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen || !produit) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
      >
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          onClick={onClose}
          variants={backdropVariants}
        />

        <motion.div
          className="relative z-[10000] bg-white max-w-3xl w-full rounded-3xl shadow-2xl border border-emerald-100/30 overflow-hidden mx-auto my-6"
          variants={modalVariants}
        >
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30"
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <PackageSearch className="h-6 w-6" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">Détails du produit</h3>
                  <p className="text-emerald-100 text-sm mt-1">
                    Informations complètes du produit
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Nom et Description */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-emerald-900 mb-3">
                  {produit.nom_article}
                </h2>
                {produit.description && (
                  <p className="text-emerald-600 leading-relaxed text-base max-w-2xl mx-auto">
                    {produit.description}
                  </p>
                )}
              </motion.div>

              {/* Prix */}
              <motion.div 
                className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-emerald-700 font-semibold text-base">Prix</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-3xl font-bold text-emerald-900">
                    {produit.prix?.toLocaleString('fr-FR')} FCFA
                  </span>
                  {produit.old_price && (
                    <span className="text-lg text-emerald-400 line-through font-medium">
                      {produit.old_price?.toLocaleString('fr-FR')} FCFA
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Images */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <Image className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-900 text-base">Galerie d'images</h4>
                </div>
                
                {produit.images?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {produit.images.map((img, index) => (
                      <motion.div 
                        key={index} 
                        className="aspect-square rounded-xl overflow-hidden border-2 border-emerald-100 bg-emerald-50"
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <img
                          src={img}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-emerald-50/50 rounded-xl border-2 border-dashed border-emerald-200">
                    <Image className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
                    <p className="text-emerald-400 font-medium text-sm">Aucune image disponible</p>
                  </div>
                )}
              </motion.div>

              {/* Catégories */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <Tag className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-900 text-base">Catégories</h4>
                </div>
                
                {produit.categories?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {produit.categories.map((cat, i) => (
                      <motion.span
                        key={i}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 rounded-full font-medium text-sm shadow-lg shadow-emerald-500/25"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        {cat.nom_categorie}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-amber-600 font-medium text-sm">Aucune catégorie assignée</p>
                  </div>
                )}
              </motion.div>

              {/* Variations */}
              {produit.variations?.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-emerald-500/10">
                      <Palette className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-emerald-900 text-base">Variations</h4>
                  </div>
                  
                  <div className="grid gap-3">
                    {produit.variations.map((v, i) => (
                      <motion.div 
                        key={i} 
                        className="bg-white rounded-xl p-3 border border-emerald-100 shadow-sm"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="font-semibold text-emerald-800 text-base mb-2">
                          {v.nom_variation}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {v.lib_variation.map((val, j) =>
                            v.nom_variation.toLowerCase().includes("couleur") || v.nom_variation.toLowerCase().includes("color") ? (
                              <motion.div
                                key={j}
                                className="relative group"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div 
                                  className="w-8 h-8 rounded-lg border-2 border-white shadow-lg"
                                  style={{ backgroundColor: val }}
                                />
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  {val}
                                </div>
                              </motion.div>
                            ) : (
                              <motion.span
                                key={j}
                                className="bg-emerald-50 text-emerald-700 px-2 py-1.5 rounded-lg border border-emerald-200 font-medium text-sm"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                {val}
                              </motion.span>
                            )
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Actions */}
          <motion.div 
            className="bg-emerald-50/50 border-t border-emerald-100 p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <motion.button
                onClick={onDelete}
                className="flex items-center justify-center gap-2 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold text-sm order-1 sm:order-1"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </motion.button>
              
              <motion.button
                onClick={onEdit}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 font-semibold text-sm order-2 sm:order-2"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit className="w-4 h-4" />
                Modifier
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProduitDetailsModal;