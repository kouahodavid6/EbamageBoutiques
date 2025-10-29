import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff } from "lucide-react";
import useBoutiqueInfoStore from "../../../stores/infoBoutique.store";
import toast from "react-hot-toast";

const PasswordForm = () => {
    const [formData, setFormData] = useState({
        ancien_password: "",
        nouveau_password: "",
        nouveau_password_confirmation: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        ancien: false,
        nouveau: false,
        confirmation: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const { updateBoutiquePassword } = useBoutiqueInfoStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.nouveau_password !== formData.nouveau_password_confirmation) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        setIsLoading(true);

        try {
            await updateBoutiquePassword(formData);
            setFormData({
                ancien_password: "",
                nouveau_password: "",
                nouveau_password_confirmation: ""
            });
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

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const inputVariants = {
        focus: { scale: 1.02, borderColor: "#10b981" },
        blur: { scale: 1, borderColor: "#bbf7d0" }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-6">Changer le mot de passe</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Ancien mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                        Ancien mot de passe
                    </label>
                    <div className="relative">
                        <motion.input
                            type={showPasswords.ancien ? "text" : "password"}
                            name="ancien_password"
                            value={formData.ancien_password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors pr-12"
                            placeholder="Votre ancien mot de passe"
                            variants={inputVariants}
                            whileFocus="focus"
                        />
                        <motion.button
                            type="button"
                            onClick={() => togglePasswordVisibility("ancien")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {showPasswords.ancien ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                    </div>
                </div>

                {/* Nouveau mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                        Nouveau mot de passe
                    </label>
                    <div className="relative">
                        <motion.input
                            type={showPasswords.nouveau ? "text" : "password"}
                            name="nouveau_password"
                            value={formData.nouveau_password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors pr-12"
                            placeholder="Votre nouveau mot de passe"
                            variants={inputVariants}
                            whileFocus="focus"
                        />
                        <motion.button
                            type="button"
                            onClick={() => togglePasswordVisibility("nouveau")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {showPasswords.nouveau ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                    </div>
                </div>

                {/* Confirmation mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                        Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                        <motion.input
                            type={showPasswords.confirmation ? "text" : "password"}
                            name="nouveau_password_confirmation"
                            value={formData.nouveau_password_confirmation}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/50 transition-colors pr-12"
                            placeholder="Confirmez votre nouveau mot de passe"
                            variants={inputVariants}
                            whileFocus="focus"
                        />
                        <motion.button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirmation")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {showPasswords.confirmation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.button>
                    </div>
                </div>

                {/* Bouton */}
                <div className="flex justify-end pt-4 border-t border-green-100">
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors font-medium disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? "Mise à jour..." : "Changer le mot de passe"}</span>
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default PasswordForm;