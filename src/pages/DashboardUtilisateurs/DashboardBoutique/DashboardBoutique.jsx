import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ShoppingCart } from "lucide-react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader  from "../components/DashboardHeader";

/* ------------------------------------------------------------- */
const DashboardBoutique = () => {
    const [sidebarOpen,   setSidebarOpen]   = useState(false);

  /* ============================================================= */
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:sticky top-0 z-40 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 w-64 h-screen bg-white shadow-md`}
            >
                {/* Croix mobile */}
                <div className="md:hidden flex justify-end p-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-800 transition"
                        aria-label="Fermer la sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <DashboardSidebar role="boutique" />
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0 flex flex-col">

                <DashboardHeader
                    title="Tableau de bord"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
                    {/* Actions rapides */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                to="/dashboard-boutique/produits"
                                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors group"
                            >
                                <Plus className="w-6 h-6 text-gray-400 group-hover:text-pink-500 mr-2" />
                                <span className="text-gray-600 group-hover:text-pink-600">Ajouter un produit</span>
                            </Link>

                            <Link 
                                to="/dashboard-boutique/commandes"
                                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors group"
                            >
                                <ShoppingCart className="w-6 h-6 text-gray-400 group-hover:text-pink-500 mr-2" />
                                <span className="text-gray-600 group-hover:text-pink-600">Voir les commandes</span>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modaux */}
            {/* <DeleteConfirmModal
                isOpen={showDeleteModal}
                onConfirm={confirmDelete}
                onCancel={() => {
                setShowDeleteModal(false);
                setSelectedRecrue(null);
                }}
                entityName={`${selectedRecrue?.nom ?? ""} ${selectedRecrue?.prenom ?? ""}`}
            /> */}

            {/* <EditRecrueModal
                isOpen={showEditModal}
                onClose={() => {
                setShowEditModal(false);
                setSelectedRecrue(null);
                }}
                initialData={selectedRecrue}
                onSubmit={confirmEdit}
            /> */}
        </div>
    );
};

export default DashboardBoutique;
