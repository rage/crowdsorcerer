// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { changeCommentAction, reviewSubmitButtonPressedAction } from 'state/review';
import Assignment from 'components/assignment-form/assignment';
import ModelSolution from 'components/assignment-form/model-solution';
import TestFields from 'components/assignment-form/test-fields';
import StatusDisplay from 'components/status-display';
import Transition from 'react-motion-ui-pack';
import ReviewQuestions from './review-questions';
import ReviewInfo from './review-info';

class Review extends Component {

  props: {
    comment: string,
    showErrors: boolean,
    errors: Map<string, Array<Object>>,
    valid: boolean,
    changeComment: (string) => void,
    handleSubmit: () => void,
  }

  render() {
    let commentError = this.props.errors.get('commentError') || [];
    if (!this.props.showErrors) {
      commentError = [];
    }
    return (
      <div>
        <ReviewInfo />
        <Assignment readOnly />
        <ModelSolution readOnly />
        <TestFields readOnly />
        <div className={prefixer('peer-review-component')}>
          <ReviewQuestions />
          <div className={prefixer('peer-review-content')}>
            <div className={prefixer('peer-review-title')} >Vapaita kommentteja tehtävästä</div>
            <textarea
              className={prefixer('comment-field')}
              value={this.props.comment}
              onChange={event => this.props.changeComment(event.currentTarget.value)}
            />
            <Transition
              enter={{ opacity: 1, height: 16 }}
              leave={{ opacity: 0, height: 0, transitionY: -3 }}
            >
              {commentError.map(error => (
                <div key={prefixer('error')} className={prefixer('error')}>
                  {error}
                </div>
              ))}
            </Transition>
          </div>
        </div>
        <button
          type="submit"
          className={prefixer('sender')}
          disabled={this.props.showErrors && !this.props.valid}
          onClick={(e) => {
            e.preventDefault();
            this.props.handleSubmit();
          }}
        >Lähetä </button>
        <StatusDisplay />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    comment: state.review.comment,
    showErrors: state.review.showErrors,
    errors: state.review.errors,
    valid: state.review.valid,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    changeComment(comment: string) {
      dispatch(changeCommentAction(comment));
    },
    handleSubmit() {
      dispatch(reviewSubmitButtonPressedAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Review);
