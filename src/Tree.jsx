import React from 'react';

import * as d3 from "d3";
import _ from 'lodash';


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


const width = 800;
const height = 500;

class Tree extends React.Component {


    componentDidMount() {

        const heirarchalData = d3.hierarchy(data);

        const Tree = d3.cluster()
            .size([width, height - 200]);

        const tree = Tree(heirarchalData);

        window.tree = tree;
        const svg = d3.select('svg');

        const nodes = svg
            .selectAll('g.node')
            .data(tree.descendants())
            .enter()
            .append('g')
            .classed('node', true);


        nodes
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .style('fill', '#696969')
            .attr('r', 10);





        nodes.append('text')
            .attr('class', 'label')
            .attr('dx', d => d.x + 50)
            .attr('dy', d => d.y + 4)
            .text(d => {

                return `units: ${d.data.units}, activation: ${d.data.activation}`;
            });

        //The line SVG Path we draw
        var lineGraph = svg.selectAll('.links')

            .data(tree.links())
            .enter()
            .append('line')
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .style('stroke', '#5f5f5f')


    }


    render() {

        return (
            <svg width={width} height={height}>
            </svg>
        );
    }
}

Tree.propTypes = {};
Tree.defaultProps = {};

export default Tree;
