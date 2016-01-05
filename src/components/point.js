import React, { Component } from 'react';
import { connect } from 'react-redux';

class Point extends Component {
    render() {
        return (
            <pre>
                {JSON.stringify(this.props.point, null, 2)}
            </pre>
        );
    }
}

export default Point
