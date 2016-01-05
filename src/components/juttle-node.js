import React, { Component } from 'react';
import { connect } from 'react-redux';
import Point from './point';
import classNames from 'classnames';

class JuttleNode extends Component {
    constructor(props) {
      super(props);
      this.state = {pointsVisible: false};
    }
    _togglePointVisibility() {
        this.setState({
            pointsVisible: !this.state.pointsVisible
        });
    }
    render() {
        let classes = classNames(
            "node-name",
            {
                'last-point-node': this.props.lastPointNode
            }
        );

        let points = this.state.pointsVisible ? (<div className="node-points">
                        <div className="points-in">
                            <div style={{textAlign: 'center'}}>{"POINTS IN"}</div>
                            {this.props.node.pointsIn.map((point) => <Point point={point}/>)}
                        </div>
                        <div className="points-out">
                            <div style={{textAlign: 'center'}}>{"POINTS OUT"}</div>
                            {this.props.node.pointsOut.map((point) => <Point point={point}/>)}
                        </div></div> ) : false;
        return (
            <div>
                <div onClick={this._togglePointVisibility.bind(this)} className={classes}>
                    {`${this.props.node.pname}: ${this.props.node.source}`}
                    <br/>
                    {`${this.props.node.pointsIn.length} in | ${this.props.node.pointsOut.length} out`}
                </div>
                {points}
            </div>
        );
    }
}

export default JuttleNode;
