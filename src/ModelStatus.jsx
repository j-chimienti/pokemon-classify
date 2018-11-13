import React from 'react';
import PropTypes from 'prop-types';


function ModelStatus({model, training, modelStatus}) {

    const statusus = modelStatus.split('_');


    return (
        <div className={'col'}>
            <h4>
                Model:
                {/*<span style={{*/}
                {/*color: model.model ? '#57d500' : '#ff2e00',*/}
                {/*transition: 'all .3s ease'*/}
                {/*}}*/}
                {/*className={'pl-2'}*/}
                {/*>*/}
                {/*&#x25cf;*/}
                {/*</span>*/}

                <small>
                    {statusus.map(status => <em key={status} className={'m-2'}>{status}</em>)}
                </small>

            </h4>


        </div>
    );
}

ModelStatus.propTypes = {
    modelStatus: PropTypes.string.isRequired,
    training: PropTypes.bool.isRequired,
};
ModelStatus.defaultProps = {};

export default ModelStatus;
