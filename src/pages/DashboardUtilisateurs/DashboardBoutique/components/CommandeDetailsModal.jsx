import { X, MapPin, ShoppingBag, CreditCard, Clock, User, Home } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-[10000] bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-100">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-100">
              <ShoppingBag className="h-5 w-5 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Détails de la commande
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-100 mt-1">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Client</h4>
                  <p className="text-gray-600">{commande.client.nom_clt}</p>
                  <p className="text-sm text-gray-500">ID: {commande.client.hashid_clt}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-green-100 mt-1">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Adresse de livraison</h4>
                  <p className="text-gray-600">{commande.localisation.quartier}</p>
                  <p className="text-gray-600">{commande.localisation.commune}, {commande.localisation.ville}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-purple-100 mt-1">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Paiement</h4>
                  <p className="text-gray-600">{commande.moyen_de_paiement}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      commande.statut === "En attente" ? "bg-yellow-100 text-yellow-800" :
                      commande.statut === "Livré" ? "bg-green-100 text-green-800" :
                      commande.statut === "Annulé" ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {commande.statut}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-amber-100 mt-1">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Date</h4>
                  <p className="text-gray-600">{formatDate(commande.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Récapitulatif</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{commande.prix_total_articles} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="font-medium">{commande.livraison} FCFA</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                  <span className="font-medium text-gray-700">Total</span>
                  <span className="font-bold text-gray-900">{commande.prix_total_commande} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Articles ({commande.articles.length})</h4>
            <div className="space-y-4">
              {commande.articles.map((article) => (
                <div key={article.hashid} className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {article.image ? (
                      <img
                        src={article.image.trim()}
                        alt={article.nom_article}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{article.nom_article}</h5>
                    <p className="text-sm text-gray-500">{article.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-gray-700">{article.prix} FCFA</span>
                      <span className="text-sm text-gray-500">Quantité: {article.quantite}</span>
                    </div>
                    {article.variations && article.variations.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {article.variations.map((variation, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                            {variation.nom_variation}: {variation.lib_variation}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-900">{article.prix * article.quantite} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandeDetailsModal;