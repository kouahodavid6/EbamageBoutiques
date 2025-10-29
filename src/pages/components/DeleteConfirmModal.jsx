import { Trash2, X, Loader2, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteConfirmModal = ({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    entityName = "cet élément",
    isDeleting = false 
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.8,
            y: -20
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transition: {
                duration: 0.2
            }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                >
                    {/* Overlay avec backdrop blur */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={!isDeleting ? onCancel : undefined}
                        aria-hidden="true"
                        variants={backdropVariants}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        className="relative z-[10000] bg-white rounded-2xl max-w-md w-full shadow-2xl border border-emerald-100/20"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-center p-6 border-b border-emerald-100">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg"
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <AlertTriangle className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900">
                                        Confirmation requise
                                    </h3>
                                    <p className="text-sm text-emerald-600/70">
                                        Action critique en attente
                                    </p>
                                </div>
                            </div>
                            {!isDeleting && (
                                <motion.button
                                    onClick={onCancel}
                                    className="p-2 rounded-xl text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Fermer la fenêtre"
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            )}
                        </div>

                        {/* Contenu */}
                        <div className="p-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 mt-1">
                                        <Trash2 className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-emerald-800 font-medium mb-2">
                                            Supprimer <span className="text-amber-600 font-semibold">{entityName}</span> ?
                                        </p>
                                        <p className="text-emerald-600/80 text-sm leading-relaxed">
                                            Cette action supprimera définitivement l'élément et toutes ses données associées. 
                                            <span className="block mt-1 font-medium text-amber-600">
                                                Cette action est irréversible.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Actions */}
                            <motion.div 
                                className="flex justify-end gap-3 pt-4 border-t border-emerald-100"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {!isDeleting && (
                                    <motion.button
                                        onClick={onCancel}
                                        className="px-6 py-3 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium transition-all duration-300 min-w-24"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Annuler
                                    </motion.button>
                                )}
                                <motion.button
                                    onClick={onConfirm}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-w-24 flex items-center justify-center"
                                    disabled={isDeleting}
                                    whileHover={{ scale: isDeleting ? 1 : 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isDeleting ? (
                                        <motion.div 
                                            className="flex items-center gap-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            Suppression...
                                        </motion.div>
                                    ) : (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Supprimer
                                        </motion.span>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;