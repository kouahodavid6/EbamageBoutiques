import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  Store,
  BarChart3,
  ShoppingBag,
  ShoppingCart,
  // Calendar,
  // Settings,
  LogOut,
  Layers,
} from "lucide-react";
import useAuthStore from '../stores/auth.store';
import { useNavigate } from "react-router-dom";
import ConfirmLogoutModal from "./../components/ConfirmLogoutModal";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const DashboardSidebar = () => {
  const location = useLocation();

  const logout = useAuthStore((state) => state.logout);
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    try {
      localStorage.removeItem("token");
      logout();
      navigate("/connexionBoutique");
      toast.success("Déconnexion effectuée avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion !");
      console.error("Erreur:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

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
  ];

  const itemVariants = {
    hover: {
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <>
      <div 
        className="h-screen w-64 bg-gradient-to-b from-white to-emerald-50 text-emerald-700 fixed left-0 top-0 z-30 border-r border-emerald-100 shadow-lg"
      >
        {/* Logo en haut du menu */}
        <div className="px-6 py-4 border-b border-emerald-100">
          <Link
            to="/dashboard-boutique"
            className="flex items-center space-x-2">
            <div>
              <Store className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="font-bold text-xl text-emerald-800">Ebamage</div>
          </Link>
        </div>

        {/* Liens du menu */}
        <div className="py-4 px-6">
          <ul>
            {sidebarItems.map((item, index) => (
              <motion.li 
                key={index} 
                className="mb-1"
                variants={itemVariants}
                custom={index}
                whileHover="hover"
              >
                <Link
                  to={item.path}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500 shadow-sm"
                      : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}>
                  <div>
                    {item.icon}
                  </div>
                  <span className="ml-2 font-medium">{item.name}</span>
                </Link>
              </motion.li>
            ))}

            {/* Lien de déconnexion */}
            <motion.li 
              className="mt-6"
              variants={itemVariants}
              custom={sidebarItems.length}
              whileHover="hover"
            >
              <motion.button
                onClick={() => setModalOpen(true)}
                className="flex w-full items-center px-6 py-3 text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-lg transition-all duration-300 shadow-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3 font-bold">Déconnexion</span>
              </motion.button>
            </motion.li>
          </ul>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 px-6">
          <div className="text-center">
            <p className="text-xs text-emerald-400">
              Version 1.0 • Ebamage
            </p>
          </div>
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