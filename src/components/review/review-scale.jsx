// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { State, Dispatch } from 'state/reducer';
import prefixer from 'utils/class-name-prefixer';
import { giveReviewAction } from 'state/review';
import MdSentimentVeryDissatisfied from 'react-icons/lib/md/sentiment-very-dissatisfied';
import MdSentimentDissatisfied from 'react-icons/lib/md/sentiment-dissatisfied';
import MdSentimentNeutral from 'react-icons/lib/md/sentiment-neutral';
import MdSentimentSatisfied from 'react-icons/lib/md/sentiment-satisfied';
import MdSentimentVerySatisfied from 'react-icons/lib/md/sentiment-very-satisfied';

class ReviewScale extends Component {

  props: {
    question: string,
    reviews: Map<string, number>,
    giveReview: (string, number) => void,
  }

  render() {
    const notChosen = prefixer('scale-icon');
    const highlighted = `${notChosen}-highlighted`;
    const answer = this.props.reviews.get(this.props.question);
    return (
      <div className={prefixer('scale')}>
        <MdSentimentVeryDissatisfied
          className={answer === 1 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 1)}
        />
        <MdSentimentDissatisfied
          className={answer === 2 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 2)}
        />
        <MdSentimentNeutral
          className={answer === 3 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 3)}
        />
        <MdSentimentSatisfied
          className={answer === 4 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 4)}
        />
        <MdSentimentVerySatisfied
          className={answer === 5 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 5)}
        />
      </div>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    reviews: state.review.reviews,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    giveReview(question: string, value: number) {
      dispatch(giveReviewAction(question, value));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewScale);
