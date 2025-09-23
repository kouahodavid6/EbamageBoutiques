import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const CartesRaisons = ({ icon: Icon, title, description }) => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {title}
            </h3>
            <p className="text-gray-600">
                {description}
            </p>
        </div>
    );
};

CartesRaisons.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default CartesRaisons;
