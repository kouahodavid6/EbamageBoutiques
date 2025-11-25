import { Menu, Bell, Store } from 'lucide-react';
import useBoutiqueInfoStore from '../../stores/infoBoutique.store';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotificationStore } from '../../stores/notification.store';
import { useEffect } from 'react';

const DashboardHeader = ({ title, toggleSidebar }) => {
    const { boutique, loading, fetchBoutiqueInfo } = useBoutiqueInfoStore();
    const { unreadCount, markAllAsRead } = useNotificationStore();
    const navigate = useNavigate();

    const nom = boutique?.nom_btq?.toUpperCase() || 'Boutique';
    const initiale = nom.charAt(0);
    const hasImage = boutique?.image_btq;

    // Rafraîchir les données du header aussi
    useEffect(() => {
        fetchBoutiqueInfo(true); // forceRefresh = true
    }, [fetchBoutiqueInfo]);

    const handleNotificationsClick = () => {
        if (unreadCount > 0) {
            markAllAsRead();
        }
        navigate('/notifications');
    };

    return (
        <header 
            className="bg-gradient-to-r from-white to-emerald-50/30 shadow-sm h-16 flex items-center px-6 sticky top-0 z-20 border-b border-emerald-100/60 backdrop-blur-sm"
            key={`header-${boutique?.hashid || 'loading'}`}
        >
            <motion.button
                onClick={toggleSidebar}
                className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-100/80 transition-all duration-300 md:hidden border border-transparent hover:border-emerald-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Menu className="h-6 w-6" />
            </motion.button>

            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent ml-3 md:ml-0">
                {title}
            </h1>

            <div className="ml-auto flex items-center space-x-4">
                <motion.button 
                    onClick={handleNotificationsClick}
                    className="p-2 rounded-full text-emerald-600 hover:bg-emerald-100/80 transition-all duration-300 relative border border-transparent hover:border-emerald-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full border border-white"/>
                    )}
                </motion.button>

                <Link to="/profil">
                    <motion.div 
                        className="flex items-center space-x-3 border-l pl-4 border-emerald-100"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        key={`header-profile-${boutique?.hashid || 'loading'}`}
                    >
                        <div className="relative">
                            {loading ? (
                                <div className="w-10 h-10 rounded-2xl bg-emerald-100 animate-pulse"></div>
                            ) : hasImage ? (
                                <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-lg">
                                    <img
                                        src={boutique.image_btq}
                                        alt={`Photo de ${nom}`}
                                        className="w-full h-full object-cover"
                                        key={boutique.image_btq}
                                    />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-semibold shadow-lg">
                                    {initiale}
                                </div>
                            )}
                            {!loading && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                                    <Store className="w-2 h-2 text-white" />
                                </div>
                            )}
                        </div>
                        
                        <div className="hidden md:block">
                            {loading ? (
                                <div className="space-y-1">
                                    <div className="h-4 bg-emerald-100 rounded w-20 animate-pulse"></div>
                                    <div className="h-3 bg-emerald-100 rounded w-16 animate-pulse"></div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm font-bold text-emerald-800" key={`header-name-${boutique?.nom_btq}`}>{nom}</p>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                        <p className="text-xs text-emerald-600 font-medium">Votre Boutique</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </Link>
            </div>

            <motion.div 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            />
        </header>
    );
};

export default DashboardHeader;