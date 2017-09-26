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
<<<<<<< 3017c2281b7474dea712a5559b4ef1d26ef6ab0e
  changeTestInTestArrayAction,
=======
>>>>>>> Add toggling test type
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
    exerciseType: string,
  };

  render() {
    let buttonClassName;

    if (this.props.exerciseType === 'input_output') {
      buttonClassName = 'close-button';
    } else {
      buttonClassName = 'card-close-button';
    }

    return (
      <div >
        <div className={prefixer('field-container')}>
          <div className={prefixer('input-field-wrapper')}>
            <div className={prefixer('label')}>
              Syöte
            </div>
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
          <div className={prefixer('input-field-wrapper')}>
            <div className={prefixer('label')}>
              Tulos
            </div>
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
            className={prefixer(buttonClassName)}
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
    exerciseType: state.form.exerciseType,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onTestInputChange(input: string, index: number) {
      dispatch(testInputChangeAction(input, index));
      dispatch(changeTestInTestArrayAction(index));
    },
    onTestOutputChange(output: string, index: number) {
      dispatch(testOutputChangeAction(output, index));
      dispatch(changeTestInTestArrayAction(index));
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
