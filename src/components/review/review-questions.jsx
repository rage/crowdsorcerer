// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State } from 'state/reducer';
import Errors from 'components/errors';
import FormValue from 'domain/form-value';
import Review from 'state/review';
import ReviewScale from './review-scale';

class ReviewQuestions extends Component {

  props: {
    errors: Map<string, Array<Object>>,
    showErrors: boolean,
    reviews: Array<FormValue<Review>>,
  }

  render() {
    return (
      <div className={prefixer('peer-review-content')}>
        <div className={prefixer('peer-review-title')}>Anna palautetta</div>
        <div>
          {
           this.props.reviews.map(
            questionValue => (
              <div key={questionValue.get().question} className={prefixer('review-question-scale-error-container')}>
                <div aria-required key={questionValue.get().question} className={prefixer('review-question-scale-container')}>
                  <div className={prefixer('peer-review-question')}>{questionValue.get().question}</div>
                  <div className={prefixer('peer-review-scale-line')} />
                  <ReviewScale answer={questionValue.get().review} question={questionValue.get().question} />
                </div>
                <Errors errors={questionValue.errors} keyBase={questionValue.get().question} show={this.props.showErrors} />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    reviews: state.review.reviews,
    showErrors: state.review.showErrors,
  };
}

export default connect(mapStateToProps, null)(ReviewQuestions);
