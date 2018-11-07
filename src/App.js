import React, {Component} from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import {POKEMON_TYPES} from "./tf/data";
import * as data from "./tf/data";
import embed from "vega-embed";
import {Table} from "./Table";
import pokemon from './pokemon'
import _ from "lodash";
import {getName} from "./tf/ui";
import ResultTable from "./ResultTable";
import pokemonImg from './pokemon.jpg';
import Tree from "./Tree";

class App extends Component {

    state = {
        modal: null,
        resultData: [],
        training: false,
        params: {
            epochs: 50,
            learningRate: 0.0005,
        },
        data: pokemon,

    };

    constructor(props) {

        super();
        this.run = this.run.bind(this);
        this.save = this.save.bind(this);
        this.load = this.load.bind(this);
        this.trainModel = this.trainModel.bind(this);
        this.prepModel = this.prepModel.bind(this);
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


    prepModel(xTrain) {

        if (this.state.model == null) {

            let model;
            model = tf.sequential();

            model.add(tf.layers.dense(
                {units: 256, activation: 'relu', inputShape: [xTrain.shape[1]]}));

            model.add(
                tf.layers.dense(
                    {units: 256, activation: 'relu'}
                )
            );

            model.add(tf.layers.dense({units: POKEMON_TYPES.length}));

            return {
                model,
                new: true,
            };

        }

        return {
            model: this.state.model,
            new: false,
        }

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
    async trainModel(xTrain, yTrain, xTest, yTest) {

        const {model} = this.prepModel(xTrain);
        model.summary();
        return await this.train(model, xTrain, yTrain, xTest, yTest);
    }


    async train(model, xTrain, yTrain, xTest, yTest) {

        const {params} = this.state;

        const optimizer = tf.train.adam(params.learningRate);
        const lossValues = [];


        for (let i = 0; i < params.epochs; i++) {
            const cost = optimizer.minimize(() => {
                const predictions = model.predict(xTrain);
                const loss = tf.losses.softmaxCrossEntropy(
                    yTrain.asType('float32'),
                    predictions.asType('float32')
                ).mean();
                return loss;
            }, true);

            const trainLoss = tf.losses.softmaxCrossEntropy(
                yTest.asType('float32'),
                model.predict(xTest).asType('float32')
            ).mean();

            App.plotLosses(lossValues, i, cost.dataSync(), trainLoss.dataSync());

            await tf.nextFrame();
        }

        return model;


    };

    /**
     * Plot new loss values.
     *
     * @param lossValues An `Array` of data to append to.
     * @param epoch Training epoch number.
     * @param newTrainLoss The new training loss, as a single `Number`.
     * @param newValidationLoss The new validation loss, as a single `Number`.
     */
    static plotLosses(lossValues, epoch, newTrainLoss, newValidationLoss) {
        lossValues.push({epoch, 'loss': newTrainLoss, 'set': 'train'});
        lossValues.push(
            {epoch, 'loss': newValidationLoss, 'set': 'validation'});
        embed(
            '#lossCanvas', {
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'data': {'values': lossValues},
                'mark': 'line',
                'encoding': {
                    'x': {'field': 'epoch', 'type': 'ordinal'},
                    'y': {'field': 'loss', 'type': 'quantitative'},
                    'color': {'field': 'set', 'type': 'nominal'}
                },
                'width': 500
            },
            {});
    }

    /**
     * Run inference on manually-input Iris flower data.
     *
     * @param this.state.model The instance of `tf.Model` to run the inference with.
     */




    async run() {


        const [xTrain, yTrain, xTest, yTest] = data.getPokemon(0.1);

        this.setState({
            ...this.state,
            training: true,
        }, async () => {

            const model = await this.trainModel(xTrain, yTrain, xTest, yTest);

            const resultData = this.evaluateModelOnTestData(model, xTest, yTest);

            this.setState({
                ...this.state,
                model,
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

            console.log('result', result);

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

    async load() {

        try {


            const loadedModel = await tf.loadModel('indexeddb://my-model-1');

            this.setState({model: loadedModel}, () => {


                window.alert('loaded');
            });

        } catch (e) {

            window.alert('Error loading model')
        }
    }


    render() {
        return (
            <div className={'container-fluid'}>

                <div className={'row'}>

                    <div className={'col-md-3'}>

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
                            <div className={'form-group'}>
                                <div className={'btn-group-sm'}>
                                    <button
                                        disabled={this.state.training}
                                        type={'button'} onClick={() => this.save()}
                                        className="btn btn-secondary"
                                        id="save-modal">save modal
                                    </button>
                                    <button
                                        disabled={this.state.training}
                                        type={'button'} onClick={() => this.load()}
                                        className="btn btn-secondary"
                                        id="load-btn">load modal
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="train-epochs">Train Epochs:</label>
                                <input

                                    onChange={e => this.setState({
                                        ...this.state,
                                        params: {...this.state.params, epochs: e.target.value}
                                    })}
                                    min={0}
                                    className="form-control"
                                    id="train-epochs"
                                    type="number" value={this.state.params.epochs}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="learning-rate">Learning Rate:</label>
                                <input
                                    onChange={e => this.setState({
                                        ...this.state,
                                        params: {...this.state.params, learningRate: e.target.value}
                                    })}

                                    className="form-control"
                                    id="learning-rate"
                                    type="number"
                                    value={this.state.params.learningRate}/>
                            </div>
                            <button
                                type={'submit'}
                                disabled={this.state.training}
                                className="btn btn-primary"
                                id="train-from-scratch"
                            >
                                Train model
                            </button>

                        </form>

                    </div>

                    <div className={'col-md-9'}>

                        <div className={'row p-3 m-3'}>
                            <div className="canvases" id="lossCanvas"></div>
                            <div className="canvases" id="accuracyCanvas"></div>
                        </div>
                        {0 < this.state.resultData.length && !this.state.training && <ResultTable
                            data={this.state.resultData}
                        />}




                    </div>
                </div>

            </div>
        );
    }
}

export default App;
