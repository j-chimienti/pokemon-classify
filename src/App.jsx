import React, {Component} from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';

import {
    PokemonTypeModel
} from "./tensorflow.model";
import pokemon from './pokemon'
import _ from "lodash";
import ResultTable from "./ResultTable";
import Predict from "./Predict";
import ModelStatus from "./ModelStatus";
import PredictionResults from "./PredictionResults";

window.tf = tf;


export function getName(_row) {

    const found = model.data.POKEMON_DATA.find(pokemon => {

        return pokemon[1] == _row[0] && pokemon[2] == _row[1]
    });

    if (found) {
        return found[0]
    }
    return 'n/a';
}


const samplePokemon = _.sample(pokemon);

const model = new PokemonTypeModel();

class App extends Component {

    state = {
        model: model,
        resultData: [],
        training: false,
        params: {
            ...model.params,
            ...samplePokemon
        },
        data: model.data.pokemon,
        predictedTypes: [],

    };

    constructor(props) {

        super();
        this.run = this.run.bind(this);
        this.save = this.save.bind(this);
        this.loadRandomPokemon = this.loadRandomPokemon.bind(this);
        this.load = this.load.bind(this);
        this.predict = this.predict.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async load() {

        try {
            const _model = await model.load();
            this.setState({
                ...this.state,
                model: {
                    ...this.state.model,
                    ...model,
                    model: _model.model,
                },
            }, () => console.log('loaded'))
        } catch (e) {

            alert(e);
        }
    }


    /**
     * Run inference on manually-input Iris flower data.
     *
     * @param this.state.model The instance of `tf.Model` to run the inference with.
     */

    async run() {
        model.createModel();
        this.setState({
            ...this.state,
            model: {
                ...this.state.model,
                ...model,
                model: model.model,
            },
            training: true,
            resultData: []
        }, async () => {
            await model.train(this.state.params);
            const resultData = model.evaluateModelOnTestData();
            this.setState({
                ...this.state,
                training: false,
                resultData,
            });
        })
    }


    async save() {

        try {

            return await model.save();
        } catch (e) {

            window.alert(e);
        }
    }

    handleChange({target: {value, name}}) {

        this.setState({
            ...this.state,
            params: {
                ...this.state.params,
                [name]: value
            }
        });
    }

    loadRandomPokemon() {


        const randPoke = _.sample(model.data.pokemon);

        this.setState({
            ...this.state,
            predictedTypes: [],
            params: {
                ...this.state.params,
                ...randPoke
            }
        })
    }

    predict() {

        if (!model.model) {

            window.alert('Load Model first');

            return false;
        }
        const predictedTypes = model.predict(this.state.params);

        this.setState({
            ...this.state,
            predictedTypes,
        })

    }


    render() {

        const {params, training, resultData, model: {model}, predictedTypes} = this.state;

        return (
            <div>

                <div className={'container-fluid'}>


                    <div className={'row'}>

                        <div className={'col-md-3'}>

                            <div className={'row'}>
                                <ModelStatus model={model}/>
                            </div>

                            <form
                                className={'my-3 py-3'}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    this.run();
                                }}
                            >
                                <h5>
                                    Model Parameters

                                </h5>

                                <div className="form-group">
                                    <label htmlFor="train-epochs">Train Epochs:</label>
                                    <input

                                        onChange={e => this.setState({
                                            ...this.state,
                                            params: {...params, epochs: e.target.value}
                                        })}
                                        min={0}
                                        step={1}
                                        className="form-control"
                                        id="train-epochs"
                                        type="number" value={params.epochs}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="learning-rate">Learning Rate:</label>
                                    <input
                                        onChange={e => this.setState({
                                            ...this.state,
                                            params: {...params, learningRate: e.target.value}
                                        })}

                                        className="form-control"
                                        id="learning-rate"
                                        type="number"
                                        value={params.learningRate}
                                        step={0.00001}
                                        min={0}
                                        max={1}
                                    />
                                </div>

                                <div className={'form-group'}>
                                    <button
                                        type={'submit'}
                                        disabled={training}
                                        className="btn btn-primary"
                                        id="train-from-scratch"
                                    >
                                        Train model
                                    </button>
                                </div>

                                <div className={'form-group'}>
                                    <div className={'btn-group-sm'}>
                                        <button
                                            disabled={!model || training}
                                            type={'button'}
                                            onClick={() => this.save()}
                                            className="btn btn-secondary"
                                            id="save-model">save model
                                        </button>
                                        <button
                                            disabled={training}
                                            type={'button'}
                                            onClick={() => this.load()}
                                            className="btn btn-secondary"
                                            id="load-btn">load model
                                        </button>
                                    </div>
                                </div>

                            </form>

                            {model && 'toJSON' in model && (
                                <form>
                                    <label>Model Info</label>
                                    <textarea
                                        readOnly={true}
                                        rows={5} className={'form-control'}
                                        value={model.toJSON()}
                                    >

            </textarea>
                                </form>
                            )}

                        </div>

                        <div className={'col-md-9'}>

                            <div className={'row'}>

                                <div className={'row p-3 m-3'}>
                                    <div className="canvases" id="lossCanvas"></div>
                                    <div className="canvases" id="accuracyCanvas"></div>
                                </div>
                                {0 < resultData.length && !training && <ResultTable
                                    data={resultData}
                                />}

                                {!training && model && (
                                    <div className={'row'}>
                                        <div className={'col-sm-6'}>
                                            <Predict
                                                modelLoaded={Boolean(model)}
                                                loadRandomPokemon={this.loadRandomPokemon}
                                                handleChange={this.handleChange} params={params}
                                                predict={this.predict}/>
                                        </div>
                                        <div className={'col-sm-6'}>
                                            <PredictionResults
                                                pokemonType={params.Type || "none"}
                                                predictions={predictedTypes}/>
                                        </div>
                                    </div>
                                )
                                }


                            </div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}

export default App;
