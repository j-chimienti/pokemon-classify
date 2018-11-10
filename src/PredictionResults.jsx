import React from 'react';
import PropTypes from 'prop-types';

function PredictionResults({predictions = [], pokemonType}) {

    if (!predictions.length) {

        return null;
    }
    return (
        <div className={'my-2'}
        >
            <h4>Predicted Types</h4>
            <ol className={'list-group'}>
                {predictions.map((prediction, i) => {

                    const type = pokemonType.split('\n')[0];

                    const same = type === prediction;

                    return (
                        <li key={prediction}
                            className={same ? 'list-group-item active' : 'list-group-item'}
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
