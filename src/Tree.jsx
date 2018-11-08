import React from 'react';

import * as d3 from "d3";
import _ from 'lodash';
import './Tree.css';


window.d3 = d3;


const data = {
    name: "dense_1",
    units: 256,
    activation: "relu",
    inputShape: 18,
    children: [
        {
            name: 'dense_2',
            units: 256,
            activation: 'relu',
            children: [{
                name: 'dense_3',
                units: 18,
                activation: 'none',
            }
            ]
        }
    ],
};


var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 400 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

class Tree extends React.Component {


    componentDidMount() {

        const heirarchalData = d3.hierarchy(data);

        const Tree = d3.tree()
            .size([width, height]);

        const tree = Tree(heirarchalData);

        window.tree = tree;
        const svg = d3.select('svg').append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");





        const nodes = svg
            .selectAll('g.node')
            .data(tree.descendants())
            .enter()
            .append('g')
            .classed('node', true)


        // var tooltip = svg
        //     .append("rect")
        //     .attr('width', 100)
        //     .attr('height', 100)
        //     .style('background', 'rgba(0, 0, 0, 0.8)')
        //     .style('color', '#fff')
        //     .style("position", "relative")
        //     .style("z-index", "10")
        //     .style("visibility", "hidden")
        //     .text("a simple tooltip");


        nodes
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .style('fill', '#696969')
            .attr('z-index', 10)
            .attr('r', 10)
            // .on("mousemove", function (event) {
            //
            //     console.log('e', event);
            //     return tooltip.style("top", (event.y - 10) + "px").style("left", (event.x + 10) + "px");
            // })
            // .on("mouseout", function () {
            //     return tooltip.style("visibility", "hidden");
            // })
            // .on("mouseover", function () {
            //     return tooltip.style("visibility", "visible");
            // })


        nodes.append('text')
            .attr('class', 'label')
            .attr('dx', d => d.x + 50)
            .attr('dy', d => d.y)
            .text((d, i) => {

                return `layer: ${i + 1} \t units: ${d.data.units}`;
            });

        //The line SVG Path we draw
        var lineGraph = svg.selectAll('.links')

            .data(tree.links())
            .enter()
            .append('line')
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y + 10)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y - 10)
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style('stroke', '#5f5f5f')


    }


    render() {

        return (
            <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            </svg>
        );
    }
}

Tree.propTypes = {};
Tree.defaultProps = {};

export default Tree;
