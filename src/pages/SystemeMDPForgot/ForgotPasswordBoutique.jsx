import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ContainerForms from "../components/ContainerForms";
import useResetPasswordBoutiqueStore from "../../stores/resetPasswordBoutique.store";
import RequestReset from "./components/RequestReset";
import VerifyOtp from "./components/VerifyOtp";
import NewPassword from "./components/NewPassword";

const ForgotPasswordBoutique = () => {
    const { step, clearState } = useResetPasswordBoutiqueStore();

    const renderStep = () => {
        switch (step) {
            case 'email':
                return <RequestReset />;
            case 'otp':
                return <VerifyOtp />;
            case 'new-password':
                return <NewPassword />;
            default:
                return <RequestReset />;
        }
    };

    const handleBack = () => {
        if (step === 'otp') {
            clearState();
        }
    };

    return (
        <ContainerForms>
            {/* Bouton retour */}
            {step !== 'email' && (
                <motion.div 
                    className="mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        to={step === 'otp' ? "/forgot-password-boutique" : "/login"}
                        onClick={handleBack}
                        className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-300"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {step === 'otp' ? "Changer d'email" : "Retour à la connexion"}
                    </Link>
                </motion.div>
            )}

            {/* Contenu dynamique selon l'étape */}
            {renderStep()}

            {/* Lien retour à la connexion (visible uniquement à l'étape 1) */}
            {step === 'email' && (
                <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-center text-sm text-emerald-700">
                        Vous vous souvenez de votre mot de passe ?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-emerald-600 hover:text-emerald-800 underline transition-colors duration-300"
                        >
                            Se connecter
                        </Link>
                    </p>
                </motion.div>
            )}
        </ContainerForms>
    );
};

export default ForgotPasswordBoutique;