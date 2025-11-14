import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

const WaveConfirmationModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 25 }}
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Réclamation effectuée !
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Votre argent sera envoyé via Wave dans les plus brefs délais.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-700 font-medium">
                                    💰 Paiement Wave en cours de traitement
                                </p>
                            </div>
                            <motion.button
                                onClick={onClose}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Fermer
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WaveConfirmationModal;