import React from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';


var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = (800) - margin.right - margin.left,
    height = (500) - margin.top - margin.bottom;

class Node {

    constructor(_id, group) {

        this.id = _id;

        this.group = group;

        const idx = +_id.split('-').pop();


        if (group === 0) {

            this.x = width * .1;
            this.y = (idx / 100) * height + (height / 4);
        } else if (group === 1) {

            this.x = width * .5;
            this.y = (idx / 256) * height;
        } else {

            this.y = (idx / 100) * height + (height / 4);
            this.x = width * .9;
        }

    }
}

class Link {

    constructor(source, target, value) {

        this.source = source.id;
        this.target = target.id;
        this.value = value;

        this.x1 = source.x;
        this.x2 = target.x;

        this.y1 = source.y;
        this.y2 = target.y;
    }

}

const inputNodes = Array.from({length: 18}, (v, i) => new Node(`input-${i}`, 0));
const hiddenNodes = Array.from({length: 256}, (v, i) => new Node(`hidden-${i}`, 1));
const outputNodes = Array.from({length: 18}, (v, i) => new Node(`output-${i}`, 2));


const makeLin = (sources, targets) => sources.map(source => {

    return targets.map(target => {

        return new Link(source, target, 2);
    })
});

const links = [...makeLin(inputNodes, hiddenNodes), ...makeLin(hiddenNodes, outputNodes)]
    .reduce((accum, array) => accum.concat(array), []);


const data = {
    nodes: inputNodes.concat(hiddenNodes, outputNodes),
    links
};


class ModelGraphic extends React.Component {

    // var simulation = d3.forceSimulation(data.nodes)
    //
    //     .force("link", d3.forceLink(data.links))
    //     .force("charge", d3.forceManyBody())
    //     .force("link", d3.forceLink(data.links))
    // // .force("center", d3.forceCenter());


    componentDidMount() {


        const svg = d3.select('#force-graph').append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        let colors = d3.schemeSet1;

        const circleRadius = 5;
        var nodes = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(data.nodes)
            .enter()
            .append('circle')
            .style('z-index', 10)
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            })
            .attr('r', circleRadius)
            .style('fill', (d, i) => {

                const id = d.group;

                return colors[id];
            });

        nodes.append("title")
            .text(function (d) {
                return d.id;
            });


        var links = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .style('z-index', 1)
            .data(data.links)
            .enter()
            .append('line')
            .attr("x1", d => {
                return d.x1 + circleRadius
            })
            .attr("y1", d => d.y1)
            .attr("x2", d => d.x2 - circleRadius)
            .attr("y2", d => d.y2)
            .attr("stroke", "blue")
            .attr("stroke-width", .1)
            .attr("fill", "none")
            .style('stroke', '#5f5f5f')

        const _links = d3.forceLink().id(function (d) {
            return d.id;
        }).distance(width / 3).links(data.links);


        function sim() {

            var simulation = d3.forceSimulation()
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("charge", d3.forceManyBody().strength(-40))
                .nodes(data.nodes)
                .force("link", _links)
                .on('tick', ticked);


            // simulation
            //     .nodes(data.nodes)
            //     .on("tick", ticked);
            //
            simulation.force("link")
                .links(data.links)


            console.log(simulation);

            window.simulation = simulation;
        }

        function ticked() {
            links
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            nodes
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        }
    }


    render() {

        return (
            <div>

                <svg id={'force-graph'} width={width + margin.left + margin.right}
                     height={height + margin.top + margin.bottom}>

                </svg>

            </div>
        );
    }
}

ModelGraphic.propTypes = {};
ModelGraphic.defaultProps = {};

export default ModelGraphic;
