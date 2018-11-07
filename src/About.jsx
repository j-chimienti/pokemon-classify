import React from 'react';
import PropTypes from 'prop-types';
import Tree from "./Tree";
import * as tf from "@tensorflow/tfjs";
import {POKEMON_TYPES} from "./tf/data";


function About(props) {
    return (
        <div className={'container-fluid'}>
            <h2>About</h2>

            <Tree/>

            <p>
                <code>
                    {`model = tf.sequential();`}
                </code>
            </p>

            <p>
                The model is a sequential model with each layer
                being stacked onto each other
            </p>
            <p>
                <code>
                    {`model.add(tf.layers.dense(
                        {units: 256, activation: 'relu', inputShape: [18]}
                    ));`}
                </code>
            </p>
            <p>
                The first layer is the input data, with shape of 18 parameters, and
                expanded into 256 units
            </p>

            <p>
                <code>
                    {
                        `model.add(tf.layers.dense({units: 256, activation: 'relu'}))`
                    }
                </code>
            </p>

            <p>
                The second layer has same units as first
            </p>

            <p>
                <code>
                    {`model.add(tf.layers.dense({units: 18}));`}
                </code>
            </p>

            <p>
                Last layer is paired down to 18 units so we can guess the pokemon class.
            </p>

            <h4>Model Training</h4>

            <p>
                <code>
                    {`
                        const cost = optimizer.minimize(() => {\n
                        const predictions = model.predict(xTrain);\n
                        const loss = tf.losses.softmaxCrossEntropy(\n
                            yTrain.asType('float32'),\n
                            predictions.asType('float32')\n
                        ).mean();\n
                        return loss;\n
                    }, true);`}
                </code>
            </p>


        </div>
    );
}

About.propTypes = {};
About.defaultProps = {};

export default About;
