import { Edit2, X } from "lucide-react";
import RegistrationFormRecrue from "./RegistrationProduitsModal";

const EditRecrueModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
                            <Edit2 className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Modifier la recrue</h2>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Fermer le modal"
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <section className="p-6 overflow-y-auto flex-1 scroll-smooth">
                    <RegistrationFormRecrue
                        onSubmit={onSubmit}
                        initialData={initialData}
                        isEdit={true}
                        onCancel={onClose}
                    />
                </section>

                <footer className="p-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-500">
                    Cliquez sur "Modifier" pour enregistrer les changements
                </footer>
            </div>
        </div>
    );
};

export default EditRecrueModal;
