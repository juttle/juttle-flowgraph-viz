import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import DevTools from './containers/DevTools';
import configureStore from './store/configureStore';
import compiler from 'juttle/lib/compiler';
import FlowgraphDVR from './containers/flowgraph-dvr';
import * as Actions from './actions';

const store = configureStore();

// emit -limit 5 | ((put a = 1; put b = 2) | filter c = null; put c = 3) | (view text; view timechart)

// patch emit method of the node to keep record the points it emits
function patchNodeEmit(node) {
    var origEmit = node.emit;
    node.emit = function(points, output_name) {
        points.forEach((point) => {
            store.dispatch(Actions.nodeEmitPoint(node.pname, point));
        });

        origEmit.apply(node, arguments);
    };
}

// patch consume method of the node to record of points it consumes
function patchNodeConsume(node) {
    var origConsume = node.consume;
    node.consume = function(points, from) {
        points.forEach((point) => {
            store.dispatch(Actions.nodeConsumePoint(node.pname, point));
        });

        origConsume.apply(node, arguments);
    };
}

function doIt(juttleSrc) {
    store.dispatch(Actions.updateJuttleSource(juttleSrc));

    compiler.compile(juttleSrc, {
            stage: 'flowgraph'
        }).then((program) => {
            let flowgraph = program.built_graph;

            store.dispatch(Actions.updateProgramState("RUNNING"));
            store.dispatch(Actions.updateFlowgraph(flowgraph));

            return compiler.compile(juttleSrc);
        }).then((program) => {

            program.get_nodes().forEach((node) => {
                patchNodeEmit(node);
                patchNodeConsume(node);
            });

            program.activate();

            return program.done()
                    .then(function() {
                        store.dispatch(Actions.updateProgramState("FINISHED"));
                    });
        }).catch((err) => {
            console.log("error while running program: " + err);
        });
}

export default class App extends Component {
    _onRunClick() {
        store.dispatch(Actions.reset());
        doIt(this.refs.juttleInput.value);
    }
    render() {
        return (
            <Provider store={ store }>
                <div>
                    <textarea ref="juttleInput" rows="10" cols="100"/>
                    <input className="run-button" type="button" onClick={this._onRunClick.bind(this)} value="Run"/>
                    <FlowgraphDVR/>
                    <DevTools/>
                </div>
            </Provider>
        );
    }
}
