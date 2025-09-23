import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
//import { Users, UserCircle, FileText } from 'lucide-react';

const DashboardBoutiqueParametre = () => {
        const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Fixe sur desktop, cachée sur mobile */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out 
                            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                            md:translate-x-0 md:relative`}>
                {/* Bouton de fermeture mobile */}
                <div className="md:hidden flex justify-end p-4">
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500 hover:text-gray-800 focus:outline-none"
                        aria-label="Fermer la sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <DashboardSidebar role="boutique" />
            </div>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <DashboardHeader
                    title="Paramètres"
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />

                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardBoutiqueParametre;