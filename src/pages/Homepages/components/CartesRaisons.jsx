import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// eslint-disable-next-line no-unused-vars
const CartesRaisons = ({ icon: Icon, title, description }) => {
    return (
        <motion.div 
            className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-all duration-500 hover:bg-white relative overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Effet de fond au hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Ligne décorative en haut */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            
            <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-emerald-200 group-hover:to-green-200 transition-all duration-300 shadow-sm">
                    <Icon className="w-8 h-8 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-emerald-900 mb-4 group-hover:text-emerald-800 transition-colors duration-300">
                    {title}
                </h3>
                
                <p className="text-emerald-700/80 leading-relaxed group-hover:text-emerald-700 transition-colors duration-300">
                    {description}
                </p>
                
                {/* Indicateur de hover */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                </div>
            </div>
        </motion.div>
    );
};

CartesRaisons.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default CartesRaisons;