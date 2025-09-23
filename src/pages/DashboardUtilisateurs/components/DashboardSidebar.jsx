import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  Store,
  BarChart3,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  Settings,
  LogOut,
  Layers,
} from "lucide-react";
import useAuthStore from "../../../stores/auth.store";
import { useNavigate } from "react-router-dom";
import ConfirmLogoutModal from "../../../components/ConfirmLogoutModal";
import { createPortal } from "react-dom";

const DashboardSidebar = () => {
  const location = useLocation();

  const logout = useAuthStore((state) => state.logout);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    try {
      // 1. Supprimer le token
      localStorage.removeItem("token");

      // 2. Réinitialiser Zustand
      logout(); // appel à ton authStore pour nettoyer l'état si besoin

      // 3. Rediriger vers la page de connexion
      navigate("/connexionBoutique");
      toast.success("Déconnexion effectuée avec succès !");
    } catch (error) {
      // L'erreur est déjà gérée par l'intercepteur Axios si c'est une erreur de requête
      // Mais comme la déconnexion est une opération locale, on garde un message d'erreur spécifique
      toast.error("Erreur lors de la déconnexion !");
      console.error("Erreur:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Définition des liens du menu selon le rôle
  const sidebarItems = [
    {
      path: "/dashboard-boutique",
      name: "Tableau de bord",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      path: "/dashboard-boutique/produits",
      name: "Produits",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      path: "/dashboard-boutique/variations",
      name: "Variations",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      path: "/dashboard-boutique/commandes",
      name: "Commandes",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    // {
    //     path: '/dashboard-boutique/live',
    //     name: 'Programmer un live',
    //     icon: <Calendar className="h-5 w-5" />
    // },
    // {
    //   path: "/dashboard-boutique/parametre",
    //   name: "Paramètres",
    //   icon: <Settings className="h-5 w-5" />,
    // },
  ];

  return (
    <>
      <div className="h-screen w-64 bg-white text-gray-500 fixed left-0 top-0 z-30">
        {/* Logo en haut du menu */}
        <div className="px-6 py-4  border-opacity-20 shadow-lg">
          <Link
            to="/dashboard-boutique"
            className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-pink-400" />
            <div className="font-bold text-xl text-gray-800">TrucDeLaTe</div>
          </Link>
        </div>

        {/* Liens du menu */}
        <div className="py-4 px-6">
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-pink-50 text-pink-600 border-l-4 border-pink-500"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}>
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}

            {/* Lien de déconnexion */}
            <li className="mt-6">
              <button
                onClick={() => setModalOpen(true)}
                className="flex w-full items-center px-6 py-3 text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="ml-3 font-bold">Déconnexion</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Utilisation de createPortal pour sortir le modal du flux */}
      {isModalOpen &&
        createPortal(
          <ConfirmLogoutModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirmLogout}
          />,
          document.body
        )}
    </>
  );
};

export default DashboardSidebar;
