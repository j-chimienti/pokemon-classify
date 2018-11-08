import React from 'react';
import PropTypes from 'prop-types';
import Tree from "./Tree";


function About(props) {
    return (
        <div className={'container'}>
            <h2>About</h2>

            <div className={'row'}>
                <div className={'row'}>
                    <div>
                        <div>
                            Sequential model with 3 fully connected layers
                            <ol>
                                <li>
                                    <b>
                                        First Layer

                                    </b>

                                    <ul>
                                        <li>
                                            Input data: 18 units
                                        </li>
                                        <li>
                                            Units: 256

                                        </li>
                                        <li>
                                            Activation: Relu
                                        </li>
                                    </ul>

                                </li>
                                <li>

                                    <b>
                                        Second Layer
                                    </b>
                                    <ul>
                                        <li>
                                            Units: 256

                                        </li>
                                        <li>
                                            Activation: Relu
                                        </li>
                                    </ul>

                                </li>
                                <li>

                                    <b>
                                        Third layer
                                    </b>
                                    <ul>
                                        <li>
                                            Units: 18
                                            <small>
                                                {' reduced to 18 pokemon types'}
                                            </small>

                                        </li>
                                        <li>
                                            Activation: none
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </div>

                    <Tree/>
                </div>
            </div>

        </div>
    );
}

About.propTypes = {};
About.defaultProps = {};

export default About;
