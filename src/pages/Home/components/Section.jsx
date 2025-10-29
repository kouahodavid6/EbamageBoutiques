import PropTypes from 'prop-types';

const Section = ({ children, className}) => {
    return(
        <section className={`py-20 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                { children }
            </div>
        </section>
    );
}

Section.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
};

export default Section;