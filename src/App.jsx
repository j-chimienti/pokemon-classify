import React, {Component} from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';

import {createModel, getPokemon, plotLosses, POKEMON_DATA, POKEMON_TYPES} from "./tensorflow.model";
import embed from "vega-embed";
import pokemon from './pokemon'
import _ from "lodash";
import ResultTable from "./ResultTable";
import Predict from "./Predict";
import ModelStatus from "./ModelStatus";
import PredictionResults from "./PredictionResults";
import {Link} from "react-router-dom";
import pokemonImg from "./pokemon.jpg";
import AppRouter from "./Router";

window.tf = tf;


export function getName(_row) {

    const found = POKEMON_DATA.find(pokemon => {

        return pokemon[1] == _row[0] && pokemon[2] == _row[1]
    });

    if (found) {
        return found[0]
    }
    return 'n/a';
}


const samplePokemon = _.sample(pokemon);


class App extends Component {


    state = {
        model: null,
        resultData: [],
        training: false,
        params: {
            epochs: 50,
            learningRate: 0.0005,
            ...samplePokemon

        },
        data: pokemon,
        predictedTypes: [],

    };

    constructor(props) {

        super();
        this.run = this.run.bind(this);
        this.save = this.save.bind(this);
        this.loadRandomPokemon = this.loadRandomPokemon.bind(this);
        this.createModelIfNeeded = this.createModelIfNeeded.bind(this);
        this.load = this.load.bind(this);
        this.train = this.train.bind(this);
        this.predict = this.predict.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.trainModel = this.trainModel.bind(this);
        this.evaluateModelOnTestData = this.evaluateModelOnTestData.bind(this);
    }

    componentDidMount() {

    }

    /**
     * Plot new accuracy values.
     *
     * @param lossValues An `Array` of data to append to.
     * @param epoch Training epoch number.
     * @param newTrainLoss The new training accuracy, as a single `Number`.
     * @param newValidationLoss The new validation accuracy, as a single `Number`.
     */
    static plotAccuracies(
        accuracyValues, epoch, newTrainAccuracy, newValidationAccuracy) {
        accuracyValues.push(
            {epoch, 'accuracy': newTrainAccuracy, 'set': 'train'});
        accuracyValues.push(
            {epoch, 'accuracy': newValidationAccuracy, 'set': 'validation'});
        embed(
            '#accuracyCanvas', {
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'data': {'values': accuracyValues},
                'mark': 'line',
                'encoding': {
                    'x': {'field': 'epoch', 'type': 'ordinal'},
                    'y': {'field': 'accuracy', 'type': 'quantitative'},
                    'color': {'field': 'set', 'type': 'nominal'}
                },
                'width': 500
            },
            {});
    }


    /**
     * Train a `tf.Model` to recognize Iris flower type.
     *
     * @param xTrain Training feature data, a `tf.Tensor` of shape
     *   [numTrainExamples, 4]. The second dimension include the features
     *   petal length, petalwidth, sepal length and sepal width.
     * @param yTrain One-hot training labels, a `tf.Tensor` of shape
     *   [numTrainExamples, 3].
     * @param xTest Test feature data, a `tf.Tensor` of shape [numTestExamples, 4].
     * @param yTest One-hot test labels, a `tf.Tensor` of shape
     *   [numTestExamples, 3].
     * @returns The trained `tf.Model` instance.
     */
    async trainModel(model, xTrain, yTrain, xTest, yTest) {


        return await this.train(model, xTrain, yTrain, xTest, yTest);
    }

    createModelIfNeeded(xTrain) {

        let {model} = this.state;
        if (!model) {

            model = createModel(xTrain);

        }

        model.summary();

        return model;


    }


    /**
     * Run inference on manually-input Iris flower data.
     *
     * @param this.state.model The instance of `tf.Model` to run the inference with.
     */




    async run() {


        const [xTrain, yTrain, xTest, yTest] = getPokemon(0.1);

        const model = this.createModelIfNeeded(xTrain);

        this.setState({
            ...this.state,
            model,
            training: true,
            resultData: []
        }, async () => {


            const _model = await this.trainModel(model, xTrain, yTrain, xTest, yTest);

            window.model = _model;

            window.xTest = xTest;
            window.yTest = yTest;

            const resultData = this.evaluateModelOnTestData(_model, xTest, yTest);

            this.setState({
                ...this.state,
                model: _model,
                training: false,
                resultData,
            });
        })
    }


    renderEvaluateTable(xData, yTrue, yPred, logits) {

        const rows = _.chunk(xData, 7);

        const data = [];

        for (let i = 0; i < rows.length; i++) {

            const row = rows[i];

            const name = getName(row);

            const type = POKEMON_TYPES[yTrue[i]];

            const pred = POKEMON_TYPES[yPred[i]];
            const exampleLogits = logits.slice(i * POKEMON_TYPES.length, (i + 1) * POKEMON_TYPES.length);

            const top5 = tf.topk(exampleLogits, 5);
            const _data = top5.indices.dataSync();

            const types = Array.from(_data).map(item => POKEMON_TYPES[item]);

            const strings = types.join(', ');

            const span = strings;

            data.push({
                name,
                type,
                pred,
                span,
                types,
                _data,
            })

        }
        return {
            data,
        }

    }


    evaluateModelOnTestData(model, xTest, yTest) {

        return tf.tidy(() => {
            const xData = xTest.dataSync();
            const yTrue = yTest.argMax(-1).dataSync();
            const predictOut = model.predict(xTest);
            const yPred = predictOut.argMax(-1);

            const logits = predictOut.dataSync();


            const result = this.renderEvaluateTable(
                xData, yTrue, yPred.dataSync(), logits);


            const resultData = result.data.map(d => {

                const foundP = this.state.data.find(_d => _d.Name === d.name);

                if (foundP) {

                    return Object.assign({}, foundP, d);

                }

                return d;
            });

            return resultData;

            // calculateAndDrawConfusionMatrix(model, xTest, yTest);
        });


        // await predictOnManualInput(model);
    }


    async save() {


        try {

            // localstorage

            if (this.state.model == null) {

                throw new Error('Invalid Request');
            }
            const saveResults = await this.state.model.save(`indexeddb://my-model-1`);

            window.alert('saved');
        } catch (e) {

            console.error(e);

            window.alert("Error Saving Model")
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


        const randPoke = _.sample(pokemon);

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

        const {model, params: {Total, HP, Attack, Defense, Speed, Sp_Atk, Sp_Def}} = this.state;


        if (!model) {

            window.alert('Load Model first');

            return false;
        }
        const _arr = [Total, HP, Attack, Defense, Speed, Sp_Atk, Sp_Def];

        const tensor = tf.tensor2d(_arr, [1, 7], 'float32');
        const prediction = model.predict(tensor);

        const top5 = tf.topk(prediction, 5);
        const _data = top5.indices.dataSync();
        const types = Array.from(_data).map(item => POKEMON_TYPES[item]);

        this.setState({
            ...this.state,
            predictedTypes: types,
        });
    }


    /*
    bad results
     */
    async _train(model, xTrain, yTrain, xTest, yTest) {

        const {params} = this.state;

        const optimizer = tf.train.adam(params.learningRate);
        model.compile({
            optimizer: optimizer,
            loss: 'categoricalCrossentropy',
            metrics: ['accuracy'],
        });

        const lossValues = [];
        const accuracyValues = [];
        // Call `model.fit` to train the model.
        return await model.fit(xTrain, yTrain, {
            epochs: params.epochs,
            validationData: [xTest, yTest],
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    // Plot the loss and accuracy values at the end of every training epoch.
                    plotLosses(lossValues, epoch, logs.loss, logs.val_loss);
                    App.plotAccuracies(accuracyValues, epoch, logs.acc, logs.val_acc);
                },
            }
        });


    }


    async train(model, xTrain, yTrain, xTest, yTest) {

        const {params} = this.state;

        const optimizer = tf.train.adam(params.learningRate);
        const lossValues = [];

        const returnCost = true;


        for (let i = 0; i < params.epochs; i++) {
            const cost = optimizer.minimize(() => {
                const predictions = model.predict(xTrain);
                return tf.losses.softmaxCrossEntropy(
                    yTrain.asType('float32'),
                    predictions.asType('float32')
                ).mean();
            }, returnCost);

            const trainLoss = tf.losses.softmaxCrossEntropy(
                yTest.asType('float32'),
                model.predict(xTest).asType('float32')
            ).mean();

            plotLosses(lossValues, i, cost.dataSync(), trainLoss.dataSync());

            await tf.nextFrame();
        }

        return model;


    };


    async load() {

        try {


            const loadedModel = await tf.loadModel('indexeddb://my-model-1');

            this.setState({model: loadedModel});

        } catch (e) {

            window.alert('Error loading model')
        }
    }


    render() {

        const {params, training, resultData, model, predictedTypes} = this.state;

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
