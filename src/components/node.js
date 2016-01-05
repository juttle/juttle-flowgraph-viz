import React, { Component } from 'react';

class Node extends Component {
    render() {
        let style = {
            position: 'absolute',
            left: this.props.position.x - this.props.width/2,
            top: this.props.position.y - this.props.height/2
        };
        return (
            <div style={style}>
                {this.props.children}
            </div>
        );
    }
}

export default Node;
