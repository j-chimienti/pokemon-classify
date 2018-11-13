import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';


var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 400 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

function ModelGraph(props) {



    const data = {
        input: [1,2,3],
        hidden: [1,2,3,4],
        output: [1,2]
    };

    const colors = d3.schemeCategory10;

    const svg = d3.select('#model-graph')
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const inputData = svg.selectAll('g.input-nodes')
        .data(data.input)
        .enter()
        .append('g');

    inputData.append('circle')
        .attr('cx', d => width * .1)
        .attr('cy', (d, i) => i * 100)
        .style('fill', colors[0])
        .attr('z-index', 10)
        .attr('r', 10);

    const hiddenData = svg.selectAll('g.input-nodes')
        .data(data.hidden)
        .enter()
        .append('g');

    hiddenData.append('circle')
        .attr('cx', d => width / 2)
        .attr('cy', (d, i) => i * 100)
        .style('fill', colors[1])
        .attr('z-index', 10)
        .attr('r', 10);

    const outputData = svg.selectAll('g.input-nodes')
        .data(data.output)
        .enter()
        .append('g');

    outputData.append('circle')
        .attr('cx', d => width * .9)
        .attr('cy', (d, i) => i * 100)
        .style('fill', colors[2])
        .attr('z-index', 10)
        .attr('r', 10);


    return (
        <div>

            <svg id={'model-graph'} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>

            </svg>
        </div>
    );
}

ModelGraph.propTypes = {};
ModelGraph.defaultProps = {};

export default ModelGraph;
