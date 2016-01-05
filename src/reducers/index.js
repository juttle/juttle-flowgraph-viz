import { combineReducers } from 'redux';
import undoable, { distinctState, includeAction, excludeAction } from 'redux-undo';
import dagre from 'dagre';
import * as ActionTypes from '../constants/actionTypes';

/*

{
    juttleSource: "...",
    flowgraphNodes: {
        p0: {
            // flowgraph node from juttle API
        }
    },
    dagLayout: {
        nodes: {
            p0: {
                position of nodes
            }
        },
        edges: [
            {
                points: [{x,y}, {x,y}]
            }
        ]
    },
    undoIndex: 5 // the step number are currently at in the undo buffer
}

*/

function flowgraph() {
    switch(action.type) {
        case ActionTypes.UPDATE_FLOWGRAPH: {
            return action.payload.flowgraph.reduce((result, value, i) => {
                results[value.pname] = {

                };
            }, {});
        }
    }
}

function juttleSource(state = "", action) {
    switch (action.type) {
        case ActionTypes.UPDATE_JUTTLE_SOURCE: {
            return action.payload.source;
        }
    }

    return state;
}

function programState(state = null, action) {
    switch(action.type) {
        case ActionTypes.UPDATE_PROGRAM_STATE: {
            return action.payload;
        }
    }

    return state;
}

function dagLayout(state = {nodes: {}, edges: []}, action) {
    switch(action.type) {
        case ActionTypes.UPDATE_FLOWGRAPH: {
            let nodeWidth = action.payload.nodeWidth || 300;
            let nodeHeight = action.payload.nodeHeight || 50;
            let flowgraphNodes = action.payload.flowgraph.nodes;

            var g = new dagre.graphlib.Graph();

            // Set an object for the graph label
            g.setGraph({});

            // Default to assigning a new object as a label for each new edge.
            g.setDefaultEdgeLabel(function() { return {}; });

            flowgraphNodes.forEach((node) => {
                g.setNode(node.pname, {width: nodeWidth, height: nodeHeight});
                node.in.forEach((inPname) => {
                    g.setEdge(inPname, node.pname);
                });
            });

            g.graph().rankdir = "LR";
            dagre.layout(g);

            return {
                nodes: g.nodes().reduce((result, pname) => {
                    result[pname] = {
                        x: g.node(pname).x,
                        y: g.node(pname).y
                    };

                    return result;
                }, {}),
                edges: g.edges().map((e) => {
                    let edge = g.edge(e);
                    return edge.points;
                })
            };
        }
    }

    return state;
}

function nodePoints(state = {}, action) {
    switch(action.type) {
        case ActionTypes.NODE_CONSUME_POINT: {
            let curNodePoints = state[action.payload.pname] || {
                pointsIn: [],
                pointsOut: []
            };
            let newNodePoints = Object.assign({}, curNodePoints, {
                pointsIn: [...curNodePoints.pointsIn, action.payload.point]
            });
            return Object.assign({}, state, {
                [action.payload.pname]: newNodePoints
            });
        }

        case ActionTypes.NODE_EMIT_POINT: {
            let curNodePoints = state[action.payload.pname] || {
                pointsIn: [],
                pointsOut: []
            };
            let newNodePoints = Object.assign({}, curNodePoints, {
                pointsOut: [...curNodePoints.pointsOut, action.payload.point]
            });
            return Object.assign({}, state, {
                [action.payload.pname]: newNodePoints
            });
        }
    }

    return state;
}

function flowgraphNodes(state = {}, action) {
    switch (action.type) {
        case ActionTypes.UPDATE_FLOWGRAPH: {
            return action.payload.flowgraph.nodes.reduce((result, value) => {
                result[value.pname] = value;
                return result;
            }, {});
        }
    }

    return state;
}

function lastPointNode(state = {}, action) {
    switch(action.type) {
        case ActionTypes.NODE_EMIT_POINT:
        case ActionTypes.NODE_CONSUME_POINT: {
            return action.payload.pname;
        }
    }

    return state;
}

function undoIndex(state = 0, action) {
    switch(action.type) {
        case ActionTypes.NODE_EMIT_POINT:
        case ActionTypes.NODE_CONSUME_POINT: {
            return state + 1;
        }
        case ActionTypes.UPDATE_UNDO_INDEX: {
            return action.payload;
        }
    }

    return state;
}

const undoableReducerConfig = {
    filter: includeAction(['NODE_EMIT_POINT','NODE_CONSUME_POINT']),
    initTypes: ['@@redux/INIT', '@@INIT', ActionTypes.RESET]
};

let rootReducer = combineReducers({
    juttleSource,
    flowgraph: combineReducers({
        nodes: flowgraphNodes
    }),
    nodePoints: undoable(nodePoints, undoableReducerConfig),
    lastPointNode: undoable(lastPointNode, undoableReducerConfig),
    undoIndex,
    dagLayout,
    programState
});

let resetableRootReducer = function(state, action) {
    if (action.type === ActionTypes.RESET) {
        return rootReducer(undefined, action);
    }
    else {
        return rootReducer(state, action);
    }
}

export default resetableRootReducer;
