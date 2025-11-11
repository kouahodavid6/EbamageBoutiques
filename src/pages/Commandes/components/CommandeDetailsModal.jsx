import {
  Package,
  User,
  CreditCard,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
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
      case "Validée":
      case "Confirmée":
        return (
          <span className={`bg-emerald-100 text-emerald-800 ${baseClasses}`}>
            <CheckCircle className="w-3 h-3" /> {status}
          </span>
        );
      case "Annulée":
        return (
          <span className={`bg-red-100 text-red-800 ${baseClasses}`}>
            <XCircle className="w-3 h-3" /> {status}
          </span>
        );
      case "En cours":
      case "En livraison":
        return (
          <span className={`bg-blue-100 text-blue-800 ${baseClasses}`}>
            <Truck className="w-3 h-3" /> {status}
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
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
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
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100/20 relative z-50"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            {/* En-tête */}
            <div className="flex justify-between items-center mb-6 border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-lg shadow-lg flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <ShoppingBag className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-emerald-900">
                  Détails de la commande
                </h2>
              </div>
              <motion.button
                onClick={onClose}
                className="bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg text-emerald-500 hover:text-emerald-700 transition-all duration-200 border border-emerald-200"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Identifiants commande */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200">
                #{commande.hashid.substring(0, 8).toUpperCase()}
              </span>
              <span className="bg-emerald-50/50 text-emerald-600 px-3 py-1.5 rounded-full text-sm border border-emerald-100 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(commande.created_at)}
              </span>
              <span className="bg-emerald-50/50 text-emerald-600 px-3 py-1.5 rounded-full text-sm border border-emerald-100">
                Code: {commande.code_commande}
              </span>
              {getStatusBadge(commande.statut)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche : client + articles */}
              <div className="lg:col-span-2 space-y-6">
                {/* Client */}
                <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" /> Informations client
                  </h3>
                  <p className="text-emerald-900 font-medium">{commande.client.nom_clt}</p>
                </div>

                {/* Articles */}
                <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" /> Articles commandés (
                    {commande.articles.length})
                  </h3>
                  <div className="space-y-4">
                    {commande.articles.map((article) => (
                      <div
                        key={article.hashid}
                        className="flex gap-4 p-4 bg-white rounded-lg border border-emerald-100 shadow-sm"
                      >
                        <img
                          src={article.image || "/placeholder.png"}
                          alt={article.nom_article}
                          className="w-20 h-20 rounded-lg object-cover border border-emerald-200"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-emerald-900">
                              {article.nom_article}
                            </h4>
                            {getStatusBadge(article.statut_sous_commande || 'En attente')}
                          </div>
                          <p className="text-sm text-emerald-600/80 mb-2">
                            {article.description}
                          </p>
                          <p className="text-emerald-700 font-medium">
                            {article.prix.toLocaleString("fr-FR")} FCFA ×{" "}
                            {article.quantite}
                          </p>
                          {article.variations?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {article.variations.map((variation, i) => (
                                <span
                                  key={i}
                                  className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-xs border border-emerald-200"
                                >
                                  {variation.nom_variation}: {variation.lib_variation}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Boutique */}
                          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                            <Store className="w-4 h-4" />
                            <span>{article.boutique?.nom_btq}</span>
                          </div>
                        </div>
                        <div className="text-right font-bold text-emerald-900">
                          {(article.prix * article.quantite).toLocaleString(
                            "fr-FR"
                          )}{" "}
                          FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne droite : résumé, paiement, adresse */}
              <div className="space-y-6">
                {/* Résumé financier */}
                <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-4">
                    Résumé financier
                  </h3>
                  <div className="space-y-2 text-sm">
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
                    <div className="flex justify-between font-bold text-emerald-900 border-t pt-2 mt-2">
                      <span>Total</span>
                      <span>
                        {commande.prix_total_commande.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Paiement */}
                <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" /> Paiement
                  </h3>
                  <p className="text-emerald-700 capitalize">
                    {commande.moyen_de_paiement}
                  </p>
                </div>

                {/* Adresse */}
                <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" /> Adresse de livraison
                  </h3>
                  <p className="text-emerald-700">
                    {commande.localisation.quartier},{" "}
                    {commande.localisation.commune},{" "}
                    {commande.localisation.ville}
                  </p>
                </div>

                {/* Dates */}
                <div className="bg-emerald-50/30 p-6 rounded-xl border border-emerald-100">
                  <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" /> Dates
                  </h3>
                  <div className="space-y-2 text-sm">
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