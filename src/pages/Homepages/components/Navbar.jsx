import { Link } from "react-router-dom";
import { Store, LogIn, X, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200/60 sticky top-0 z-50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-400/20 rounded-xl transform group-hover:scale-110 transition-transform duration-300"></div>
                                <Store className="w-8 h-8 text-emerald-600 relative z-10" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                                Ebamage
                            </span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link 
                            to="/connexionBoutique" 
                            className="border border-emerald-300 text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-emerald-100"
                        >
                            Connexion
                        </Link>
                        <Link 
                            to="/inscriptionBoutique"
                            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 transform hover:-translate-y-0.5"
                        >
                            Créer ma boutique
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-emerald-600 hover:bg-emerald-100/80 transition-all duration-300 border border-transparent hover:border-emerald-200"
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
                <div className="md:hidden bg-gradient-to-b from-emerald-50/95 to-green-50/95 backdrop-blur-md border-t border-emerald-200/60">
                    <div className="px-4 pt-3 pb-4 space-y-2">
                        <Link 
                            to="/connexionBoutique" 
                            className="flex items-center px-4 py-3 rounded-xl text-emerald-700 text-base font-semibold bg-white/80 border border-emerald-100 hover:bg-white hover:border-emerald-200 transition-all duration-300 shadow-sm"
                            onClick={toggleMenu}
                        >
                            <LogIn className="mr-3 h-5 w-5 text-emerald-500" />
                            Connexion
                        </Link>
                        <Link 
                            to="/inscriptionBoutique" 
                            className="flex items-center px-4 py-3 rounded-xl text-white text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg"
                            onClick={toggleMenu}
                        >
                            <Store className="mr-3 h-5 w-5" />
                            Créer ma boutique
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;