// @flow
import React, { Component } from 'react';
import { STATUS_NONE, STATUS_IN_PROGRESS, STATUS_FINISHED } from 'state/submission/';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import type { ErrorResult } from 'state/submission/reducer';
import prefixer from 'utils/class-name-prefixer';
import { resetSubmissionStatusAction } from 'state/submission';
import { addMarkersAction } from 'state/form/actions';
import getMarkers from 'utils/get-markers';
import ProgressBar from './progress-bar';
import ResultIcon from './result-icon';


class StatusDisplay extends Component {

  props: {
    onOKButtonClick: () => void,
    sendingStatusMessage: string,
    sendingStatusProgress: number,
    status: string,
    result: ErrorResult,
    showProgress: boolean,
  }

  render() {
    let statusDisplay = prefixer('hidden');
    if (this.props.sendingStatusMessage !== STATUS_NONE) {
      statusDisplay = prefixer('sending-status');
    }
    let finishButton = prefixer('hidden');
    let sendingInfo = prefixer('sending-info');
    if (this.props.status !== STATUS_IN_PROGRESS) {
      finishButton = prefixer('info-button');
      if (this.props.status === STATUS_FINISHED) {
        const resultInfo = this.props.result.OK ? prefixer('all-passed') : prefixer('compile-error');
        sendingInfo += ` ${resultInfo}`;
      } else {
        sendingInfo = `${sendingInfo} ${prefixer('internal-error')}`;
      }
    }
    let errorMessageKey = '';
    let errorInfoClassName = prefixer('error-info');
    if (this.props.result.errors && this.props.result.errors.length > 0) {
      const lengths = [];
      this.props.result.errors.forEach((error) => {
        lengths.push(error.messages.map(m => m.message).join('\n').length);
      });
      errorInfoClassName += ` ${lengths
        .reduce((a, b) => a + b) > 8 ? prefixer('long') : ''}`;
    }
    return (
      <div className={statusDisplay}>
        <div className={sendingInfo}>
          <div className={prefixer('status-message')}>
            {this.props.sendingStatusMessage}
          </div>
          <div className={errorInfoClassName}>
            {this.props.result.errors.map((e) => {
              const messages = e.messages.map(m => m.message).join('\n');
              errorMessageKey += ` ${messages}`;
              return (
                <div key={errorMessageKey}>
                  <div className={prefixer('error-header')}>{e.header}</div>
                  <div className={prefixer('error-message')}>{messages}</div>
                </div>);
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
                this.props.onOKButtonClick(getMarkers(this.props.result.errors));
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
    onOKButtonClick(markers: Array<Object>) {
      dispatch(resetSubmissionStatusAction());
      dispatch(addMarkersAction(markers));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusDisplay);
