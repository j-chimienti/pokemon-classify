import React from 'react';
import PropTypes from 'prop-types';

function PredictionResults({predictions = [], pokemonType}) {

    if (!predictions.length) {

        return null;
    }
    return (
        <div
        >
            <h4>Predicted Types</h4>
            <ol className={'list-group'}>
                {predictions.map((prediction, i) => {

                    return (
                        <li key={prediction}
                            className={pokemonType == prediction ? 'list-group-item active' : 'list-group-item'}
                        >
                            {prediction}
                        </li>
                    )
                })}
            </ol>
        </div>
    );
}

PredictionResults.propTypes = {
    predictions: PropTypes.array.isRequired,
    pokemonType: PropTypes.string.isRequired,
};
PredictionResults.defaultProps = {};

export default PredictionResults;
