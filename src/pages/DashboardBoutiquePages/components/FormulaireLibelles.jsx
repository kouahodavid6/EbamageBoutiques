import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Check } from "lucide-react";
import useLibelleVariationStore from "../../../stores/libelleVariation.store";

const FormulaireLibelles = ({ variations, loading }) => {
    const [selectedVariation, setSelectedVariation] = useState("");
    const [libelles, setLibelles] = useState([""]);
    const [isLoading, setIsLoading] = useState(false);

    const { ajouterLibelles } = useLibelleVariationStore();

    // Ajouter un nouveau champ libellé
    const ajouterChampLibelle = () => {
        setLibelles([...libelles, ""]);
    };

    // Supprimer un champ libellé
    const supprimerChampLibelle = (index) => {
        if (libelles.length > 1) {
            setLibelles(libelles.filter((_, i) => i !== index));
        }
    };

    // Modifier un libellé
    const modifierLibelle = (index, value) => {
        const nouveauxLibelles = [...libelles];
        nouveauxLibelles[index] = value;
        setLibelles(nouveauxLibelles);
    };

    // Valider l'ajout des libellés
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedVariation) {
            alert("Veuillez sélectionner une variation");
            return;
        }

        // Filtrer les libellés vides
        const libellesFiltres = libelles.filter(lib => lib.trim() !== "");
        if (libellesFiltres.length === 0) {
            alert("Veuillez ajouter au moins un libellé");
            return;
        }

        setIsLoading(true);

        try {
            await ajouterLibelles({
                variation_id: selectedVariation,
                lib_variation: libellesFiltres
            });
            
            // Réinitialiser le formulaire
            setSelectedVariation("");
            setLibelles([""]);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-green-100 rounded-xl"></div>
                <div className="h-10 bg-green-100 rounded-xl"></div>
                <div className="h-12 bg-green-100 rounded-xl"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection de la variation */}
            <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                    Type de variation *
                </label>
                <select
                    value={selectedVariation}
                    onChange={(e) => setSelectedVariation(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors"
                >
                    <option value="">Choisissez une variation</option>
                    {variations.map((variation) => (
                        <option key={variation.hashid} value={variation.hashid}>
                            {variation.nom_variation}
                        </option>
                    ))}
                </select>
            </div>

            {/* Champs des libellés */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-green-700">
                        Libellés *
                    </label>
                    <motion.button
                        type="button"
                        onClick={ajouterChampLibelle}
                        className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter un libellé</span>
                    </motion.button>
                </div>
                
                <div className="space-y-3">
                    {libelles.map((libelle, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-3"
                        >
                            <input
                                type="text"
                                value={libelle}
                                onChange={(e) => modifierLibelle(index, e.target.value)}
                                placeholder={`Saisissez un libellé (ex: Rouge, XL, etc.)`}
                                className="flex-1 px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors"
                            />
                            {libelles.length > 1 && (
                                <motion.button
                                    type="button"
                                    onClick={() => supprimerChampLibelle(index)}
                                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            )}
                        </motion.div>
                    ))}
                </div>
                <p className="text-green-600 text-sm mt-2">
                    Ajoutez autant de libellés que nécessaire pour cette variation
                </p>
            </div>

            {/* Bouton de validation */}
            <motion.button
                type="submit"
                disabled={isLoading || !selectedVariation}
                className={`w-full py-4 rounded-xl flex items-center justify-center space-x-3 transition-colors font-medium ${
                    selectedVariation && libelles.some(lib => lib.trim() !== "")
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={selectedVariation && libelles.some(lib => lib.trim() !== "") ? { scale: 1.02 } : {}}
                whileTap={selectedVariation && libelles.some(lib => lib.trim() !== "") ? { scale: 0.98 } : {}}
            >
                <Check className="w-5 h-5" />
                <span className="text-lg">
                    {isLoading ? "Ajout en cours..." : "Valider les libellés"}
                </span>
            </motion.button>
        </form>
    );
};

export default FormulaireLibelles;