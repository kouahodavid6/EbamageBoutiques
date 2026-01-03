import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, AlertCircle, CheckCircle, Store } from "lucide-react";
import Input from "../../../components/Input";
import useResetPasswordBoutiqueStore from "../../../stores/resetPasswordBoutique.store";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    
    const { submitNewPassword, loading, error, email_btq, success, clearState } = useResetPasswordBoutiqueStore();
    const navigate = useNavigate();

    const validatePasswords = () => {
        if (password.length < 6) {
            setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
            return false;
        }
        if (password !== confirmPassword) {
            setPasswordError("Les mots de passe ne correspondent pas");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePasswords()) return;

        try {
            await submitNewPassword(email_btq, password, confirmPassword);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBackToLogin = () => {
        clearState();
        navigate("/login");
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-md mx-auto">
                <motion.div 
                    className="w-full flex flex-col items-center py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-2xl mb-4 shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </motion.div>
                    <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent text-center mb-2">
                        Mot de passe réinitialisé !
                    </h2>
                    <p className="text-emerald-600/80 text-center text-sm font-medium">
                        Votre mot de passe a été modifié avec succès
                    </p>
                </motion.div>

                <motion.div 
                    className="mt-8 p-6 bg-emerald-50/50 rounded-xl border border-emerald-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-center text-sm text-emerald-700 mb-6">
                        Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                    </p>

                    <motion.button
                        onClick={handleBackToLogin}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:from-emerald-600 hover:to-green-600 hover:shadow-emerald-200/50 transition-all duration-300"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Retour à la connexion
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div 
                className="w-full flex flex-col items-center py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-2xl mb-4 shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    <Lock className="h-8 w-8 text-emerald-600" />
                </motion.div>
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent text-center mb-2">
                    Nouveau mot de passe
                </h2>
                <p className="text-emerald-600/80 text-center text-sm font-medium">
                    Choisissez un nouveau mot de passe sécurisé
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Nouveau mot de passe <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError("");
                        }}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 transition-all duration-300 ${
                            passwordError || error 
                                ? "border-red-300 bg-red-50 focus:ring-red-200" 
                                : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                        }`}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Confirmer le mot de passe <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError("");
                        }}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 transition-all duration-300 ${
                            passwordError || error 
                                ? "border-red-300 bg-red-50 focus:ring-red-200" 
                                : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                        }`}
                        required
                    />
                </div>

                {(passwordError || error) && (
                    <motion.div 
                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {passwordError || error}
                        </p>
                    </motion.div>
                )}

                <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                        loading 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:from-emerald-600 hover:to-green-600 hover:shadow-emerald-200/50"
                    }`}
                    variants={buttonVariants}
                    whileHover={!loading ? "hover" : {}}
                    whileTap={!loading ? "tap" : {}}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Réinitialisation...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Lock className="w-5 h-5 mr-2" />
                            Réinitialiser le mot de passe
                        </div>
                    )}
                </motion.button>
            </form>

            <motion.div 
                className="mt-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <p className="text-center text-sm text-emerald-700">
                    Utilisez un mot de passe fort contenant au moins 6 caractères.
                </p>
            </motion.div>
        </div>
    );
};

export default NewPassword;