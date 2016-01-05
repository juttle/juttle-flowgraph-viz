import React, { Component } from 'react';
import { connect } from 'react-redux';

import d3 from 'd3';

class Chart extends Component {
    componentDidUpdate(prevProps, prevState) {
        let bars = d3.select(this.refs.chart)
          .selectAll("div")
            .data(this.props.points);
        bars.enter().append("div")
            .style("background-color", "blue")
            .style("width", function(d) { return d * 10 + "px"; })
            .text(function(d) { return d; });

        bars.style("width", function(d) { return d * 10 + "px"; })
            .text(function(d) { return d; });

        bars.exit().remove();
    }
    render() {
        return (
            <div ref="chart">
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            points: state.points
        }
    }
)(Chart);
