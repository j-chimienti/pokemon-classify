import React, {Component} from 'react';
import './App.css';
import {sample} from "lodash";
import ResultTable from "./ResultTable";
import Predict from "./Predict";
import ModelStatus from "./ModelStatus";
import PredictionResults from "./PredictionResults";


import {PokemonTypeModel} from "./pokemonModel";
import Header from "./Header";
import {Link} from "react-router-dom";
import pokemonImg from "./pokemon.jpg";
import About from "./About";
import {Table} from "./Table";
import pokemon from "./pokemon";
import ModelGraph from "./ModelGraph";
import ModelGraphic from "./ModelGraphic";
import ModelFunctions from "./ModelFunctions";
import TrainingParams from "./TrainingParams";
import Tree from "./Tree";

let model = {
    model: null,
};

class App extends Component {

    constructor(props) {

        super();
        this.run = this.run.bind(this);
        this.save = this.save.bind(this);
        this.updateParams = this.updateParams.bind(this);
        this.predictTestData = this.predictTestData.bind(this);
        this.loadRandomPokemon = this.loadRandomPokemon.bind(this);
        this.load = this.load.bind(this);
        this.predict = this.predict.bind(this);
        this.handleChange = this.handleChange.bind(this);


        this.state = {
            resultData: [],
            training: false,
            predictedTypes: [],
            page: "home",
            modelStatus: "new",
            model,
            params: {
                epochs: 50,
                learningRate: 0.0005,
            },

        };

    }

    async componentDidMount() {

        let localModal = false;
        if (await PokemonTypeModel.checkStoredModelStatus() != null) {
            model = await PokemonTypeModel.load();

            localModal = true;

        } else {

            model = new PokemonTypeModel();
        }

        const samplePokemon = sample(model.data.pokemon);

        this.setState({
            ...this.state,
            modelStatus: localModal ? "loaded" : "new",
            params: {
                ...model.params,
                ...samplePokemon
            }
        })
    }


    async removeModel() {

        await model.removeModel();

        model = new PokemonTypeModel();

        this.setState({
            ...this.state,
            modelStatus: 'new_deleted'
        });

    }

    async load() {

        try {
            model = await PokemonTypeModel.load();

            this.setState({
                ...this.state,
                modelStatus: "loaded"
            });

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
            modelStatus: 'training',
            resultData: []
        }, async () => {
            await model.train(this.state.params);
            const resultData = model.evaluateModelOnTestData();


            await model.save();
            this.setState({
                modelStatus: 'trained_saved',
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

            this.setState({
                ...this.state,
                modelStatus: "saved_loaded"
            });

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

        // fixme
        if (this.state.modelStatus === "newdkdkd") {

            window.alert('Load Model first');

            return false;
        }
        const predictedTypes = model.predict(this.state.params);

        this.setState({
            ...this.state,
            predictedTypes,
        })

    }

    goTo(page = 'home') {

        this.setState({

            ...this.state,
            page,
        });
    }

    updateParams(e) {

        this.setState({
            ...this.state,
            params: {...this.state.params, [e.target.name]: e.target.value}
        })
    }

    render() {

        const {params, training, resultData, predictedTypes, modelStatus, page} = this.state;

        const correctPredictions = resultData.filter(d => d.pred === d.type).length;
        const top5Pred = resultData.filter(({types, type}) => types.includes(type)).length;
        const predictions = resultData.length;

        const correctPredictionsPercent = Math.floor((correctPredictions / predictions) * 100);
        const top5PredictionsPercent = Math.floor((top5Pred / predictions) * 100);

        const home = <div className={'container'}>


            <Header/>

            <div className={'row my-4'}>
                <ModelStatus model={model} training={training} modelStatus={modelStatus}/>

                <ModelFunctions
                    modelStatus={modelStatus}
                    training={training}
                    removeModel={this.removeModel}
                    save={this.save}
                    load={this.load}
                />
            </div>
            <div className={'row'}>
                <div className={'col-xs-6'}>
                    <h3 className={'section-title'}>
                        Training Parameters

                    </h3>
                    <TrainingParams
                        predictTestData={this.predictTestData}
                        params={params}
                        training={training}
                        run={this.run}
                        modelStatus={modelStatus}
                        updateParams={this.updateParams}
                    />

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


        </div>;

        let activePage;

        if (page === 'home') {
            activePage = home;
        } else if (page === 'about') {

            activePage = <About/>;
        } else if (page === 'data') {

            activePage = <div className={'container-fluid'}>
                <Table data={pokemon}/>
            </div>;
        }
        return (
            <div>
                <nav className={'navbar'}>
                    <a onClick={() => this.goTo('home')}>
                        <h2 className={'navbar-brand'}>
                            <img src={pokemonImg} alt={''} width={'50'} height={'auto'} className={'mr-2'}/>
                            Pokemon Classification
                        </h2>
                    </a>
                    <ul className={'navbar-nav'}>
                        <a className="pointer" onClick={() => this.goTo('home')}>
                            <li>
                                Home
                            </li>
                        </a>
                        <a className="pointer" onClick={() => this.goTo('about')}>
                            <li>
                                About
                            </li>
                        </a>
                        <a className="pointer" onClick={() => this.goTo('data')}>
                            <li>
                                Data
                            </li>
                        </a>
                    </ul>
                </nav>
                {activePage}
            </div>
        );
    }
}

export default App;
