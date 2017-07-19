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

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;

class ReviewScale extends Component {

  constructor(props) {
    super(props);

    this.focusables = [];
  }

  componentDidMount() {
    this.focusables[1] = document.getElementById('veryDissatisfied');
    this.focusables[2] = document.getElementById('dissatisfied');
    this.focusables[3] = document.getElementById('neutral');
    this.focusables[4] = document.getElementById('satisfied');
    this.focusables[5] = document.getElementById('verySatisfied');
  }

  focusables: Array<HTMLElement | null>

  props: {
    question: string,
    answer: number,
    giveReview: (string, number) => void,
  }

  radioOnKeyDown(e: KeyboardEvent) {
    let answer = !this.props.answer ? 0 : this.props.answer;
    switch (e.keyCode) {
      case KEY_DOWN:
      case KEY_RIGHT:
        answer = (answer + 1 <= 5) ? (answer + 1) : 1;
        this.props.giveReview(this.props.question, answer);
        break;
      case KEY_LEFT:
      case KEY_UP:
        answer = (answer - 1 >= 1) ? (answer - 1) : 5;
        this.props.giveReview(this.props.question, answer);
        break;
      default:
    }
    if (this.focusables[answer]) {
      this.focusables[answer].focus();
    }
  }

  render() {
    const notChosen = prefixer('scale-icon');
    const highlighted = `${notChosen}-highlighted`;
    return (
      <div
        className={prefixer('scale')}
        role="radiogroup"
        aria-label={`${this.props.question}`}
        tabIndex="0"
      >
        <MdSentimentVeryDissatisfied
          className={this.props.answer === 1 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 1)}
          id="veryDissatisfied"
          role="radio"
          aria-checked={this.props.answer === 1}
          onKeyDown={e => this.radioOnKeyDown(e)}
          tabIndex="0"
        />
        <MdSentimentDissatisfied
          className={this.props.answer === 2 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 2)}
          id="dissatisfied"
          role="radio"
          aria-checked={this.props.answer === 2}
          tabIndex="-1"
          onKeyDown={e => this.radioOnKeyDown(e)}
        />
        <MdSentimentNeutral
          className={this.props.answer === 3 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 3)}
          id="neutral"
          role="radio"
          aria-checked={this.props.answer === 3}
          tabIndex="-1"
          onKeyDown={e => this.radioOnKeyDown(e)}
        />
        <MdSentimentSatisfied
          className={this.props.answer === 4 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 4)}
          id="satisfied"
          role="radio"
          aria-checked={this.props.answer === 4}
          tabIndex="-1"
          onKeyDown={e => this.radioOnKeyDown(e)}
        />
        <MdSentimentVerySatisfied
          className={this.props.answer === 5 ? highlighted : notChosen}
          onClick={() => this.props.giveReview(this.props.question, 5)}
          id="verySatisfied"
          role="radio"
          aria-checked={this.props.answer === 5}
          tabIndex="-1"
          onKeyDown={e => this.radioOnKeyDown(e)}
        />
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
