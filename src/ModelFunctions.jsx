import React from 'react';
import PropTypes from 'prop-types';

function ModelFunctions({modelStatus, training, removeModel, save, load}) {
    return (
            <div className={'col float-right'}>
                <div className={'btn-group-sm'}>
                    <button
                        disabled={modelStatus === 'new' || training}
                        type={'button'}
                        onClick={() => removeModel()}
                        className="btn btn-outline-danger"
                        id="delete-model">
                        delete model
                    </button>
                    <button
                        disabled={modelStatus === 'new' || training}
                        type={'button'}
                        onClick={() => save()}
                        className="btn btn-secondary"
                        id="save-model">save model
                    </button>
                    <button
                        disabled={training}
                        type={'button'}
                        onClick={() => load()}
                        className="btn btn-secondary"
                        id="load-btn">load model
                    </button>
                </div>
            </div>
    );
}

ModelFunctions.propTypes = {
    modelStatus: PropTypes.string.isRequired,
    training: PropTypes.bool.isRequired,
    removeModel: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired
};
ModelFunctions.defaultProps = {};

export default ModelFunctions;
