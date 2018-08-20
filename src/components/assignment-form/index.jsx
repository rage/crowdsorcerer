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
    exerciseType: string,
  }

  render() {
    let tests;
    if (this.props.exerciseType === 'unit_tests') {
      tests = <UnitTests />;
    } else if (this.props.exerciseType === 'input_output') {
      tests = <TestFields />;
    } else { // else if this.props.exerciseType === 'io_and_code'
      tests = <IOAndCode />;
    }

    return (
      <form onSubmit={this.props.handleSubmit} >
        <Assignment />
        <ModelSolution />
        {tests}
        <ExerciseTags showErrors={this.props.showErrors} />
        <div className={`${prefixer('form-component')} ${prefixer('submit-button-container')}`}>
          <button
            type="button"
            disabled={this.props.showErrors && !this.props.valid}
            className={prefixer('sender')}
            // onClick={(e) => {
            //   e.preventDefault();
            //   this.props.handleSubmit();
            // }}
            onClick={(e) => {
              e.preventDefault();
              this.props.handlePreview();
            }}
          >
            Lähetä
          </button>
        </div>
        <Preview />
        <StatusDisplay showProgress />
      </form>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    valid: state.form.valid,
    showErrors: state.form.showErrors,
    exerciseType: state.form.exerciseType,
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
