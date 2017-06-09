// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { Dispatch } from 'state/reducer';
import IO from 'domain/io';
import {
  testInputChangeAction,
  testOutputChangeAction,
  removeTestFieldAction,
} from 'state/form';

class InputOutput extends Component {

  props: {
    index: number,
    io: IO,
    onTestInputChange: (input: string, index: number) => void,
    onTestOutputChange: (output: string, index: number) => void,
    onRemoveFieldClick: (index: number) => void,
  };

  render() {
    return (
      <div>
        <div className={prefixer('same-line').concat(' ').concat(prefixer('test-field'))}>
          <label htmlFor={`input ${this.props.index}`}>Syöte</label>
          <br />
          <input
            className={prefixer('input-field')}
            type="text"
            name={`input ${this.props.index}`}
            value={this.props.io.input}
            onChange={(event) => {
              this.props.onTestInputChange(event.currentTarget.value, this.props.index);
            }}
          />
        </div>
        <div className={prefixer('same-line').concat(' ').concat(prefixer('test-field'))}>
          <label htmlFor={`output ${this.props.index}`}>Tulos</label>
          <br />
          <input
            className={prefixer('input-field')}
            type="text"
            name={`output ${this.props.index}`}
            value={this.props.io.output}
            onChange={(event) => {
              this.props.onTestOutputChange(event.currentTarget.value, this.props.index);
            }}
          />
        </div>
        <div className={prefixer('same-line')}>
          <button
            role="button"
            className={prefixer('close-button')}
            onClick={(e: Event) => { e.preventDefault(); this.props.onRemoveFieldClick(this.props.index); }}
          >
            &#10005;
          </button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onTestInputChange(input: string, index: number) {
      dispatch(testInputChangeAction(input, index));
    },
    onTestOutputChange(output: string, index: number) {
      dispatch(testOutputChangeAction(output, index));
    },
    onRemoveFieldClick(index) {
      dispatch(removeTestFieldAction(index));
    },
  };
}

export default connect(null, mapDispatchToProps)(InputOutput);
