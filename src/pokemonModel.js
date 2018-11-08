/* eslint-disable arrow-parens */
import embed from "vega-embed";
import _ from "lodash";
import {getName} from "./App";

const tf = require('@tensorflow/tfjs');
const _uniq = require('lodash.uniq');
const pokemond = require('./pokemon');

const POKEMON_DATA = pokemond.map(mapJsonToArray);

const POKEMON_TYPES = _uniq(POKEMON_DATA.map(item => item[8]));

function mapJsonToArray(p) {


    const {Name, Type, Total, HP, Attack, Defense, Speed, Sp_Atk, Sp_Def} = p;

    const type = Type.split('\n')[0];

    return [
        Name,
        Total,
        HP,
        Attack,
        Defense,
        Sp_Def,
        Sp_Atk,
        Speed,
        type,
    ]


}

class PokemonData {


    constructor(testSplit = 0.1) {

        this.pokemon = pokemond;
        this.POKEMON_DATA = POKEMON_DATA;
        this.POKEMON_TYPES = POKEMON_TYPES;

        const [xTrain, yTrain, xTest, yTest] = this.getPokemon(testSplit);

        this.xTrain = xTrain;
        this.yTrain = yTrain;
        this.xTest = xTest;
        this.yTest = yTest;
    }

    getPokemon(testSplit = 0.2) {


        return tf.tidy(() => {
            const dataByClass = [];
            const targetsByClass = [];
            for (let i = 0; i < POKEMON_TYPES.length; ++i) {
                dataByClass.push([]);
                targetsByClass.push([]);
            }

            // const {dataset} = utils.normalizeDataset(POKEMON_DATA.map(i => i.slice(1, -1)), true, [], []);


            for (let i = 0; i < POKEMON_DATA.length; i++) {
                const example = POKEMON_DATA[i];
                const target = example[example.length - 1];
                const data = POKEMON_DATA.map(i => i.slice(1, -1));
                const idx = POKEMON_TYPES.findIndex(type => type === target);
                dataByClass[idx].push(data[i]);
                targetsByClass[idx].push(idx);
            }

            const xTrains = [];
            const yTrains = [];
            const xTests = [];
            const yTests = [];


            for (let i = 0; i < POKEMON_TYPES.length; ++i) {
                const [xTrain, yTrain, xTest, yTest] =
                    this.convertToTensors(dataByClass[i], targetsByClass[i], testSplit);
                xTrains.push(xTrain);
                yTrains.push(yTrain);
                xTests.push(xTest);
                yTests.push(yTest);
            }

            const concatAxis = 0;
            return [
                tf.concat(xTrains, concatAxis), tf.concat(yTrains, concatAxis),
                tf.concat(xTests, concatAxis), tf.concat(yTests, concatAxis)
            ];
        });
    }


    /**
     * Convert Iris data arrays to `tf.Tensor`s.
     *
     * @param data The Iris input feature data, an `Array` of `Array`s, each element
     *   of which is assumed to be a length-4 `Array` (for petal length, petal
     *   width, sepal length, sepal width).
     * @param targets An `Array` of numbers, with values from the set {0, 1, 2}:
     *   representing the true category of the Iris flower. Assumed to have the same
     *   array length as `data`.
     * @param testSplit Fraction of the data at the end to split as test data: a
     *   number between 0 and 1.
     * @return A length-4 `Array`, with
     *   - training data as `tf.Tensor` of shape [numTrainExapmles, 4].
     *   - training one-hot labels as a `tf.Tensor` of shape [numTrainExamples, 3]
     *   - test data as `tf.Tensor` of shape [numTestExamples, 4].
     *   - test one-hot labels as a `tf.Tensor` of shape [numTestExamples, 3]
     */
    convertToTensors(data, targets, testSplit) {
        const numExamples = data.length;
        if (numExamples !== targets.length) {
            throw new Error('data and split have different numbers of examples');
        }

        // Randomly shuffle `data` and `targets`.
        const indices = [];
        for (let i = 0; i < numExamples; ++i) {
            indices.push(i);
        }
        tf.util.shuffle(indices);

        const shuffledData = [];
        const shuffledTargets = [];
        for (let i = 0; i < numExamples; ++i) {
            shuffledData.push(data[indices[i]]);
            shuffledTargets.push(targets[indices[i]]);
        }

        // Split the data into a training set and a tet set, based on `testSplit`.
        const numTestExamples = Math.round(numExamples * testSplit);
        const numTrainExamples = numExamples - numTestExamples;

        const xDims = shuffledData[0].length;

        // Create a 2D `tf.Tensor` to hold the feature data.
        const xs = tf.tensor2d(shuffledData, [numExamples, xDims]);

        // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
        // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
        const ys = tf.oneHot(tf.tensor1d(shuffledTargets).toInt(), POKEMON_TYPES.length);

        // Split the data into training and test sets, using `slice`.
        const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
        const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
        const yTrain = ys.slice([0, 0], [numTrainExamples, POKEMON_TYPES.length]);
        const yTest = ys.slice([0, 0], [numTestExamples, POKEMON_TYPES.length]);
        return [xTrain, yTrain, xTest, yTest];
    }


}

class UI {

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


}

class PokemonModel {

    params = {
        epochs: 50,
        learningRate: 0.0005,
    };
    model;


    constructor() {

        this.data = new PokemonData();

    }


    createModel() {

        const {xTrain, POKEMON_TYPES} = this.data;
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

        this.model = model;

    }

    async load() {


        const loadedModel = await tf.loadModel('indexeddb://my-model-1');
        this.model = loadedModel;

        return this;

    }

    async save() {

        if (this.model == null) {

            throw new Error('Invalid Request');
        }
        const saveResults = await this.model.save(`indexeddb://my-model-1`);

        return saveResults;
    }

    async train(params) {

        const {xTrain, yTrain, xTest, yTest} = this.data;
        const optimizer = tf.train.adam(params.learningRate);
        const lossValues = [];

        const returnCost = true;
        for (let i = 0; i < params.epochs; i++) {
            const cost = optimizer.minimize(() => {
                const predictions = this.model.predict(xTrain);
                return tf.losses.softmaxCrossEntropy(
                    yTrain.asType('float32'),
                    predictions.asType('float32')
                ).mean();
            }, returnCost);

            const trainLoss = tf.losses.softmaxCrossEntropy(
                yTest.asType('float32'),
                this.model.predict(xTest).asType('float32')
            ).mean();

            UI.plotLosses(lossValues, i, cost.dataSync(), trainLoss.dataSync());

            await tf.nextFrame();
        }

        return this;


    };


}

export class PokemonTypeModel extends PokemonModel {


    constructor() {

        super();
        this.createModel();
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

    evaluateModelOnTestData() {

        const {xTest, yTest} = this.data;

        return tf.tidy(() => {
            const xData = xTest.dataSync();
            const yTrue = yTest.argMax(-1).dataSync();
            const predictOut = this.model.predict(xTest);
            const yPred = predictOut.argMax(-1);

            const logits = predictOut.dataSync();


            const result = this.renderEvaluateTable(
                xData, yTrue, yPred.dataSync(), logits);


            const resultData = result.data.map(d => {

                const foundP = this.data.pokemon.find(_d => _d.Name === d.name);

                if (foundP) {

                    return Object.assign({}, foundP, d);

                }

                return d;
            });

            return resultData;

            // calculateAndDrawConfusionMatrix(model, xTest, yTest);
        });


    }

    predict({Total, HP, Attack, Defense, Speed, Sp_Atk, Sp_Def}) {

        const _arr = [Total, HP, Attack, Defense, Speed, Sp_Atk, Sp_Def];

        const tensor = tf.tensor2d(_arr, [1, 7], 'float32');
        const prediction = this.model.predict(tensor);
        const top5 = tf.topk(prediction, 5);
        const _data = top5.indices.dataSync();
        const predictedTypes = Array.from(_data).map(item => POKEMON_TYPES[item]);
        return predictedTypes;
    }


}





