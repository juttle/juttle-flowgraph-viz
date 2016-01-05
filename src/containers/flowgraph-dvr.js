import React, { Component } from 'react';
import { connect } from 'react-redux';
import Flowgraph from './flowgraph';
import DVR from '../components/dvr';
import { ActionCreators } from 'redux-undo';
import * as Actions from '../actions';

class FlowgraphDVR extends Component {
    _onDVRChange(value) {
        this.props.dispatch(Actions.updateUndoIndex(value));

        if (value <= this.props.pastLength - 1) {
            this.props.dispatch(ActionCreators.jumpToPast(value));
        }
        else {
            this.props.dispatch(ActionCreators.jumpToFuture(value - this.props.pastLength - 1));
        }
    }

    render() {

        let dvr = false;

        if (this.props.programState === 'FINISHED') {
            dvr = (<DVR value={this.props.undoIndex}
                onChange={this._onDVRChange.bind(this)}
                min={0}
                max={this.props.pastLength + this.props.futureLength} />);
        }
        return (
            <div>
                {dvr}
                <Flowgraph />
            </div>
        );
    }
}
export default connect(
    state => {
        return {
            pastLength: state.nodePoints.past.length,
            futureLength: state.nodePoints.future.length,
            undoIndex: state.undoIndex,
            programState: state.programState
        };
    },
    null
)(FlowgraphDVR);
