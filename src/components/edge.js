import React, { Component } from 'react';

function createLineElement(x, y, length, angle) {
    var styles = {
        border: '1px solid lightgrey',
        width: length,
        height: 0,
        MozTransform: `rotate(${angle}rad)`,
        WebkitTransform: `rotate(${angle}rad)`,
        OTransform: `rotate(${angle}rad)`,
        msTransform: `rotate(${angle}rad)`,
        position: 'absolute',
        top: y,
        left: x
    };

    return (<div style={styles}/>);
}

function createLine({start, end}) {
    var x1 = start.x;
    var y1 = start.y;
    var x2 = end.x;
    var y2 = end.y;

    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y - 1, c, alpha);
}

function pair(points) {
    let pairs = [];

    for(var i = 0; i < points.length - 1; i++) {
        pairs.push({
            start: points[i],
            end: points[i+1]
        });
    }

    return pairs;
}

class Edge extends Component {
    render() {
        let lines = pair(this.props.points).map((linePoints, i) => {
            return (<div key={i}>{createLine(linePoints)}</div>);
        });

        return (
            <div>
                {lines}
            </div>
        );
    }
}

export default Edge;
