import { Store, Phone, Mail, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Link to="/" className="flex items-center space-x-2">
                <Store className="w-8 h-8 text-pink-500" />
                <span className="font-bold text-xl">TDL</span>
              </Link>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              La plateforme e-commerce dédiée aux petits commerçants
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-pink-400 mr-2" />
                <a
                  href="#"
                  className="text-sm hover:text-white transition-colors">
                  +225 01 01 01 01 01
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-pink-400 mr-2" />
                <a
                  href="#"
                  className="text-sm hover:text-white transition-colors">
                  trucdelate@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-pink-400 mr-2" />
                <a
                  href="#"
                  className="text-sm hover:text-white transition-colors">
                  www.tdl.org
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  CGU
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p className="text-sm text-white">
            {/* 💻 Développé par <a href="https://lien-du-portfolio.com" className="text-pink-400 hover:underline">Kouaho Ekissi David Emmanuel</a> */}
          </p>
          <p>© {new Date().getFullYear()} TDL. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
