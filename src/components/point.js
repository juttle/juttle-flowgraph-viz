import React, { Component } from 'react';
import { connect } from 'react-redux';

import d3 from 'd3';

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
