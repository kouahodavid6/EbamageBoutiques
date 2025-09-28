import { Edit2, X } from "lucide-react";
import RegistrationFormRecrue from "./RegistrationProduitsModal";
import { motion, AnimatePresence } from "framer-motion";

const EditRecrueModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    if (!isOpen) return null;

    // Variants d'animation
    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: -50,
            transition: { duration: 0.3 }
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: { duration: 0.2 }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
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

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: { 
            scale: 1, 
            rotate: 0,
            transition: { 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex justify-center items-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        aria-hidden="true"
                        variants={overlayVariants}
                    />

                    <motion.div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden border border-emerald-100"
                        onClick={(e) => e.stopPropagation()}
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <header className="p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50/30 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100"
                                    variants={iconVariants}
                                >
                                    <Edit2 className="h-6 w-6 text-emerald-600" />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-bold text-emerald-900">Modifier le produit</h2>
                                    <p className="text-emerald-600/70 text-sm">
                                        Mettez à jour les informations de votre produit
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                aria-label="Fermer le modal"
                                className="p-2 rounded-xl hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 transition-all duration-300"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <X className="h-5 w-5" />
                            </motion.button>
                        </header>

                        {/* Contenu */}
                        <motion.section 
                            className="p-6 overflow-y-auto flex-1 scroll-smooth bg-gradient-to-b from-white to-emerald-50/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <RegistrationFormRecrue
                                onSubmit={onSubmit}
                                initialData={initialData}
                                isEdit={true}
                                onCancel={onClose}
                            />
                        </motion.section>

                        {/* Pied de page */}
                        <motion.footer 
                            className="p-4 border-t border-emerald-100 bg-emerald-50/30"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                        >
                            <div className="flex items-center justify-center gap-2 text-sm text-emerald-600/70">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                <p>Cliquez sur "Modifier" pour enregistrer les changements</p>
                            </div>
                        </motion.footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditRecrueModal;