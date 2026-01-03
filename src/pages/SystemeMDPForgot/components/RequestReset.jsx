import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, AlertCircle, ArrowRight, Store } from "lucide-react";
import Input from "../../../components/Input";
import useResetPasswordBoutiqueStore from "../../../stores/resetPasswordBoutique.store";

const RequestReset = () => {
    const [email_btq, setEmail] = useState("");
    const { requestResetCode, loading, error, setEmail: setStoreEmail } = useResetPasswordBoutiqueStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await requestResetCode(email_btq);
            setStoreEmail(email_btq);
        } catch (error) {
            console.error(error);
        }
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

    const inputVariants = {
        focus: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div 
                className="w-full flex flex-col items-center py-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="bg-gradient-to-br from-emerald-100 to-green-100 p-4 rounded-2xl mb-4 shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    <Store className="h-8 w-8 text-emerald-600" />
                </motion.div>
                <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent text-center mb-2">
                    Mot de passe oublié ?
                </h2>
                <p className="text-emerald-600/80 text-center text-sm font-medium">
                    Entrez votre email boutique pour recevoir un code de réinitialisation
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                    <label htmlFor="email_btq" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Email boutique <span className="text-red-500">*</span>
                    </label>
                    <motion.div whileFocus="focus" variants={inputVariants}>
                        <Input
                            type="email"
                            id="email_btq"
                            name="email_btq"
                            value={email_btq}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contact@ma-boutique.com"
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 transition-all duration-300 ${
                                error 
                                    ? "border-red-300 bg-red-50 focus:ring-red-200" 
                                    : "border-emerald-200 focus:ring-emerald-200 focus:border-emerald-400"
                            }`}
                            required
                        />
                    </motion.div>
                </div>

                {error && (
                    <motion.div 
                        className="p-4 bg-red-50 border border-red-200 rounded-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error}
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
                            Envoi en cours...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Mail className="w-5 h-5 mr-2" />
                            Envoyer le code de réinitialisation
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </div>
                    )}
                </motion.button>
            </form>

            <motion.div 
                className="mt-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <p className="text-center text-sm text-emerald-700">
                    Le code sera envoyé à l'adresse email associée à votre compte boutique.
                </p>
            </motion.div>
        </div>
    );
};

export default RequestReset;