// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import { reviewSubmitButtonPressedAction } from 'state/review';
import Assignment from 'components/assignment-form/assignment';
import ModelSolution from 'components/assignment-form/model-solution';
import TestFields from 'components/assignment-form/test-fields';
import StatusDisplay from 'components/status-display';
import ExerciseTags from 'components/tag-input';
import ReviewQuestions from './review-questions';
import ReviewInfo from './review-info';
import ReviewComment from './review-comment';

class Review extends Component {

  props: {
    valid: boolean,
    showErrors: boolean,
    handleSubmit: () => void,
  }

  render() {
    return (
      <div>
        <ReviewInfo />
        <Assignment readOnly />
        <ModelSolution readOnly />
        <TestFields readOnly />
        <div className={prefixer('peer-review-component')}>
          <ReviewQuestions />
          <ReviewComment />
        </div>
        <ExerciseTags showErrors={this.props.showErrors} />
        <div className={prefixer('form-component')}>
          <button
            type="submit"
            className={prefixer('sender')}
            disabled={this.props.showErrors && !this.props.valid}
            onClick={(e) => {
              e.preventDefault();
              this.props.handleSubmit();
            }}
          >Lähetä
          </button>
        </div>
        <StatusDisplay />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    showErrors: state.review.showErrors,
    valid: state.review.valid,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      dispatch(reviewSubmitButtonPressedAction());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Review);
