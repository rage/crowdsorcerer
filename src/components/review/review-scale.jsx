// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'state/reducer';
import prefixer from 'utils/class-name-prefixer';
import { giveReviewAction } from 'state/review';
import MdSentimentVeryDissatisfied from 'react-icons/lib/md/sentiment-very-dissatisfied';
import MdSentimentDissatisfied from 'react-icons/lib/md/sentiment-dissatisfied';
import MdSentimentNeutral from 'react-icons/lib/md/sentiment-neutral';
import MdSentimentSatisfied from 'react-icons/lib/md/sentiment-satisfied';
import MdSentimentVerySatisfied from 'react-icons/lib/md/sentiment-very-satisfied';
import SentimentWrapper from './sentiment-wrapper';

class ReviewScale extends Component {

  props: {
    question: string,
    answer: number,
    giveReview: (string, number) => void,
  }

  render() {
    return (
      <div
        className={prefixer('scale')}
        role="radiogroup"
        aria-label={`${this.props.question}`}
        tabIndex="0"
      >
        <SentimentWrapper
          question={this.props.question}
          answer={this.props.answer}
          onClick={this.props.giveReview}
        >
          <MdSentimentVeryDissatisfied />
          <MdSentimentDissatisfied />
          <MdSentimentNeutral />
          <MdSentimentSatisfied />
          <MdSentimentVerySatisfied />
        </SentimentWrapper>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    giveReview(question: string, value: number) {
      dispatch(giveReviewAction(question, value));
    },
  };
}

export default connect(null, mapDispatchToProps)(ReviewScale);

