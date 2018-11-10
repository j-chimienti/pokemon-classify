import React from 'react';
import PropTypes from 'prop-types';


function ModelStatus({model: {model}, training}) {

    return (
        <div>
            <h4>
                Model:
                <span style={{
                    color: model ? '#57d500' : '#ff2e00',
                    transition: 'all .3s ease'
                }}
                      className={'pl-2'}
                >
                    &#x25cf;
                </span>
                {training && <small>
                    training
                </small>}
            </h4>


        </div>
    );
}

ModelStatus.propTypes = {};
ModelStatus.defaultProps = {};

export default ModelStatus;
