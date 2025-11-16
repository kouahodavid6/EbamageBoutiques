import {
  Package,
  User,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Calendar,
  ShoppingBag,
  Store,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const CommandeDetailsModal = ({ commande, isOpen, onClose }) => {
  if (!commande || !isOpen) return null;

  // Badges statut
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";

    switch (status) {
      case "En attente":
          return (
              <span className={`bg-amber-100 text-amber-800 ${baseClasses}`}>
                  <Clock className="w-3 h-3" /> {status}
              </span>
          );
      case "Livré":
      case "Livrée":
          return (
              <span className={`bg-emerald-100 text-emerald-800 ${baseClasses}`}>
                  <CheckCircle className="w-3 h-3" /> {status}
              </span>
          );
      case "Annulé":
      case "Annulée":
          return (
              <span className={`bg-red-100 text-red-800 ${baseClasses}`}>
                  <XCircle className="w-3 h-3" /> {status}
              </span>
          );
      case "Confirmée":
          return (
              <span className={`bg-green-100 text-green-800 ${baseClasses}`}>
                  <CheckCircle className="w-3 h-3" /> {status}
              </span>
          );
      default:
        return (
          <span className={`bg-gray-100 text-gray-800 ${baseClasses}`}>
            {status}
          </span>
        );
    }
  };

  // Formatage date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy HH:mm", { locale: fr });
    } catch (e) {
      return "Date invalide";
    }
  };

  // Variants motion
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          onClick={onClose}
          aria-hidden="true"
          variants={backdropVariants}
        />

        {/* Contenu modal */}
        <motion.div
          className="bg-white rounded-xl sm:rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100/20 relative z-50"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            {/* En-tête */}
            <div className="flex justify-between items-start sm:items-center gap-4 mb-6 border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <motion.div
                  className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-lg shadow-lg flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <h2 className="text-lg sm:text-xl font-bold text-emerald-900 truncate">
                  Détails de la commande
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg text-emerald-500 hover:text-emerald-700 transition-all duration-200 border border-emerald-200 flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>

            {/* Identifiants commande */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-emerald-50 text-emerald-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border border-emerald-200 truncate max-w-full">
                #{commande.hashid.substring(0, 8).toUpperCase()}
              </span>
              <span className="bg-emerald-50/50 text-emerald-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm border border-emerald-100 flex items-center gap-1 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{formatDate(commande.created_at)}</span>
              </span>
              <span className="bg-emerald-50/50 text-emerald-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm border border-emerald-100 truncate max-w-full">
                Code: {commande.code_commande}
              </span>
              <div className="flex-shrink-0">
                {getStatusBadge(commande.statut)}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Colonne gauche : client + articles */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Client */}
                <div className="bg-emerald-50/30 p-4 sm:p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" /> 
                    Informations client
                  </h3>
                  <p className="text-emerald-900 font-medium text-sm sm:text-base">
                    {commande.client.nom_clt}
                  </p>
                </div>

                {/* Articles */}
                <div className="bg-emerald-50/30 p-4 sm:p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" /> 
                    Articles commandés ({commande.articles.length})
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {commande.articles.map((article) => (
                      <div
                        key={article.hashid}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-emerald-100 shadow-sm"
                      >
                        <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
                          <img
                            src={article.image || "/placeholder.png"}
                            alt={article.nom_article}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-emerald-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                              <h4 className="font-semibold text-emerald-900 text-sm sm:text-base truncate">
                                {article.nom_article}
                              </h4>
                              <div className="flex-shrink-0">
                                {getStatusBadge(article.statut_sous_commande || 'En attente')}
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-emerald-600/80 mb-2 line-clamp-2">
                              {article.description}
                            </p>
                            <p className="text-emerald-700 font-medium text-sm sm:text-base">
                              {article.prix.toLocaleString("fr-FR")} FCFA × {article.quantite}
                            </p>
                            {article.variations?.length > 0 && (
                              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                                {article.variations.map((variation, i) => (
                                  <span
                                    key={i}
                                    className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-xs border border-emerald-200 break-words max-w-full"
                                  >
                                    {variation.nom_variation}: {variation.lib_variation}
                                  </span>
                                ))}
                              </div>
                            )}
                            {/* Boutique */}
                            <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-emerald-600">
                              <Store className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{article.boutique?.nom_btq}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right sm:text-left font-bold text-emerald-900 text-sm sm:text-base border-t pt-2 sm:pt-0 sm:border-t-0 flex justify-between sm:block">
                          <span className="sm:hidden text-emerald-600 font-normal">Total:</span>
                          {(article.prix * article.quantite).toLocaleString("fr-FR")} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne droite : résumé, paiement, adresse */}
              <div className="space-y-4 sm:space-y-6">
                {/* Résumé financier */}
                <div className="bg-emerald-50/30 p-4 sm:p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-3 sm:mb-4 text-sm sm:text-base">
                    Résumé financier
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>
                        {commande.prix_total_articles.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>
                        {commande.livraison.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-900 border-t pt-2 mt-2 text-sm sm:text-base">
                      <span>Total</span>
                      <span>
                        {commande.prix_total_commande.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Paiement */}
                <div className="bg-emerald-50/30 p-4 sm:p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" /> 
                    Paiement
                  </h3>
                  <p className="text-emerald-700 capitalize text-sm sm:text-base">
                    {commande.moyen_de_paiement}
                  </p>
                </div>

                {/* Adresse */}
                <div className="bg-emerald-50/30 p-4 sm:p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" /> 
                    Adresse de livraison
                  </h3>
                  <p className="text-emerald-700 text-sm sm:text-base">
                    {commande.localisation.quartier}, {commande.localisation.commune}, {commande.localisation.ville}
                  </p>
                </div>

                {/* Dates */}
                <div className="bg-emerald-50/30 p-4 sm:p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" /> 
                    Dates
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <p className="text-emerald-600/70 text-xs">Créée le</p>
                      <p className="text-emerald-900">{formatDate(commande.created_at)}</p>
                    </div>
                    {commande.updated_at !== commande.created_at && (
                      <div>
                        <p className="text-emerald-600/70 text-xs">Modifiée le</p>
                        <p className="text-emerald-900">{formatDate(commande.updated_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandeDetailsModal;