import PropTypes from 'prop-types';
import { Star, Quote, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const CartesTemoignages = ({ name, role, testimonial, avatar }) => (
    <motion.div 
        className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 hover:border-emerald-200 transition-all duration-500 h-full flex flex-col relative overflow-hidden"
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
        {/* Effet de fond écologique */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50/30 rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
        
        {/* Icône de citation */}
        <div className="absolute top-4 left-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <Quote className="w-16 h-16 text-emerald-400" />
        </div>

        <div className="relative z-10">
            {/* Note étoiles avec style vert */}
            <div className="flex justify-start mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={18} 
                        className="text-emerald-400 fill-current drop-shadow-sm" 
                    />
                ))}
                <div className="ml-2 flex items-center">
                    <Leaf className="w-4 h-4 text-emerald-500 ml-1" />
                    <span className="text-xs font-medium text-emerald-600 ml-1">Éco</span>
                </div>
            </div>

            {/* Témoignage */}
            <p className="text-emerald-800/90 text-start leading-relaxed mb-6 flex-grow relative">
                <Quote className="w-6 h-6 text-emerald-300 absolute -left-1 -top-1 opacity-70" />
                <span className="pl-4">{testimonial}</span>
            </p>

            {/* Profil */}
            <div className="flex items-center">
                <div className="relative">
                    <img 
                        src={avatar} 
                        alt={name}
                        className="w-14 h-14 rounded-2xl object-cover mr-4 border-2 border-emerald-100 group-hover:border-emerald-200 transition-colors duration-300 shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Leaf className="w-3 h-3 text-white" />
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-emerald-900 group-hover:text-emerald-800 transition-colors duration-300">
                        {name}
                    </h4>
                    <p className="text-emerald-600/80 text-sm font-medium">{role}</p>
                    <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-1"></div>
                        <span className="text-xs text-emerald-500">Membre vérifié</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Ligne décorative en bas */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-300 to-green-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </motion.div>
);

CartesTemoignages.propTypes = {
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    testimonial: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
};

export default CartesTemoignages;