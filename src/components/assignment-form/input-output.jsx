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
          <span className={prefixer('same-line').concat(' ').concat(prefixer('test-field'))}>
            <div>
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
              {IOErrors.map((error) => {
                if (error.key === 'inputError' && error.index === this.props.index) {
                  return (
                    <span
                      key={'input'.concat(this.props.index.toString())} className={prefixer('error')}
                    >
                      {error.msg}
                    </span>);
                }
                return undefined;
              })
              }
            </div>
          </span>
          <span className={(prefixer('test-field'))}>
            <div>
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
              {IOErrors.map((error) => {
                if (error.key === 'outputError' && error.index === this.props.index) {
                  return (
                    <span
                      key={'output'.concat(this.props.index.toString())}
                      className={prefixer('error').concat(' ').concat(prefixer('output'))}
                    > {error.msg}
                    </span>);
                }
                return undefined;
              })
              }
            </div>
          </span>
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

function mapStateToProps(state: State) {
  return {
    errors: state.form.errors,
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
