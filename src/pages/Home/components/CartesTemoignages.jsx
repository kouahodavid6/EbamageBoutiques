import PropTypes from 'prop-types';
import { Star } from 'lucide-react';

const CartesTemoignages = ({ name, role, testimonial, avatar }) => (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="flex justify-start mb-2">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-current" />
            ))}
        </div>

        <p className="text-gray-600 text-start italic mb-4 flex-grow">"{testimonial}"</p>

        <div className="flex items-center mb-4">
            <img 
                src={avatar} 
                alt={name}
                className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
                <h4 className="font-bold text-gray-900">{name}</h4>
                <p className="text-gray-600 text-sm">{role}</p>
            </div>
        </div>
    </div>
);

CartesTemoignages.propTypes = {
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    testimonial: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
};

export default CartesTemoignages;