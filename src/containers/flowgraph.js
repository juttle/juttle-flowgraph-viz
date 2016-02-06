import React, { Component } from 'react';
import { connect } from 'react-redux';
import JuttleNode from '../components/juttle-node';
import Edge from '../components/edge';
import Node from '../components/node';
import _ from 'underscore';

class Flowgraph extends Component {
    render() {
        let nodes = Object.keys(this.props.nodesWithPoints).sort().map((pname) => {
            return (<Node key={pname} position={this.props.nodes[pname]} width={300} height={50}>
                <JuttleNode node={this.props.nodesWithPoints[pname]}
                    lastPointNode={pname === this.props.lastPointNode}/>
                </Node>);
        });

        let edges = this.props.edges.map((edge, i) => {
            return <Edge key={i} points={edge}/>
        });

        return (
            <div className="flowgraph">
                {nodes}
                {edges}
            </div>
        );
    }
}
export default connect(
    state => {
        return {
            nodesWithPoints: _.mapObject(state.flowgraph.nodes, (value, key) => {
                return {
                    pname: key,
                    pointsIn: state.nodePoints.present[key] ? state.nodePoints.present[key].pointsIn : [],
                    pointsOut: state.nodePoints.present[key] ? state.nodePoints.present[key].pointsOut : [],
                    // location is missing when a sink is implicitly added by juttle
                    source: value.location ? state.juttleSource.substring(value.location.start.offset, value.location.end.offset) : `${value.type} (unknown code)`
                }
            }),
            nodes: state.dagLayout.nodes,
            edges: state.dagLayout.edges,
            lastPointNode: state.lastPointNode.present
        }
    }
)(Flowgraph);
