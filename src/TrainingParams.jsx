import React from 'react';
import PropTypes from 'prop-types';

function TrainingParams({run, updateParams, params, training, modelStatus, predictTestData}) {
    return (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        run();
                    }}
                >



                    <div className="form-group">
                        <label htmlFor="train-epochs">Train Epochs:</label>
                        <input
                            onChange={updateParams}
                            min={0}
                            step={1}
                            className="form-control-sm form-number"
                            id="train-epochs"
                            name={'epochs'}
                            type="number"
                            value={params.epochs}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="learning-rate">Learning Rate:</label>
                        <input
                            onChange={updateParams}
                            width={200}
                            className="form-control-sm form-number"
                            id="learning-rate"
                            name={'learningRate'}
                            type="number"
                            value={params.learningRate}
                            step={0.00001}
                            min={0}
                            max={1}
                        />
                    </div>

                    <div className={'row my-3'}>
                        <button type={'button'} className={'btn btn-outline-primary mr-2'}
                                onClick={() => {

                                    predictTestData();
                                }}
                                disabled={training || modelStatus === 'new'}
                        >
                            Test
                        </button>
                        <button
                            type={'submit'}
                            disabled={training}
                            className="btn btn-primary btn-lg"
                            id="train-from-scratch"
                        >
                            Train
                        </button>
                    </div>
                </form>
    );
}

TrainingParams.propTypes = {
    run: PropTypes.func.isRequired,
    predictTestData: PropTypes.func.isRequired,
    updateParams: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    modelStatus: PropTypes.string.isRequired,
    training: PropTypes.bool.isRequired,
};
TrainingParams.defaultProps = {};

export default TrainingParams;
