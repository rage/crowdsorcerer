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
  testTypeChangedAction,
  changeTestInTestArrayAction,
} from 'state/form';
import Errors from 'components/errors';
import TestTypeButton from './test-type-button';

class InputOutput extends Component {

  props: {
    index: number,
    io: IO,
    onTestInputChange: (input: string, index: number) => void,
    onTestOutputChange: (output: string, index: number) => void,
    onRemoveFieldClick: (index: number) => void,
    onTestTypeButtonClicked: (oldType: string, index: number) => void,
    readOnly: boolean,
    showErrors: boolean,
  };

  render() {
    return (
      <div >
        <div className={prefixer('field-container')}>
          <div className={prefixer('input-field-wrapper')}>
            <input
              aria-label="testisyöte"
              aria-required
              readOnly={this.props.readOnly}
              className={prefixer('input-field')}
              type="text"
              placeholder="Syöte"
              name={`input ${this.props.index}`}
              value={this.props.io.input.get()}
              onChange={(event) => {
                this.props.onTestInputChange(event.currentTarget.value, this.props.index);
              }}
            />
            <Errors
              errors={this.props.io.input.errors}
              keyBase={`${this.props.io.hash()} input`}
              show={this.props.showErrors}
            />
          </div>
          <TestTypeButton type={this.props.io.type} onClick={this.props.onTestTypeButtonClicked} index={this.props.index} />
          <div className={prefixer('input-field-wrapper')}>
            <input
              aria-label="testituloste"
              aria-required
              readOnly={this.props.readOnly}
              className={prefixer('input-field')}
              type="text"
              placeholder="Tulos"
              name={`output ${this.props.index}`}
              value={this.props.io.output.get()}
              onChange={(event) => {
                this.props.onTestOutputChange(event.currentTarget.value, this.props.index);
              }}
            />
            <Errors
              errors={this.props.io.output.errors}
              keyBase={`${this.props.io.hash()} output`}
              show={this.props.showErrors}
            />
          </div>
          {!this.props.readOnly && <button
            type="button"
            className={prefixer('close-button')}
            onClick={(e: Event) => { e.preventDefault(); this.props.onRemoveFieldClick(this.props.index); }}
          >
            &#10006;
          </button>}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    showErrors: state.form.showErrors,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onTestInputChange(input: string, index: number) {
      dispatch(testInputChangeAction(input, index));
      dispatch(changeTestInTestArrayAction('', input, '', index));
    },
    onTestOutputChange(output: string, index: number) {
      dispatch(testOutputChangeAction(output, index));
      dispatch(changeTestInTestArrayAction('', '', output, index));
    },
    onRemoveFieldClick(index) {
      dispatch(removeTestFieldAction(index));
    },
    onTestTypeButtonClicked(oldType: string, index: number) {
      dispatch(testTypeChangedAction(oldType, index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InputOutput);
