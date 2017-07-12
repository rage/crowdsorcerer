// @flow
import React, { Component } from 'react';
import { STATUS_NONE, STATUS_IN_PROGRESS, STATUS_FINISHED } from 'state/submission/reducer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import prefixer from 'utils/class-name-prefixer';
import { resetSubmissionStatusAction } from 'state/submission';
import ProgressBar from './progress-bar';

class StatusDisplay extends Component {

  props: {
    onOKButtonClick: () => void,
    sendingStatusMessage: string,
    sendingStatusProgress: number,
    status: string,
    result: { OK: boolean, errors: Array<string> },
    showProgress: boolean,
  }

  renderProgress() {
    if (!this.props.showProgress) {
      return undefined;
    }
    return (
      <div className={prefixer('progress-bar-container')}>
        <ProgressBar progressPercent={this.props.sendingStatusProgress} />
      </div>
    );
  }

  render() {
    let statusDisplay = prefixer('hidden');
    if (this.props.sendingStatusMessage !== STATUS_NONE) {
      statusDisplay = prefixer('sending-status');
    }
    let result = prefixer('spinner');
    let finishButton = prefixer('hidden');
    let errors = [];
    let sendingInfo = prefixer('sending-info');
    if (this.props.status !== STATUS_IN_PROGRESS) {
      finishButton = prefixer('info-button');
      errors = this.props.result.errors ? this.props.result.errors : errors;
      if (this.props.status === STATUS_FINISHED) {
        if (this.props.result) {
          result = this.props.result.OK ? prefixer('check-mark') : prefixer('sad-face');
          const resultInfo = this.props.result.OK ? prefixer('all-passed') : prefixer('compile-error');
          sendingInfo += ` ${resultInfo}`;
        }
      } else {
        result = prefixer('sad-face');
        sendingInfo = `${sendingInfo} ${prefixer('internal-error')}`;
      }
    }
    return (
      <div className={statusDisplay}>
        <div className={sendingInfo}>
          <div className={prefixer('status-message')}>
            {this.props.sendingStatusMessage}
          </div>
          <div className={prefixer('error-messages')}>
            {errors.map(e =>
              (<div key={`${e}`} className={prefixer('error-message')}>{e}</div>),
            )}
          </div>
          <div className={prefixer('status-bottom')}>
            <div className={prefixer('result-container')}>
              {this.renderProgress()}
              <div className={prefixer('result')}>
                <div className={result} />
              </div>
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
