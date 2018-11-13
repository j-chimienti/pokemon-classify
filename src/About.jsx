import React from 'react';
import PropTypes from 'prop-types';

import test from './MacBook.svg';
import ModelGraphic from "./ModelGraphic";

function About(props) {
    return (
        <div className={'container'}>
            <h2>About</h2>


            <div className={'row'}>

                {/*<ModelGraphic/>*/}

                <div className={'col-sm-6'}>
                    <h5>Sequential Model</h5>
                    <ol>
                        <li>
                            <b>
                                Input Layer (pokemon)

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
                                Hidden Layer
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
                                Output layer
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

                <div className={'col-sm-6'}>
                    <img src={test} className={'img-fluid'}/>
                </div>


            </div>
        </div>
    );
}

About.propTypes = {};
About.defaultProps = {};

export default About;
