// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { STATUS_NONE, STATUS_ERROR, STATUS_IN_PROGRESS, STATUS_FINISHED } from 'state/submission/reducer';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import ProgressBar from './progress-bar';
import { resetSubmissionStatusAction } from '../../state/submission';

class StatusDisplay extends Component {

  props: {
    onOKButtonClick: () => void,
    sendingStatusMessage: string,
    sendingStatusProgress: number,
    status: string,
    result: Object,
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
      finishButton = prefixer('finish-button');
      if (this.props.result.error) {
        errors = this.props.result.error;
      }
      if (this.props.status === STATUS_FINISHED) {
        if (this.props.result.OK) {
          result = prefixer('check-mark');
          sendingInfo += ` ${prefixer('all-passed')} `;
        } else {
          result = prefixer('sad-face');
          sendingInfo += ` ${prefixer('compile-error')}`;
        }
      } else {
        result = prefixer('sad-face');
        sendingInfo = `${sendingInfo} ${prefixer('internal-error')}`;
      }
    }
    const form = (
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
              <div className={prefixer('progress-bar-container')}>
                <ProgressBar progressPercent={this.props.sendingStatusProgress} />
              </div>
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
    return form;
  }
}
function mapStateToProps(state: State) {
  return {
    sendingStatusMessage: state.submission.message,
    sendingStatusProgress: state.submission.progress,
    status: state.submission.status,
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
