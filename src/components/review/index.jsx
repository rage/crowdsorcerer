// @flow
import React, { Component } from 'react';
import LikertReact from 'likert-react';
import { connect } from 'react-redux';
import prefixer from 'utils/class-name-prefixer';
import type { State, Dispatch } from 'state/reducer';
import type { Review as QuestionReview } from 'state/review/reducer';
import {
  reviewSubmitButtonPressedAction,
  giveReviewAction,
 } from 'state/review';
import Assignment from 'components/assignment-form/assignment';
import ModelSolution from 'components/assignment-form/model-solution';
import TestFields from 'components/assignment-form/test-fields';
import UnitTests from 'components/assignment-form/unit-tests';
import IOAndCode from 'components/assignment-form/io-and-code';
import StatusDisplay from 'components/status-display';
import ExerciseTags from 'components/tag-input';
import FormValue from 'domain/form-value';
import Errors from 'components/errors';
import ReviewInfo from './review-info';
import ReviewComment from './review-comment';

class Review extends Component {

  props: {
    valid: boolean,
    showErrors: boolean,
    handleSubmit: () => void,
    giveReview: (string, number) => void,
    reviews: FormValue<Array<QuestionReview>>,
    testingType: string,
  }

  render() {
    let tests;
    if (this.props.testingType === 'unit_tests') {
      tests = <UnitTests />; // TODO: handle readonly
    } else if (this.props.testingType === 'input_output') {
      tests = <TestFields />;
    } else { // else if this.props.testingType === 'io_and_code'
      tests = <IOAndCode readOnly />;
    }

    return (
      <div>
        <ReviewInfo />
        <Assignment readOnly />
        <ModelSolution readOnly />
        {tests}
        <div className={prefixer('peer-review-component')}>
          <div className={prefixer('peer-review-content')}>
            <div className={prefixer('peer-review-title')}>Anna palautetta</div>
            <div className={prefixer('likert-scale')}>
              <LikertReact
                reviews={this.props.reviews.get()}
                onClick={this.props.giveReview}
              />
            </div>
            <Errors errors={this.props.reviews.errors} show={this.props.showErrors} />
          </div>
          <ReviewComment />
        </div>
        <ExerciseTags showErrors={this.props.showErrors} />
        <div className={`${prefixer('form-component')} ${prefixer('submit-button-container')}`}>
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
    reviews: state.review.reviews,
    testingType: state.form.testingType,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    handleSubmit() {
      dispatch(reviewSubmitButtonPressedAction());
    },
    giveReview(question: string, value: number) {
      dispatch(giveReviewAction(question, value));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Review);
