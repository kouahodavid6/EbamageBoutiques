import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Save, X, Settings, Tag, ChevronDown } from "lucide-react";
import useLibelleVariationStore from "../../../stores/libelleVariation.store";

const ListeVariationsAvecLibelles = ({ variations, loading }) => {
    const [editingLibelle, setEditingLibelle] = useState({ variationId: null, index: null, value: "" });
    const [selectedVariationId, setSelectedVariationId] = useState("");

    const { 
        modifierLibelle, 
        supprimerLibelle, 
        supprimerVariation,
        variations: allVariationsFromStore, // Les variations du store libelleVariation
        fetchVariations, 
        loading: variationsLoading 
    } = useLibelleVariationStore();

    // Charger toutes les variations au montage du composant
    useEffect(() => {
        fetchVariations();
    }, [fetchVariations]);

    // Filtrer les variations pour n'afficher que celles qui ont des libellés
    const variationsAvecLibelles = variations.filter(v => v.valeurs && v.valeurs.length > 0);

    // Démarrer l'édition d'un libellé
    const demarrerEditionLibelle = (variationId, index, valeur) => {
        setEditingLibelle({ variationId, index, value: valeur });
    };

    // Sauvegarder l'édition d'un libellé
    const sauvegarderEditionLibelle = async () => {
        if (!editingLibelle.value.trim()) {
            alert("Le libellé ne peut pas être vide");
            return;
        }

        try {
            await modifierLibelle(
                editingLibelle.variationId, 
                editingLibelle.index, 
                editingLibelle.value
            );
            setEditingLibelle({ variationId: null, index: null, value: "" });
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    // Supprimer un libellé
    const handleSupprimerLibelle = async (variationId, index, libelleValue) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le libellé "${libelleValue}" ?`)) {
            try {
                await supprimerLibelle(variationId, index);
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    // Supprimer une variation entière
    const handleSupprimerVariation = async (variationId, nomVariation) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la variation "${nomVariation}" et tous ses libellés ?`)) {
            try {
                await supprimerVariation(variationId);
                // Reset la sélection si on supprime la variation sélectionnée
                if (selectedVariationId === variationId) {
                    setSelectedVariationId("");
                }
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    // Filtrer les variations à afficher selon la sélection
    const variationsToDisplay = selectedVariationId 
        ? variationsAvecLibelles.filter(v => v.hashid === selectedVariationId)
        : variationsAvecLibelles;

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-green-50 rounded-xl p-4 space-y-3">
                        <div className="h-6 bg-green-100 rounded w-1/3"></div>
                        <div className="flex flex-wrap gap-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-8 bg-green-100 rounded-full w-20"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (variationsAvecLibelles.length === 0) {
        return (
            <div className="text-center py-8">
                <Settings className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Aucune variation avec libellés
                </h3>
                <p className="text-green-600">
                    Les variations avec leurs libellés apparaîtront ici après ajout
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Sélecteur de variation */}
            <div className="bg-white rounded-xl p-4 border border-green-200">
                <label className="block text-sm font-medium text-green-700 mb-2">
                    Filtrer par variation :
                </label>
                <div className="relative">
                    {variationsLoading ? (
                        <div className="w-full border border-green-300 rounded-lg px-4 py-3 bg-green-50 animate-pulse">
                            <div className="h-4 bg-green-100 rounded w-1/2"></div>
                        </div>
                    ) : (
                        <>
                            <select
                                value={selectedVariationId}
                                onChange={(e) => setSelectedVariationId(e.target.value)}
                                className="w-full appearance-none border border-green-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-green-900 cursor-pointer"
                            >
                                <option value="">Toutes les variations</option>
                                {allVariationsFromStore
                                    .filter(variation => variationsAvecLibelles.some(v => v.hashid === variation.hashid))
                                    .map((variation) => (
                                        <option key={variation.hashid} value={variation.hashid}>
                                            {variation.nom_variation} ({variation.valeurs?.length || 0} libellés)
                                        </option>
                                    ))
                                }
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-600">
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </>
                    )}
                </div>
                
                {selectedVariationId && (
                    <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-green-600">
                            Affichage d'une variation sélectionnée
                        </span>
                        <button
                            onClick={() => setSelectedVariationId("")}
                            className="text-sm text-green-700 hover:text-green-900 underline"
                        >
                            Voir toutes
                        </button>
                    </div>
                )}
            </div>

            {/* Liste des variations avec libellés */}
            <div className="space-y-6">
                {variationsToDisplay.map((variation) => (
                    <motion.div
                        key={variation.hashid}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-6"
                    >
                        {/* En-tête de la variation */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Tag className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-green-900">
                                        {variation.nom_variation}
                                    </h3>
                                    <p className="text-green-600 text-sm">
                                        {variation.valeurs?.length || 0} libellé(s)
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={() => handleSupprimerVariation(variation.hashid, variation.nom_variation)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Liste des libellés */}
                        {variation.valeurs && variation.valeurs.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-green-700 mb-2">
                                    Libellés disponibles :
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {variation.valeurs.map((libelle, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative group"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {editingLibelle.variationId === variation.hashid && 
                                                editingLibelle.index === index ? (
                                                // Mode édition
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="text"
                                                        value={editingLibelle.value}
                                                        onChange={(e) => setEditingLibelle({
                                                            ...editingLibelle,
                                                            value: e.target.value
                                                        })}
                                                        className="px-3 py-1 border border-green-300 rounded-full text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        onKeyPress={(e) => e.key === 'Enter' && sauvegarderEditionLibelle()}
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={sauvegarderEditionLibelle}
                                                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                                                    >
                                                        <Save className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingLibelle({ variationId: null, index: null, value: "" })}
                                                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                // Mode affichage
                                                <div className="flex items-center space-x-1">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
                                                        {libelle}
                                                    </span>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                                        <button
                                                            onClick={() => demarrerEditionLibelle(variation.hashid, index, libelle)}
                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleSupprimerLibelle(variation.hashid, index, libelle)}
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-green-500 text-sm">
                                    Aucun libellé défini pour cette variation
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Message si aucune variation ne correspond au filtre */}
            {variationsToDisplay.length === 0 && selectedVariationId && (
                <div className="text-center py-8 bg-yellow-50 rounded-xl border border-yellow-200">
                    <Settings className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                        Aucun libellé trouvé
                    </h3>
                    <p className="text-yellow-600">
                        La variation sélectionnée ne contient aucun libellé.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ListeVariationsAvecLibelles;