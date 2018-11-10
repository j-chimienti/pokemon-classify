import React from 'react';
import PropTypes from 'prop-types';

function Header(props) {
    return (
        <div>
            <h1>Tensorflow.js Classification</h1>
            <p>
                Train a model to predict pokemon types from their stats.
            </p>

            <h3 className={'section-title'}>
                Description
            </h3>

            <p>
                This example showcases how to use Tensorflow.js to perform
                simple classification.

            </p>

            <p>
                Through training on test data, the model will learn to predict
                pokemon types from their stats
            </p>

            <h3 className={'section-title'}>
                Instructions
            </h3>

            <ul>
                <li>
                    Train new model by clicking train model (or load local model if saved)
                </li>
                <li>
                    Note that while the model is training it periodically saves a copy of itself to local browser
                    storage, this mean you can refresh the page and continue training from the last save point. If at
                    any point you want to start training from scratch, click "Delete stored Model".
                </li>
                <li>
                    Once the model has finished training you can click "Predict" to see the results of the predictions
                </li>
            </ul>
        </div>
    );
}

Header.propTypes = {};
Header.defaultProps = {};

export default Header;
