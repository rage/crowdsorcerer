// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { submitButtonPressedAction } from 'state/form';
import 'codemirror/mode/clike/clike';
import StatusDisplay from '../status-display';
import ModelSolution from './model-solution';
import Assignment from './assignment';
import TestFields from './test-fields';

class AssignmentForm extends Component {

  wrapper: HTMLDivElement;

  props: {
    handleSubmit: () => void,
    valid: boolean,
    showErrors: boolean,
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit} >
        <StatusDisplay />
        <Assignment editorReadOnly={false} />
        <ModelSolution />
        <TestFields />
        <div className={prefixer('form-component')}>
          <button
            type="submit"
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
      </form>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    valid: state.form.valid,
    errors: state.form.errors,
    showErrors: state.form.showErrors,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      dispatch(submitButtonPressedAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
