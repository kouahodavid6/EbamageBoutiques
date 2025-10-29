import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Edit } from "lucide-react";
import useBoutiqueInfoStore from "../../../stores/infoBoutique.store";

const InfoForm = ({ boutique, loading }) => {
    const [formData, setFormData] = useState({
        nom_btq: "",
        email_btq: "",
        tel_btq: ""
    });
    const [initialData, setInitialData] = useState({
        nom_btq: "",
        email_btq: "",
        tel_btq: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const { updateBoutiqueInfo } = useBoutiqueInfoStore();

    useEffect(() => {
        if (boutique) {
            const newData = {
                nom_btq: boutique.nom_btq || "",
                email_btq: boutique.email_btq || "",
                tel_btq: boutique.tel_btq || ""
            };
            setFormData(newData);
            setInitialData(newData);
        }
    }, [boutique]);

    // Vérifier les changements à chaque modification
    useEffect(() => {
        const hasFormChanged = 
            formData.nom_btq !== initialData.nom_btq ||
            formData.email_btq !== initialData.email_btq ||
            formData.tel_btq !== initialData.tel_btq;
        
        setHasChanges(hasFormChanged);
    }, [formData, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!hasChanges) {
            return; // Ne rien faire si pas de changements
        }
        
        setIsLoading(true);

        try {
            await updateBoutiqueInfo(formData);
            setInitialData(formData); // Mettre à jour les données initiales
            setHasChanges(false); // Réinitialiser les changements
            setIsEditing(false);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleCancel = () => {
        // Revenir aux données initiales
        setFormData(initialData);
        setHasChanges(false);
        setIsEditing(false);
    };

    const inputVariants = {
        focus: { scale: 1.02, borderColor: "#10b981" },
        blur: { scale: 1, borderColor: "#bbf7d0" }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-green-900">
                    Informations de la boutique
                </h2>
                <motion.button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                        isEditing 
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-200" 
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Edit className="w-4 h-4" />
                    <span>{isEditing ? "Annuler" : "Modifier"}</span>
                </motion.button>
            </div>
            
            {!isEditing ? (
                // Mode lecture seule
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <label className="block text-sm font-medium text-green-700 mb-1">
                            Nom de la boutique
                        </label>
                        <p className="text-green-900 font-semibold">{formData.nom_btq}</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <label className="block text-sm font-medium text-green-700 mb-1">
                            Email
                        </label>
                        <p className="text-green-900 font-semibold">{formData.email_btq}</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <label className="block text-sm font-medium text-green-700 mb-1">
                            Téléphone
                        </label>
                        <p className="text-green-900 font-semibold">{formData.tel_btq}</p>
                    </div>
                </div>
            ) : (
                // Mode édition
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                            Nom de la boutique
                        </label>
                        {loading ? (
                            <div className="h-12 bg-green-100 rounded-xl animate-pulse"></div>
                        ) : (
                            <motion.input
                                type="text"
                                name="nom_btq"
                                value={formData.nom_btq}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors"
                                placeholder="Nom de votre boutique"
                                variants={inputVariants}
                                whileFocus="focus"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                            Email
                        </label>
                        {loading ? (
                            <div className="h-12 bg-green-100 rounded-xl animate-pulse"></div>
                        ) : (
                            <motion.input
                                type="email"
                                name="email_btq"
                                value={formData.email_btq}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors"
                                placeholder="email@exemple.com"
                                variants={inputVariants}
                                whileFocus="focus"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-2">
                            Téléphone
                        </label>
                        {loading ? (
                            <div className="h-12 bg-green-100 rounded-xl animate-pulse"></div>
                        ) : (
                            <motion.input
                                type="tel"
                                name="tel_btq"
                                value={formData.tel_btq}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors"
                                placeholder="0123456789"
                                variants={inputVariants}
                                whileFocus="focus"
                            />
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-green-100">
                        <motion.button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Annuler
                        </motion.button>
                        <motion.button
                            type="submit"
                            disabled={isLoading || !hasChanges}
                            className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors font-medium ${
                                hasChanges
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            } ${isLoading ? "opacity-50" : ""}`}
                            whileHover={hasChanges ? { scale: 1.02 } : {}}
                            whileTap={hasChanges ? { scale: 0.98 } : {}}
                        >
                            <Save className="w-4 h-4" />
                            <span>{isLoading ? "Mise à jour..." : "Enregistrer"}</span>
                        </motion.button>
                    </div>

                    {/* Indicateur de changements */}
                    {hasChanges && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 border border-blue-200 rounded-xl p-3"
                        >
                            <p className="text-blue-700 text-sm flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Modifications non enregistrées
                            </p>
                        </motion.div>
                    )}
                </form>
            )}
        </div>
    );
};

export default InfoForm;