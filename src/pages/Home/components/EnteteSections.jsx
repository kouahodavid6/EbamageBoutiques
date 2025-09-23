import PropTypes from 'prop-types';

const EnteteSections = ({ title, text}) => {
    return(
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                { title }
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                { text }
            </p>
        </div>
    );
}

EnteteSections.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

export default EnteteSections;