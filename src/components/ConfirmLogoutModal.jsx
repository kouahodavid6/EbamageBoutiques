import { LogOut, X } from "lucide-react";
import { useEffect } from 'react';

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
    // Bloque le scroll quand le modal est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => (document.body.style.overflow = '');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Modal */}
            <div className="relative z-[10000] bg-white rounded-xl max-w-md w-full shadow-xl border border-gray-100">
                {/* En-tête avec bouton de fermeture */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-red-100">
                            <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Confirmer la déconnexion</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Fermer la fenêtre"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                {/* Contenu */}
                <div className="p-6">
                    <p className="text-gray-700 mb-6">
                        Êtes-vous sûr de vouloir vous déconnecter ?
                    </p>
                    
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogoutModal;