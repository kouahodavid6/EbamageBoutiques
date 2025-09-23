import PropTypes from 'prop-types';

const Card = ({children}) => {
    return(
        <div className="grid md:grid-cols-3 gap-8">
            { children }
        </div>
    );
}

Card.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Card;