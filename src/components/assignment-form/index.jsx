// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { formSubmitButtonPressedAction } from 'state/form';
import { deleteMarkersAction } from 'state/form/actions';
import 'codemirror/mode/clike/clike';
import ExerciseTags from 'components/tag-input';
import StatusDisplay from '../status-display';
import ModelSolution from './model-solution';
import Assignment from './assignment';
import TestFields from './test-fields';
import UnitTests from './unit-tests';

class AssignmentForm extends Component {

  wrapper: HTMLDivElement;

  props: {
    handleSubmit: () => void,
    valid: boolean,
    showErrors: boolean,
    testTemplate: {
      code: string,
      readOnlyLines: number[],
    },
  }

  render() {
    let tests;
    if (this.props.testTemplate && this.props.testTemplate.code) {
      tests = <UnitTests />;
    } else {
      tests = <TestFields />;
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
            onClick={(e) => {
              e.preventDefault();
              this.props.handleSubmit();
            }}
          >
            Lähetä
          </button>
        </div>
        <StatusDisplay showProgress />
      </form>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    valid: state.form.valid,
    showErrors: state.form.showErrors,
    testTemplate: state.form.unitTests.boilerplate,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      dispatch(deleteMarkersAction());
      dispatch(formSubmitButtonPressedAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
