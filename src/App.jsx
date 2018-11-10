import React, {Component} from 'react';
import './App.css';
import {sample} from "lodash";
import ResultTable from "./ResultTable";
import Predict from "./Predict";
import ModelStatus from "./ModelStatus";
import PredictionResults from "./PredictionResults";


import {PokemonTypeModel} from "./pokemonModel";
import Header from "./Header";

let model;

class App extends Component {

    constructor(props) {

        super();
        this.run = this.run.bind(this);
        this.save = this.save.bind(this);
        this.predictTestData = this.predictTestData.bind(this);
        this.loadRandomPokemon = this.loadRandomPokemon.bind(this);
        this.load = this.load.bind(this);
        this.predict = this.predict.bind(this);
        this.handleChange = this.handleChange.bind(this);


        model = new PokemonTypeModel();
        const samplePokemon = sample(model.data.pokemon);
        this.state = {
            resultData: [],
            training: false,
            predictedTypes: [],
            params: {
                ...model.params,
                ...samplePokemon
            }

        };

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
            })
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


    async predictTestData() {

        model.generateNewData();
        const resultData = model.evaluateModelOnTestData();

        this.setState({
            ...this.state,
            resultData
        })
    }


    async save() {

        try {

            await model.save();

            window.alert('model saved');

            return true;
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


        const randPoke = sample(model.data.pokemon);

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

        const {params, training, resultData, predictedTypes} = this.state;

        const correctPredictions = resultData.filter(d => d.pred === d.type).length;
        const top5Pred = resultData.filter(({types, type}) => types.includes(type)).length;
        const predictions = resultData.length;

        const correctPredictionsPercent = Math.floor((correctPredictions / predictions) * 100);
        const top5PredictionsPercent = Math.floor((top5Pred / predictions) * 100);

        return (
            <div className={'container'}>
                <Header/>

                <div className={'row'}>

                    <div className={'col-xs-6'}>
                        <div className={'row'}>
                            <button
                                disabled={!model.model || training}
                                type={'button'}
                                onClick={() => this.save()}
                                className="btn btn-secondary m-2"
                                id="save-model">save model
                            </button>
                            <button
                                disabled={training}
                                type={'button'}
                                onClick={() => this.load()}
                                className="btn btn-secondary m-2"
                                id="load-btn">load model
                            </button>
                        </div>
                        <div className={'row'}>
                            <form
                                className={'col-xs-6 my-3 py-3'}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    this.run();
                                }}
                            >
                                <h3 className={'section-title'}>
                                    Training Parameters

                                </h3>


                                <div className="form-group">
                                    <label htmlFor="train-epochs">Train Epochs:</label>
                                    <input

                                        onChange={e => this.setState({
                                            ...this.state,
                                            params: {...params, epochs: e.target.value}
                                        })}
                                        min={0}
                                        step={1}
                                        className="form-control-sm form-number"
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

                                        width={200}
                                        className="form-control-sm form-number"
                                        id="learning-rate"
                                        type="number"
                                        value={params.learningRate}
                                        step={0.00001}
                                        min={0}
                                        max={1}
                                    />
                                </div>

                                <div className={'row py-3'}>
                                    <button
                                        type={'submit'}
                                        disabled={training}
                                        className="btn btn-primary m-2"
                                        id="train-from-scratch"
                                    >
                                        Train
                                    </button>
                                    <button type={'button'} className={'btn btn-primary m-2'}
                                            onClick={() => {

                                                this.predictTestData();
                                            }}
                                            disabled={!model.model}
                                    >
                                        Test
                                    </button>
                                </div>


                            </form>


                        </div>

                    </div>
                    <div className={'col-xs-6'}>
                        <div className="canvases" id="lossCanvas"></div>
                        <div className="canvases" id="accuracyCanvas"></div>
                    </div>

                </div>

                <h3 className={'section-title'}>
                    Results

                </h3>
                {!isNaN(correctPredictions) && !isNaN(top5PredictionsPercent) && <div className={'row m-2'}>
                    <h5 className={'float-right'}>
                        Correct
                        <span className={'badge badge-secondary m-1 mono'}>
                                {correctPredictionsPercent + '%'}
                            </span>
                        Top 5
                        <span className={'badge badge-secondary m-1 mono'}>
                                 {top5PredictionsPercent + '%'}
                            </span>
                    </h5>
                </div>
                }
                {0 < resultData.length && !training && <ResultTable
                    data={resultData}
                />}

                {!training && model.model && (
                    <div>
                        <h3 className={'section-title'}>Predict Pokemon Type</h3>
                        <div className={'row'}>
                            <div className={'col m-1'}>
                                <Predict
                                    predictTestData={this.predictTestData}
                                    modelLoaded={Boolean(model.model)}
                                    loadRandomPokemon={this.loadRandomPokemon}
                                    handleChange={this.handleChange} params={params}
                                    predict={this.predict}/>

                            </div>
                            <div className={'col m-1'}>
                                <PredictionResults
                                    pokemonType={params.Type || "none"}
                                    predictions={predictedTypes}/>
                            </div>
                        </div>
                    </div>
                )
                }


            </div>
        );
    }
}

export default App;
