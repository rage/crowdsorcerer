// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import Transition from 'react-motion-ui-pack';
import type { State } from 'state/reducer';
import ReviewScale from './review-scale';

class ReviewQuestions extends Component {

  props: {
    errors: Map<string, Array<Object>>,
    reviewQuestions: Array<string>,
    showErrors: boolean,
  }

  render() {
    const reviewErrors = this.props.errors.get('reviewError') || [];
    return (
      <div className={prefixer('peer-review-content')}>
        <div className={prefixer('peer-review-title')}>Anna palautetta</div>
        <div>
          {
           this.props.reviewQuestions.map(
            question => (
              <div key={question} className={prefixer('review-question-scale-error-container')}>
                <div key={question} className={prefixer('review-question-scale-container')}>
                  <div className={prefixer('peer-review-question')} >{question}</div>
                  <div className={prefixer('peer-review-scale-line')} />
                  <ReviewScale question={question} />
                </div>
                <Transition
                  enter={{ opacity: 1, height: 16 }}
                  leave={{ opacity: 0, height: 0, transitionY: -3 }}
                >
                  {reviewErrors.map((error) => {
                    if (this.props.showErrors && error.question === question) {
                      return (
                        <div key={`${question}-${error.msg}`} className={prefixer('error')}>
                          {error.msg}
                        </div>
                      );
                    }
                    return undefined;
                  })}
                </Transition>
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
    reviewQuestions: state.review.reviewQuestions,
    errors: state.review.errors,
    showErrors: state.review.showErrors,
  };
}

export default connect(mapStateToProps, null)(ReviewQuestions);
