// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { STATUS_NONE, STATUS_FINISHED } from 'state/submission/reducer';
import { addTestFieldAction, submitButtonPressedAction } from 'state/form';
import { resetSubmissionStatusAction } from 'state/submission';
import 'codemirror/mode/clike/clike';
import Transition from 'react-motion-ui-pack';
import { spring } from 'react-motion';
import IO from 'domain/io';
import InputOutput from './input-output';
import ModelSolution from './model-solution';
import Assignment from './assignment';
import ProgressBar from '../progress-bar';

class AssignmentForm extends Component {

  handleAddNewHiddenRow: Function;
  wrapper: HTMLDivElement;

  props: {
    inputOutput: Array<IO>,
    solutionRows: Array<number>,
    modelSolution: string,
    handleSubmit: () => void,
    onAddFieldClick: () => void,
    onOKButtonClick: () => void,
    valid: boolean,
    sendingStatusMessage: string,
    sendingStatusProgress: number,
    showErrors: boolean,
    status: string,
    result: Object,
  }

  render() {
    let statusDisplay = prefixer('hidden');
    if (this.props.sendingStatusMessage !== STATUS_NONE) {
      statusDisplay = prefixer('sendingStatus');
    }
    let spinner = prefixer('spinner');
    let finishButton = prefixer('hidden');
    if (this.props.status === STATUS_FINISHED) {
      spinner = '';
      finishButton = prefixer('finishButton');
    }
    let errors = [];
    if (this.props.result.error) {
      errors = this.props.result.error;
    }
    const form = (
      <form onSubmit={this.props.handleSubmit}>
        <Assignment />
        <ModelSolution
          value={this.props.modelSolution}
          solutionRows={this.props.solutionRows}
        />
        <div className={prefixer('form-component')}>
          <div className={prefixer('instructions')}>
            Testit
        </div >
          <div className={prefixer('io-component')}>
            <Transition
              appear={{
                opacity: 0,
                height: 64,
                translateY: 80,
                translateX: 0,
              }}
              enter={{
                overflow: 'hidden',
                height: 64,
                opacity: 1,
                translateX: 0,
                translateY: spring(0, { stiffness: 120, damping: 15 }),
              }}
              leave={{ opacity: 0, height: 0 }}
            >
              {this.props.inputOutput.map((io: IO, index: number) =>
                (<div key={io.hash()}>
                  {<InputOutput index={index} io={io} />}
                </div>),
              )}
            </Transition>
          </div>
          <button
            className={prefixer('add-field')}
            onClick={(e) => { e.preventDefault(); this.props.onAddFieldClick(); }}
          >
            + Lisää kenttä
          </button>
        </div>
        <div className={prefixer('form-component')}>
          <button
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
        <div className={statusDisplay}>
          <div className={prefixer('sendingInfo')}>
            <div className={prefixer('status-message')}>
              {this.props.sendingStatusMessage}
            </div>
            <div className={prefixer('error-messages')}>
              {errors.map((e, i) =>
              (<div key={`${e}${i}`} className={prefixer('error-message')}>{e}</div>),
            )}
            </div>
            <ProgressBar max={1.0} progressPercent={this.props.sendingStatusProgress} />
            <div className={prefixer('bottom-right')}>
              <div className={spinner} />
              <button
                className={finishButton}
                onClick={(e) => {
                  e.preventDefault();
                  this.props.onOKButtonClick();
                }}
              > OK </button>
            </div>
          </div>
        </div>
      </form>
    );
    return form;
  }
}

function mapStateToProps(state: State) {
  return {
    modelSolution: state.form.modelSolution,
    inputOutput: state.form.inputOutput,
    solutionRows: state.form.solutionRows,
    valid: state.form.valid,
    errors: state.form.errors,
    showErrors: state.form.showErrors,
    sendingStatusMessage: state.submission.message,
    sendingStatusProgress: state.submission.progress,
    status: state.submission.status,
    result: state.submission.result,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      dispatch(submitButtonPressedAction());
    },
    onAddFieldClick() {
      dispatch(addTestFieldAction());
    },
    onOKButtonClick() {
      dispatch(resetSubmissionStatusAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentForm);
