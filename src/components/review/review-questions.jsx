// @flow
import React, { Component } from 'react';
import prefixer from 'utils/class-name-prefixer';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import { giveReviewAction } from 'state/review';

class ReviewQuestions extends Component {

  render() {
    return (
      <div />
    );
  }
}

function mapStateToProps(state: State) {
  return {
    reviewQuestions: state.review.reviewQuestions,
    reviews: state.review.reviewQuestions,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    giveReview(question: string, value: number) {
      dispatch(giveReviewAction(question, value));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewQuestions);
