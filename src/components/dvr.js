import React, { Component } from 'react';
import { connect } from 'react-redux';

class DVR extends Component {
    _onRangeChange() {
        this.props.onChange(parseInt(this.refs.rangeInput.value, 10));
    }

    _onNumberInputChange() {
        this.props.onChange(this.refs.numberInput.value);
    }

    render() {
        return (
            <div className="dvr">
                <input ref="rangeInput"
                    value={this.props.value}
                    onInput={this._onRangeChange.bind(this)}
                    /* add onChange so that react doesn't complain about onChange not being set
                    (onInput is doing the job for us) */
                    onChange={() => {}}
                    type="range"
                    min={this.props.min}
                    max={this.props.max}
                    step="1"/>
                <input ref="numberInput"
                    type="number"
                    value={this.props.value}
                    min={this.props.min}
                    max={this.props.max}
                    onChange={this._onNumberInputChange.bind(this)}
                    />{`/${this.props.max}`}
            </div>
        );
    }
}

export default DVR;
