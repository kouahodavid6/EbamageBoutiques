import { Store, Phone, Mail, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-white py-12 relative overflow-hidden">
      {/* Effet de texture subtile */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/30 rounded-xl transform group-hover:scale-110 transition-transform duration-300"></div>
                  <Store className="w-8 h-8 text-emerald-300 relative z-10" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-emerald-200 to-green-100 bg-clip-text text-transparent">
                  Ebamage
                </span>
              </Link>
            </div>
            <p className="text-sm text-emerald-100/80 mb-4 leading-relaxed">
              La plateforme e-commerce dédiée aux petits commerçants pour une croissance verte et durable
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Nous contacter</h3>
            <div className="space-y-3 text-emerald-100/80">
              <div className="flex items-center group">
                <div className="bg-emerald-500/20 p-2 rounded-lg mr-3 group-hover:bg-emerald-500/30 transition-all duration-300">
                  <Phone className="h-4 w-4 text-emerald-300" />
                </div>
                <a href="#" className="text-sm hover:text-emerald-100 transition-colors hover:underline">
                  +225 01 01 01 01 01
                </a>
              </div>
              <div className="flex items-center group">
                <div className="bg-emerald-500/20 p-2 rounded-lg mr-3 group-hover:bg-emerald-500/30 transition-all duration-300">
                  <Mail className="h-4 w-4 text-emerald-300" />
                </div>
                <a href="#" className="text-sm hover:text-emerald-100 transition-colors hover:underline">
                  contact@ebamage.com
                </a>
              </div>
              <div className="flex items-center group">
                <div className="bg-emerald-500/20 p-2 rounded-lg mr-3 group-hover:bg-emerald-500/30 transition-all duration-300">
                  <Globe className="h-4 w-4 text-emerald-300" />
                </div>
                <a href="#" className="text-sm hover:text-emerald-100 transition-colors hover:underline">
                  www.ebamage.com
                </a>
              </div>
            </div>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Légal</h3>
            <ul className="space-y-3 text-emerald-100/80">
              <li>
                <a href="#" className="hover:text-emerald-100 transition-colors hover:underline block py-1">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-100 transition-colors hover:underline block py-1">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-100 transition-colors hover:underline block py-1">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Support</h3>
            <ul className="space-y-3 text-emerald-100/80">
              <li>
                <a href="#" className="hover:text-emerald-100 transition-colors hover:underline block py-1">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-100 transition-colors hover:underline block py-1">
                  Contact support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-100 transition-colors hover:underline block py-1">
                  Guides pratiques
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-emerald-700/50 mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-emerald-200/80">
              💻 Développé avec <Heart className="inline w-4 h-4 text-emerald-400 mx-1" /> par <a href="https://easy-portfolio.vercel.app/" className="text-emerald-300 hover:text-emerald-200 underline transition-colors">Kouaho Ekissi David Emmanuel</a>
            </p>
            <p className="text-sm text-emerald-200/80">
              © {new Date().getFullYear()} Ebamage. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;