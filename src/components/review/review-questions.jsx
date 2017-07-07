// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State } from 'state/reducer';
import ReviewScale from './review-scale';

class ReviewQuestions extends Component {

  render() {
    return (
      <div className={prefixer('peer-review-content')}>
        <div className={prefixer('peer-review-title')}>Anna palautetta</div>
        <div>
          {
           this.props.reviewQuestions.map(
            question => (
              <div key={question} className={prefixer('review-question-scale-container')}>
                <div className={prefixer('peer-review-question')} >{question}</div>
                <div className={prefixer('peer-review-scale-line')} />
                <ReviewScale question={question} />
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
  };
}

export default connect(mapStateToProps, null)(ReviewQuestions);
