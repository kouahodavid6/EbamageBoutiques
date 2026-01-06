import { Store, FileText, Phone, Mail, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-white py-12 relative overflow-hidden">
      {/* Effet de texture subtile */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-">
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
              La plateforme e-commerce qui facilite la vente et l'achat d'articles en toute sécurité
            </p>
            
            {/* Bouton Support PDF */}
            <a
              href="/pdf/SupportPDF.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-white bg-transparent hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <FileText className="h-6 w-6" />
              Support PDF
            </a>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-200">Nous contacter</h3>
            <div className="space-y-3 text-emerald-100/80">
              <div className="flex items-center group">
                <div className="bg-emerald-500/20 p-2 rounded-lg mr-3 group-hover:bg-emerald-500/30 transition-all duration-300">
                  <Phone className="h-4 w-4 text-emerald-300" />
                </div>
                <span 
                  className="text-sm hover:text-emerald-100 transition-colors hover:underline cursor-pointer"
                  onClick={() => window.open('https://wa.me/2250779863190')}
                >
                  +225 07 79 86 31 90
                </span>
              </div>
              <div className="flex items-center group">
                <div className="bg-emerald-500/20 p-2 rounded-lg mr-3 group-hover:bg-emerald-500/30 transition-all duration-300">
                  <Mail className="h-4 w-4 text-emerald-300" />
                </div>
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=ebamage.ci@gmail.com&su=Contact&body=Bonjour"
                  target="_blank"
                  className="text-sm hover:text-emerald-100 transition-colors hover:underline"
                >
                  ebamage.ci@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-emerald-700/50 mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-emerald-200/80">
              💻 Développé avec le <Heart className="inline w-4 h-4 text-emerald-400 mx-1" /> par {' '}
              <span 
                className="text-emerald-300 hover:text-emerald-200 underline transition-colors cursor-pointer"
                onClick={() => window.open('https://devs-trop-doux-recup.vercel.app/', '_blank')}
              >
                  Équipe Dev
              </span>
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