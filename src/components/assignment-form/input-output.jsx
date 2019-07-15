// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import type { State, Dispatch } from 'state/reducer';
import IO from 'domain/io';
import {
  testInputChangeAction,
  testOutputChangeAction,
  removeTestFieldAction,
  testTypeChangedAction,
  changeTestInTestArrayAction,
  addTestInputLineAction,
} from 'state/form';
import Errors from 'components/errors';

class InputOutput extends Component {

  props: {
    index: number,
    io: IO,
    onTestInputChange: (input: string, index: number) => void,
    onTestOutputChange: (output: string, index: number) => void,
    onRemoveFieldClick: (index: number) => void,
    readOnly: boolean,
    showErrors: boolean,
    testingType: string,
    onAddLineButtonClick: (index: number) => void,
  };

  render() {
    let buttonClassName;

    if (this.props.testingType === 'input_output' || this.props.testingType === 'input_output_tests_for_set_up_code') {
      buttonClassName = 'close-button';
    } else {
      buttonClassName = 'card-close-button';
    }

    let extraLines = '';
    if (this.props.io.input.get().length > 1) {
      extraLines = this.props.io.input.get().map((line, index) => {
        if (index === 0) {
          return '';
        }
        return (<TextField
          key={`${index + line}`}
          className={prefixer('input-field')}
          defaultValue={line}
          onChange={(event) => {
            this.props.onTestInputChange(event.currentTarget.value, this.props.index, index);
          }}
          variant="outlined"
        />);
      });
    }

    return (
      <div >
        <Card className={prefixer('field-container')}>
          <div className={prefixer('input-field-wrapper')}>
            <TextField
              className={prefixer('input-field')}
              defaultValue={this.props.io.input.get()[0]}
              onChange={(event) => {
                this.props.onTestInputChange(event.currentTarget.value, this.props.index, 0);
              }}
              variant="outlined"
              label="Syöte"
              placeholder="Syöte"
              InputLabelProps={{
                shrink: true,
              }}
            />
            {extraLines}

            <Button
              type="button"
              className={'add-line-button'} onClick={(e: Event) => {
                e.preventDefault();
                this.props.onAddLineButtonClick(this.props.index);
              }} style={{ textTransform: 'none' }}
            >+ Lisää rivi</Button>

            <Errors
              errors={this.props.io.input.errors}
              keyBase={`${this.props.io.hash()} input`}
              show={this.props.showErrors}
            />
          </div>
          <div className={prefixer('input-field-wrapper')}>
            <TextField
              className={prefixer('input-field')}
              defaultValue={this.props.io.output.get()}
              onChange={(event) => {
                this.props.onTestOutputChange(event.currentTarget.value, this.props.index);
              }}
              variant="outlined"
              label="Tulos"
              placeholder="Tulos"
              InputLabelProps={{
                shrink: true,
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
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    showErrors: state.form.showErrors,
    testingType: state.form.testingType,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onTestInputChange(input: string, index: number, lineNumber: number) {
      dispatch(testInputChangeAction(input, index, lineNumber));
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
    onAddLineButtonClick(index) {
      dispatch(addTestInputLineAction(index));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InputOutput);
