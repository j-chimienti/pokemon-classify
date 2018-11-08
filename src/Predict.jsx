import React from 'react';
import PropTypes from 'prop-types';

const props = ['Total', 'HP', 'Attack', 'Defense', 'Speed', 'Sp_Atk', 'Sp_Def'];


function Predict({predict, handleChange, params, loadRandomPokemon, modelLoaded = false}) {

    const inputs_ = props.map(property => {

        return (
            <div key={property}>
                <label htmlFor={property}>{property}</label>
                <input type={'number'} className={'form-control mono'} id={property}
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
                           className={'form-control'}
                           id={property}
                           value={value}
                           readOnly
                    />
                </div>
            )

        })
    }

    return (
        <div>
            <form onSubmit={e => {

                e.preventDefault();
                console.log('redi')
                predict();
            }}
                  className={'form-inline'}

            >
                <h3>Predict Pokemon Type</h3>

                {inputs_} <br/>
                {readOnly}
                <div className={'form-group'}>

                    <button type={'button'} className={'btn btn-secondary'}
                            onClick={loadRandomPokemon}
                            disabled={!modelLoaded}
                    >
                        load random pokemon
                    </button>
                    <button
                        disabled={!modelLoaded}
                        type={'submit'} className={'btn btn-primary'}>
                        {!modelLoaded ? "load model" : "predict"}
                    </button>
                </div>
            </form>
        </div>
    );
}

Predict.propTypes = {
    predict: PropTypes.func.isRequired,
    loadRandomPokemon: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    modelLoaded: PropTypes.bool.isRequired,
};
Predict.defaultProps = {};

export default Predict;
