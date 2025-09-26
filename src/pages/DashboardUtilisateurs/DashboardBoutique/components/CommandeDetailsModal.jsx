import { X, MapPin, ShoppingBag, CreditCard, Clock, User, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CommandeDetailsModal = ({ isOpen, onClose, commande }) => {
  if (!isOpen || !commande) return null;

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Variants d'animation
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    },
    visible: {
      opacity: 1,
      scale: 1,
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
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "En attente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Livré": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Annulé": return "bg-red-100 text-red-800 border-red-200";
      case "En cours": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && commande && (
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
            className="relative z-[10000] bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100"
            variants={modalVariants}
          >
            {/* En-tête */}
            <div className="flex justify-between items-center p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50/30">
              <div className="flex items-center gap-4">
                <motion.div
                  className="p-3 rounded-xl bg-emerald-100"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring" }}
                >
                  <ShoppingBag className="h-6 w-6 text-emerald-600" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">
                    Détails de la commande
                  </h3>
                  <p className="text-emerald-600/70 text-sm">Commande #{commande.hashid}</p>
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

            <div className="p-6 space-y-8">
              {/* Informations générales */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-6">
                  {/* Client */}
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-3 rounded-lg bg-emerald-100 mt-1">
                      <User className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-800 mb-1">Client</h4>
                      <p className="text-emerald-700">{commande.client.nom_clt}</p>
                      <p className="text-sm text-emerald-600/70 mt-1">ID: {commande.client.hashid_clt}</p>
                    </div>
                  </motion.div>

                  {/* Adresse */}
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <div className="p-3 rounded-lg bg-emerald-100 mt-1">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-800 mb-1">Adresse de livraison</h4>
                      <p className="text-emerald-700">{commande.localisation.quartier}</p>
                      <p className="text-emerald-700">{commande.localisation.commune}, {commande.localisation.ville}</p>
                    </div>
                  </motion.div>

                  {/* Paiement */}
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    <div className="p-3 rounded-lg bg-emerald-100 mt-1">
                      <CreditCard className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-800 mb-1">Paiement</h4>
                      <p className="text-emerald-700 capitalize">{commande.moyen_de_paiement}</p>
                      <motion.span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getStatusColor(commande.statut)}`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {commande.statut}
                      </motion.span>
                    </div>
                  </motion.div>

                  {/* Date */}
                  <motion.div
                    className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <div className="p-3 rounded-lg bg-emerald-100 mt-1">
                      <Clock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-800 mb-1">Date de commande</h4>
                      <p className="text-emerald-700">{formatDate(commande.created_at)}</p>
                    </div>
                  </motion.div>
                </div>

                {/* Récapitulatif */}
                <motion.div
                  className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-100 h-fit"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-semibold text-emerald-800 mb-4 text-lg">Récapitulatif</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <span className="text-emerald-700">Sous-total</span>
                      <span className="font-semibold text-emerald-800">{commande.prix_total_articles} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                      <span className="text-emerald-700">Frais de livraison</span>
                      <span className="font-semibold text-emerald-800">{commande.livraison} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center pt-3">
                      <span className="font-bold text-lg text-emerald-900">Total</span>
                      <span className="font-bold text-lg text-emerald-900">{commande.prix_total_commande} FCFA</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Articles */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <h4 className="font-semibold text-emerald-800 mb-4 text-lg">
                  Articles ({commande.articles.length})
                </h4>
                <div className="space-y-4">
                  {commande.articles.map((article, index) => (
                    <motion.div
                      key={article.hashid}
                      className="flex gap-4 p-4 border border-emerald-100 rounded-xl bg-white hover:shadow-md transition-all duration-300"
                      whileHover={{ y: -2 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                    >
                      <motion.div
                        className="w-20 h-20 bg-emerald-50 rounded-xl flex items-center justify-center overflow-hidden border border-emerald-100"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {article.image ? (
                          <img
                            src={article.image.trim()}
                            alt={article.nom_article}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-emerald-400" />
                        )}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-emerald-900 mb-1">{article.nom_article}</h5>
                        <p className="text-emerald-600/80 text-sm mb-2 line-clamp-2">{article.description}</p>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="font-medium text-emerald-700">{article.prix} FCFA</span>
                          <span className="text-sm text-emerald-600/70">Quantité: {article.quantite}</span>
                        </div>
                        {article.variations && article.variations.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {article.variations.map((variation, idx) => (
                              <motion.span
                                key={idx}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 border border-emerald-200"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                {variation.nom_variation}: {variation.lib_variation}
                              </motion.span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-emerald-900 text-lg">{article.prix * article.quantite} FCFA</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Pied de page */}
            <div className="p-6 border-t border-emerald-100 bg-emerald-50/30">
              <div className="flex justify-end">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-200/50"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Fermer
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandeDetailsModal;