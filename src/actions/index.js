import * as ActionTypes from '../constants/actionTypes';

export function updateJuttleSource(juttleSource) {
    return {
        type: ActionTypes.UPDATE_JUTTLE_SOURCE,
        payload: {
            source: juttleSource
        }
    };
}

export function updateProgramState(state) {
    return {
        type: ActionTypes.UPDATE_PROGRAM_STATE,
        payload: state
    };
}

export function updateFlowgraph(flowgraph) {
    return {
        type: ActionTypes.UPDATE_FLOWGRAPH,
        payload: {
            flowgraph
        }
    };
}

export function nodeEmitPoint(pname, point) {
    return {
        type: ActionTypes.NODE_EMIT_POINT,
        payload: {
            pname,
            point
        }
    };
}

export function nodeConsumePoint(pname, point) {
    return {
        type: ActionTypes.NODE_CONSUME_POINT,
        payload: {
            pname,
            point
        }
    };
}

export function updateUndoIndex(index) {
    return {
        type: ActionTypes.UPDATE_UNDO_INDEX,
        payload: index
    };
}

export function reset() {
    return {
        type: ActionTypes.RESET,
    };
}
