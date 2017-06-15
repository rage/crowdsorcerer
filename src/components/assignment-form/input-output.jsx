// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
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
    errors: Map<string, Array<Object>>,
    onTestInputChange: (input: string, index: number) => void,
    onTestOutputChange: (output: string, index: number) => void,
    onRemoveFieldClick: (index: number) => void,
  };

  render() {
    let IOErrors = this.props.errors.get('IOError');
    if (!IOErrors) {
      IOErrors = [];
    }
    return (
      <div >
        <div className={prefixer('field-container')}>
          <div className={prefixer('input-field-wrapper')}>
            <input
              className={prefixer('input-field')}
              type="text"
              placeholder="Input"
              name={`input ${this.props.index}`}
              value={this.props.io.input}
              onChange={(event) => {
                this.props.onTestInputChange(event.currentTarget.value, this.props.index);
              }}
            />
            {IOErrors.map((error) => {
              if (error.key === 'inputError' && error.index === this.props.index && this.props.showErrors) {
                return (
                  <span
                    key={`input${this.props.index.toString()}`} className={prefixer('error')}
                  >
                    {error.msg}
                  </span>);
              }
              return undefined;
            })
              }
          </div>
          <div className={prefixer('input-field-wrapper')}>
            <input
              className={prefixer('input-field')}
              type="text"
              placeholder="Output"
              name={`output ${this.props.index}`}
              value={this.props.io.output}
              onChange={(event) => {
                this.props.onTestOutputChange(event.currentTarget.value, this.props.index);
              }}
            />
            {IOErrors.map((error) => {
              if (error.key === 'outputError' && error.index === this.props.index && this.props.showErrors) {
                return (
                  <span
                    key={`output${this.props.index.toString()}`}
                    className={`${prefixer('error')} ${prefixer('output')}`}
                  > {error.msg}
                  </span>);
              }
              return undefined;
            })
              }
          </div>
          <button
            role="button"
            className={prefixer('close-button')}
            onClick={(e: Event) => { e.preventDefault(); this.props.onRemoveFieldClick(this.props.index); }}
          >
            &#10006;
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    errors: state.form.errors,
    showErrors: state.form.showErrors,
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(InputOutput);
