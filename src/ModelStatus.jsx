import React from 'react';
import PropTypes from 'prop-types';

function ModelStatus({model}) {
    return (
        <div>
            <h4>
                Model:
                <span style={{
                    color: model ? '#57d500' : '#ff2e00',
                    transition: 'all .3s ease'
                }}>
                    &#x25cf;
                </span>
            </h4>


        </div>
    );
}

ModelStatus.propTypes = {};
ModelStatus.defaultProps = {};

export default ModelStatus;
