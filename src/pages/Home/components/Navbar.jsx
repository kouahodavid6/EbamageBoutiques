import { Link } from "react-router-dom";
import { Store, LogIn, X, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="flex items-center space-x-2"
                        >
                            <Store className="w-8 h-8 text-pink-500" />
                            <span className="text-2xl font-bold text-gray-800">TrucDeLaTe</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link 
                            to="/connexionBoutique" 
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium  hover:bg-gray-600 transition"
                        >
                            Connexion
                        </Link>
                        <Link 
                            to="/inscriptionBoutique"
                            className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium  hover:bg-pink-600 transition"
                        >
                            Créer ma boutique
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-pink-800 transition"
                            aria-label="Menu"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        
            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link 
                            to="/connexionBoutique" 
                            className="block px-3 py-2 rounded-md text-white text-base font-medium bg-gray-500 hover:bg-gray-800 transition"
                            onClick={toggleMenu}
                        >
                            <div className="flex items-center">
                                <LogIn className="mr-2 h-5 w-5" />
                                Connexion
                            </div>
                        </Link>
                        <Link 
                            to="/inscriptionBoutique" 
                            className="block px-3 py-2 rounded-md text-white text-base font-medium bg-pink-500 hover:bg-pink-800 transition"
                            onClick={toggleMenu}
                        >
                            <div className="flex items-center">
                                <Store className="mr-2 h-5 w-5" />
                                Créer ma boutique
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;