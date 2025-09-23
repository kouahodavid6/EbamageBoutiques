import { Menu, Bell, User } from 'lucide-react';
import useAuthStore from '../../../stores/auth.store';

const DashboardHeader = ({ title, toggleSidebar }) => {
    const user = useAuthStore((state) => state.user);

    // Sécurité : on vérifie si user est bien présent
    const nom = user?.nom_btq?.toUpperCase() || 'Utilisateur';
    return (
        <header className="bg-white shadow-sm h-16 flex items-center px-4 sticky top-0 z-20">
            {/* Bouton pour afficher/cacher la sidebar (visible seulement en mobile) */}
            <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Titre de la page */}
            <h1 className="text-xl font-bold text-gray-800 ml-2 md:ml-0">{title}</h1>

            {/* Zone à droite : notifications + profil */}
            <div className="ml-auto flex items-center space-x-4">
                {/* Bouton cloche de notifications */}
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                    <Bell className="h-7 w-7" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Avatar + infos utilisateur */}
                <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-gray-700">{nom}</p>
                        <p className="text-xs text-gray-500">Boutique</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
