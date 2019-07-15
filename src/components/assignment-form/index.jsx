// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { formSubmitButtonPressedAction, changePreviewStateAction, deleteMarkersAction } from 'state/form';
import 'codemirror/mode/clike/clike';
import ExerciseTags from 'components/tag-input';
import StatusDisplay from '../status-display';
import ModelSolution from './model-solution';
import Assignment from './assignment';
import TestFields from './test-fields';
import UnitTests from './unit-tests';
import IOAndCode from './io-and-code';
import Preview from './preview';

class AssignmentForm extends Component {

  wrapper: HTMLDivElement;

  props: {
    handleSubmit: () => void,
    handlePreview: () => void,
    valid: boolean,
    showErrors: boolean,
    testingType: string,
    previewState: boolean,
  }

  render() {
    let tests;
    if (this.props.testingType === 'unit_tests' || this.props.testingType === 'whole_test_code_for_set_up_code') {
      tests = <UnitTests />;
    } else if (this.props.testingType === 'input_output' || this.props.testingType === 'input_output_tests_for_set_up_code') {
      tests = <TestFields />;
    } else { // else if (this.props.testingType === 'io_and_code' || this.props.testingType === 'tests_for_set_up_code')
      tests = <IOAndCode />;
    }

    let setUpCode;
    if (['input_output_tests_for_set_up_code', 'tests_for_set_up_code', 'whole_test_code_for_set_up_code']
    .includes(this.props.testingType)) {
      setUpCode = true;
    }

    let preview = '';
    if (this.props.previewState) {
      preview = <Preview />;
    }

    return (
      <form onSubmit={this.props.handleSubmit} >
        <Assignment />
        <ModelSolution setUpCode />
        {tests}
        <ExerciseTags showErrors={this.props.showErrors} />
        <div className={`${prefixer('form-component')} ${prefixer('submit-button-container')}`}>
          <button
            type="button"
            disabled={this.props.showErrors && !this.props.valid}
            className={prefixer('sender')}
            onClick={(e) => {
              e.preventDefault();
              if (setUpCode) {
                this.props.handleSubmit();
              } else {
                this.props.handlePreview();
              }
            }}
          >
            Lähetä
          </button>
        </div>
        {preview}
        <StatusDisplay showProgress />
      </form>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    valid: state.form.valid,
    showErrors: state.form.showErrors,
    testingType: state.form.testingType,
    previewState: state.form.previewState,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      dispatch(deleteMarkersAction());
      dispatch(formSubmitButtonPressedAction());
    },
    handlePreview() {
      dispatch(changePreviewStateAction(true));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
