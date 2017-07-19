// @flow
import React, { Component } from 'react';
import { STATUS_NONE, STATUS_IN_PROGRESS, STATUS_FINISHED } from 'state/submission/reducer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import type { ResultType } from 'state/submission/reducer';
import prefixer from 'utils/class-name-prefixer';
import { resetSubmissionStatusAction } from 'state/submission';
import ProgressBar from './progress-bar';
import ResultIcon from './result-icon';

class StatusDisplay extends Component {

  props: {
    onOKButtonClick: () => void,
    sendingStatusMessage: string,
    sendingStatusProgress: number,
    status: string,
    result: ResultType,
    showProgress: boolean,
  }

  render() {
    let statusDisplay = prefixer('hidden');
    if (this.props.sendingStatusMessage !== STATUS_NONE) {
      statusDisplay = prefixer('sending-status');
    }
    let finishButton = prefixer('hidden');
    let errors = [];
    let sendingInfo = prefixer('sending-info');
    if (this.props.status !== STATUS_IN_PROGRESS) {
      finishButton = prefixer('info-button');
      errors = this.props.result.error ? this.props.result.error : errors;
      if (this.props.status === STATUS_FINISHED) {
        const resultInfo = this.props.result.OK ? prefixer('all-passed') : prefixer('compile-error');
        sendingInfo += ` ${resultInfo}`;
      } else {
        sendingInfo = `${sendingInfo} ${prefixer('internal-error')}`;
      }
    }
    let errorKey = '';
    return (
      <div className={statusDisplay}>
        <div className={sendingInfo}>
          <div className={prefixer('status-message')}>
            {this.props.sendingStatusMessage}
          </div>
          <div className={prefixer('error-messages')}>
            {errors.map((e) => {
              errorKey = errorKey.concat(e);
              let error = JSON.stringify(e);
              error = error.substring(1, error.length - 1);
              return <div key={`${errorKey}`} className={prefixer('error-message')}>{error}</div>;
            },
            )}
          </div>
          <div className={prefixer('status-bottom')}>
            <div className={prefixer('result-container')}>
              <ProgressBar progressPercent={this.props.sendingStatusProgress} showProgress={this.props.showProgress} />
              <ResultIcon status={this.props.status} result={this.props.result} />
            </div>
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
    );
  }
}

function mapStateToProps(state: State) {
  return {
    sendingStatusMessage: state.submission.message,
    status: state.submission.status,
    sendingStatusProgress: state.submission.progress,
    result: state.submission.result,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onOKButtonClick() {
      dispatch(resetSubmissionStatusAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusDisplay);
