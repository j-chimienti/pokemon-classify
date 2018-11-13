import React from "react";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import App from "./App";
import pokemonImg from "./pokemon.jpg";
import pokemon from './pokemon'
import {Table} from "./Table";
import About from "./About";


const Data = () => {

    return (
        <div className={'container-fluid'}>
            <Table data={pokemon}/>
        </div>
    )
};

const AppRouter = () => (
    <Router>
        <div>

            <Switch>
                <Route path="/about" component={About}/>
                <Route path="/data" component={Data}/>
                <Route path={'/classify'} component={App}/>
                <Route component={App}/>
            </Switch>
        </div>
    </Router>
);

export default AppRouter;
