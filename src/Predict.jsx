import React from 'react';
import PropTypes from 'prop-types';

const props = ['Total', 'HP', 'Attack', 'Defense', 'Speed', 'Sp_Atk', 'Sp_Def'];


function Predict({predict, handleChange, params, loadRandomPokemon, modelLoaded = false, predictTestData}) {

    const inputs_ = props.map(property => {

        return (
            <div key={property}>
                <label htmlFor={property}>{property}</label>
                <input
                    name={property}
                    type={'number'}
                    width={100}
                    className={'form-control-sm mono'}
                    id={property}
                    value={params[property]}
                    onChange={handleChange}
                />
            </div>

        )
    });

    const {Name, Type: _Type} = params;

    const Type = _Type.split('\n')[0];

    let readOnly = [];
    if (Name && Type) {

        readOnly = ['Name', 'Type'].map((property, i) => {

            const value = property === 'Type' ? Type : params[property];

            return (
                <div key={property}>
                    <label htmlFor={property}>
                        {property}
                    </label>
                    <input type={'text'}
                           className={'form-control-sm'}
                           id={property}
                           value={value}
                           readOnly
                           width={100}
                    />
                </div>
            )

        })
    }

    return (

        <form onSubmit={e => {

            e.preventDefault();
            predict();

        }}

        >


            {inputs_}


            {readOnly}


            <div className={'row my-3 mx-1 btn-group'}>
                <button type={'button'} className={'btn btn-secondary'}
                        onClick={loadRandomPokemon}
                        disabled={!modelLoaded}
                >
                    random
                </button>
                <button
                    disabled={!modelLoaded}

                    onClick={predict}
                    className={'btn btn-secondary'}>
                    {!modelLoaded ? "load model" : "predict"}
                </button>


            </div>
            <div className={'btn-group'}>

                <button type={'button'} className={'btn btn-primary'}
                        onClick={() => {
                            loadRandomPokemon();

                            setTimeout(predict, 100);
                        }}
                        disabled={!modelLoaded}
                >
                    random & predict
                </button>

            </div>
        </form>
    );
}

Predict.propTypes = {
    predict: PropTypes.func.isRequired,
    predictTestData: PropTypes.func.isRequired,
    loadRandomPokemon: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    modelLoaded: PropTypes.bool.isRequired,
};
Predict.defaultProps = {};

export default Predict;
