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
import Transition from 'react-motion-ui-pack';

class InputOutput extends Component {

  props: {
    index: number,
    io: IO,
    errors: Map<string, Array<Object>>,
    onTestInputChange: (input: string, index: number) => void,
    onTestOutputChange: (output: string, index: number) => void,
    onRemoveFieldClick: (index: number) => void,
    readOnly: boolean,
    showErrors: boolean,
  };

  renderEditable() {
    let IOErrors = this.props.errors.get('IOError');
    if (!IOErrors) {
      IOErrors = [];
    }
    return (
      <div >
        <div className={prefixer('field-container')}>
          <div className={prefixer('input-field-wrapper')}>
            <input
              aria-label="testisyöte"
              aria-required
              className={prefixer('input-field')}
              type="text"
              placeholder="Syöte"
              name={`input ${this.props.index}`}
              value={this.props.io.input}
              onChange={(event) => {
                this.props.onTestInputChange(event.currentTarget.value, this.props.index);
              }}
            />
            <Transition
              enter={{ opacity: 1, height: 16 }}
              leave={{ opacity: 0, height: 0, transitionY: -3 }}
            >
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
              })}
            </Transition>
          </div>
          <div className={prefixer('input-field-wrapper')}>
            <input
              aria-required
              aria-label="testituloste"
              className={prefixer('input-field')}
              type="text"
              placeholder="Tulos"
              name={`output ${this.props.index}`}
              value={this.props.io.output}
              onChange={(event) => {
                this.props.onTestOutputChange(event.currentTarget.value, this.props.index);
              }}
            />
            <Transition
              enter={{ opacity: 1, height: 16 }}
              leave={{ opacity: 0, height: 0, transitionY: -3 }}
            >
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
              })}
            </Transition>
          </div>
          <button
            type="button"
            className={prefixer('close-button')}
            onClick={(e: Event) => { e.preventDefault(); this.props.onRemoveFieldClick(this.props.index); }}
          >
            &#10006;
          </button>
        </div>
      </div>
    );
  }

  renderReadOnly() {
    return (
      <div >
        <div className={prefixer('field-container')}>
          <input
            readOnly
            aria-label="testisyöte"
            className={prefixer('input-field')}
            type="text"
            value={this.props.io.input}
          />
          <div className={prefixer('test-field-arrow')}>&rarr;
          </div>
          <input
            readOnly
            aria-label="testituloste"
            className={prefixer('input-field')}
            type="text"
            value={this.props.io.output}
          />
        </div>
      </div>
    );
  }

  render() {
    return this.props.readOnly ? this.renderReadOnly() : this.renderEditable();
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
