import React from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
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
            <nav className={'navbar'}>
                <ul className={'navbar-nav'}>
                    <li>
                        <Link to="/">
                            <h2>
                                <img src={pokemonImg} alt={''} width={'50'} height={'auto'}/>
                                Pokemon Classification</h2>
                        </Link>
                    </li>
                    <li>
                        <Link to="/about/">About</Link>
                    </li>
                    <li>
                        <Link to="/data/">Data</Link>
                    </li>
                </ul>
            </nav>

            <Route path="/" exact component={App}/>
            <Route path="/about/" component={About}/>
            <Route path="/data/" component={Data}/>
        </div>
    </Router>
);

export default AppRouter;
